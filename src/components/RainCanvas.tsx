import React, { useEffect, useRef } from 'react';

export const RainCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Raindrop particles
    interface Drop {
      x: number;
      y: number;
      speed: number;
      length: number;
      alpha: number;
    }

    const dropCount = 90;
    const drops: Drop[] = [];
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 12 + Math.random() * 15,
        length: 15 + Math.random() * 25,
        alpha: 0.15 + Math.random() * 0.25,
      });
    }

    // Bokeh neon lights in out-of-focus background
    interface Bokeh {
      x: number;
      y: number;
      radius: number;
      color: string;
      alpha: number;
      pulse: number;
    }

    const bokehs: Bokeh[] = [
      { x: width * 0.12, y: height * 0.22, radius: 45, color: '#ff2a6d', alpha: 0.2, pulse: 0 },
      { x: width * 0.25, y: height * 0.35, radius: 35, color: '#05d9e8', alpha: 0.18, pulse: 1 },
      { x: width * 0.78, y: height * 0.25, radius: 50, color: '#ffc600', alpha: 0.15, pulse: 2 },
      { x: width * 0.88, y: height * 0.38, radius: 40, color: '#00f0ff', alpha: 0.22, pulse: 3 },
      { x: width * 0.5, y: height * 0.15, radius: 60, color: '#9d4edd', alpha: 0.12, pulse: 4 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle out-of-focus bokeh lights
      bokehs.forEach((b) => {
        b.pulse += 0.02;
        const currentRadius = b.radius + Math.sin(b.pulse) * 4;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentRadius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'transparent');
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw rain streaks
      ctx.strokeStyle = 'rgba(160, 220, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      drops.forEach((d) => {
        ctx.beginPath();
        ctx.globalAlpha = d.alpha;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 1;
        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};
