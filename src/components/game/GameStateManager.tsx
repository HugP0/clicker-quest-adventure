import { useState, useEffect } from "react";
import { EnvironmentalState } from "@/types/powerPlant";
import { usePowerPlants } from "@/hooks/usePowerPlants";
import { useMarket } from "@/hooks/useMarket";
import { useResearch } from "@/hooks/useResearch";

export const useGameState = () => {
  const { powerPlants, purchasePowerPlant, upgradePowerPlant, toggleAutoProduction } = usePowerPlants();
  const { market, sellEnergy, updateMarket } = useMarket();
  const { researchProjects, startResearch } = useResearch();
  
  const [environment, setEnvironment] = useState<EnvironmentalState>({
    pollutionLevel: 0,
    renewablePercentage: 0,
    visualState: 'neutral',
    globalDemand: 100,
    marketPrice: 1.0,
    publicOpinion: 50
  });
  
  const [money, setMoney] = useState(50);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      updateMarket();
      calculateEnvironmentalImpact();
    }, 1000);
    
    setTimeout(() => setIsLoading(false), 2000);
    
    return () => clearInterval(interval);
  }, [powerPlants]);

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
      renewablePercentage: totalProduction > 0 ? (renewablePercentage / totalProduction) * 100 : 0,
      visualState: totalPollution > 50 ? 'polluted' : totalPollution < 20 ? 'clean' : 'neutral',
      globalDemand: market.demand,
      marketPrice: market.currentPrice,
      publicOpinion: 50
    });

    if (totalProduction > 0) {
      const profit = sellEnergy(totalProduction);
      setMoney(prev => prev + profit);
    }
  };

  const handleSellEnergy = (amount: number) => {
    const profit = sellEnergy(amount);
    setMoney(prev => prev + profit);
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
    sellEnergy: handleSellEnergy,
    startResearch
  };
};