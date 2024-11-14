import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface ResourceCounterProps {
  amount: number;
  renewablePercentage: number;
}

export const ResourceCounter = ({ amount, renewablePercentage }: ResourceCounterProps) => {
  return (
    <div className="glass-card px-8 py-4 bg-amber-950/20">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Zap className="text-yellow-500" size={20} />
        <p className="text-sm text-yellow-200">Energy Generated</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={amount}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-4xl font-bold text-yellow-400"
        >
          {amount.toLocaleString()} MW
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 text-sm text-yellow-200">
        {renewablePercentage.toFixed(1)}% Renewable
      </div>
    </div>
  );
};