import { useState, useEffect } from "react";
import { PowerPlant, EnvironmentalState } from "@/types/powerPlant";
import { toast } from "sonner";

const INITIAL_POWER_PLANTS: PowerPlant[] = [
  {
    id: "coal",
    name: "Coal Power Plant",
    type: "coal",
    baseProduction: 10,
    pollutionImpact: 5,
    cost: 10,
    description: "Basic power generation, high pollution",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 50
  },
  {
    id: "hydro",
    name: "Hydroelectric Dam",
    type: "hydro",
    baseProduction: 5,
    pollutionImpact: 1,
    cost: 50,
    description: "Clean energy from flowing water",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 100
  },
  {
    id: "solar",
    name: "Solar Farm",
    type: "solar",
    baseProduction: 3,
    pollutionImpact: 0,
    cost: 30,
    description: "Renewable energy from sunlight",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 75
  },
  {
    id: "nuclear",
    name: "Nuclear Plant",
    type: "nuclear",
    baseProduction: 50,
    pollutionImpact: 2,
    cost: 200,
    description: "High energy output, moderate pollution",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 300
  },
  {
    id: "wind",
    name: "Wind Farm",
    type: "wind",
    baseProduction: 2,
    pollutionImpact: 0,
    cost: 20,
    description: "Clean but low output energy",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 40
  },
  {
    id: "geothermal",
    name: "Geothermal Plant",
    type: "geothermal",
    baseProduction: 15,
    pollutionImpact: 1,
    cost: 150,
    description: "Steady clean energy from Earth's heat",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 225
  }
];

export const useGameState = () => {
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>(INITIAL_POWER_PLANTS);
  const [environment, setEnvironment] = useState<EnvironmentalState>({
    pollutionLevel: 0,
    renewablePercentage: 0,
    visualState: 'neutral'
  });
  const [money, setMoney] = useState(50);

  const calculateEnvironmentalImpact = () => {
    const totalPollution = powerPlants.reduce((acc, plant) => 
      acc + (plant.pollutionImpact * plant.owned * plant.upgradeLevel), 0);
    
    const totalProduction = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned * plant.upgradeLevel), 0);
    
    const renewableProduction = powerPlants
      .filter(plant => ['solar', 'hydro', 'wind', 'geothermal'].includes(plant.type))
      .reduce((acc, plant) => acc + (plant.baseProduction * plant.owned * plant.upgradeLevel), 0);

    setEnvironment({
      pollutionLevel: totalPollution,
      renewablePercentage: totalProduction > 0 ? (renewableProduction / totalProduction) * 100 : 0,
      visualState: totalPollution > 50 ? 'polluted' : totalPollution < 20 ? 'clean' : 'neutral'
    });

    // Generate money based on total production
    const moneyGenerated = Math.floor(totalProduction * 0.1);
    setMoney(prev => prev + moneyGenerated);
  };

  useEffect(() => {
    const interval = setInterval(calculateEnvironmentalImpact, 1000);
    return () => clearInterval(interval);
  }, [powerPlants]);

  const purchasePowerPlant = (id: string) => {
    const plant = powerPlants.find(p => p.id === id);
    if (!plant || money < plant.cost) return;

    setMoney(prev => prev - plant.cost);
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { 
            ...plant, 
            owned: plant.owned + 1,
            cost: Math.floor(plant.cost * 1.15) // Increase cost by 15% for each purchase
          }
        : plant
    ));
    
    toast.success(`New ${plant.name} constructed!`);
  };

  const upgradePowerPlant = (id: string) => {
    const plant = powerPlants.find(p => p.id === id);
    if (!plant || money < plant.upgradeCost) return;

    setMoney(prev => prev - plant.upgradeCost);
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { 
            ...plant, 
            upgradeLevel: plant.upgradeLevel + 1,
            upgradeCost: Math.floor(plant.upgradeCost * 1.5) // Increase upgrade cost by 50%
          }
        : plant
    ));
    
    toast.success(`${plant.name} upgraded to level ${plant.upgradeLevel + 1}!`);
  };

  return {
    powerPlants,
    environment,
    money,
    purchasePowerPlant,
    upgradePowerPlant
  };
};