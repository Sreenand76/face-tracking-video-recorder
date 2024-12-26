"use client";
import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";
import ControlButtons from "./ControlButtons";
import { toast } from "react-toastify";
import VideoPreview from "./VideoPreview";


const FaceDetectionRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const combinedCanvasRef = useRef<HTMLCanvasElement | null>(null);//for combining the video with the canvas
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
         // Access webcam and set video stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        // Load faceapi models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
      } catch (error) {
        console.error("Error initializing video or models:", error);
      }
    };

    initialize();

    return () => {
      // Cleanup: Stop video stream on unmount
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);


  const handleFaceDetection = async () => {
    // Detect faces and landmarks
    if (videoRef.current && combinedCanvasRef.current) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const canvas = combinedCanvasRef.current;
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      // Match canvas dimensions with video feed
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video onto the canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        resizedDetections.forEach((detection) => {
          const { landmarks, detection: faceBox } = detection;

          // Draw semi-transparent bounding box
          const { x, y, width, height } = faceBox.box;
          ctx.beginPath();
          ctx.rect(x, y, width, height);
          ctx.fillStyle = "rgba(0, 153, 255, 0.2)";
          ctx.fill();
          ctx.strokeStyle = "rgba(0, 153, 255, 0.8)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw facial landmarks
          if (landmarks) {
            const landmarkGroups = [
              { points: landmarks.getJawOutline(), color: "#00CC99" },
              { points: landmarks.getLeftEye(), color: "#FFA500" },
              { points: landmarks.getRightEye(), color: "#FFA500" },
              { points: landmarks.getMouth(), color: "#FF5733" },
              { points: landmarks.getNose(), color: "#4CAF50" },
            ];

            landmarkGroups.forEach(({ points, color }) => {
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
              }
              if (
                points === landmarks.getLeftEye() ||
                points === landmarks.getRightEye() ||
                points === landmarks.getMouth()
              ) {
                ctx.lineTo(points[0].x, points[0].y);
              }
              ctx.strokeStyle = color;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const interval = setInterval(() => handleFaceDetection(), 100);
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop any existing recording
    }
    if (combinedCanvasRef.current) {
      const stream = combinedCanvasRef.current.captureStream(30); // Capture canvas stream at 30 fps
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" }); 
      setMediaRecorder(recorder);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setVideoPreviewUrl(url);
          toast.success("Video recording stopped", { autoClose: 3000 });
          localStorage.setItem("video", url);
          setRecordedChunks([]);
        } else {
          toast.error("Recording failed. No data available.", { autoClose: 3000 });
        }
        setIsRecording(false);
      };

      recorder.start(100); // Emit `ondataavailable` every 100ms
      toast.success("Video recording started", { autoClose: 3000 });
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop recording
    } else {
      toast.error("No recording in progress to stop", { autoClose: 3000 });
    }
    setIsRecording(false);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[92vh] bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-3xl px-2"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full rounded-lg shadow-md"
        />
        <canvas
          ref={combinedCanvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </motion.div>
      <ControlButtons isRecording={isRecording} onStart={startRecording} onStop={stopRecording} />

      {videoPreviewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-7 md:mt-4"
        >
          <span
            onClick={() => { setShowPreview(true); }}
            className="text-blue-600 text-xl font-semibold cursor-pointer hover:text-blue-800 hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            Show Video Preview
          </span>
        </motion.div>
      )}

      {showPreview && videoPreviewUrl && (
        <VideoPreview videoUrl={videoPreviewUrl} onBack={handleBack} />
      )}
    </div>

  );
};

export default FaceDetectionRecorder;





