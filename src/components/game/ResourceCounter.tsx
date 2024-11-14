import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

interface ResourceCounterProps {
  amount: number;
}

export const ResourceCounter = ({ amount }: ResourceCounterProps) => {
  return (
    <div className="glass-card px-8 py-4 bg-amber-950/20">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Cookie className="text-amber-600" size={20} />
        <p className="text-sm text-amber-200">Cookies Baked</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={amount}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-4xl font-bold text-amber-400"
        >
          {amount.toLocaleString()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};