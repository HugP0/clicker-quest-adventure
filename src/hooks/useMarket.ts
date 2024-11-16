import { useState } from 'react';
import { MarketState } from '@/types/powerPlant';
import { toast } from 'sonner';

const INITIAL_MARKET_STATE: MarketState = {
  currentPrice: 1.0,
  demand: 100,
  trend: 'stable',
  history: Array.from({ length: 10 }, (_, i) => ({
    timestamp: Date.now() - (i * 1000),
    price: 1.0
  }))
};

export const useMarket = () => {
  const [market, setMarket] = useState<MarketState>(INITIAL_MARKET_STATE);

  const sellEnergy = (amount: number) => {
    const profit = amount * market.currentPrice;
    toast.success(`Sold ${amount} MW for $${profit.toFixed(2)}`);
    return profit;
  };

  const updateMarket = () => {
    const randomChange = (Math.random() - 0.5) * 0.1;
    const newPrice = Math.max(0.5, Math.min(2.0, market.currentPrice + randomChange));
    const newTrend = randomChange > 0 ? 'up' : randomChange < 0 ? 'down' : 'stable';
    
    setMarket(prev => ({
      ...prev,
      currentPrice: newPrice,
      trend: newTrend,
      history: [
        { timestamp: Date.now(), price: newPrice },
        ...prev.history.slice(0, 9)
      ]
    }));
  };

  return { market, sellEnergy, updateMarket };
};