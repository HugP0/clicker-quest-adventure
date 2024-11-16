import { useState } from 'react';
import { PowerPlant } from '@/types/powerPlant';
import { toast } from 'sonner';

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
    autoProducing: false,
    efficiency: 0.8,
    marketDemand: 100,
    profitPerMW: 1.2
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
    autoProducing: false,
    efficiency: 0.6,
    marketDemand: 150,
    profitPerMW: 2.0
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
    autoProducing: false,
    efficiency: 0.9,
    marketDemand: 80,
    profitPerMW: 3.0
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
    autoProducing: false,
    efficiency: 0.7,
    marketDemand: 120,
    profitPerMW: 1.5
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
    autoProducing: false,
    efficiency: 0.85,
    marketDemand: 110,
    profitPerMW: 2.5
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
    autoProducing: false,
    efficiency: 0.8,
    marketDemand: 90,
    profitPerMW: 1.8
  }
];

export const usePowerPlants = () => {
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>(INITIAL_POWER_PLANTS);

  const purchasePowerPlant = (id: string) => {
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { 
            ...plant, 
            owned: plant.owned + 1,
            cost: Math.floor(plant.cost * 1.15)
          }
        : plant
    ));
    
    const plant = powerPlants.find(p => p.id === id);
    if (plant) {
      toast.success(`New ${plant.name} built!`);
    }
  };

  const upgradePowerPlant = (id: string) => {
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { 
            ...plant, 
            upgradeLevel: plant.upgradeLevel + 1,
            upgradeCost: Math.floor(plant.upgradeCost * 1.5)
          }
        : plant
    ));
    
    const plant = powerPlants.find(p => p.id === id);
    if (plant) {
      toast.success(`${plant.name} upgraded to level ${plant.upgradeLevel + 1}!`);
    }
  };

  const toggleAutoProduction = (id: string) => {
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { ...plant, autoProducing: !plant.autoProducing }
        : plant
    ));
  };

  return {
    powerPlants,
    purchasePowerPlant,
    upgradePowerPlant,
    toggleAutoProduction
  };
};
