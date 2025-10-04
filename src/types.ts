export enum RangeCategory {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Trend {
  INCREASING = 'Increasing',
  DECREASING = 'Decreasing',
  VOLATILE = 'Volatile',
  STABLE = 'Stable',
  NEUTRAL = 'Neutral',
}

export interface Multiplier {
  id: string;
  value: number;
  category: RangeCategory;
}

export interface Prediction {
  patternAnalysis: string;
  nextRoundPrediction: string;
  probabilities: {
    low: number;
    medium: number;
    high: number;
  };
  cashOutTarget: number;
  investmentAdvice: string;
}

export type Language = 'en' | 'bn';

export enum OcrStatus {
    IDLE = 'IDLE',
    INITIALIZING = 'INITIALIZING...',
    ACTIVE = 'ACTIVE',
    STOPPING = 'STOPPING...',
    ERROR = 'ERROR'
}

export interface CaptureArea {
  x: number;
  y: number;
  width: number;
  height: number;
}
