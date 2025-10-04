
import React, { useState } from 'react';
import Overlay from './components/Overlay';
import WelcomeModal from './components/WelcomeModal';

function App() {
  const [hasConsented, setHasConsented] = useState(false);

  const handleConsent = () => {
    setHasConsented(true);
  };

  return (
    <div className="bg-gray-800/10 backdrop-blur-sm min-h-screen font-sans text-white antialiased" style={{ background: 'rgba(0,0,0,0.05)' }}>
      {!hasConsented && <WelcomeModal onConsent={handleConsent} />}
      {hasConsented && <Overlay />}
    </div>
  );
}

export default App;
