export type PowerPlantType = 'coal' | 'hydro' | 'solar' | 'nuclear' | 'geothermal';

export interface PowerPlant {
  id: string;
  name: string;
  type: PowerPlantType;
  baseProduction: number;
  pollutionImpact: number;
  cost: number;
  description: string;
  owned: number;
}

export interface EnvironmentalState {
  pollutionLevel: number;
  renewablePercentage: number;
  visualState: 'polluted' | 'neutral' | 'clean';
}