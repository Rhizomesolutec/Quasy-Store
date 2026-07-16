"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface WebNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const webCanvasRef = useRef<HTMLCanvasElement>(null);
  const centerpieceWrapperRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [spiderRecoil, setSpiderRecoil] = useState(false);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [swayRotation, setSwayRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ minY: 90, maxY: 500 });

  // Mouse coordinate refs
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const centerOffsetRef = useRef({ x: 0, y: 0 });

  // Web nodes list
  const nodesRef = useRef<WebNode[]>([]);
  const centerNodeRef = useRef<WebNode | null>(null);

  // Set loaded state on mount to kick off intro animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Update scrollProgress
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

  // Update dynamic dimensions for screen height
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

  // Calculate real-time scroll velocity and apply physical sway dampening
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
        // Map velocity to rotation angle (max 18 degrees)
        const targetRotation = Math.max(-15, Math.min(15, velocity * 4.5));
        // Dampen the sway angle smoothly towards the target velocity tilt
        setSwayRotation(prev => prev + (targetRotation - prev) * 0.1);
      }

      lastY = currentY;
      lastTime = currentTime;
      requestAnimationFrame(checkScrollVelocity);
    };

    requestAnimationFrame(checkScrollVelocity);
    return () => { active = false; };
  }, []);

  // 1. Elastic Background Web Canvas Physics
  useEffect(() => {
    const canvas = webCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const radialStrands = 10;
    const rings = 6;
    const springFactor = 0.035;
    const friction = 0.9;
    const mouseRadius = 150;
    const mousePushForce = 35;

    const generateWeb = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const nodes: WebNode[] = [];

      const centerNode: WebNode = {
        x: centerX,
        y: centerY,
        baseX: centerX,
        baseY: centerY,
        vx: 0,
        vy: 0,
        angle: 0,
        radius: 0,
      };
      centerNodeRef.current = centerNode;

      const maxDist = Math.min(width, height) * 0.48;

      for (let r = 1; r <= rings; r++) {
        const ringRadius = (r / rings) * maxDist;
        for (let s = 0; s < radialStrands; s++) {
          const angle = (s * Math.PI * 2) / radialStrands;
          const x = centerX + Math.cos(angle) * ringRadius;
          const y = centerY + Math.sin(angle) * ringRadius;

          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            angle,
            radius: ringRadius,
          });
        }
      }
      nodesRef.current = nodes;
    };

    generateWeb();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      generateWeb();
    };
    window.addEventListener("resize", handleResize);

    // Physics Update Loop
    const animate = () => {
      // Fallback: If dimensions were 0 on mount, re-initialize once layout calculates size
      if (width === 0 || height === 0) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        if (width > 0 && height > 0) {
          generateWeb();
        }
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const m = mouseRef.current;
      const centerNode = centerNodeRef.current;

      // Update Center Node Physics
      if (centerNode) {
        if (m.active) {
          const dx = m.x - centerNode.x;
          const dy = m.y - centerNode.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            centerNode.vx -= (dx / dist) * force * mousePushForce * 0.3;
            centerNode.vy -= (dy / dist) * force * mousePushForce * 0.3;
          }
        }
        centerNode.vx += (centerNode.baseX - centerNode.x) * springFactor;
        centerNode.vy += (centerNode.baseY - centerNode.y) * springFactor;
        centerNode.vx *= friction;
        centerNode.vy *= friction;
        centerNode.x += centerNode.vx;
        centerNode.y += centerNode.vy;

        const ox = centerNode.x - centerX;
        const oy = centerNode.y - centerY;
        centerOffsetRef.current = { x: ox, y: oy };

        // Physically translate the centerpiece along the web mesh!
        if (centerpieceWrapperRef.current) {
          centerpieceWrapperRef.current.style.transform = `translate3d(${ox * 0.8}px, ${oy * 0.8}px, 0)`;
        }
      }

      // Update remaining nodes
      nodesRef.current.forEach((node) => {
        if (m.active) {
          const dx = m.x - node.x;
          const dy = m.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            node.vx -= (dx / dist) * force * mousePushForce * 0.6;
            node.vy -= (dy / dist) * force * mousePushForce * 0.6;
          }
        }

        node.vx += (node.baseX - node.x) * springFactor;
        node.vy += (node.baseY - node.y) * springFactor;
        node.vx *= friction;
        node.vy *= friction;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw Web Rings (Concentric Polygons)
      for (let r = 0; r < rings; r++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(216, 207, 192, ${0.05 + (r / rings) * 0.08})`;
        ctx.lineWidth = 0.8;
        for (let s = 0; s < radialStrands; s++) {
          const idx = r * radialStrands + s;
          const node = nodesRef.current[idx];
          if (node) {
            if (s === 0) ctx.moveTo(node.x, node.y);
            else ctx.lineTo(node.x, node.y);
          }
        }
        // Close Ring
        const firstIdx = r * radialStrands;
        const firstNode = nodesRef.current[firstIdx];
        if (firstNode) ctx.lineTo(firstNode.x, firstNode.y);
        ctx.stroke();
      }

      // Draw Web Radial Lines
      for (let s = 0; s < radialStrands; s++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(216, 207, 192, 0.09)";
        ctx.lineWidth = 1;
        if (centerNode) ctx.moveTo(centerNode.x, centerNode.y);
        else ctx.moveTo(centerX, centerY);

        for (let r = 0; r < rings; r++) {
          const idx = r * radialStrands + s;
          const node = nodesRef.current[idx];
          if (node) ctx.lineTo(node.x, node.y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. GSAP Scroll Trigger for split screen parallax and fades
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    // Translate left column text block leftwards & fade out
    tl.to(
      titleContainerRef.current,
      {
        x: -80,
        opacity: 0,
        ease: "power1.out",
      },
      0
    );

    // Zoom out web canvas in the right column
    tl.to(
      webCanvasRef.current,
      {
        scale: 1.35,
        opacity: 0,
        ease: "power1.inOut",
      },
      0
    );

    // Fade out and translate centerpiece video down on scroll
    if (centerpieceWrapperRef.current) {
      tl.to(
        centerpieceWrapperRef.current,
        {
          scale: 0.65,
          opacity: 0,
          y: 100,
          ease: "power1.inOut",
        },
        0
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Mouse move handlers for elastic web deformation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = webCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Letter array for dropping animation
  const titleLetters = ["Q", "U", "S", "A", "Y"];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100vh] bg-[#0b0b0b] overflow-hidden flex flex-col justify-center items-center py-16 px-6 lg:px-16 z-0 select-none"
    >
      {/* Background Parallax Texture */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-[0.025] mix-blend-color-dodge z-0 scale-105"
        style={{ backgroundImage: "url('/images/spider-1.jpg')" }}
      />

      {/* Pulsing Crimson and Silver Backdrops */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Central glowing red shadow */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[550px] max-h-[550px] rounded-full bg-[#8E1F1F]/12 blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
        {/* Cold silver glow */}
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#D8CFC0]/3 blur-[140px]" />
      </div>

      {/* Ornate Filigree Corner Borders */}
      <div className="absolute inset-0 pointer-events-none z-20 border border-[#D8CFC0]/5 m-3 md:m-6 select-none">
        <svg className="absolute top-2 left-2 w-8 h-8 text-[#D8CFC0]/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
        <svg className="absolute top-2 right-2 w-8 h-8 text-[#D8CFC0]/15 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
        <svg className="absolute bottom-2 left-2 w-8 h-8 text-[#D8CFC0]/15 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
        <svg className="absolute bottom-2 right-2 w-8 h-8 text-[#D8CFC0]/15 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2,2 L14,2 M2,2 L2,14 M2,2 L10,10 M6,2 L2,6 M10,2 L2,10" />
        </svg>
      </div>

      {/* Main Grid: Left Column Content / Right Column Interactive Showcase */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-center z-30 select-none px-4 md:px-8">
        
        {/* Left Column: Typography, Descriptions, and Action Buttons */}
        <div 
          ref={titleContainerRef} 
          className="flex flex-col items-center lg:items-start text-center lg:text-left overflow-visible"
        >
          {/* Estd label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -10 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="h-[1px] w-6 bg-[#D8CFC0]/20" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#D8CFC0]/55">ESTD 2026</span>
            <div className="h-[1px] w-6 bg-[#D8CFC0]/20" />
          </motion.div>

          {/* Bouncing Silk Letters of "QUSAY" */}
          <div className="relative flex items-center justify-center lg:justify-start gap-2 sm:gap-4 md:gap-6 h-[105px] sm:h-[130px] md:h-[150px] w-full overflow-visible">
            {titleLetters.map((letter, i) => (
              <div key={i} className="relative flex flex-col items-center h-full overflow-visible">
                {/* Interactive Silk Line Thread */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isLoaded ? "70px" : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 65,
                    damping: 16,
                    delay: i * 0.12 + 0.6,
                  }}
                  className="w-[1px] bg-gradient-to-b from-[#8E1F1F]/15 via-[#8E1F1F]/60 to-[#D8CFC0]/30 origin-top"
                />

                {/* Hanging swaying Letter */}
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ 
                    opacity: isLoaded ? 1 : 0, 
                    y: isLoaded ? 0 : -100,
                    rotate: isLoaded ? [-1.8, 1.8, -1.8] : 0 
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
                  className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem] text-[#D8CFC0] uppercase tracking-normal select-none filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)] font-bold relative"
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
                          <stop offset="35%" stopColor="#D8CFC0" />
                          <stop offset="70%" stopColor="#6E6B64" />
                          <stop offset="100%" stopColor="#2A2927" />
                        </radialGradient>
                      </defs>

                      {/* Silver Curb Chain (Double-path stroke for metallic link detail) */}
                      <path d="M 23,25 C 32,55 68,55 77,25" stroke="#4E4B44" strokeWidth="1.8" fill="none" />
                      <path d="M 23,25 C 32,55 68,55 77,25" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="2.5 2" fill="none" opacity="0.85" />

                      {/* Left side silver spacer beads & Star link */}
                      <path d="M 31,35 L 32.5,33.5 L 34,35 L 33,33 L 34.5,32 L 32.5,32.5 L 31.5,31 L 32,33 Z" fill="none" stroke="#D8CFC0" strokeWidth="0.5" />
                      <circle cx="36" cy="40" r="2.2" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />
                      <circle cx="41.5" cy="44.5" r="1.8" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />

                      {/* Right side silver spacer beads & Star link */}
                      <path d="M 69,35 L 67.5,33.5 L 66,35 L 67,33 L 65.5,32 L 67.5,32.5 L 68.5,31 L 68,33 Z" fill="none" stroke="#D8CFC0" strokeWidth="0.5" />
                      <circle cx="64" cy="40" r="2.2" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />
                      <circle cx="58.5" cy="44.5" r="1.8" fill="url(#silverMetalS)" stroke="#1c1c1c" strokeWidth="0.3" />

                      {/* Center Clasp Silver Link */}
                      <circle cx="50" cy="49" r="2.4" stroke="#D8CFC0" strokeWidth="0.8" fill="none" />

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
                        <path d="M 50,51.4 L 50,53.5" stroke="#D8CFC0" strokeWidth="1.0" />

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
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="font-sans text-[10px] md:text-xs tracking-[0.24em] uppercase text-[#8E1F1F] font-bold mt-2"
          >
            Forged in Shadow &bull; Wearable Gothic Lore
          </motion.p>

          {/* Brand Lore Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 15 }}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="font-sans text-[11px] md:text-xs tracking-wider leading-relaxed text-[#D8CFC0]/55 max-w-md mt-5 mb-8 text-center lg:text-left"
          >
            A dark synthesis of raw gothic lore and sterling silver artistry. Discover our limited-edition wearable relics, forged in darkness and designed for those who walk between the shadows.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 15 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="flex flex-row gap-4 items-center justify-center lg:justify-start w-full"
          >
            <Link href="/shop" className="relative group overflow-hidden border border-[#D8CFC0]/30 px-6 py-3 rounded-sm bg-transparent transition-all duration-300 hover:border-[#8E1F1F]/80">
              <div className="absolute inset-0 w-0 bg-[#8E1F1F]/10 group-hover:w-full transition-all duration-500 ease-out" />
              <span className="relative font-sans text-[10px] tracking-widest uppercase text-[#D8CFC0] group-hover:text-white transition-colors duration-300">
                Shop Relics
              </span>
            </Link>
            <Link href="/about" className="relative group overflow-hidden px-6 py-3 rounded-sm bg-[#D8CFC0]/5 border border-transparent transition-all duration-300 hover:bg-[#D8CFC0]/10">
              <span className="font-sans text-[10px] tracking-widest uppercase text-[#D8CFC0]/70 group-hover:text-[#D8CFC0] transition-colors duration-300">
                Our Lore
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Interactive Web and Levitating Amulet Video Showcase */}
        <div 
          className="relative w-full aspect-square max-w-[420px] max-h-[420px] mx-auto flex items-center justify-center overflow-visible"
        >
          {/* Elastic Canvas Web Background (Fitted inside parent container) */}
          <canvas
            ref={webCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700"
            style={{ opacity: isLoaded ? 1 : 0 }}
          />

          {/* Showcase: Amulet container */}
          <div
            ref={centerpieceWrapperRef}
            className="relative w-[65vw] h-[65vw] md:w-[26vw] md:h-[26vw] max-w-[260px] max-h-[260px] aspect-square flex items-center justify-center select-none pointer-events-none overflow-visible z-20"
          >
            {/* Subtle Ambient Pulsing Glow Rings behind amulet */}
            <div className="absolute w-[60%] h-[60%] rounded-full bg-[#8e1f1f]/22 blur-[30px] animate-pulse pointer-events-none" />
            <div className="absolute w-[45%] h-[45%] rounded-full bg-[#00ff88]/4 blur-[20px] animate-pulse pointer-events-none" style={{ animationDuration: "5s" }} />

            {/* Ornate Double-Ring Gothic Silver Frame */}
            <div className="absolute inset-0 rounded-full border-2 border-double border-[#D8CFC0]/30 shadow-[0_0_40px_rgba(0,0,0,0.92)] flex items-center justify-center pointer-events-none z-20">
              {/* Subtle notch detail ring */}
              <div className="absolute inset-[3px] rounded-full border border-dashed border-[#D8CFC0]/12" />
            </div>
            
            {/* Inner bezel ring */}
            <div className="absolute inset-[8px] rounded-full border border-[#D8CFC0]/18 pointer-events-none z-20 shadow-[inset_0_0_12px_rgba(0,0,0,0.85)]" />

            {/* Video Container with Radial Transparency Mask */}
            <div 
              className="absolute inset-[10px] rounded-full overflow-hidden bg-[#111111]/35 backdrop-blur-[2px]"
              style={{
                maskImage: "radial-gradient(circle, black 52%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(circle, black 52%, transparent 72%)"
              }}
            >
              <video
                src="/images/Nacklace/Glow dark nacklace/vol 2/vol 2 vido.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.08] filter contrast-[1.26] brightness-[1.04] saturate-[1.12]"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Floating Scroll Down Indicator at the bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.35 : 0 }}
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
        <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-[#D8CFC0]/60">SCROLL DOWN</span>
        <motion.svg
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-3.5 h-3.5 text-[#D8CFC0]/55"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
        </motion.svg>
      </motion.div>

      {/* Global Scroll-Progress Hanging Spider (Silver) */}
      <AnimatePresence>
        {scrollProgress > 0.02 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed left-2 sm:left-6 md:left-10 top-0 bottom-0 w-8 z-50 pointer-events-none flex flex-col items-center"
          >
            {/* The Silk Thread stretching from viewport top */}
            <div 
              className="w-[0.8px] bg-gradient-to-b from-[#8E1F1F]/20 via-[#D8CFC0]/45 to-[#D8CFC0]/70"
              style={{ height: `${dimensions.minY + scrollProgress * (dimensions.maxY - dimensions.minY)}px` }}
            />

            {/* Swaying Spider Pendant (Silver) */}
            <motion.div
              style={{ 
                transformOrigin: "50px 27px",
                rotate: swayRotation,
                marginTop: "-2px"
              }}
              className="w-8 h-8 text-[#D8CFC0]/80 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            >
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <defs>
                  <radialGradient id="silverProgressGem" cx="35%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#D8CFC0" />
                    <stop offset="70%" stopColor="#6E6B64" />
                    <stop offset="100%" stopColor="#2A2927" />
                  </radialGradient>
                </defs>

                {/* Silver Link Ring */}
                <circle cx="50" cy="27" r="4.5" stroke="#D8CFC0" strokeWidth="1.2" fill="none" opacity="0.8" />
                <path d="M50,31.5 L50,33.5" stroke="#D8CFC0" strokeWidth="1.2" />

                {/* Head */}
                <circle cx="50" cy="36" r="3.8" fill="url(#silverProgressGem)" stroke="#1c1c1c" strokeWidth="0.4" />

                {/* Cephalothorax */}
                <circle cx="50" cy="45" r="6.5" fill="url(#silverProgressGem)" stroke="#141414" strokeWidth="0.4" />
                <circle cx="49" cy="43.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
                <circle cx="51" cy="43.5" r="0.6" fill="#FFFFFF" opacity="0.8" />

                {/* Teardrop Silver Abdomen */}
                <path 
                  d="M50,52 C41,61 39,73 50,77 C61,73 59,61 50,52 Z" 
                  fill="url(#silverProgressGem)" 
                  stroke="#121212" 
                  strokeWidth="0.6"
                />
                <path 
                  d="M50,52 C41,61 39,73 50,77 C61,73 59,61 50,52 Z" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="0.5" 
                  opacity="0.7"
                />
                <path 
                  d="M48.5,55.5 C46,59.5 46,62.5 48,65 C46.8,62.5 46.2,59.5 48.5,55.5 Z" 
                  fill="#FFFFFF" 
                  opacity="0.45" 
                />

                {/* Legs Group */}
                <g stroke="#2B2A27" strokeWidth="2.0" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 45,43 C 33,35 30,22 36,15" />
                  <path d="M 44,45 C 28,42 22,50 24,56" />
                  <path d="M 44,48 C 26,52 24,65 29,72" />
                  <path d="M 46,51 C 32,62 34,76 39,80" />
                  <path d="M 55,43 C 67,35 70,22 64,15" />
                  <path d="M 56,45 C 72,42 78,50 76,56" />
                  <path d="M 56,48 C 74,52 76,65 71,72" />
                  <path d="M 54,51 C 68,62 66,76 61,80" />
                </g>

                <g stroke="#FFFFFF" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                  <path d="M 44.5,42.5 C 33.5,35.5 30.5,22.5 35.5,15.5" />
                  <path d="M 43.5,44.5 C 28.5,41.5 22.5,49.5 24.5,55.5" />
                  <path d="M 43.5,47.5 C 26.5,51.5 24.5,64.5 28.5,71.5" />
                  <path d="M 45.5,50.5 C 32.5,61.5 34.5,75.5 38.5,79.5" />
                  <path d="M 55.5,42.5 C 66.5,35.5 69.5,22.5 64.5,15.5" />
                  <path d="M 56.5,44.5 C 71.5,41.5 77.5,49.5 75.5,55.5" />
                  <path d="M 56.5,47.5 C 73.5,51.5 75.5,64.5 71.5,71.5" />
                  <path d="M 54.5,50.5 C 67.5,61.5 65.5,75.5 60.5,79.5" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
