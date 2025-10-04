

import React, { useState, useRef, useCallback, useEffect } from 'react';

export const useDraggable = (initialPos = { x: 50, y: 50 }) => {
  const [position, setPosition] = useState(initialPos);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      isDraggingRef.current = true;
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { position, dragRef, onMouseDown };
};
