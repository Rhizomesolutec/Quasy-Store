"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HangingSpider() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [swayRotation, setSwayRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ minY: 90, maxY: 500 });

  // Update scrollProgress relative to the entire page scroll height
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = window.scrollY / totalHeight;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update dimensions on screen resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        minY: 90,
        maxY: window.innerHeight - 110
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate scroll velocity and apply swaying physics
  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = Date.now();
    let active = true;

    const checkScrollVelocity = () => {
      if (!active) return;
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const dy = currentY - lastY;
      const dt = currentTime - lastTime;

      if (dt > 0) {
        const velocity = dy / dt; // pixels per ms
        const targetRotation = Math.max(-15, Math.min(15, velocity * 4.5));
        setSwayRotation(prev => prev + (targetRotation - prev) * 0.1);
      }

      lastY = currentY;
      lastTime = currentTime;
      requestAnimationFrame(checkScrollVelocity);
    };

    requestAnimationFrame(checkScrollVelocity);
    return () => {
      active = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {scrollProgress > 0.02 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed left-2 sm:left-6 md:left-10 top-0 bottom-0 w-8 z-50 pointer-events-none flex flex-col items-center"
        >
          {/* Silk Thread stretching from viewport top */}
          <div
            className="w-[0.8px] bg-gradient-to-b from-[#E50914]/20 via-[#F5F2EF]/45 to-[#F5F2EF]/70"
            style={{ height: `${dimensions.minY + scrollProgress * (dimensions.maxY - dimensions.minY)}px` }}
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
