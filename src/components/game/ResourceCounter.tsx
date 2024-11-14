import { motion, AnimatePresence } from "framer-motion";

interface ResourceCounterProps {
  amount: number;
}

export const ResourceCounter = ({ amount }: ResourceCounterProps) => {
  return (
    <div className="glass-card px-8 py-4">
      <p className="text-sm text-game-accent mb-1">Energy Points</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={amount}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-4xl font-bold text-game-primary"
        >
          {amount.toLocaleString()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};