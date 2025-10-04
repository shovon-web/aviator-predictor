import React from 'react';
import { Prediction, RangeCategory, Trend } from '../types';
import { TrendUpIcon, TrendDownIcon, ZapIcon, StableTrendIcon } from './icons';

interface PredictionDisplayProps {
  prediction: Prediction;
  t: (key: string) => string;
  isLoading: boolean;
  historyLength: number;
  trend: Trend;
}

const getCategoryColorClass = (category: string) => {
    switch(category.toLowerCase()) {
        case RangeCategory.LOW.toLowerCase(): return 'text-red-400';
        case RangeCategory.MEDIUM.toLowerCase(): return 'text-yellow-400';
        case RangeCategory.HIGH.toLowerCase(): return 'text-green-400';
        default: return 'text-gray-300';
    }
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, t, isLoading, historyLength, trend }) => {
  const { nextRoundPrediction, probabilities, cashOutTarget, investmentAdvice, patternAnalysis } = prediction;
  
  const probabilityData = [
      { name: t('low'), value: probabilities.low, color: 'bg-red-500' },
      { name: t('medium'), value: probabilities.medium, color: 'bg-yellow-500' },
      { name: t('high'), value: probabilities.high, color: 'bg-green-500' },
  ];
  
  // --- Confidence Calculation ---
  const calculateConfidence = () => {
    if (historyLength < 5) {
        return { level: 'Low', color: 'border-red-500/80', badgeColor: 'bg-red-500/20 text-red-400' };
    }

    const dataScore = Math.min(historyLength / 30, 1.0);
    const probs = Object.values(prediction.probabilities).map(Number).sort((a, b) => b - a);
    const probSpread = (probs[0] - probs[1]) / 100;
    const probScore = probSpread;
    const confidenceScore = (dataScore * 0.5) + (probScore * 0.5);

    if (confidenceScore > 0.7) {
        return { level: 'High', color: 'border-green-500', badgeColor: 'bg-green-500/20 text-green-300' };
    }
    if (confidenceScore > 0.45) {
        return { level: 'Medium', color: 'border-yellow-500', badgeColor: 'bg-yellow-500/20 text-yellow-300' };
    }
    return { level: 'Low', color: 'border-red-500/80', badgeColor: 'bg-red-500/20 text-red-400' };
  };

  const confidence = calculateConfidence();

  const getTrendIndicator = () => {
    switch (trend) {
      case Trend.INCREASING:
        return { icon: <TrendUpIcon />, labelKey: 'trendIncreasing', badgeColor: 'bg-green-500/20 text-green-300' };
      case Trend.DECREASING:
        return { icon: <TrendDownIcon />, labelKey: 'trendDecreasing', badgeColor: 'bg-red-500/20 text-red-400' };
      case Trend.VOLATILE:
        return { icon: <ZapIcon />, labelKey: 'trendVolatile', badgeColor: 'bg-yellow-500/20 text-yellow-300' };
      case Trend.STABLE:
        return { icon: <StableTrendIcon />, labelKey: 'trendStable', badgeColor: 'bg-cyan-500/20 text-cyan-300' };
      default: return null;
    }
  };
  const trendIndicator = getTrendIndicator();

  return (
    <div className={`p-4 space-y-4 animate-fade-in ${isLoading ? 'opacity-50 blur-sm' : ''}`}>
      
        <div className={`bg-slate-800/50 p-4 rounded-lg text-center border-t-4 transition-colors duration-500 ${confidence.color}`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">{t('nextPrediction')}</h3>
                <div className="flex items-center space-x-2">
                    {trendIndicator && (
                        <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${trendIndicator.badgeColor}`} title={t(trendIndicator.labelKey)}>
                            {trendIndicator.icon}
                            <span className="ml-1.5">{t(trendIndicator.labelKey)}</span>
                        </div>
                    )}
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${confidence.badgeColor}`}>
                       {t('confidenceLevel')}: {t(`confidence${confidence.level}`)}
                    </div>
                </div>
            </div>
            <p className={`text-4xl font-bold ${getCategoryColorClass(nextRoundPrediction)}`}>
                {nextRoundPrediction}
            </p>
        </div>

        <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">{t('probabilities')}</h3>
            <div className="flex bg-slate-800/50 rounded-full h-6 overflow-hidden">
                {probabilityData.map(p => (
                    p.value > 0 && <div
                        key={p.name}
                        className={`${p.color} flex items-center justify-center text-xs font-bold text-white transition-all duration-500`}
                        style={{ width: `${p.value}%` }}
                        title={`${p.name}: ${p.value}%`}
                    >
                        {p.value > 10 ? `${p.value}%` : ''}
                    </div>
                ))}
            </div>
             <div className="flex justify-between text-xs mt-1 px-1">
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>{t('low')}</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>{t('medium')}</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{t('high')}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-1">{t('cashOutTarget')}</h3>
                <p className="text-2xl font-mono text-white">{cashOutTarget > 0 ? `${cashOutTarget.toFixed(2)}x` : 'N/A'}</p>
            </div>
             <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-1">{t('investmentAdvice')}</h3>
                <p className="text-sm text-gray-300 italic">"{investmentAdvice}"</p>
            </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">{t('patternAnalysis')}</h3>
            <p className="text-sm text-gray-300">{patternAnalysis}</p>
        </div>
    </div>
  );
};

export default PredictionDisplay;
