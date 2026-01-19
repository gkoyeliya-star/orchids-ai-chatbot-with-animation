"use client";

import { ChatBot } from "@/components/ChatBot";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, Zap, Brain, MessageSquare, Shield, Clock, ChevronDown, Cpu, Database, Globe, Wifi, Binary, CircuitBoard, Hexagon, Triangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function CursorTrail() {
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  
  useEffect(() => {
    const handleMove = (x: number, y: number) => {
      const newTrail = { x, y, id: Date.now() + Math.random() };
      setTrails((prev) => [...prev.slice(-20), newTrail]);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) => prev.slice(1));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {trails.map((trail, idx) => {
        const size = 4 + idx * 1.2;
        const opacity = 0.2 + idx * 0.04;
        return (
          <motion.div
            key={trail.id}
            initial={{ scale: 1, opacity: opacity }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              left: trail.x - size / 2,
              top: trail.y - size / 2,
              width: size,
              height: size,
              background: `radial-gradient(circle, rgba(139, 92, 246, ${opacity}) 0%, rgba(217, 70, 239, ${opacity * 0.8}) 50%, rgba(6, 182, 212, ${opacity * 0.5}) 100%)`,
              boxShadow: `0 0 ${10 + idx * 2}px rgba(139, 92, 246, ${opacity * 0.5}), 0 0 ${20 + idx * 3}px rgba(217, 70, 239, ${opacity * 0.3})`,
            }}
          />
        );
      })}
      {trails.length > 0 && (
        <motion.div
          className="absolute w-6 h-6 -translate-x-3 -translate-y-3 pointer-events-none"
          style={{
            left: trails[trails.length - 1]?.x,
            top: trails[trails.length - 1]?.y,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-60 blur-sm animate-pulse" />
          <div className="absolute inset-[25%] rounded-full bg-white/80" />
        </motion.div>
      )}
    </div>
  );
}

function FloatingIcon({ icon: Icon, x, y, delay, color }: { icon: React.ElementType; x: string; y: string; delay: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.4, 0.2, 0.4, 0], scale: [0.5, 1, 0.8, 1, 0.5], y: [0, -30, -20, -40, -60] }}
      transition={{ duration: 8, delay, repeat: 9999, ease: "easeInOut" }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <Icon className={`w-5 h-5 ${color}`} />
    </motion.div>
  );
}

function AnimatedWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute bottom-0 left-0 w-full h-[60%]" viewBox="0 0 1440 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(217, 70, 239, 0.3)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
          </linearGradient>
          <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.25)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.25)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.25)" />
          </linearGradient>
          <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.2)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.2)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.2)" />
          </linearGradient>
          <linearGradient id="wave-grad-4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(52, 211, 153, 0.15)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.15)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.15)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path className="animate-wave-1" fill="url(#wave-grad-1)" filter="url(#glow)" d="M0,300 C240,200 480,400 720,300 C960,200 1200,400 1440,300 L1440,600 L0,600 Z" />
        <path className="animate-wave-2" fill="url(#wave-grad-2)" filter="url(#glow)" d="M0,350 C300,250 600,450 900,350 C1200,250 1350,400 1440,350 L1440,600 L0,600 Z" />
        <path className="animate-wave-3" fill="url(#wave-grad-3)" filter="url(#glow)" d="M0,400 C200,320 400,480 600,400 C800,320 1000,480 1200,400 C1300,360 1380,420 1440,400 L1440,600 L0,600 Z" />
        <path className="animate-wave-4" fill="url(#wave-grad-4)" filter="url(#glow)" d="M0,450 C180,380 360,520 540,450 C720,380 900,520 1080,450 C1260,380 1350,480 1440,450 L1440,600 L0,600 Z" />
      </svg>
      
      <svg className="absolute top-0 left-0 w-full h-[40%] rotate-180" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-top-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.15)" />
            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.15)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.15)" />
          </linearGradient>
          <linearGradient id="wave-top-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.1)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
          </linearGradient>
        </defs>
        <path className="animate-wave-1-reverse" fill="url(#wave-top-1)" d="M0,200 C200,100 400,300 600,200 C800,100 1000,300 1200,200 C1320,140 1400,240 1440,200 L1440,400 L0,400 Z" />
        <path className="animate-wave-2-reverse" fill="url(#wave-top-2)" d="M0,250 C240,180 480,320 720,250 C960,180 1200,320 1440,250 L1440,400 L0,400 Z" />
      </svg>
    </div>
  );
}

function FuturisticBackground() {
  const floatingIcons = [
    { icon: Cpu, x: "10%", y: "20%", delay: 0, color: "text-violet-400/50" },
    { icon: Database, x: "85%", y: "15%", delay: 1.5, color: "text-cyan-400/50" },
    { icon: Globe, x: "75%", y: "70%", delay: 0.8, color: "text-fuchsia-400/50" },
    { icon: Wifi, x: "20%", y: "75%", delay: 2, color: "text-pink-400/50" },
    { icon: Binary, x: "90%", y: "45%", delay: 1, color: "text-violet-400/50" },
    { icon: CircuitBoard, x: "5%", y: "50%", delay: 2.5, color: "text-cyan-400/50" },
    { icon: Hexagon, x: "60%", y: "10%", delay: 0.5, color: "text-emerald-400/50" },
    { icon: Triangle, x: "30%", y: "85%", delay: 1.8, color: "text-amber-400/50" },
    { icon: Zap, x: "50%", y: "5%", delay: 3, color: "text-yellow-400/50" },
    { icon: Brain, x: "15%", y: "40%", delay: 0.3, color: "text-purple-400/50" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatedWaves />
      
      <div className="absolute inset-0 animate-grid-pulse" style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(217, 70, 239, 0)" />
            <stop offset="50%" stopColor="rgba(217, 70, 239, 0.5)" />
            <stop offset="100%" stopColor="rgba(217, 70, 239, 0)" />
          </linearGradient>
        </defs>
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#line-grad-1)" strokeWidth="1" className="animate-line-draw" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#line-grad-2)" strokeWidth="1" className="animate-line-draw-alt" />
      </svg>

      <div className="absolute top-[10%] left-[5%] w-32 h-32 border border-violet-500/20 rounded-full animate-orbit" />
      <div className="absolute top-[20%] right-[10%] w-48 h-48 border border-fuchsia-500/15 rounded-full animate-orbit-reverse" />
      <div className="absolute bottom-[15%] left-[15%] w-24 h-24 border border-cyan-500/20 rounded-full animate-orbit" style={{ animationDelay: "-5s" }} />
      <div className="absolute bottom-[25%] right-[20%] w-40 h-40 border border-pink-500/10 rounded-full animate-orbit-reverse" style={{ animationDelay: "-3s" }} />

      <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-violet-400 rounded-full animate-twinkle shadow-lg shadow-violet-400/50" />
      <div className="absolute top-[15%] right-[30%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-twinkle shadow-lg shadow-cyan-400/50" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[40%] left-[40%] w-1 h-1 bg-fuchsia-400 rounded-full animate-twinkle shadow-lg shadow-fuchsia-400/50" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-pink-400 rounded-full animate-twinkle shadow-lg shadow-pink-400/50" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-[20%] right-[40%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-twinkle shadow-lg shadow-emerald-400/50" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-[45%] left-[60%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-twinkle shadow-lg shadow-amber-400/50" style={{ animationDelay: "2.5s" }} />
      <div className="absolute top-[70%] left-[30%] w-2 h-2 bg-blue-400 rounded-full animate-twinkle shadow-lg shadow-blue-400/50" style={{ animationDelay: "3s" }} />

      {floatingIcons.map((item, idx) => (
        <FloatingIcon key={idx} {...item} />
      ))}

      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/20 to-transparent animate-scan-line" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent animate-scan-line" style={{ animationDelay: "-3s" }} />
    </div>
  );
}

function WireframeMeshBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spherePoints: { x: number; y: number; z: number }[] = [];
    const latLines = 16;
    const lonLines = 24;

    for (let i = 0; i <= latLines; i++) {
      const lat = (Math.PI * i) / latLines - Math.PI / 2;
      for (let j = 0; j <= lonLines; j++) {
        const lon = (2 * Math.PI * j) / lonLines;
        spherePoints.push({
          x: Math.cos(lat) * Math.cos(lon),
          y: Math.sin(lat),
          z: Math.cos(lat) * Math.sin(lon),
        });
      }
    }

    const animate = () => {
      timeRef.current += 0.006;
      const t = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const isMobile = canvas.width < 768;
      const baseRadius = isMobile ? Math.min(canvas.width, canvas.height) * 0.18 : Math.min(canvas.width, canvas.height) * 0.15;

      const rotatedPoints = spherePoints.map((p) => {
        let { x, y, z } = p;

        const cosRy = Math.cos(t * 0.3);
        const sinRy = Math.sin(t * 0.3);
        const newX = x * cosRy - z * sinRy;
        const newZ = x * sinRy + z * cosRy;
        x = newX;
        z = newZ;

        const cosRx = Math.cos(t * 0.2);
        const sinRx = Math.sin(t * 0.2);
        const newY = y * cosRx - z * sinRx;
        const newZ2 = y * sinRx + z * cosRx;
        y = newY;
        z = newZ2;

        const noise1 = Math.sin(x * 3 + t * 2) * 0.15;
        const noise2 = Math.sin(y * 4 + t * 1.5) * 0.12;
        const noise3 = Math.sin(z * 2.5 + t * 1.8) * 0.1;
        const distortion = 1 + noise1 + noise2 + noise3;

        const radius = baseRadius * distortion;
        const perspective = 800 / (800 + z * baseRadius);

        return {
          screenX: centerX + x * radius * perspective,
          screenY: centerY + y * radius * perspective,
          z: z,
          depth: perspective,
        };
      });

      ctx.lineWidth = 0.8;

      for (let i = 0; i < latLines; i++) {
        for (let j = 0; j < lonLines; j++) {
          const idx1 = i * (lonLines + 1) + j;
          const idx2 = i * (lonLines + 1) + j + 1;
          const idx3 = (i + 1) * (lonLines + 1) + j;
          const idx4 = (i + 1) * (lonLines + 1) + j + 1;

          const p1 = rotatedPoints[idx1];
          const p2 = rotatedPoints[idx2];
          const p3 = rotatedPoints[idx3];
          const p4 = rotatedPoints[idx4];

          if (!p1 || !p2 || !p3 || !p4) continue;

          const avgDepth = (p1.depth + p2.depth + p3.depth + p4.depth) / 4;
          const alpha = Math.max(0.1, Math.min(0.7, avgDepth * 0.8));

          const hue1 = 280 + Math.sin(t + i * 0.2) * 30;
          const hue2 = 320 + Math.cos(t + j * 0.15) * 20;
          const gradient = ctx.createLinearGradient(p1.screenX, p1.screenY, p4.screenX, p4.screenY);
          gradient.addColorStop(0, `hsla(${hue1}, 80%, 70%, ${alpha})`);
          gradient.addColorStop(1, `hsla(${hue2}, 70%, 60%, ${alpha * 0.7})`);

          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p3.screenX, p3.screenY);
          ctx.stroke();
        }
      }

      for (let i = 0; i < rotatedPoints.length; i += 4) {
        const p = rotatedPoints[i];
        if (!p) continue;
        const alpha = Math.max(0.2, p.depth * 0.5);
        const size = 1.2 * p.depth;
        
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-r from-violet-600/20 via-fuchsia-500/15 to-cyan-400/10 blur-[80px] animate-blob-pulse" />
    </div>
  );
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const learnMoreRef = useRef<HTMLDivElement>(null);

  const scrollToLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Groq's LPU delivers responses in milliseconds, not seconds", gradient: "from-amber-500 to-orange-600" },
    { icon: Brain, title: "Smart AI", desc: "Llama 3.3 70B provides deep understanding and reasoning", gradient: "from-violet-500 to-purple-600" },
    { icon: MessageSquare, title: "Natural Chat", desc: "Fluid conversations that feel genuinely human", gradient: "from-cyan-500 to-blue-600" },
    { icon: Shield, title: "Privacy First", desc: "Your conversations stay private and secure", gradient: "from-emerald-500 to-green-600" },
    { icon: Clock, title: "24/7 Available", desc: "Always online, ready to help anytime you need", gradient: "from-rose-500 to-pink-600" },
    { icon: Cpu, title: "Unlimited Chats", desc: "No limits on conversations or message length", gradient: "from-indigo-500 to-blue-600" },
  ];

  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden">
      <CursorTrail />
      <FuturisticBackground />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,80,200,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(200,80,150,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(80,150,200,0.08),transparent_40%)]" />

      <WireframeMeshBlob />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-fuchsia-400 animate-spin-slow" />
            <span className="text-sm font-medium text-violet-200">Next-Gen AI Assistant</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span className="text-white">Chat with </span>
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
              Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-xl text-lg text-white/60 leading-relaxed"
          >
            Experience the future of conversation with our AI assistant. 
            Powered by Groq&apos;s lightning-fast inference engine and Llama 3.3.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => setChatOpen(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-white font-semibold shadow-2xl shadow-violet-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
              </div>
              <span className="relative z-10 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Start Chatting
              </span>
            </motion.button>
            <motion.button
              onClick={scrollToLearnMore}
              whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ChevronDown className="h-5 w-5" />
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02, borderColor: "rgba(139, 92, 246, 0.3)" }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={learnMoreRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-40 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white">
              Why Choose <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Our AI</span>?
            </h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto">
              Built with cutting-edge technology for the best conversational experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Groq LPU Technology</h3>
              </div>
              <p className="text-white/50 leading-relaxed">
                Groq&apos;s Language Processing Unit (LPU) delivers inference speeds up to 10x faster than traditional GPUs. 
                Experience responses in milliseconds, making conversations feel truly natural and instantaneous.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Llama 3.3 70B Model</h3>
              </div>
              <p className="text-white/50 leading-relaxed">
                Powered by Meta&apos;s latest Llama 3.3 70B model, offering exceptional reasoning capabilities, 
                multilingual support, and deep contextual understanding for complex conversations.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
              </div>
              <p className="text-white/50 leading-relaxed">
                Your conversations are encrypted and never stored on external servers. 
                Chat history is saved locally on your device, giving you full control over your data.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Always Available</h3>
              </div>
              <p className="text-white/50 leading-relaxed">
                Access your AI assistant 24/7 from any device. Whether it&apos;s a quick question or 
                a deep conversation, we&apos;re here whenever you need intelligent assistance.
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
            <motion.button
              onClick={() => setChatOpen(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 py-4 text-white font-semibold shadow-2xl shadow-violet-500/30"
            >
              <MessageSquare className="h-5 w-5" />
              Try It Now - It&apos;s Free
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
