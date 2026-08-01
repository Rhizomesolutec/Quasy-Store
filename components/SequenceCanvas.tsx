"use client";

import { useEffect, useRef, useState } from "react";

interface SequenceCanvasProps {
  scrollProgress: number;
  onProgress: (loaded: number, total: number) => void;
  onLoaded: (images: HTMLImageElement[]) => void;
  prefersReducedMotion: boolean;
  isMobileSequenceAvailable: boolean;
}

export default function SequenceCanvas({
  scrollProgress,
  onProgress,
  onLoaded,
  prefersReducedMotion,
  isMobileSequenceAvailable,
}: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [loadedSequence, setLoadedSequence] = useState<"none" | "desktop" | "mobile">("none");

  // Animation frame indices
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);

  // Keep callback refs stable to prevent useEffect infinite loop triggers
  const onProgressRef = useRef(onProgress);
  const onLoadedRef = useRef(onLoaded);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // Preload Images
  useEffect(() => {
    let active = true;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preload = async () => {
      let isMobileViewport = false;
      if (typeof window !== "undefined") {
        isMobileViewport = window.innerWidth < 768;
      }

      const desktopPrefix = "/images/Hero section/ezgif-frame-";
      const mobilePrefix = "/images/hero-mobile/ezgif-frame-";
      const pad = (n: number) => String(n).padStart(3, "0");

      const useMobile = isMobileViewport && isMobileSequenceAvailable;

      const activePrefix = useMobile ? mobilePrefix : desktopPrefix;
      const sequenceType = useMobile ? "mobile" : "desktop";

      // If we already loaded this sequence type, don't reload
      if (loadedSequence === sequenceType) return;

      setIsPreloaded(false);
      onProgressRef.current(0, 300);

      const urls = Array.from(
        { length: 300 },
        (_, i) => `${activePrefix}${pad(i + 1)}.png`
      );
      const total = urls.length;

      const promises = urls.map((url, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = url;

          const handleLoad = () => {
            if (!active) return resolve();
            if ("decode" in img) {
              img
                .decode()
                .catch(() => { })
                .finally(() => {
                  if (active) {
                    loadedCount++;
                    onProgressRef.current(loadedCount, total);
                    resolve();
                  }
                });
            } else {
              loadedCount++;
              onProgressRef.current(loadedCount, total);
              resolve();
            }
          };

          img.onload = handleLoad;
          img.onerror = handleLoad;
          loadedImages[index] = img;
        });
      });

      await Promise.all(promises);

      if (active) {
        setImages(loadedImages);
        setIsPreloaded(true);
        setLoadedSequence(sequenceType);
        onLoadedRef.current(loadedImages);
      }
    };

    preload();

    // Listen to resize to check if we cross the 768px breakpoint
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const isMobileViewport = window.innerWidth < 768;
      const expectedType = isMobileViewport ? "mobile" : "desktop";
      if (loadedSequence !== "none" && loadedSequence !== expectedType) {
        preload();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      active = false;
      window.removeEventListener("resize", handleResize);
    };
  }, [loadedSequence]);

  // Update target frame based on scroll progress
  useEffect(() => {
    if (prefersReducedMotion) {
      targetFrameRef.current = 0;
    } else {
      targetFrameRef.current = Math.min(299, Math.max(0, scrollProgress * 299));
    }
  }, [scrollProgress, prefersReducedMotion]);

  // Canvas drawing & resize loop
  useEffect(() => {
    if (!isPreloaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const drawFrame = (frameIndex: number) => {
      const img = images[frameIndex];
      if (!img) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fit Image to Cover Canvas (maintain aspect ratio)
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = img.width;
      const imageHeight = img.height;

      const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const nw = imageWidth * scale;
      const nh = imageHeight * scale;

      const cx = (canvasWidth - nw) / 2;
      const cy = (canvasHeight - nh) / 2;

      ctx.drawImage(img, cx, cy, nw, nh);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Re-draw current frame after resize
      const currentFrame = Math.round(currentFrameRef.current);
      drawFrame(currentFrame);
    };

    // Initialize dimensions
    resize();
    window.addEventListener("resize", resize);

    // Animation loop (requestAnimationFrame with inertia interpolation)
    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      // Interpolate with inertia easing (0.1 coefficient)
      const diff = target - current;
      const easedCurrent = current + diff * 0.1;
      currentFrameRef.current = easedCurrent;

      const frameToDraw = Math.min(299, Math.max(0, Math.round(easedCurrent)));

      // Only draw when the frame index changes to save GPU resources
      if (frameToDraw !== lastDrawnFrameRef.current) {
        drawFrame(frameToDraw);
        lastDrawnFrameRef.current = frameToDraw;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPreloaded, images, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 object-cover overflow-hidden"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
