import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface ClickAreaProps {
  onClick: () => void;
  multiplier?: number;
  environmentalState: 'polluted' | 'neutral' | 'clean';
}

export const ClickArea = ({ onClick, multiplier = 1, environmentalState }: ClickAreaProps) => {
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    onClick();
  };

  const getBgColor = () => {
    switch (environmentalState) {
      case 'polluted':
        return 'bg-gray-800/20';
      case 'clean':
        return 'bg-green-900/20';
      default:
        return 'bg-amber-950/20';
    }
  };

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`click-target w-full h-full glass-card flex items-center justify-center ${getBgColor()}`}
      >
        <motion.div
          className="text-6xl md:text-8xl text-yellow-500"
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            repeat: isHovered ? Infinity : 0,
          }}
        >
          <Zap size={96} />
        </motion.div>
      </button>
      {clickPosition.x !== 0 && (
        <motion.div
          initial={{ scale: 0, x: clickPosition.x - 10, y: clickPosition.y - 10 }}
          animate={{ scale: 1, opacity: 0, y: clickPosition.y - 50 }}
          transition={{ duration: 0.5 }}
          className="absolute w-5 h-5 text-yellow-500 font-bold pointer-events-none"
        >
          +{multiplier}
        </motion.div>
      )}
    </div>
  );
};