'use client';
import React, { useEffect, useRef } from 'react';

interface FibreParticlesProps {
  density?: 'low' | 'medium';
  colour?: string;
  paused?: boolean;
}

export function FibreParticles({
  density = 'low',
  colour = 'var(--sage)',
  paused = false
}: FibreParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; w: number; h: number; a: number; vX: number; vY: number; vA: number; opacity: number }> = [];

    const numParticles = density === 'medium' ? 120 : 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          w: Math.random() * 2 + 1, // width: 1-3px
          h: Math.random() * 12 + 8, // height/length: 8-20px
          a: Math.random() * Math.PI * 2, // angle
          vX: (Math.random() - 0.5) * 0.2, // velocity X
          vY: (Math.random() - 0.5) * 0.2 + 0.1, // velocity Y (slight downward drift)
          vA: (Math.random() - 0.5) * 0.01, // rotational velocity
          opacity: Math.random() * 0.08 + 0.04 // opacity: 0.04 - 0.12
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colour;

      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.globalAlpha = p.opacity;
        // Draw slightly irregular rectangle to mimic fibre
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        if (!paused) {
          p.x += p.vX;
          p.y += p.vY;
          p.a += p.vA;

          // Wrap around screen
          if (p.x < -p.w) p.x = canvas.width + p.w;
          if (p.x > canvas.width + p.w) p.x = -p.w;
          if (p.y < -p.h) p.y = canvas.height + p.h;
          if (p.y > canvas.height + p.h) p.y = -p.h;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colour, density, paused]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      aria-hidden="true" 
    />
  );
}
