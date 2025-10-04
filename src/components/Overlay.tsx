import React, { useState, useEffect, useCallback } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import { useLocalization } from '../hooks/useLocalization';
import { useOcr, OcrStatus } from '../hooks/useOcr';
import { useScreenCapture, CaptureArea } from '../hooks/useScreenCapture';
import { getPrediction } from '../services/geminiService';
import { Multiplier, Prediction, Trend } from '../types';
import { MAX_HISTORY_LENGTH, getCategory, INITIAL_PREDICTION } from '../constants';

import Header from './Header';
import Controls from './Controls';
import PredictionDisplay from './PredictionDisplay';
import HistoryView from './HistoryView';
import Settings from './Settings';
import About from './About';

type Tab = 'prediction' | 'history' | 'settings' | 'about';

const DEFAULT_CAPTURE_AREA: CaptureArea = { x: 50, y: 100, width: 200, height: 400 };

const Overlay: React.FC = () => {
  const { position, dragRef, onMouseDown } = useDraggable();
  const { language, setLanguage, t } = useLocalization('en');

  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('prediction');
  
  const [history, setHistory] = useState<Multiplier[]>([]);
  const [prediction, setPrediction] = useState<Prediction>(INITIAL_PREDICTION);
  const [isLoading, setIsLoading] = useState(false);
  const [trend, setTrend] = useState<Trend>(Trend.NEUTRAL);
  const [captureArea, setCaptureArea] = useState<CaptureArea>(() => {
      const saved = localStorage.getItem('captureArea');
      return saved ? JSON.parse(saved) : DEFAULT_CAPTURE_AREA;
  });

  const handleNewMultiplier = useCallback((newValue: number) => {
    setHistory(prevHistory => {
      if (prevHistory.length > 0 && prevHistory[0].value === newValue) {
        return prevHistory; // Avoid duplicates
      }
      const newMultiplier: Multiplier = {
        id: new Date().toISOString(),
        value: newValue,
        category: getCategory(newValue),
      };
      const updatedHistory = [newMultiplier, ...prevHistory];
      if (updatedHistory.length > MAX_HISTORY_LENGTH) {
        updatedHistory.pop();
      }
      return updatedHistory;
    });
  }, []);

  const { ocrStatus, startOcr, stopOcr, processFrame, setOcrStatus } = useOcr(handleNewMultiplier);
  const { startCapture, stopCapture, error: captureError } = useScreenCapture(processFrame);

  useEffect(() => {
    if (history.length >= 5) {
      setIsLoading(true);
      getPrediction(history)
        .then(setPrediction)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [history]);

  useEffect(() => {
    if (history.length < 4) {
      setTrend(Trend.NEUTRAL);
      return;
    }

    const recentValues = history.slice(0, 4).map(h => h.value).reverse();
    const range = Math.max(...recentValues) - Math.min(...recentValues);

    const isIncreasing = recentValues[3] > recentValues[2] && recentValues[2] > recentValues[1];
    if (isIncreasing) {
      setTrend(Trend.INCREASING);
      return;
    }
    
    const isDecreasing = recentValues[3] < recentValues[2] && recentValues[2] < recentValues[1];
    if (isDecreasing) {
      setTrend(Trend.DECREASING);
      return;
    }

    if (range > 4.0) {
      setTrend(Trend.VOLATILE);
    } else if (range < 1.5) {
      setTrend(Trend.STABLE);
    } else {
      setTrend(Trend.NEUTRAL);
    }
  }, [history]);

  const handleStartOcr = useCallback(() => {
    startOcr();
    startCapture(captureArea);
  }, [startOcr, startCapture, captureArea]);

  const handleStopOcr = useCallback(() => {
    stopOcr();
    stopCapture();
  }, [stopOcr, stopCapture]);
  
  useEffect(() => {
    if (captureError) {
      console.error(captureError);
      setOcrStatus(OcrStatus.ERROR);
      stopCapture();
    }
  }, [captureError, setOcrStatus, stopCapture]);

  const handleRoiSelected = (area: CaptureArea) => {
      setCaptureArea(area);
      localStorage.setItem('captureArea', JSON.stringify(area));
  };
  
  const handleResetRoi = () => {
      setCaptureArea(DEFAULT_CAPTURE_AREA);
      localStorage.removeItem('captureArea');
  };
  
  const handleClearHistory = () => {
      setHistory([]);
      setPrediction(INITIAL_PREDICTION);
  };
  
  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 w-full ${
        activeTab === tabName ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400' : 'text-gray-400 hover:bg-slate-700/50'
      }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'prediction':
        return <PredictionDisplay prediction={prediction} t={t} isLoading={isLoading} historyLength={history.length} trend={trend} />;
      case 'history':
        return <HistoryView history={history} t={t} />;
      case 'settings':
        return <Settings t={t} language={language} setLanguage={setLanguage} onRoiSelected={handleRoiSelected} captureArea={captureArea} onResetRoi={handleResetRoi} onClearHistory={handleClearHistory} />;
      case 'about':
        return <About t={t} />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={dragRef}
      className="fixed bg-slate-800/50 backdrop-blur-lg border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 w-[380px] flex flex-col transition-all duration-300"
      style={{ top: `${position.y}px`, left: `${position.x}px`, transform: isMinimized ? `translateY(calc(100vh - ${position.y + 32}px - 10px))` : 'translateY(0)'}}
    >
      <Header
        title="Aviator AI Predictor"
        onMouseDown={onMouseDown}
        onClose={() => setIsVisible(false)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
      />
      
      {!isMinimized && (
        <>
            <div className="flex border-b border-cyan-500/20 bg-slate-900/50">
                <TabButton tabName="prediction" label={t('predictionTab')} />
                <TabButton tabName="history" label={t('historyTab')} />
                <TabButton tabName="settings" label={t('settingsTab')} />
                <TabButton tabName="about" label={t('aboutTab')} />
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
            
            <Controls
                onAddMultiplier={handleNewMultiplier}
                t={t}
                isLoading={isLoading}
                ocrStatus={ocrStatus}
                onStartOcr={handleStartOcr}
                onStopOcr={handleStopOcr}
            />
        </>
      )}
    </div>
  );
};

export default Overlay;
