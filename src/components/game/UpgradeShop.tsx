import { motion } from "framer-motion";
import { PowerPlant } from "@/types/powerPlant";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface UpgradeShopProps {
  powerPlants: PowerPlant[];
  onPurchase: (id: string) => void;
  onUpgrade: (id: string) => void;
  onToggleAuto: (id: string) => void;
  canAfford: (cost: number) => boolean;
}

export const UpgradeShop = ({ 
  powerPlants, 
  onPurchase, 
  onUpgrade, 
  onToggleAuto,
  canAfford 
}: UpgradeShopProps) => {
  return (
    <div className="glass-card p-6 w-full max-w-md bg-amber-950/20">
      <h2 className="text-xl font-bold mb-4 text-yellow-200">Power Plants</h2>
      <div className="space-y-4">
        {powerPlants.map((plant) => (
          <motion.div
            key={plant.id}
            className="w-full glass-card p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-yellow-400">{plant.name}</h3>
                  <p className="text-sm text-yellow-200">{plant.description}</p>
                  <p className="text-xs text-yellow-200">
                    Production: {plant.baseProduction * plant.upgradeLevel} MW | Impact: {plant.pollutionImpact}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-300">Cost: ${plant.cost}</p>
                  <p className="text-xs text-yellow-200">Owned: {plant.owned}</p>
                  <p className="text-xs text-yellow-200">Level: {plant.upgradeLevel}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => onPurchase(plant.id)}
                  disabled={!canAfford(plant.cost)}
                  className="flex-1"
                  variant="outline"
                >
                  Buy (${plant.cost})
                </Button>
                {plant.owned > 0 && (
                  <>
                    <Button
                      onClick={() => onUpgrade(plant.id)}
                      disabled={!canAfford(plant.upgradeCost)}
                      className="flex-1"
                      variant="outline"
                    >
                      Upgrade (${plant.upgradeCost})
                    </Button>
                    <Button
                      onClick={() => onToggleAuto(plant.id)}
                      variant={plant.autoProducing ? "default" : "outline"}
                      size="icon"
                    >
                      <Power className={plant.autoProducing ? "text-yellow-200" : "text-yellow-500"} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};