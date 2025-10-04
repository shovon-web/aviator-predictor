import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface WelcomeModalProps {
  onConsent: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onConsent }) => {
  const { t } = useLocalization('en'); // Use english for initial modal

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 max-w-md w-full p-6 text-center text-gray-300">
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">{t('welcomeTitle')}</h1>
        <p className="mb-3">{t('welcomeDesc1')}</p>
        <p className="mb-3">{t('welcomeDesc2')}</p>
        <p className="text-yellow-400 font-semibold mb-6">{t('welcomeDesc3')}</p>
        <button
          onClick={onConsent}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-md shadow-cyan-500/30 w-full"
        >
          {t('agreeButton')}
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
