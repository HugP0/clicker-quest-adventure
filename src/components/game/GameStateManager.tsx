import { useState, useEffect } from "react";
import { PowerPlant, EnvironmentalState, MarketState, ResearchProject } from "@/types/powerPlant";
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

const INITIAL_MARKET_STATE: MarketState = {
  currentPrice: 1.0,
  demand: 100,
  trend: 'stable',
  history: Array.from({ length: 10 }, (_, i) => ({
    timestamp: Date.now() - (i * 1000),
    price: 1.0
  }))
};

const INITIAL_RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "efficiency1",
    name: "Enhanced Efficiency",
    description: "Improve power plant efficiency by 10%",
    cost: 1000,
    requiredEnergy: 500,
    completed: false,
    unlocks: ["efficiency2"]
  }
];

export const useGameState = () => {
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>(INITIAL_POWER_PLANTS);
  const [environment, setEnvironment] = useState<EnvironmentalState>({
    pollutionLevel: 0,
    renewablePercentage: 0,
    visualState: 'neutral',
    globalDemand: 100,
    marketPrice: 1.0,
    publicOpinion: 50
  });
  const [market, setMarket] = useState<MarketState>(INITIAL_MARKET_STATE);
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(INITIAL_RESEARCH_PROJECTS);
  const [money, setMoney] = useState(50);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const calculateEnvironmentalImpact = () => {
    const totalPollution = powerPlants.reduce((acc, plant) => 
      acc + (plant.pollutionImpact * plant.owned * plant.upgradeLevel), 0);
    
    const totalProduction = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned * plant.upgradeLevel * (plant.autoProducing ? 1 : 0)), 0);
    
    const renewableProduction = powerPlants
      .filter(plant => ['solar', 'wind', 'hydro'].includes(plant.type))
      .reduce((acc, plant) => 
        acc + (plant.baseProduction * plant.owned * plant.upgradeLevel * (plant.autoProducing ? 1 : 0)), 0);

    setEnvironment({
      pollutionLevel: totalPollution,
      renewablePercentage: totalProduction > 0 ? (renewableProduction / totalProduction) * 100 : 0,
      visualState: totalPollution > 50 ? 'polluted' : totalPollution < 20 ? 'clean' : 'neutral',
      globalDemand: 100,
      marketPrice: 1.0,
      publicOpinion: 50
    });

    if (totalProduction > 0) {
      const moneyGenerated = Math.floor(totalProduction * 0.5);
      setMoney(prev => prev + moneyGenerated);
    }
  };

  useEffect(() => {
    const interval = setInterval(calculateEnvironmentalImpact, 1000);
    return () => clearInterval(interval);
  }, [powerPlants]);

  const sellEnergy = (amount: number) => {
    const profit = amount * market.currentPrice;
    setMoney(prev => prev + profit);
    toast.success(`Sold ${amount} MW for $${profit.toFixed(2)}`);
  };

  const startResearch = (projectId: string) => {
    const project = researchProjects.find(p => p.id === projectId);
    if (!project || project.completed) return;

    setResearchProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, completed: true } : p
    ));
    toast.success(`Research completed: ${project.name}`);
  };

  const toggleAutoProduction = (id: string) => {
    setPowerPlants(prev => prev.map(plant => 
      plant.id === id 
        ? { ...plant, autoProducing: !plant.autoProducing }
        : plant
    ));
    
    const plant = powerPlants.find(p => p.id === id);
    if (plant) {
      toast.success(`${plant.name} ${!plant.autoProducing ? 'enabled' : 'disabled'}!`);
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
    
    toast.success(`New ${plant.name} built!`);
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
    market,
    researchProjects,
    purchasePowerPlant,
    upgradePowerPlant,
    toggleAutoProduction,
    sellEnergy,
    startResearch
  };
};
