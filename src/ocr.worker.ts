import * as Tesseract from 'tesseract.js';

let scheduler: Tesseract.Scheduler | null = null;
let isInitialized = false;

const initializeTesseract = async () => {
    if (isInitialized) return;

    console.log('OCR Worker: Initializing Tesseract...');
    scheduler = Tesseract.createScheduler();
    const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => console.log(m.status === 'recognizing text' ? `OCR: ${(m.progress * 100).toFixed(0)}%` : m.status)
    });
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789.x',
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
    });
    scheduler.addWorker(worker);
    isInitialized = true;
    console.log('OCR Worker: Tesseract initialized.');
    self.postMessage({ type: 'INITIALIZED' });
};

self.onmessage = async (event: MessageEvent<{ type: string; payload?: ImageData }>) => {
    const { type, payload } = event.data;

    if (type === 'INIT') {
        await initializeTesseract();
        return;
    }

    if (type === 'TERMINATE') {
        await scheduler?.terminate();
        scheduler = null;
        isInitialized = false;
        console.log('OCR Worker: Tesseract terminated.');
        self.postMessage({ type: 'TERMINATED' });
        return;
    }

    if (type === 'PROCESS_FRAME' && payload) {
        if (!scheduler || !isInitialized) {
            console.warn('OCR Worker: Tesseract not initialized. Ignoring frame.');
            return;
        }

        try {
            const canvas = new OffscreenCanvas(payload.width, payload.height);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Failed to get 2D context from OffscreenCanvas');
            ctx.putImageData(payload, 0, 0);

            const result = await scheduler.addJob('recognize', canvas);
            const text = result.data.text;
            
            const multiplierRegex = /(\d[\d.]*)\s*x/gi;
            let matches;
            const values = [];

            while ((matches = multiplierRegex.exec(text)) !== null) {
                const num = parseFloat(matches[1]);
                if (!isNaN(num)) {
                    values.push(num);
                }
            }
            
            if (values.length > 0) {
                const highestValue = Math.max(...values);
                self.postMessage({ type: 'RESULT', payload: highestValue });
            }
        } catch (error) {
            console.error('OCR Worker: Error during recognition:', error);
            self.postMessage({ type: 'ERROR', payload: 'Recognition failed' });
        }
    }
};
