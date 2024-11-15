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
  }
];

export const useGameState = () => {
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>(INITIAL_POWER_PLANTS);
  const [environment, setEnvironment] = useState<EnvironmentalState>({
    pollutionLevel: 0,
    renewablePercentage: 0,
    visualState: 'neutral'
  });

  const calculateEnvironmentalImpact = () => {
    const totalPollution = powerPlants.reduce((acc, plant) => 
      acc + (plant.pollutionImpact * plant.owned), 0);
    
    const totalProduction = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned), 0);
    
    const renewableProduction = powerPlants
      .filter(plant => ['solar', 'hydro', 'geothermal'].includes(plant.type))
      .reduce((acc, plant) => acc + (plant.baseProduction * plant.owned), 0);

    setEnvironment({
      pollutionLevel: totalPollution,
      renewablePercentage: totalProduction > 0 ? (renewableProduction / totalProduction) * 100 : 0,
      visualState: totalPollution > 50 ? 'polluted' : totalPollution < 20 ? 'clean' : 'neutral'
    });
  };

  useEffect(() => {
    calculateEnvironmentalImpact();
  }, [powerPlants]);

  const purchasePowerPlant = (id: string) => {
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { ...plant, owned: plant.owned + 1 }
        : plant
    ));
    
    toast.success(`New ${powerPlants.find(p => p.id === id)?.name} constructed!`);
  };

  return {
    powerPlants,
    environment,
    purchasePowerPlant
  };
};