import { motion } from "framer-motion";
import { PowerPlant } from "@/types/powerPlant";
import { ArrowUpCircle, Building2 } from "lucide-react";

interface UpgradeShopProps {
  powerPlants: PowerPlant[];
  onPurchase: (id: string) => void;
  onUpgrade: (id: string) => void;
  canAfford: (cost: number) => boolean;
}

export const UpgradeShop = ({ powerPlants, onPurchase, onUpgrade, canAfford }: UpgradeShopProps) => {
  return (
    <div className="glass-card p-6 w-full max-w-md bg-amber-950/20">
      <h2 className="text-xl font-bold mb-4 text-yellow-200">Centrales Électriques</h2>
      <div className="space-y-4">
        {powerPlants.map((plant) => (
          <motion.div
            key={plant.id}
            className="glass-card p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-yellow-400">{plant.name}</h3>
                <p className="text-sm text-yellow-200">{plant.description}</p>
                <p className="text-xs text-yellow-200">
                  Production: {plant.baseProduction * plant.level} MW | Impact: {plant.pollutionImpact}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onPurchase(plant.id)}
                    disabled={!canAfford(plant.cost)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      canAfford(plant.cost)
                        ? "bg-amber-600 hover:bg-amber-500"
                        : "bg-gray-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <Building2 size={16} />
                    Construire ({plant.cost})
                  </button>
                  {plant.owned > 0 && (
                    <button
                      onClick={() => onUpgrade(plant.id)}
                      disabled={!canAfford(plant.upgradeBaseCost)}
                      className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                        canAfford(plant.upgradeBaseCost)
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-gray-600 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <ArrowUpCircle size={16} />
                      Améliorer ({plant.upgradeBaseCost})
                    </button>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-300">Possédées: {plant.owned}</p>
                <p className="text-xs text-yellow-200">Niveau: {plant.level}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};