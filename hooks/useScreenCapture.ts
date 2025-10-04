
import { useState, useRef, useCallback } from 'react';

export interface CaptureArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useScreenCapture = (onFrame: (imageData: ImageData) => void) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const captureFrame = useCallback((area: CaptureArea) => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;
    
    // Set canvas dimensions to match capture area
    canvas.width = area.width;
    canvas.height = area.height;

    // Draw the specified part of the video onto the canvas
    try {
      context.drawImage(video, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
      // Get image data from canvas
      const imageData = context.getImageData(0, 0, area.width, area.height);
      onFrame(imageData);
    } catch (e) {
      console.error("Error drawing image or getting image data:", e);
    }

    // Continue capturing frames
    animationFrameIdRef.current = requestAnimationFrame(() => captureFrame(area));
  }, [onFrame]);


  const startCapture = useCallback(async (area: CaptureArea) => {
    try {
      const displayMediaOptions: DisplayMediaStreamOptions = {
        // FIX: The 'cursor' property is valid for getDisplayMedia, but may not exist in the DOM library's type definition for MediaTrackConstraints. Casting to 'any' to bypass the type check.
        video: {
          cursor: "never"
        } as any,
        audio: false
      };
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      mediaStreamRef.current = stream;

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      videoRef.current = video;
      
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      
      setIsCapturing(true);
      setError(null);

      video.onloadedmetadata = () => {
         animationFrameIdRef.current = requestAnimationFrame(() => captureFrame(area));
      };

    } catch (err: any) {
      console.error("Error starting screen capture:", err);
      setError("Failed to start screen capture. Please grant permission.");
      setIsCapturing(false);
    }
  }, [captureFrame]);

  const stopCapture = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    videoRef.current = null;
    canvasRef.current = null;
    setIsCapturing(false);
  }, []);

  return { isCapturing, startCapture, stopCapture, error };
};
