import { useState, useEffect } from "react";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { toast } from "sonner";
import { Upgrade, GameState, DailyReward } from "@/types/game";
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
  {
    id: "temporaryBooster",
    name: "Power Surge",
    cost: 30,
    description: "3x points for 30 seconds",
    owned: 0,
    multiplier: 3,
    type: "booster",
    duration: 30,
  },
];

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, reward: { type: "points", value: 50 } },
  { day: 2, reward: { type: "points", value: 100 } },
  { day: 3, reward: { type: "multiplier", value: 2, duration: 60 } },
  { day: 4, reward: { type: "points", value: 200 } },
  { day: 5, reward: { type: "booster", value: 3, duration: 120 } },
  { day: 6, reward: { type: "points", value: 500 } },
  { day: 7, reward: { type: "multiplier", value: 5, duration: 300 } },
];

const POINTS_PER_LEVEL = 100;

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    points: 0,
    clickMultiplier: 1,
    autoClickerPoints: 0,
    level: 1,
    totalPointsEarned: 0,
    activeMultipliers: [],
    consecutiveLogins: 0,
  });
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);

  // Check daily login
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = gameState.lastLoginDate;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastLogin === yesterday.toDateString();

      setGameState(prev => ({
        ...prev,
        lastLoginDate: today,
        consecutiveLogins: isConsecutive ? prev.consecutiveLogins + 1 : 1
      }));

      const reward = DAILY_REWARDS[(isConsecutive ? gameState.consecutiveLogins : 0) % 7];
      if (reward) {
        handleDailyReward(reward.reward);
        toast.success(`Daily Reward: Day ${reward.day} - ${getRewardDescription(reward.reward)}`);
      }
    }
  }, []);

  // Clean up expired multipliers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setGameState(prev => ({
        ...prev,
        activeMultipliers: prev.activeMultipliers.filter(m => m.expiresAt > now)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTotalMultiplier = () => {
    return gameState.activeMultipliers.reduce((acc, m) => acc * m.value, gameState.clickMultiplier);
  };

  const handleDailyReward = (reward: DailyReward["reward"]) => {
    if (reward.type === "points") {
      setGameState(prev => ({
        ...prev,
        points: prev.points + reward.value,
        totalPointsEarned: prev.totalPointsEarned + reward.value
      }));
    } else if (reward.type === "multiplier" || reward.type === "booster") {
      activateMultiplier(reward.value, reward.duration || 60);
    }
  };

  const activateMultiplier = (value: number, duration: number) => {
    setGameState(prev => ({
      ...prev,
      activeMultipliers: [
        ...prev.activeMultipliers,
        { value, expiresAt: Date.now() + duration * 1000 }
      ]
    }));
  };

  const handleClick = () => {
    setGameState(prev => {
      const pointsEarned = prev.clickMultiplier * getTotalMultiplier();
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

    setGameState(prev => {
      const newState = { ...prev, points: prev.points - upgrade.cost };
      
      if (upgrade.type === "autoClicker") {
        newState.autoClickerPoints += upgrade.multiplier;
      } else if (upgrade.type === "multiplier") {
        newState.clickMultiplier *= upgrade.multiplier;
      } else if (upgrade.type === "booster") {
        activateMultiplier(upgrade.multiplier, upgrade.duration || 60);
      }
      
      return newState;
    });

    setUpgrades(prev =>
      prev.map((u) =>
        u.id === id
          ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      )
    );

    toast.success(`Purchased ${upgrade.name}!`);
  };

  const getRewardDescription = (reward: DailyReward["reward"]) => {
    if (reward.type === "points") return `${reward.value} points`;
    if (reward.type === "multiplier") return `${reward.value}x multiplier for ${reward.duration}s`;
    return `${reward.value}x booster for ${reward.duration}s`;
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
        {gameState.activeMultipliers.length > 0 && (
          <div className="text-sm text-game-accent">
            Active multiplier: {getTotalMultiplier()}x
          </div>
        )}
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
