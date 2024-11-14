export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
  owned: number;
  multiplier: number;
  type: 'autoClicker' | 'multiplier';
}

export interface GameState {
  points: number;
  clickMultiplier: number;
  autoClickerPoints: number;
  level: number;
  totalPointsEarned: number;
}