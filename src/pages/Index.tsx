import { useState, useEffect } from "react";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { toast } from "sonner";
import { Upgrade, GameState } from "@/types/game";
import { Progress } from "@/components/ui/progress";

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: "autoClicker",
    name: "Auto Clicker",
    cost: 10,
    description: "Automatically generates 1 point per second",
    owned: 0,
    multiplier: 1,
    type: "autoClicker",
  },
  {
    id: "clickMultiplier",
    name: "Click Multiplier",
    cost: 50,
    description: "Doubles the points you get per click",
    owned: 0,
    multiplier: 2,
    type: "multiplier",
  },
];

const POINTS_PER_LEVEL = 100;

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    points: 0,
    clickMultiplier: 1,
    autoClickerPoints: 0,
    level: 1,
    totalPointsEarned: 0,
  });
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);

  // Auto-clicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.autoClickerPoints > 0) {
        setGameState((prev) => {
          const newPoints = prev.points + prev.autoClickerPoints;
          const newTotalPoints = prev.totalPointsEarned + prev.autoClickerPoints;
          const newLevel = Math.floor(newTotalPoints / POINTS_PER_LEVEL) + 1;
          
          if (newLevel > prev.level) {
            toast.success(`Level Up! You reached level ${newLevel}`);
          }

          return {
            ...prev,
            points: newPoints,
            totalPointsEarned: newTotalPoints,
            level: newLevel,
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.autoClickerPoints]);

  const handleClick = () => {
    setGameState((prev) => {
      const pointsEarned = prev.clickMultiplier;
      const newPoints = prev.points + pointsEarned;
      const newTotalPoints = prev.totalPointsEarned + pointsEarned;
      const newLevel = Math.floor(newTotalPoints / POINTS_PER_LEVEL) + 1;

      if (newLevel > prev.level) {
        toast.success(`Level Up! You reached level ${newLevel}`);
      }

      return {
        ...prev,
        points: newPoints,
        totalPointsEarned: newTotalPoints,
        level: newLevel,
      };
    });
  };

  const handlePurchase = (id: string) => {
    const upgrade = upgrades.find((u) => u.id === id);
    if (!upgrade || gameState.points < upgrade.cost) return;

    setGameState((prev) => {
      const newState = { ...prev, points: prev.points - upgrade.cost };
      
      if (upgrade.type === "autoClicker") {
        newState.autoClickerPoints += upgrade.multiplier;
      } else if (upgrade.type === "multiplier") {
        newState.clickMultiplier *= upgrade.multiplier;
      }
      
      return newState;
    });

    setUpgrades((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      )
    );

    toast.success(`Purchased ${upgrade.name}!`);
  };

  const progressToNextLevel = (gameState.totalPointsEarned % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <ResourceCounter amount={gameState.points} />
        <div className="glass-card px-4 py-2">
          <p className="text-sm text-game-accent">Level {gameState.level}</p>
          <Progress value={progressToNextLevel} className="w-32 mt-2" />
        </div>
        <div className="text-sm text-game-neutral">
          Points per click: {gameState.clickMultiplier}
          <br />
          Auto points per second: {gameState.autoClickerPoints}
        </div>
      </div>
      
      <ClickArea onClick={handleClick} />
      
      <UpgradeShop
        upgrades={upgrades}
        onPurchase={handlePurchase}
        canAfford={(cost) => gameState.points >= cost}
      />
    </div>
  );
};

export default Index;