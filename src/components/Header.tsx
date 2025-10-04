

import React from 'react';
import { CloseIcon, MinimizeIcon, MaximizeIcon, AppIcon } from './icons';

interface HeaderProps {
  title: string;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onMouseDown, onClose, onMinimize, isMinimized }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className="bg-slate-900/80 backdrop-blur-sm cursor-move h-8 flex items-center justify-between px-2 rounded-t-lg border-b border-cyan-500/20"
    >
      <div className="flex items-center space-x-2">
        <AppIcon size={16} />
        <span className="text-xs font-bold text-cyan-400 tracking-wider">{title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onMinimize} className="text-gray-400 hover:text-white">
            {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default Header;
