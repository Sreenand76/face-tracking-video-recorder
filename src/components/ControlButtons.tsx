import React from "react";
import { motion } from "framer-motion";

interface ControlButtonsProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRecording,
  onStart,
  onStop,
}) => {
  return (  
     <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 justify-center items-center"
      >
    {/* Stop Recording Button */}
    <motion.button
      onClick={onStop}
      className="px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-md hover:from-teal-600 hover:via-cyan-600 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-300 relative"
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isRecording ? 1.1 : 1,
        boxShadow: isRecording
          ? "0px 15px 25px rgba(255, 87, 51, 0.8)"
          : "0px 10px 20px rgba(72, 201, 176, 0.6)",
      }}
      aria-pressed={!isRecording}
      aria-label="Stop recording"
    >
      <span className="absolute inset-0 bg-white opacity-10 rounded-full blur-lg"></span>
      Stop Recording
    </motion.button>
    
    {/* Start Recording Button */}
    <motion.button
      onClick={onStart}
      className="px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:from-purple-600 hover:via-pink-600 hover:to-red-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 relative"
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isRecording ? 1.1 : 1,
        boxShadow: isRecording
          ? "0px 15px 25px rgba(255, 87, 51, 0.8)"
          : "0px 10px 20px rgba(99, 102, 241, 0.6)",
      }}
      aria-pressed={isRecording}
      aria-label={isRecording ? "Recording in progress" : "Start recording"}
    >
      <span className="absolute inset-0 bg-white opacity-10 rounded-full blur-lg"></span>
      {isRecording ? "Recording..." : "Start Recording"}
    </motion.button>
    </motion.div>
      
  );
};

export default ControlButtons;
