import { useState } from "react";
import { motion } from "framer-motion";

interface ClickAreaProps {
  onClick: () => void;
  multiplier?: number;
}

export const ClickArea = ({ onClick, multiplier = 1 }: ClickAreaProps) => {
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    onClick();
  };

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <button
        onClick={handleClick}
        className="click-target w-full h-full glass-card flex items-center justify-center"
      >
        <motion.div
          className="text-6xl md:text-8xl animate-float"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⚡
        </motion.div>
      </button>
      {clickPosition.x !== 0 && (
        <motion.div
          initial={{ scale: 0, x: clickPosition.x - 10, y: clickPosition.y - 10 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-5 h-5 text-game-primary pointer-events-none"
        >
          +{multiplier}
        </motion.div>
      )}
    </div>
  );
};