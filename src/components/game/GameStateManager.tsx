import { useState, useEffect, useCallback } from "react";
import { PowerPlant, EnvironmentalState } from "@/types/powerPlant";
import { toast } from "sonner";

const INITIAL_POWER_PLANTS: PowerPlant[] = [
  {
    id: "coal",
    name: "Centrale à Charbon",
    type: "coal",
    baseProduction: 10,
    pollutionImpact: 5,
    cost: 10,
    baseCost: 10,
    costMultiplier: 1.15,
    description: "Production de base, forte pollution",
    owned: 0,
    level: 1,
    upgradeBaseCost: 50
  },
  {
    id: "hydro",
    name: "Barrage Hydroélectrique",
    type: "hydro",
    baseProduction: 5,
    pollutionImpact: 1,
    cost: 50,
    baseCost: 50,
    costMultiplier: 1.2,
    description: "Énergie propre de l'eau",
    owned: 0,
    level: 1,
    upgradeBaseCost: 200
  },
  {
    id: "solar",
    name: "Ferme Solaire",
    type: "solar",
    baseProduction: 3,
    pollutionImpact: 0,
    cost: 30,
    baseCost: 30,
    costMultiplier: 1.18,
    description: "Énergie renouvelable du soleil",
    owned: 0,
    level: 1,
    upgradeBaseCost: 150
  }
];

export const useGameState = () => {
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>(INITIAL_POWER_PLANTS);
  const [environment, setEnvironment] = useState<EnvironmentalState>({
    pollutionLevel: 0,
    renewablePercentage: 0,
    visualState: 'neutral'
  });

  const calculateEnvironmentalImpact = useCallback(() => {
    const totalPollution = powerPlants.reduce((acc, plant) => 
      acc + (plant.pollutionImpact * plant.owned * plant.level), 0);
    
    const totalProduction = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned * plant.level), 0);
    
    const renewableProduction = powerPlants
      .filter(plant => ['solar', 'hydro', 'geothermal'].includes(plant.type))
      .reduce((acc, plant) => acc + (plant.baseProduction * plant.owned * plant.level), 0);

    setEnvironment({
      pollutionLevel: totalPollution,
      renewablePercentage: totalProduction > 0 ? (renewableProduction / totalProduction) * 100 : 0,
      visualState: totalPollution > 50 ? 'polluted' : totalPollution < 20 ? 'clean' : 'neutral'
    });
  }, [powerPlants]);

  const purchasePowerPlant = (id: string) => {
    setPowerPlants(prev => prev.map(plant => {
      if (plant.id === id) {
        const newOwned = plant.owned + 1;
        const newCost = Math.floor(plant.baseCost * Math.pow(plant.costMultiplier, newOwned));
        return { 
          ...plant, 
          owned: newOwned,
          cost: newCost
        };
      }
      return plant;
    }));
    
    toast.success(`Nouvelle ${powerPlants.find(p => p.id === id)?.name} construite !`);
  };

  const upgradePowerPlant = (id: string) => {
    setPowerPlants(prev => prev.map(plant => {
      if (plant.id === id) {
        const newLevel = plant.level + 1;
        return { 
          ...plant, 
          level: newLevel,
          upgradeBaseCost: Math.floor(plant.upgradeBaseCost * Math.pow(1.5, newLevel))
        };
      }
      return plant;
    }));
    
    toast.success(`${powerPlants.find(p => p.id === id)?.name} améliorée au niveau ${
      (powerPlants.find(p => p.id === id)?.level || 0) + 1
    } !`);
  };

  useEffect(() => {
    calculateEnvironmentalImpact();
  }, [powerPlants, calculateEnvironmentalImpact]);

  // Production passive
  useEffect(() => {
    const interval = setInterval(() => {
      const production = powerPlants.reduce((acc, plant) => 
        acc + (plant.baseProduction * plant.owned * plant.level), 0);
      // Vous devrez ajouter cette production à votre total de points
    }, 1000);

    return () => clearInterval(interval);
  }, [powerPlants]);

  return {
    powerPlants,
    environment,
    purchasePowerPlant,
    upgradePowerPlant
  };
};