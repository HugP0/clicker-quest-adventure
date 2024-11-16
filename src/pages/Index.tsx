import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClickArea } from "@/components/game/ClickArea";
import { ResourceCounter } from "@/components/game/ResourceCounter";
import { UpgradeShop } from "@/components/game/UpgradeShop";
import { EnergyMarket } from "@/components/game/EnergyMarket";
import { ResearchLab } from "@/components/game/ResearchLab";
import { useGameState } from "@/components/game/GameStateManager";
import { Progress } from "@/components/ui/progress";
import { LoadingScreen } from "@/components/game/LoadingScreen";
import { LanguageSelector } from "@/components/game/LanguageSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const { t } = useTranslation();
  const { 
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
  } = useGameState();

  const handleClick = () => {
    const pointsEarned = powerPlants.reduce((acc, plant) => 
      acc + (plant.baseProduction * plant.owned * plant.upgradeLevel), 1);
    
    setPoints(prev => {
      const newPoints = prev + pointsEarned;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      
      if (newLevel > level) {
        setLevel(newLevel);
      }
      
      return newPoints;
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-amber-900/20 to-amber-950/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="w-[180px]" />
          <h1 className="text-4xl font-bold text-center text-yellow-400">
            {t('game.title')}
          </h1>
          <LanguageSelector />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCounter 
                energy={points}
                money={money}
                renewablePercentage={environment.renewablePercentage}
              />
              <div className="glass-card p-4 space-y-2">
                <p className="text-sm text-yellow-200">{t('game.environmental_impact')}</p>
                <Progress value={environment.pollutionLevel} className="h-2" />
                <p className="text-xs text-yellow-200">
                  {t('game.pollution_level')}: {environment.pollutionLevel}%
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ClickArea 
                onClick={handleClick} 
                environmentalState={environment.visualState}
              />
            </div>

            <EnergyMarket
              market={market}
              currentProduction={points}
              onSellEnergy={sellEnergy}
            />
          </div>
          
          <div className="lg:col-span-4 h-[calc(100vh-12rem)]">
            <Tabs defaultValue="powerplants">
              <TabsList className="w-full">
                <TabsTrigger value="powerplants" className="flex-1">{t('game.shop')}</TabsTrigger>
                <TabsTrigger value="research" className="flex-1">{t('research.title')}</TabsTrigger>
              </TabsList>
              <TabsContent value="powerplants">
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
                  <UpgradeShop
                    powerPlants={powerPlants}
                    onPurchase={purchasePowerPlant}
                    onUpgrade={upgradePowerPlant}
                    onToggleAuto={toggleAutoProduction}
                    canAfford={(cost) => money >= cost}
                  />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="research">
                <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
                  <ResearchLab
                    projects={researchProjects}
                    currentEnergy={points}
                    onStartResearch={startResearch}
                  />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;