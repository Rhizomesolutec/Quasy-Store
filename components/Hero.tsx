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

  // 2. GSAP Scroll Trigger for scaling model and fading titles
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

    // Zoom out background web
    tl.to(
      webCanvasRef.current,
      {
        scale: 1.5,
        opacity: 0,
        ease: "power1.inOut",
      },
      0
    );

    // Fade out and translate title
    tl.to(
      titleContainerRef.current,
      {
        y: -120,
        opacity: 0,
        ease: "power1.out",
      },
      0
    );

    // Fade out description & action buttons
    tl.to(
      descRef.current,
      {
        y: -40,
        opacity: 0,
        ease: "power1.out",
      },
      0
    );

    // Fade out and scale centerpiece relic down on scroll
    if (centerpieceWrapperRef.current) {
      tl.to(
        centerpieceWrapperRef.current,
        {
          scale: 0.6,
          opacity: 0,
          y: 120,
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
  const titleLetters = ["Q", "U", "A", "S", "Y"];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100vh] bg-[#0b0b0b] overflow-hidden flex flex-col justify-center items-center py-16 px-6 z-0 select-none"
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

      {/* Elastic Canvas Web Background */}
      <canvas
        ref={webCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

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

      {/* Main Unified Center Content Column */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-30 select-none">
        
        {/* 1. Header with Hanging "Spider-Silk" Title Letters */}
        <div ref={titleContainerRef} className="relative flex flex-col items-center overflow-visible w-full">
          {/* Estd label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -10 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-1"
          >
            <div className="h-[1px] w-6 bg-[#D8CFC0]/20" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#D8CFC0]/55">ESTD 2026</span>
            <div className="h-[1px] w-6 bg-[#D8CFC0]/20" />
          </motion.div>

          {/* Bouncing Silk Letters of "QUASY" */}
          <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-8 h-[110px] sm:h-[135px] md:h-[170px] w-full overflow-visible">
            {titleLetters.map((letter, i) => (
              <div key={i} className="relative flex flex-col items-center h-full overflow-visible">
                {/* Interactive Silk Line Thread */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isLoaded ? "80px" : 0 }}
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
                  className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-[#D8CFC0] uppercase tracking-normal select-none filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)] font-bold"
                >
                  {letter}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
            transition={{ duration: 0.9, delay: 1.2 }}
            className="font-sans text-[9px] sm:text-[10px] md:text-xs tracking-[0.24em] uppercase text-[#8E1F1F] font-bold mt-2"
          >
            Forged in Shadow &bull; Artifacts of the Arachnid Requiem
          </motion.p>
        </div>

        {/* 2. Centerpiece: Ornate Amulet with Radial-Masked Video */}
        <div 
          ref={centerpieceWrapperRef}
          className="relative w-[65vw] h-[65vw] md:w-[26vw] md:h-[26vw] max-w-[260px] max-h-[260px] aspect-square flex items-center justify-center my-6 sm:my-8 select-none pointer-events-none overflow-visible"
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

        {/* 3. Action Buttons placed immediately below centerpiece */}
        <div ref={descRef} className="relative flex flex-col items-center gap-2 overflow-visible">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 15 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="flex flex-row gap-4 items-center justify-center"
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
    </div>
  );
}
