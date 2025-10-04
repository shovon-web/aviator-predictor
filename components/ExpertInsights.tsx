import React from 'react';
import { Prediction } from '../types';

interface ExpertInsightsProps {
  prediction: Prediction;
  t: (key: string) => string;
  isLoading: boolean;
}

const ExpertInsights: React.FC<ExpertInsightsProps> = ({ prediction, t, isLoading }) => {
  const { patternAnalysis, investmentAdvice } = prediction;

  return (
    <div className={`p-4 space-y-4 animate-fade-in ${isLoading ? 'opacity-50 blur-sm' : ''}`}>
      <div className="bg-slate-800/50 p-4 rounded-lg">
        <h3 className="text-md font-semibold text-cyan-400 mb-2">{t('patternAnalysis')}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{patternAnalysis}</p>
      </div>
      <div className="bg-slate-800/50 p-4 rounded-lg">
        <h3 className="text-md font-semibold text-cyan-400 mb-2">{t('investmentAdvice')}</h3>
        <p className="text-sm text-gray-300 leading-relaxed italic">"{investmentAdvice}"</p>
      </div>
    </div>
  );
};

export default ExpertInsights;
