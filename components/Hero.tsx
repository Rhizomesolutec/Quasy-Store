"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import SequenceCanvas, { type SequenceCanvasHandle } from "./SequenceCanvas";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  isMobileSequenceAvailable?: boolean;
}

export default function Hero({ isMobileSequenceAvailable = false }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceCanvasRef = useRef<SequenceCanvasHandle | null>(null);
  const sequenceVisibleRef = useRef(true);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  const [isSequenceVisible, setIsSequenceVisible] = useState(true);
  const [spiderRecoil, setSpiderRecoil] = useState(false);

  // PNG Sequence Background state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Handle prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleSequenceProgress = useCallback((_loaded: number, _total: number) => {
    // Sequence still preloads in the background; no blocking overlay.
  }, []);

  const handleSequenceLoaded = useCallback(() => {
    sequenceVisibleRef.current = true;
    setIsSequenceVisible(true);
  }, []);

  // GSAP Scroll Trigger to pin the Hero section and track frame progress
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=220%", // Pinned scroll height (increased scroll length for smooth playback)
      pin: true,
      pinSpacing: true, // Explicitly enable pinSpacing to isolate sections
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        sequenceCanvasRef.current?.setProgress(progress);

        const shouldShowSequence = progress < 0.995;
        if (shouldShowSequence !== sequenceVisibleRef.current) {
          sequenceVisibleRef.current = shouldShowSequence;
          setIsSequenceVisible(shouldShowSequence);
        }
      },
    });

    sequenceCanvasRef.current?.setProgress(0);
    sequenceVisibleRef.current = true;
    setIsSequenceVisible(true);

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);
  // Letter array for dropping animation
  const titleLetters = ["Q", "U", "S", "A", "Y"];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100vh] bg-[#0b0b0b] overflow-hidden flex flex-col justify-center items-center py-16 px-6 lg:px-16 z-0 select-none"
    >
      {/* PNG Sequence Background Canvas Wrapper (fades out completely when animation finishes) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-300"
        style={{ opacity: isSequenceVisible ? 1 : 0 }}
      >
        <SequenceCanvas
          ref={sequenceCanvasRef}
          onProgress={handleSequenceProgress}
          onLoaded={handleSequenceLoaded}
          prefersReducedMotion={prefersReducedMotion}
          isMobileSequenceAvailable={isMobileSequenceAvailable}
        />
      </div>

      {/* Ornate Filigree Corner Borders */}
      <div className="absolute inset-0 pointer-events-none z-20 border border-[#F5F2EF]/5 m-3 md:m-6 select-none">
        <svg className="absolute top-2 left-2 w-8 h-8 text-[#F5F2EF]/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
        <svg className="absolute top-2 right-2 w-8 h-8 text-[#F5F2EF]/15 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
        <svg className="absolute bottom-2 left-2 w-8 h-8 text-[#F5F2EF]/15 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
        <svg className="absolute bottom-2 right-2 w-8 h-8 text-[#F5F2EF]/15 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
      </div>

      {/* Main Container: Centered Content */}
      <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center z-30 select-none px-4 md:px-8 -translate-y-12 sm:translate-y-0">

        {/* Column: Typography, Descriptions, and Action Buttons */}
        <div
          ref={titleContainerRef}
          className="flex flex-col items-center text-center overflow-visible w-full"
        >
          {/* Estd label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex items-center gap-3 mb-2 justify-center"
          >
            <div className="h-[1px] w-6 bg-[#F5F2EF]/20" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#F5F2EF]/55">ESTD 2026</span>
            <div className="h-[1px] w-6 bg-[#F5F2EF]/20" />
          </motion.div>

          {/* Bouncing Silk Letters of "QUSAY" */}
          <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-6 h-[105px] sm:h-[130px] md:h-[150px] w-full overflow-visible">
            {titleLetters.map((letter, i) => (
              <div key={i} className="relative flex flex-col items-center h-full overflow-visible">
                {/* Interactive Silk Line Thread */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "70px" }}
                  transition={{
                    type: "spring",
                    stiffness: 65,
                    damping: 16,
                    delay: i * 0.12 + 0.6,
                  }}
                  className="w-[1px] bg-gradient-to-b from-[#E50914]/15 via-[#E50914]/60 to-[#F5F2EF]/30 origin-top"
                />

                {/* Hanging swaying Letter */}
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: [-1.8, 1.8, -1.8]
                  }}
                  transition={{
                    y: { type: "spring", stiffness: 70, damping: 11, delay: i * 0.12 + 0.6 },
                    opacity: { duration: 0.5, delay: i * 0.12 + 0.6 },
                    rotate: {
                      repeat: Infinity,
                      duration: 3.5 + i * 0.3,
                      ease: "easeInOut",
                      delay: i * 0.12 + 1.2
                    }
                  }}
                  style={{ transformOrigin: "top center", marginTop: "-6px" }}
                  onMouseEnter={() => {
                    if (letter === "S") {
                      setSpiderRecoil(true);
                      setTimeout(() => setSpiderRecoil(false), 800);
                    }
                  }}
                  className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem] text-[#F5F2EF] uppercase tracking-normal select-none filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)] font-bold relative"
                >
                  {letter}

                  {/* If letter is S, draw the draped necklace chain and spider pendant */}
                  {letter === "S" && (
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 w-[140%] h-[140%] -top-[20%] -left-[20%] overflow-visible pointer-events-none z-10"
                    >
                      <defs>
                        <radialGradient id="silverMetalS" cx="35%" cy="30%" r="50%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="35%" stopColor="#F5F2EF" />
                          <stop offset="70%" stopColor="#6E6B64" />
                          <stop offset="100%" stopColor="#2A2927" />
                        </radialGradient>
                      </defs>

                      {/* Silver Curb Chain (Double-path stroke for metallic link detail) */}
                      <path d="M 23,25 C 32,55 68,55 77,25" stroke="#4E4B44" strokeWidth="1.8" fill="none" />
                      <path d="M 23,25 C 32,55 68,55 77,25" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="2.5 2" fill="none" opacity="0.85" />

                      {/* Left side silver spacer beads & Star link */}
                      <path d="M 31,35 L 32.5,33.5 L 34,35 L 33,33 L 34.5,32 L 32.5,32.5 L 31.5,31 L 32,33 Z" fill="none" stroke="#F5F2EF" strokeWidth="0.5" />
                      <circle cx="36" cy="40" r="2.2" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />
                      <circle cx="41.5" cy="44.5" r="1.8" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />

                      {/* Right side silver spacer beads & Star link */}
                      <path d="M 69,35 L 67.5,33.5 L 66,35 L 67,33 L 65.5,32 L 67.5,32.5 L 68.5,31 L 68,33 Z" fill="none" stroke="#F5F2EF" strokeWidth="0.5" />
                      <circle cx="64" cy="40" r="2.2" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />
                      <circle cx="58.5" cy="44.5" r="1.8" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />

                      {/* Center Clasp Silver Link */}
                      <circle cx="50" cy="49" r="2.4" stroke="#F5F2EF" strokeWidth="0.8" fill="none" />

                      {/* Hanging Spider Pendant (All Sterling Silver) */}
                      <motion.g
                        animate={{
                          y: spiderRecoil ? [-5, -15, 0] : [0, 2, 0],
                          rotate: spiderRecoil ? [0, -10, 8, 0] : [-1, 1, -1]
                        }}
                        transition={{
                          y: spiderRecoil
                            ? { duration: 0.8, ease: "easeInOut" }
                            : { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                          rotate: spiderRecoil
                            ? { duration: 0.8, ease: "easeInOut" }
                            : { repeat: Infinity, duration: 5.5, ease: "easeInOut" }
                        }}
                        style={{ transformOrigin: "50px 49px" }}
                      >
                        {/* Silver Link to Head */}
                        <path d="M 50,51.4 L 50,53.5" stroke="#F5F2EF" strokeWidth="1.0" />

                        {/* Head */}
                        <circle cx="50" cy="55.5" r="2.0" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.4" />

                        {/* Cephalothorax */}
                        <circle cx="50" cy="61" r="3.6" fill="url(#silverMetalS)" stroke="#141414" strokeWidth="0.4" />
                        {/* Cephalothorax silver shine facets */}
                        <circle cx="49" cy="59.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
                        <circle cx="51" cy="59.5" r="0.6" fill="#FFFFFF" opacity="0.8" />

                        {/* Teardrop Silver Abdomen */}
                        <path
                          d="M 50,65 C 45,71 44,79 50,81.5 C 56,79 55,71 50,65 Z"
                          fill="url(#silverMetalS)"
                          stroke="#121212"
                          strokeWidth="0.6"
                        />
                        <path
                          d="M 50,65 C 45,71 44,79 50,81.5 C 56,79 55,71 50,65 Z"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="0.5"
                          opacity="0.7"
                        />
                        {/* Sparkle highlight */}
                        <path
                          d="M 48.5,68.5 C 46,72.5 46,75.5 48,78 C 46.8,75.5 46.2,72.5 48.5,68.5 Z"
                          fill="#FFFFFF"
                          opacity="0.45"
                        />

                        {/* Legs Group */}
                        {/* Thick silver-pewter leg bases */}
                        <g stroke="#2B2A27" strokeWidth="2.0" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          {/* Left Legs */}
                          <path d="M 47.5,59.8 C 40,54.8 38,46.8 42,42.5" />
                          <path d="M 46.8,61.0 C 36.8,59.1 32.8,64.1 34.1,68.0" />
                          <path d="M 46.8,63.0 C 35.5,65.6 34.2,74.1 37.5,78.7" />
                          <path d="M 47.5,65.0 C 38.3,72.2 39.5,81.2 42.8,83.9" />
                          {/* Right Legs */}
                          <path d="M 52.5,59.8 C 60,54.8 62,46.8 58,42.5" />
                          <path d="M 53.2,61.0 C 63.2,59.1 67.2,64.1 65.9,68.0" />
                          <path d="M 53.2,63.0 C 64.5,65.6 65.8,74.1 62.5,78.7" />
                          <path d="M 52.5,65.0 C 61.7,72.2 60.5,81.2 57.2,83.9" />
                        </g>

                        {/* Shiny silver highlights on top of legs for a 3D metallic feel */}
                        <g stroke="#FFFFFF" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                          {/* Left Legs */}
                          <path d="M 47,59.3 C 39.8,54.3 37.8,46.3 41.5,42.0" />
                          <path d="M 46.3,60.5 C 36.3,58.6 32.3,63.6 33.6,67.5" />
                          <path d="M 46.3,62.5 C 35.0,65.1 33.7,73.6 37.0,78.2" />
                          <path d="M 47.0,64.5 C 37.8,71.7 39.0,80.7 42.3,83.4" />
                          {/* Right Legs */}
                          <path d="M 53,59.3 C 60.2,54.3 62.2,46.3 58.5,42.0" />
                          <path d="M 53.7,60.5 C 63.7,58.6 67.7,63.6 66.4,67.5" />
                          <path d="M 53.7,62.5 C 65.0,65.1 66.3,73.6 63.0,78.2" />
                          <path d="M 53.0,64.5 C 62.2,71.7 61.0,80.7 57.7,83.4" />
                        </g>
                      </motion.g>
                    </svg>
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="font-sans text-[8px] sm:text-[10px] md:text-xs tracking-[0.12em] sm:tracking-[0.24em] whitespace-nowrap uppercase text-[#E50914] font-bold mt-2"
          >
            Forged in Shadow &bull; Wearable Gothic Lore
          </motion.p>
        </div>
      </div>

      {/* Floating Scroll Down Indicator at the bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        whileHover={{ opacity: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-300 cursor-pointer z-30"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight * 0.95,
            behavior: "smooth",
          });
        }}
      >
        <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-[#F5F2EF]/60">SCROLL DOWN</span>
        <motion.svg
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-3.5 h-3.5 text-[#F5F2EF]/55"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
