"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for client mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics config: creates a smooth lag-follow (scurrying) effect
  const springConfig = { damping: 24, stiffness: 220, mass: 0.45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch devices to preserve mobile performance
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Apply global stylesheet style to hide default cursor on all elements
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const moveCursor = (e: MouseEvent) => {
      setIsVisible(true);
      // Offset by half the spider size (12px) to align its center to mouse tip
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        left: cursorX,
        top: cursorY,
      }}
      className="fixed w-6 h-6 z-[9999] pointer-events-none select-none filter drop-shadow-[0_0_5px_rgba(229,9,20,0.85)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
    >
      <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#E50914]/85">
        <defs>
          <radialGradient id="cursorMetal" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E50914" />
            <stop offset="75%" stopColor="#660000" />
            <stop offset="100%" stopColor="#070707" />
          </radialGradient>
        </defs>

        {/* Head */}
        <circle cx="50" cy="38" r="4.5" fill="url(#cursorMetal)" stroke="#070707" strokeWidth="0.5" />

        {/* Cephalothorax */}
        <circle cx="50" cy="48" r="8" fill="url(#cursorMetal)" stroke="#070707" strokeWidth="0.5" />
        <circle cx="48.2" cy="46.2" r="0.8" fill="#FFFFFF" opacity="0.8" />
        <circle cx="51.8" cy="46.2" r="0.8" fill="#FFFFFF" opacity="0.8" />

        {/* Teardrop Abdomen */}
        <path 
          d="M 50,56 C 40,66 38,80 50,85 C 62,80 60,66 50,56 Z" 
          fill="url(#cursorMetal)" 
          stroke="#070707" 
          strokeWidth="0.8"
        />
        <path 
          d="M 50,56 C 40,66 38,80 50,85 Z" 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="0.5" 
          opacity="0.55"
        />

        {/* Legs Group */}
        <g stroke="#330000" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Legs */}
          <path d="M 45,45 C 30,36 28,22 34,14" />
          <path d="M 43,48 C 24,44 18,52 20,59" />
          <path d="M 43,51 C 22,56 20,70 26,78" />
          <path d="M 45,55 C 28,67 30,82 36,86" />
          {/* Right Legs */}
          <path d="M 55,45 C 70,36 72,22 66,14" />
          <path d="M 57,48 C 76,44 82,52 80,59" />
          <path d="M 57,51 C 78,56 80,70 74,78" />
          <path d="M 55,55 C 72,67 70,82 64,86" />
        </g>

        {/* Leg highlights */}
        <g stroke="#E50914" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
          {/* Left Legs */}
          <path d="M 44.5,44.5 C 30.5,36.5 28.5,22.5 33.5,14.5" />
          <path d="M 42.5,47.5 C 24.5,43.5 18.5,51.5 20.5,58.5" />
          <path d="M 42.5,50.5 C 22.5,55.5 20.5,69.5 26.5,77.5" />
          <path d="M 44.5,54.5 C 28.5,66.5 30.5,81.5 35.5,85.5" />
          {/* Right Legs */}
          <path d="M 55.5,44.5 C 69.5,36.5 71.5,22.5 66.5,14.5" />
          <path d="M 57.5,47.5 C 75.5,43.5 81.5,51.5 79.5,58.5" />
          <path d="M 57.5,50.5 C 77.5,55.5 79.5,69.5 73.5,77.5" />
          <path d="M 55.5,54.5 C 71.5,66.5 69.5,81.5 64.5,85.5" />
        </g>
      </svg>
    </motion.div>
  );
}
