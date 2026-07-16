"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strongVignetteRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = 169;

  // Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/images/Hero-section/frame_${pad(i, 3)}.png`;
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  // GSAP Scroll Animation
  useEffect(() => {
    if (!containerRef.current || !imgRef.current || !cardRef.current) return;

    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    const sequenceObj = { frame: 0 };

    // GSAP Scroll Trigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        pin: true,
      },
    });

    // Scrub through frames
    tl.to(sequenceObj, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      onUpdate: () => {
        const idx = Math.round(sequenceObj.frame);
        const frameNum = Math.min(totalFrames, Math.max(1, idx + 1));
        if (imgRef.current) {
          imgRef.current.src = `/images/Hero-section/frame_${pad(frameNum, 3)}.png`;
        }
      },
    }, 0);

    // Fade in strong rounded vignette on scroll to dark screens
    if (strongVignetteRef.current) {
      tl.to(strongVignetteRef.current, {
        opacity: 1,
        ease: "power1.out",
      }, 0);
    }

    // Subtle 3D rotation — keep pendant centered and fully visible
    tl.fromTo(
      cardRef.current,
      { rotateY: 5, rotateX: 3, scale: 0.98 },
      { rotateY: -5, rotateX: -3, scale: 1, ease: "power1.inOut" },
      0
    );

    // Animate feature texts — drift toward chain zones, never over the pendant
    const textBlocks = gsap.utils.toArray(".scroll-text") as HTMLElement[];
    const textMotion: Record<string, { enter: gsap.TweenVars; exit: gsap.TweenVars }> = {
      left: {
        enter: { opacity: 1, x: 28, y: 18, duration: 0.15, ease: "power2.out" },
        exit: { opacity: 0, x: -48, y: -12, duration: 0.15, ease: "power2.in" },
      },
      right: {
        enter: { opacity: 1, x: -28, y: 18, duration: 0.15, ease: "power2.out" },
        exit: { opacity: 0, x: 48, y: -12, duration: 0.15, ease: "power2.in" },
      },
      top: {
        enter: { opacity: 1, y: 6, duration: 0.15, ease: "power2.out" },
        exit: { opacity: 0, y: -28, duration: 0.15, ease: "power2.in" },
      },
      bottom: {
        enter: { opacity: 1, y: -6, duration: 0.15, ease: "power2.out" },
        exit: { opacity: 0, y: 28, duration: 0.15, ease: "power2.in" },
      },
    };

    textBlocks.forEach((text, i) => {
      const start = i / textBlocks.length;
      const end = (i + 1) / textBlocks.length;
      const zone = text.dataset.zone ?? "top";
      const motion = textMotion[zone];

      const enterFrom: gsap.TweenVars = { opacity: 0 };
      const exitTo: gsap.TweenVars = { opacity: 0 };

      if (zone === "left") {
        Object.assign(enterFrom, { x: -72, y: -24 });
        Object.assign(exitTo, motion.exit);
      } else if (zone === "right") {
        Object.assign(enterFrom, { x: 72, y: -24 });
        Object.assign(exitTo, motion.exit);
      } else if (zone === "top") {
        Object.assign(enterFrom, { y: -36 });
        Object.assign(exitTo, motion.exit);
      } else {
        Object.assign(enterFrom, { y: 36 });
        Object.assign(exitTo, motion.exit);
      }

      tl.fromTo(text, enterFrom, motion.enter, start * 0.95);
      tl.to(text, exitTo, end * 0.95 - 0.05);
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Framer Motion Interactive Mouse 3D Tilt for Full Screen Viewport
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 25 });
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 100, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const xVal = e.clientX - width / 2;
    const yVal = e.clientY - height / 2;
    mouseX.set(xVal / width);
    mouseY.set(yVal / height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[300vh] bg-[#111111] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >


      {/* Sticky Interactive Full Screen Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-[1200px]">
        
        {/* Full Screen Image Wrapper with tilt & scroll rotation */}
        <motion.div
          ref={cardRef}
          style={{ rotateX: tiltX, rotateY: tiltY }}
          className="absolute inset-0 w-full h-full z-0 flex items-center justify-center"
        >
          {/* Soft vignette — pendant stays bright, edges fade gently */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
            <div 
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                width: "100vw",
                height: "56.25vw",
                maxWidth: "177.78vh",
                maxHeight: "100vh",
                left: "50%",
                top: "46%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                ref={imgRef}
                src="/images/Hero-section/frame_001.png"
                alt="Spider Necklace Full Screen"
                className="w-full h-full pointer-events-none select-none"
              />
              
              {/* Clean Cover for the star symbol in the bottom right */}
              <div 
                id="star-cover"
                className="absolute bottom-[16.9%] right-[9.6%] translate-x-1/2 translate-y-1/2 w-[4.5%] aspect-square rounded-full bg-[#c7c0c2] mix-blend-darken blur-[4px] pointer-events-none"
              />
            </div>

            {/* Fullscreen Vignette & Edge Blenders */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 
                  "linear-gradient(to right, #111111 0%, transparent 12%, transparent 88%, #111111 100%), " +
                  "radial-gradient(ellipse 75% 75% at 50% 46%, transparent 45%, rgba(17,17,17,0.45) 75%, rgba(17,17,17,0.9) 100%)",
              }}
            />

            {/* Dynamic strong rounded vignette active on dark scroll screens */}
            <div
              ref={strongVignetteRef}
              className="absolute inset-0 pointer-events-none z-20 opacity-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 46%, transparent 20%, rgba(17,17,17,0.85) 52%, #111111 72%)",
              }}
            />
          </div>

        </motion.div>

        {/* Scroll-Triggered Text HUDs — anchored to chain paths, clear of the stone */}
        {/* Left top zone */}
        <div
          data-zone="left"
          className="scroll-text absolute left-[3%] md:left-[6%] top-[14%] md:top-[16%] text-left max-w-[9.5rem] sm:max-w-[11rem] md:max-w-xs pointer-events-none select-none z-10 opacity-0"
        >
          <span className="text-[#8E1F1F] uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">Design Origin</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl text-[#D8CFC0] leading-none mb-4">
            The Arachnid Requiem
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#D8CFC0]/60 leading-relaxed">
            Inspired by gothic cathedrals and natural predators. A dark, ornate talisman for the modern age.
          </p>
        </div>

        {/* Right top zone */}
        <div
          data-zone="right"
          className="scroll-text absolute right-[3%] md:right-[6%] top-[14%] md:top-[16%] text-right max-w-[9.5rem] sm:max-w-[11rem] md:max-w-xs pointer-events-none select-none z-10 flex flex-col items-end opacity-0"
        >
          <span className="text-[#8E1F1F] uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">Detailing</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl text-[#D8CFC0] leading-none mb-4">
            Aged Sterling Silver
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#D8CFC0]/60 leading-relaxed">
            Oxidized crevices highlight the fine leg joints and hand-etched gothic scrollwork of the body.
          </p>
        </div>



      </div>
    </div>
  );
}
