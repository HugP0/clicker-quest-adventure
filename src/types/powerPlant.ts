export type PowerPlantType = 'coal' | 'hydro' | 'solar' | 'nuclear' | 'geothermal';

export interface PowerPlant {
  id: string;
  name: string;
  type: PowerPlantType;
  baseProduction: number;
  pollutionImpact: number;
  cost: number;
  baseCost: number; // Coût initial
  costMultiplier: number; // Multiplicateur de coût
  description: string;
  owned: number;
  level: number; // Niveau d'amélioration
  upgradeBaseCost: number; // Coût de base pour améliorer
}

export interface EnvironmentalState {
  pollutionLevel: number;
  renewablePercentage: number;
  visualState: 'polluted' | 'neutral' | 'clean';
}