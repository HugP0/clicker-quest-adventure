export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
  owned: number;
  multiplier: number;
  type: 'autoClicker' | 'multiplier' | 'booster';
  duration?: number; // Duration in seconds for temporary boosters
}

export interface GameState {
  points: number;
  clickMultiplier: number;
  autoClickerPoints: number;
  level: number;
  totalPointsEarned: number;
  activeMultipliers: {
    value: number;
    expiresAt: number;
  }[];
  lastLoginDate?: string;
  consecutiveLogins: number;
}

export interface DailyReward {
  day: number;
  reward: {
    type: 'points' | 'multiplier' | 'booster';
    value: number;
    duration?: number;
  };
}