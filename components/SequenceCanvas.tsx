"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const TOTAL_FRAMES = 300;
const LAST_FRAME_INDEX = TOTAL_FRAMES - 1;
const CRITICAL_INITIAL_FRAMES = 36;
const CRITICAL_TAIL_STEP = 12;
const PRELOAD_CONCURRENCY = 16;
const EAGER_DECODE_FRAMES = 24;

export interface SequenceCanvasHandle {
  setProgress: (progress: number) => void;
}

interface SequenceCanvasProps {
  onProgress: (loaded: number, total: number) => void;
  onLoaded: (images: HTMLImageElement[]) => void;
  prefersReducedMotion: boolean;
  isMobileSequenceAvailable: boolean;
}

function clampFrame(frame: number) {
  return Math.min(LAST_FRAME_INDEX, Math.max(0, frame));
}

function buildCriticalFrameSet() {
  const critical = new Set<number>();

  for (let i = 0; i < CRITICAL_INITIAL_FRAMES; i++) {
    critical.add(i);
  }

  for (let i = CRITICAL_INITIAL_FRAMES; i < TOTAL_FRAMES; i += CRITICAL_TAIL_STEP) {
    critical.add(i);
  }

  critical.add(0);
  critical.add(LAST_FRAME_INDEX);
  return critical;
}

function resolveNearestLoadedFrame(
  target: number,
  loadedFrames: boolean[]
) {
  if (loadedFrames[target]) return target;

  for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
    const before = target - offset;
    if (before >= 0 && loadedFrames[before]) return before;

    const after = target + offset;
    if (after < TOTAL_FRAMES && loadedFrames[after]) return after;
  }

  return -1;
}

const SequenceCanvas = forwardRef<SequenceCanvasHandle, SequenceCanvasProps>(function SequenceCanvas({
  onProgress,
  onLoaded,
  prefersReducedMotion,
  isMobileSequenceAvailable,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedFramesRef = useRef<boolean[]>([]);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const loadedSequenceRef = useRef<"none" | "desktop" | "mobile">("none");
  const loadRunIdRef = useRef(0);

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

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (progress: number) => {
        if (prefersReducedMotion) {
          targetFrameRef.current = 0;
          return;
        }
        targetFrameRef.current = clampFrame(progress * LAST_FRAME_INDEX);
      },
    }),
    [prefersReducedMotion]
  );

  // Ensure reduced motion always pins to first frame
  useEffect(() => {
    if (!prefersReducedMotion) return;
    targetFrameRef.current = 0;
    currentFrameRef.current = 0;
  }, [prefersReducedMotion]);

  // Preload images with critical-first strategy
  useEffect(() => {
    let active = true;
    const criticalFrames = buildCriticalFrameSet();
    const criticalFrameList = Array.from(criticalFrames);
    const criticalTotal = criticalFrameList.length;
    const allFrameIndices = Array.from({ length: TOTAL_FRAMES }, (_, index) => index);

    const runQueue = async (
      frameIndices: number[],
      urls: string[],
      onFrameLoaded: (index: number, image: HTMLImageElement) => void
    ) => {
      let cursor = 0;
      const workerCount = Math.max(
        1,
        Math.min(PRELOAD_CONCURRENCY, frameIndices.length)
      );

      const worker = async () => {
        while (active && cursor < frameIndices.length) {
          const queueIndex = cursor++;
          const frameIndex = frameIndices[queueIndex];
          const image = new Image();
          image.decoding = "async";
          if (frameIndex < 3) {
            image.fetchPriority = "high";
          }

          const loadedImage = await new Promise<HTMLImageElement | null>((resolve) => {
            const finalize = () => resolve(image);
            image.onload = () => {
              if (frameIndex < EAGER_DECODE_FRAMES && "decode" in image) {
                image
                  .decode()
                  .catch(() => { })
                  .finally(finalize);
              } else {
                finalize();
              }
            };
            image.onerror = () => resolve(null);
            image.src = urls[frameIndex];
          });

          if (!active || !loadedImage) continue;
          onFrameLoaded(frameIndex, loadedImage);
        }
      };

      await Promise.all(Array.from({ length: workerCount }, () => worker()));
    };

    const getSequenceType = (): "desktop" | "mobile" => {
      if (typeof window === "undefined") return "desktop";
      const isMobileViewport = window.innerWidth < 768;
      return isMobileViewport && isMobileSequenceAvailable ? "mobile" : "desktop";
    };

    const preload = async (sequenceType: "desktop" | "mobile") => {
      const runId = ++loadRunIdRef.current;
      const desktopPrefix = "/images/Hero section/ezgif-frame-";
      const mobilePrefix = "/images/hero-mobile/ezgif-frame-";
      const activePrefix = sequenceType === "mobile" ? mobilePrefix : desktopPrefix;
      const pad = (n: number) => String(n).padStart(3, "0");
      const urls = Array.from(
        { length: TOTAL_FRAMES },
        (_, i) => `${activePrefix}${pad(i + 1)}.png`
      );
      const stagedImages: (HTMLImageElement | null)[] = Array.from(
        { length: TOTAL_FRAMES },
        () => null
      );
      const stagedLoadedFlags = Array.from({ length: TOTAL_FRAMES }, () => false);
      let criticalLoaded = 0;
      let notifiedReady = false;

      currentFrameRef.current = 0;
      targetFrameRef.current = 0;
      lastDrawnFrameRef.current = -1;
      setIsPreloaded(false);
      onProgressRef.current(0, criticalTotal);

      const onFrameLoaded = (frameIndex: number, image: HTMLImageElement) => {
        if (!active || loadRunIdRef.current !== runId) return;

        stagedImages[frameIndex] = image;
        stagedLoadedFlags[frameIndex] = true;

        if (criticalFrames.has(frameIndex)) {
          criticalLoaded++;
          onProgressRef.current(Math.min(criticalLoaded, criticalTotal), criticalTotal);

          if (!notifiedReady && criticalLoaded >= criticalTotal) {
            imagesRef.current = stagedImages;
            loadedFramesRef.current = stagedLoadedFlags;
            setIsPreloaded(true);
            loadedSequenceRef.current = sequenceType;
            onLoadedRef.current(stagedImages.filter(Boolean) as HTMLImageElement[]);
            notifiedReady = true;
          }
        }
      };

      await runQueue(criticalFrameList, urls, onFrameLoaded);

      if (!active || loadRunIdRef.current !== runId) return;

      if (!notifiedReady) {
        imagesRef.current = stagedImages;
        loadedFramesRef.current = stagedLoadedFlags;
        setIsPreloaded(true);
        loadedSequenceRef.current = sequenceType;
        onLoadedRef.current(stagedImages.filter(Boolean) as HTMLImageElement[]);
        notifiedReady = true;
      }

      const nonCriticalFrameList = allFrameIndices.filter(
        (index) => !criticalFrames.has(index)
      );
      await runQueue(nonCriticalFrameList, urls, onFrameLoaded);

      if (!active || loadRunIdRef.current !== runId) return;
      imagesRef.current = stagedImages;
      loadedFramesRef.current = stagedLoadedFlags;
    };

    const maybePreload = () => {
      const expectedType = getSequenceType();
      if (loadedSequenceRef.current === expectedType) return;
      void preload(expectedType);
    };

    maybePreload();

    const handleResize = () => {
      maybePreload();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      active = false;
      loadRunIdRef.current += 1;
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileSequenceAvailable]);

  // Canvas drawing & resize loop
  useEffect(() => {
    if (!isPreloaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const drawFrame = (resolvedFrameIndex: number) => {
      const img = imagesRef.current[resolvedFrameIndex];
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
      const requestedFrame = clampFrame(Math.round(currentFrameRef.current));
      const resolvedFrame = resolveNearestLoadedFrame(
        requestedFrame,
        loadedFramesRef.current
      );
      if (resolvedFrame >= 0) {
        drawFrame(resolvedFrame);
        lastDrawnFrameRef.current = resolvedFrame;
      }
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

      const requestedFrame = clampFrame(Math.round(easedCurrent));
      const resolvedFrame = resolveNearestLoadedFrame(
        requestedFrame,
        loadedFramesRef.current
      );

      // Only draw when resolved frame changes to save GPU resources
      if (resolvedFrame >= 0 && resolvedFrame !== lastDrawnFrameRef.current) {
        drawFrame(resolvedFrame);
        lastDrawnFrameRef.current = resolvedFrame;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPreloaded]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 object-cover overflow-hidden"
      style={{ mixBlendMode: "normal" }}
    />
  );
});

export default SequenceCanvas;
