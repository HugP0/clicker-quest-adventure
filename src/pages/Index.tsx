import { useState, useEffect } from "react";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { toast } from "sonner";

const INITIAL_UPGRADES = [
  {
    id: "autoClicker",
    name: "Auto Clicker",
    cost: 10,
    description: "Automatically clicks once per second",
    owned: 0,
  },
  {
    id: "clickMultiplier",
    name: "Click Multiplier",
    cost: 50,
    description: "Doubles the value of each click",
    owned: 0,
  },
];

const Index = () => {
  const [points, setPoints] = useState(0);
  const [upgrades, setUpgrades] = useState(INITIAL_UPGRADES);
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const autoClickerCount = upgrades.find((u) => u.id === "autoClicker")?.owned || 0;
    if (autoClickerCount === 0) return;

    const interval = setInterval(() => {
      setPoints((p) => p + autoClickerCount * multiplier);
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades, multiplier]);

  const handleClick = () => {
    setPoints((p) => p + 1 * multiplier);
  };

  const handlePurchase = (id: string) => {
    const upgrade = upgrades.find((u) => u.id === id);
    if (!upgrade || points < upgrade.cost) return;

    setPoints((p) => p - upgrade.cost);
    setUpgrades((current) =>
      current.map((u) =>
        u.id === id
          ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      )
    );

    if (id === "clickMultiplier") {
      setMultiplier((m) => m * 2);
    }

    toast.success(`Purchased ${upgrade.name}!`);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <ResourceCounter amount={points} />
      </div>
      
      <ClickArea onClick={handleClick} />
      
      <UpgradeShop
        upgrades={upgrades}
        onPurchase={handlePurchase}
        canAfford={(cost) => points >= cost}
      />
    </div>
  );
};

export default Index;