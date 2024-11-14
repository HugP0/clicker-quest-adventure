import { motion } from "framer-motion";
import { PowerPlant } from "@/types/powerPlant";

interface UpgradeShopProps {
  powerPlants: PowerPlant[];
  onPurchase: (id: string) => void;
  canAfford: (cost: number) => boolean;
}

export const UpgradeShop = ({ powerPlants, onPurchase, canAfford }: UpgradeShopProps) => {
  return (
    <div className="glass-card p-6 w-full max-w-md bg-amber-950/20">
      <h2 className="text-xl font-bold mb-4 text-yellow-200">Power Plants</h2>
      <div className="space-y-4">
        {powerPlants.map((plant) => (
          <motion.button
            key={plant.id}
            onClick={() => onPurchase(plant.id)}
            className={`w-full glass-card p-4 text-left transition-colors ${
              canAfford(plant.cost)
                ? "hover:bg-amber-800/20"
                : "opacity-50 cursor-not-allowed"
            }`}
            whileHover={canAfford(plant.cost) ? { scale: 1.02 } : {}}
            whileTap={canAfford(plant.cost) ? { scale: 0.98 } : {}}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-yellow-400">{plant.name}</h3>
                <p className="text-sm text-yellow-200">{plant.description}</p>
                <p className="text-xs text-yellow-200">
                  Production: {plant.baseProduction} MW | Impact: {plant.pollutionImpact}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-300">Cost: {plant.cost}</p>
                <p className="text-xs text-yellow-200">Owned: {plant.owned}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};