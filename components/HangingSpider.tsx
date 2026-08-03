"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

export default function HangingSpider() {
  const [isVisible, setIsVisible] = useState(false);
  const dimensionsRef = useRef({ minY: 90, maxY: 500 });
  const lastScrollYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const threadHeight = useMotionValue(90);
  const swayRotation = useMotionValue(0);

  // Keep thread height bounds in sync with viewport size.
  useEffect(() => {
    const updateDimensions = () => {
      dimensionsRef.current = {
        minY: 90,
        maxY: window.innerHeight - 110,
      };

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      const { minY, maxY } = dimensionsRef.current;
      threadHeight.set(minY + progress * (maxY - minY));
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [threadHeight]);

  // Update thread length + visibility from scroll without re-rendering every frame.
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      const { minY, maxY } = dimensionsRef.current;
      threadHeight.set(minY + progress * (maxY - minY));
      setIsVisible((prev) => {
        const next = progress > 0.02;
        return prev === next ? prev : next;
      });
    };

    lastScrollYRef.current = window.scrollY;
    lastTimeRef.current = performance.now();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threadHeight]);

  // Calculate scroll velocity and apply swaying physics via motion values.
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const currentY = window.scrollY;
      const now = performance.now();
      const dy = currentY - lastScrollYRef.current;
      const dt = now - lastTimeRef.current;

      if (dt > 0) {
        const velocity = dy / dt; // pixels per ms
        const targetRotation = Math.max(-15, Math.min(15, velocity * 4.5));
        const currentRotation = swayRotation.get();
        swayRotation.set(currentRotation + (targetRotation - currentRotation) * 0.1);
      }

      lastScrollYRef.current = currentY;
      lastTimeRef.current = now;
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, [swayRotation]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed left-2 sm:left-6 md:left-10 top-0 bottom-0 w-8 z-50 pointer-events-none flex flex-col items-center"
        >
          {/* Silk Thread stretching from viewport top */}
          <motion.div
            className="w-[0.8px] bg-gradient-to-b from-[#E50914]/20 via-[#F5F2EF]/45 to-[#F5F2EF]/70"
            style={{ height: threadHeight }}
          />

          {/* Swaying Spider Pendant (Glowing Crimson Core) */}
          <motion.div
            style={{
              transformOrigin: "50px 27px",
              rotate: swayRotation,
              marginTop: "-2px"
            }}
            className="w-8 h-8 text-[#E50914]/80 filter drop-shadow-[0_0_5px_rgba(229,9,20,0.85)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <defs>
                <radialGradient id="silverProgressGemGlobal" cx="35%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#E50914" />
                  <stop offset="75%" stopColor="#660000" />
                  <stop offset="100%" stopColor="#070707" />
                </radialGradient>
              </defs>

              {/* Link Ring */}
              <circle cx="50" cy="27" r="4.5" stroke="#E50914" strokeWidth="1.2" fill="none" opacity="0.8" />
              <path d="M50,31.5 L50,33.5" stroke="#E50914" strokeWidth="1.2" />

              {/* Head */}
              <circle cx="50" cy="36" r="3.8" fill="url(#silverProgressGemGlobal)" stroke="#070707" strokeWidth="0.4" />

              {/* Cephalothorax */}
              <circle cx="50" cy="45" r="6.5" fill="url(#silverProgressGemGlobal)" stroke="#070707" strokeWidth="0.4" />
              <circle cx="49" cy="43.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
              <circle cx="51" cy="43.5" r="0.6" fill="#FFFFFF" opacity="0.8" />

              {/* Abdomen */}
              <path
                d="M50,52 C41,61 39,73 50,77 C61,73 59,61 50,52 Z"
                fill="url(#silverProgressGemGlobal)"
                stroke="#070707"
                strokeWidth="0.6"
              />
              <path
                d="M50,52 C41,61 39,73 50,77 C61,73 59,61 50,52 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.5"
                opacity="0.75"
              />
              <path
                d="M48.5,55.5 C46,59.5 46,62.5 48,65 C46.8,62.5 46.2,59.5 48.5,55.5 Z"
                fill="#FFFFFF"
                opacity="0.45"
              />

              {/* Legs */}
              <g stroke="#330000" strokeWidth="2.0" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 45,43 C 33,35 30,22 36,15" />
                <path d="M 44,45 C 28,42 22,50 24,56" />
                <path d="M 44,48 C 26,52 24,65 29,72" />
                <path d="M 46,51 C 32,62 34,76 39,80" />
                <path d="M 55,43 C 67,35 70,22 64,15" />
                <path d="M 56,45 C 72,42 78,50 76,56" />
                <path d="M 56,48 C 74,52 76,65 71,72" />
                <path d="M 54,51 C 68,62 66,76 61,80" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
