import { useState, useEffect } from "react";
import { PowerPlant, EnvironmentalState } from "@/types/powerPlant";
import { toast } from "sonner";

const INITIAL_POWER_PLANTS: PowerPlant[] = [
  {
    id: "coal",
    name: "Coal Power Plant",
    type: "coal",
    baseProduction: 2,
    pollutionImpact: 5,
    cost: 10,
    description: "Basic power generation, high pollution",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 50,
    autoProducing: false
  },
  {
    id: "solar",
    name: "Solar Farm",
    type: "solar",
    baseProduction: 1,
    pollutionImpact: 0,
    cost: 30,
    description: "Renewable energy from sunlight",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 75,
    autoProducing: false
  },
  {
    id: "nuclear",
    name: "Nuclear Plant",
    type: "nuclear",
    baseProduction: 10,
    pollutionImpact: 2,
    cost: 200,
    description: "High energy output, moderate pollution",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 300,
    autoProducing: false
  },
  {
    id: "wind",
    name: "Wind Farm",
    type: "wind",
    baseProduction: 1,
    pollutionImpact: 0,
    cost: 20,
    description: "Clean but low output energy",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 40,
    autoProducing: false
  },
  {
    id: "geothermal",
    name: "Geothermal Plant",
    type: "geothermal",
    baseProduction: 5,
    pollutionImpact: 1,
    cost: 150,
    description: "Sustainable energy from Earth's heat",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 225,
    autoProducing: false
  },
  {
    id: "hydro",
    name: "Hydro Dam",
    type: "hydro",
    baseProduction: 3,
    pollutionImpact: 0,
    cost: 100,
    description: "Clean energy from water flow",
    owned: 0,
    upgradeLevel: 1,
    upgradeCost: 150,
    autoProducing: false
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const calculateEnvironmentalImpact = () => {
    const totalPollution = powerPlants.reduce((acc, plant) => 
      acc + (plant.pollutionImpact * plant.owned * plant.upgradeLevel), 0);
    
    const totalProduction = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned * plant.upgradeLevel * (plant.autoProducing ? 1 : 0)), 0);
    
    const renewableProduction = powerPlants
      .filter(plant => ['solar', 'wind', 'hydro'].includes(plant.type))
      .reduce((acc, plant) => acc + (plant.baseProduction * plant.owned * plant.upgradeLevel * (plant.autoProducing ? 1 : 0)), 0);

    setEnvironment({
      pollutionLevel: totalPollution,
      renewablePercentage: totalProduction > 0 ? (renewableProduction / totalProduction) * 100 : 0,
      visualState: totalPollution > 50 ? 'polluted' : totalPollution < 20 ? 'clean' : 'neutral'
    });

    if (totalProduction > 0) {
      const moneyGenerated = Math.floor(totalProduction * 0.1);
      setMoney(prev => prev + moneyGenerated);
    }
  };

  useEffect(() => {
    const interval = setInterval(calculateEnvironmentalImpact, 1000);
    return () => clearInterval(interval);
  }, [powerPlants]);

  const toggleAutoProduction = (id: string) => {
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { ...plant, autoProducing: !plant.autoProducing }
        : plant
    ));
    const plant = powerPlants.find(p => p.id === id);
    if (plant) {
      toast.success(`${plant.name} auto-production ${!plant.autoProducing ? 'enabled' : 'disabled'}!`);
    }
  };

  const purchasePowerPlant = (id: string) => {
    const plant = powerPlants.find(p => p.id === id);
    if (!plant || money < plant.cost) return;

    setMoney(prev => prev - plant.cost);
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { 
            ...plant, 
            owned: plant.owned + 1,
            cost: Math.floor(plant.cost * 1.15)
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
            upgradeCost: Math.floor(plant.upgradeCost * 1.5)
          }
        : plant
    ));
    
    toast.success(`${plant.name} upgraded to level ${plant.upgradeLevel + 1}!`);
  };

  return {
    powerPlants,
    environment,
    money,
    isLoading,
    purchasePowerPlant,
    upgradePowerPlant,
    toggleAutoProduction
  };
};