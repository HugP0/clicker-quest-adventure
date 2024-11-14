import { motion } from "framer-motion";

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
  owned: number;
}

interface UpgradeShopProps {
  upgrades: Upgrade[];
  onPurchase: (id: string) => void;
  canAfford: (cost: number) => boolean;
}

export const UpgradeShop = ({ upgrades, onPurchase, canAfford }: UpgradeShopProps) => {
  return (
    <div className="glass-card p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-game-accent">Upgrades</h2>
      <div className="space-y-4">
        {upgrades.map((upgrade) => (
          <motion.button
            key={upgrade.id}
            onClick={() => onPurchase(upgrade.id)}
            className={`w-full glass-card p-4 text-left transition-colors ${
              canAfford(upgrade.cost)
                ? "hover:bg-white/20"
                : "opacity-50 cursor-not-allowed"
            }`}
            whileHover={canAfford(upgrade.cost) ? { scale: 1.02 } : {}}
            whileTap={canAfford(upgrade.cost) ? { scale: 0.98 } : {}}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-game-primary">{upgrade.name}</h3>
                <p className="text-sm text-game-accent">{upgrade.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-game-neutral">Cost: {upgrade.cost}</p>
                <p className="text-xs text-game-accent">Owned: {upgrade.owned}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};