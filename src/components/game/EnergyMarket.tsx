import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { MarketState } from "@/types/powerPlant";
import { useTranslation } from "react-i18next";

interface EnergyMarketProps {
  market: MarketState;
  currentProduction: number;
  onSellEnergy: (amount: number) => void;
}

export const EnergyMarket = ({ market, currentProduction, onSellEnergy }: EnergyMarketProps) => {
  const { t } = useTranslation();

  return (
    <div className="glass-card p-4 bg-amber-950/20">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">{t('market.title')}</h3>
      
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={market.history}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#fbbf24" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-yellow-200">
          <span>{t('market.current_price')}:</span>
          <span>${market.currentPrice.toFixed(2)}/MW</span>
        </div>
        <div className="flex justify-between text-yellow-200">
          <span>{t('market.demand')}:</span>
          <span>{market.demand} MW</span>
        </div>
        <div className="flex justify-between text-yellow-200">
          <span>{t('market.trend')}:</span>
          <span className={market.trend === 'up' ? 'text-green-400' : market.trend === 'down' ? 'text-red-400' : 'text-yellow-200'}>
            {t(`market.trends.${market.trend}`)}
          </span>
        </div>
      </div>

      <Button 
        onClick={() => onSellEnergy(currentProduction)}
        className="w-full mt-4"
        variant="outline"
      >
        {t('market.sell_energy', { amount: currentProduction })}
      </Button>
    </div>
  );
};