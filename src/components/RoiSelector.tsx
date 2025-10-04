

import React, { useState, useRef } from 'react';

interface RoiSelectorProps {
  onAreaSelected: (area: { x: number; y: number; width: number; height: number; }) => void;
  t: (key: string) => string;
}

const RoiSelector: React.FC<RoiSelectorProps> = ({ onAreaSelected, t }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelecting(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    const area = getSelectionArea();
    const dpr = window.devicePixelRatio || 1;
    if (area.width > 10 && area.height > 10) { // minimum size
      onAreaSelected({
        x: area.x * dpr,
        y: area.y * dpr,
        width: area.width * dpr,
        height: area.height * dpr,
      });
    }
  };
  
  const getSelectionArea = () => {
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(startPos.x - currentPos.x);
    const height = Math.abs(startPos.y - currentPos.y);
    return { x, y, width, height };
  };

  const selectionArea = getSelectionArea();

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 cursor-crosshair z-[100]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isSelecting && (
        <div
          className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400/20"
          style={{
            left: selectionArea.x,
            top: selectionArea.y,
            width: selectionArea.width,
            height: selectionArea.height,
          }}
        />
      )}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-900 rounded-lg text-white text-center pointer-events-none">
            <p className="font-bold text-lg">{t('setCaptureArea')}</p>
            <p className="text-sm">{t('dragToSelect')}</p>
       </div>
    </div>
  );
};

export default RoiSelector;
