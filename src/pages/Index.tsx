import { useState } from "react";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { Earth } from "@/components/game/Earth";
import { useGameState } from "@/components/game/GameStateManager";
import { Progress } from "@/components/ui/progress";

const POINTS_PER_LEVEL = 1000; // Increased from 100 to 1000

const Index = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const { powerPlants, environment, money, purchasePowerPlant, upgradePowerPlant } = useGameState();

  const handleClick = () => {
    const pointsEarned = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned * plant.upgradeLevel), 1);
    
    setPoints(prev => {
      const newPoints = prev + pointsEarned;
      const newLevel = Math.floor(newPoints / POINTS_PER_LEVEL) + 1;
      
      if (newLevel > level) {
        setLevel(newLevel);
      }
      
      return newPoints;
    });
  };

  const handlePurchase = (id: string) => {
    purchasePowerPlant(id);
  };

  const handleUpgrade = (id: string) => {
    upgradePowerPlant(id);
  };

  const progressToNextLevel = (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <ResourceCounter 
          energy={points}
          money={money}
          renewablePercentage={environment.renewablePercentage}
        />
        <div className="glass-card px-4 py-2">
          <p className="text-xl font-bold text-yellow-400">Level {level}</p>
          <Progress value={progressToNextLevel} className="w-48 mt-2" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-8">
        <Earth environmentalState={environment.visualState} />
        <ClickArea 
          onClick={handleClick} 
          environmentalState={environment.visualState}
        />
      </div>
      
      <UpgradeShop
        powerPlants={powerPlants}
        onPurchase={handlePurchase}
        onUpgrade={handleUpgrade}
        canAfford={(cost) => money >= cost}
      />
    </div>
  );
};

export default Index;