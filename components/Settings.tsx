import React, { useState } from 'react';
import { Language } from '../types';
import RoiSelector from './RoiSelector';
import { CaptureArea } from '../hooks/useScreenCapture';

interface SettingsProps {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  onRoiSelected: (area: CaptureArea) => void;
  onClearHistory: () => void;
  captureArea: CaptureArea;
  onResetRoi: () => void;
}

const LanguageButton: React.FC<{
  lang: Language;
  currentLang: Language;
  onClick: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ lang, currentLang, onClick, children }) => (
  <button
    onClick={() => onClick(lang)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      currentLang === lang
        ? 'bg-cyan-500 text-white shadow-md'
        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
    }`}
  >
    {children}
  </button>
);


const Settings: React.FC<SettingsProps> = ({ t, language, setLanguage, onRoiSelected, onClearHistory, captureArea, onResetRoi }) => {
    const [isSelectingRoi, setIsSelectingRoi] = useState(false);

    const handleRoiSelected = (area: any) => {
        onRoiSelected(area);
        setIsSelectingRoi(false);
    }
    
    const handleClearHistoryClick = () => {
        if (window.confirm(t('clearHistoryConfirm'))) {
            onClearHistory();
        }
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {isSelectingRoi && <RoiSelector onAreaSelected={handleRoiSelected} t={t}/>}
            
            <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">{t('language')}</h3>
                <div className="flex space-x-2">
                   <LanguageButton lang="en" currentLang={language} onClick={setLanguage}>English</LanguageButton>
                   <LanguageButton lang="bn" currentLang={language} onClick={setLanguage}>বাংলা</LanguageButton>
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-cyan-400 mb-2">{t('captureArea')}</h3>
                 <p className="text-xs text-gray-400 mb-2">{t('currentArea')}: {captureArea.width}x{captureArea.height}px</p>
                 <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsSelectingRoi(true)}
                        className="flex-grow bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        {t('setCaptureArea')}
                    </button>
                    <button 
                        onClick={onResetRoi}
                        className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        {t('resetCaptureArea')}
                    </button>
                 </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-cyan-400 mb-3">{t('dataManagement')}</h3>
                 <button 
                    onClick={handleClearHistoryClick}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    {t('clearHistory')}
                 </button>
            </div>
        </div>
    );
};

export default Settings;