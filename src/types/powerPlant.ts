export type PowerPlantType = 'coal' | 'hydro' | 'solar' | 'nuclear' | 'geothermal' | 'wind';

export interface PowerPlant {
  id: string;
  name: string;
  type: PowerPlantType;
  baseProduction: number;
  pollutionImpact: number;
  cost: number;
  description: string;
  owned: number;
  upgradeLevel: number;
  upgradeCost: number;
  autoProducing: boolean;
  efficiency: number;
  marketDemand: number;
  profitPerMW: number;
}

export interface EnvironmentalState {
  pollutionLevel: number;
  renewablePercentage: number;
  visualState: 'polluted' | 'neutral' | 'clean';
  globalDemand: number;
  marketPrice: number;
  publicOpinion: number;
}

export interface MarketState {
  currentPrice: number;
  demand: number;
  trend: 'up' | 'down' | 'stable';
  history: Array<{ timestamp: number; price: number }>;
}

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  cost: number;
  requiredEnergy: number;
  completed: boolean;
  unlocks: string[];
}