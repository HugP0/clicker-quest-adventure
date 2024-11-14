import { useState } from "react";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { useGameState } from "@/components/game/GameStateManager";
import { Progress } from "@/components/ui/progress";

const POINTS_PER_LEVEL = 100;

const Index = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const { powerPlants, environment, purchasePowerPlant } = useGameState();

  const handleClick = () => {
    const pointsEarned = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned), 1);
    
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
    const plant = powerPlants.find(p => p.id === id);
    if (!plant || points < plant.cost) return;
    
    setPoints(prev => prev - plant.cost);
    purchasePowerPlant(id);
  };

  const progressToNextLevel = (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <ResourceCounter 
          amount={points} 
          renewablePercentage={environment.renewablePercentage} 
        />
        <div className="glass-card px-4 py-2">
          <p className="text-sm text-yellow-400">Level {level}</p>
          <Progress value={progressToNextLevel} className="w-32 mt-2" />
        </div>
      </div>
      
      <ClickArea 
        onClick={handleClick} 
        environmentalState={environment.visualState}
      />
      
      <UpgradeShop
        powerPlants={powerPlants}
        onPurchase={handlePurchase}
        canAfford={(cost) => points >= cost}
      />
    </div>
  );
};

export default Index;