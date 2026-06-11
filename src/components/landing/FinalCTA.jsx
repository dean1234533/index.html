import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        if (!prefersReduced) {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0) p.x = canvas.offsetWidth;
          if (p.x > canvas.offsetWidth) p.x = 0;
          if (p.y < 0) p.y = canvas.offsetHeight;
          if (p.y > canvas.offsetHeight) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(179, 0, 24, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function FinalCTA() {
  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden">
      <StarfieldCanvas />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-transparent to-[#0a0f1e] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-8"
        >
          Your Transformation
          <br />
          <span className="bg-gradient-to-r from-[#b30018] to-[#10b981] bg-clip-text text-transparent">
            Starts Today
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 bg-[#b30018] hover:bg-[#9c0015] text-white font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 shadow-lg shadow-[#b30018]/30 hover:shadow-[#b30018]/50 min-h-[48px]"
          >
            <Zap className="w-5 h-5" aria-hidden="true" />
            Get Started for £7.99/month
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>
          <p className="text-[#94a3b8]/60 text-sm">
            No contracts. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}