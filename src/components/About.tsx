

import React from 'react';

interface AboutProps {
  t: (key: string) => string;
}

const About: React.FC<AboutProps> = ({ t }) => {
  return (
    <div className="p-6 text-center animate-fade-in">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">{t('aboutTab')}</h3>
        <div className="space-y-4">
            <div>
                <p className="text-sm text-gray-400">{t('developer')}</p>
                <p className="text-lg text-white font-semibold">Shovon Rahman</p>
            </div>
            <div>
                 <a 
                    href="https://t.me/aviator_forecast" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/30 transition-transform transform hover:scale-105"
                 >
                    {t('telegram')}
                 </a>
            </div>
        </div>
    </div>
  );
};

export default About;
