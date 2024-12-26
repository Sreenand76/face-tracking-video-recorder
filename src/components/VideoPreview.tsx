import React from "react";
import { motion } from "framer-motion";

interface VideoPreviewProps {
  videoUrl: string | null;
  onBack: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, onBack }) => {
  return (
<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="relative w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg"
  >
    <div className="relative">
      <video controls className="w-full rounded-lg" src={videoUrl || ""} />
      <button
        onClick={() => {
          console.log("Back button clicked");
          onBack();
        }}
        className="absolute top-2 left-3 text-white bg-black bg-opacity-60 py-2 px-5 rounded-md"
      >
        Back
      </button>
    </div>
  </motion.div>
</div>

  );
};
export default VideoPreview
