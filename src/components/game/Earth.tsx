import { motion } from "framer-motion";

interface EarthProps {
  environmentalState: 'polluted' | 'neutral' | 'clean';
}

export const Earth = ({ environmentalState }: EarthProps) => {
  const getEarthStyle = () => {
    switch (environmentalState) {
      case 'polluted':
        return 'bg-gray-800 shadow-[0_0_50px_rgba(255,0,0,0.3)]';
      case 'clean':
        return 'bg-blue-500 shadow-[0_0_50px_rgba(0,255,0,0.3)]';
      default:
        return 'bg-blue-700 shadow-[0_0_30px_rgba(255,165,0,0.3)]';
    }
  };

  return (
    <div className="relative w-48 h-48">
      <motion.div
        className={`w-full h-full rounded-full ${getEarthStyle()} animate-float`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="absolute inset-0 rounded-full bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b')] bg-cover opacity-50" />
      </motion.div>
    </div>
  );
};