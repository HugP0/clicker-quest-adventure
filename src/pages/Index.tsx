import { useState } from "react";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { useGameState } from "@/components/game/GameStateManager";
import { Progress } from "@/components/ui/progress";

const POINTS_PER_LEVEL = 1000;

const Index = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const { 
    powerPlants, 
    environment, 
    money, 
    purchasePowerPlant, 
    upgradePowerPlant,
    toggleAutoProduction 
  } = useGameState();

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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ResourceCounter 
            energy={points}
            money={money}
            renewablePercentage={environment.renewablePercentage}
          />
          <div className="glass-card p-4 space-y-2">
            <p className="text-sm text-yellow-200">Environmental Impact</p>
            <Progress value={environment.pollutionLevel} className="h-2" />
            <p className="text-xs text-yellow-200">
              Pollution Level: {environment.pollutionLevel}%
            </p>
          </div>
          <div className="flex justify-center">
            <ClickArea 
              onClick={handleClick} 
              environmentalState={environment.visualState}
            />
          </div>
        </div>
        
        <UpgradeShop
          powerPlants={powerPlants}
          onPurchase={purchasePowerPlant}
          onUpgrade={upgradePowerPlant}
          onToggleAuto={toggleAutoProduction}
          canAfford={(cost) => money >= cost}
        />
      </div>
    </div>
  );
};

export default Index;