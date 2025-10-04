
import { RangeCategory } from './types';

export const MULTIPLIER_THRESHOLDS = {
  LOW: 1.3,
  MEDIUM: 5.0,
};

export const MAX_HISTORY_LENGTH = 50;

export const getCategory = (value: number): RangeCategory => {
  if (value <= MULTIPLIER_THRESHOLDS.LOW) return RangeCategory.LOW;
  if (value > MULTIPLIER_THRESHOLDS.LOW && value <= MULTIPLIER_THRESHOLDS.MEDIUM) return RangeCategory.MEDIUM;
  return RangeCategory.HIGH;
};

export const INITIAL_PREDICTION = {
    patternAnalysis: 'Waiting for more data to analyze patterns.',
    nextRoundPrediction: 'N/A',
    probabilities: { low: 0, medium: 0, high: 0 },
    cashOutTarget: 0,
    investmentAdvice: 'Please add at least 5 multipliers to get initial advice.',
};
