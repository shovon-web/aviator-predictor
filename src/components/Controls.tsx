import React, { useState } from 'react';
import { OcrStatus } from '../types';

interface ControlsProps {
    onAddMultiplier: (value: number) => void;
    t: (key: string) => string;
    isLoading: boolean;
    ocrStatus: OcrStatus;
    onStartOcr: () => void;
    onStopOcr: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onAddMultiplier, t, isLoading, ocrStatus, onStartOcr, onStopOcr }) => {
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        const value = parseFloat(inputValue);
        if (!isNaN(value) && value > 0) {
            onAddMultiplier(value);
            setInputValue('');
            setIsManualEntry(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleAdd();
    }

    const isOcrActive = ocrStatus === OcrStatus.ACTIVE;
    const isOcrIdle = ocrStatus === OcrStatus.IDLE || ocrStatus === OcrStatus.ERROR;
    const isOcrBusy = ocrStatus === OcrStatus.INITIALIZING || ocrStatus === OcrStatus.STOPPING;

    const getStatusInfo = () => {
        switch (ocrStatus) {
            case OcrStatus.ACTIVE:
                return { text: t('stopAnalysis'), color: 'bg-red-600 hover:bg-red-500', dot: 'bg-green-500 animate-pulse' };
            case OcrStatus.INITIALIZING:
                return { text: ocrStatus, color: 'bg-slate-600', dot: 'bg-yellow-500 animate-pulse' };
            case OcrStatus.STOPPING:
                 return { text: ocrStatus, color: 'bg-slate-600', dot: 'bg-orange-500' };
            case OcrStatus.ERROR:
                 return { text: 'Error - Restart', color: 'bg-yellow-600 hover:bg-yellow-500', dot: 'bg-red-500' };
            case OcrStatus.IDLE:
            default:
                return { text: t('startAnalysis'), color: 'bg-cyan-600 hover:bg-cyan-500', dot: 'bg-gray-500' };
        }
    }
    const statusInfo = getStatusInfo();


    if (isManualEntry) {
        return (
            <div className="p-3 bg-slate-900/80 rounded-b-lg border-t border-cyan-500/20">
                <div className="flex space-x-2">
                    <input
                        type="number"
                        step="0.01"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('enterMultiplier')}
                        className="bg-slate-700 border border-slate-600 text-white text-sm rounded-md block w-full p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                        autoFocus
                    />
                    <button onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        {t('add')}
                    </button>
                    <button onClick={() => setIsManualEntry(false)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        X
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-3 bg-slate-900/80 rounded-b-lg border-t border-cyan-500/20 flex space-x-2">
            <button
                onClick={isOcrActive ? onStopOcr : onStartOcr}
                disabled={isOcrBusy || isLoading}
                className={`w-full text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-3 disabled:cursor-not-allowed ${statusInfo.color}`}
            >
               <span className={`relative flex h-3 w-3`}>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${statusInfo.dot}`}></span>
               </span>
               <span className={`font-semibold`}>{statusInfo.text}</span>
            </button>
             <button
                onClick={() => setIsManualEntry(true)}
                disabled={isOcrBusy || isOcrActive}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
                {t('manualEntry')}
            </button>
        </div>
    );
};

export default Controls;
