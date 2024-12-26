// src/hooks/useFaceTracking.ts
import * as faceapi from 'face-api.js';

export const useFaceTracking = async () => {
  const MODEL_URL = '/models'; // Directory where models are stored

  // Load face-api.js models
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL); // Load small face detector model
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL); // Load face landmarks model
};
