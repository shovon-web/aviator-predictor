import { useState, useRef, useEffect, useCallback } from 'react';
import { OcrStatus } from '../types';
export { OcrStatus };

export const useOcr = (onMultiplierRecognized: (value: number) => void) => {
    const [ocrStatus, setOcrStatus] = useState<OcrStatus>(OcrStatus.IDLE);
    const workerRef = useRef<Worker | null>(null);

    const initializeWorker = useCallback(() => {
        // Vite handles web workers with this special constructor syntax
        const worker = new Worker(new URL('../ocr.worker.ts', import.meta.url), { type: 'module' });
        
        worker.onmessage = (event: MessageEvent) => {
            const { type, payload } = event.data;
            if (type === 'INITIALIZED') {
                setOcrStatus(OcrStatus.ACTIVE);
            } else if (type === 'RESULT') {
                onMultiplierRecognized(payload);
            } else if (type === 'ERROR') {
                console.error('OCR Error:', payload);
                setOcrStatus(OcrStatus.ERROR);
            } else if (type === 'TERMINATED') {
                setOcrStatus(OcrStatus.IDLE);
            }
        };
        
        worker.onerror = (error) => {
            console.error('Web Worker error:', error);
            setOcrStatus(OcrStatus.ERROR);
        }

        worker.postMessage({ type: 'INIT' });
        workerRef.current = worker;

    }, [onMultiplierRecognized]);


    const startOcr = useCallback(() => {
        setOcrStatus(OcrStatus.INITIALIZING);
        if (!workerRef.current) {
            initializeWorker();
        }
    }, [initializeWorker]);


    const stopOcr = useCallback(() => {
        if (workerRef.current) {
            setOcrStatus(OcrStatus.STOPPING);
            workerRef.current.postMessage({ type: 'TERMINATE' });
            workerRef.current.terminate();
            workerRef.current = null;
            setOcrStatus(OcrStatus.IDLE);
        }
    }, []);

    const processFrame = useCallback((imageData: ImageData) => {
        if (workerRef.current && ocrStatus === OcrStatus.ACTIVE) {
            workerRef.current.postMessage({ type: 'PROCESS_FRAME', payload: imageData }, [imageData.data.buffer]);
        }
    }, [ocrStatus]);

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    return { ocrStatus, startOcr, stopOcr, processFrame, setOcrStatus };
};
