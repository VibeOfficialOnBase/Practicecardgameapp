import React, { useEffect, useRef } from 'react';

export default function MagicalParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Orb {
      constructor() {
        this.reset();
        // Start at random y to fill screen initially
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50; // Start below screen
        this.size = Math.random() * 4 + 4; // 4px to 8px
        this.speedY = Math.random() * 0.5 + 0.1;
        this.drift = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.2 + 0.1; // 0.1 to 0.3
        this.color = Math.random() > 0.5 ? '168, 85, 247' : '236, 72, 153'; // Purple or Pink
      }

      update() {
        this.y -= this.speedY;
        this.x += this.drift;

        // Respawn if off top
        if (this.y < -50) {
          this.reset();
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 20; i++) {
        particles.push(new Orb());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Apply blur filter
      ctx.filter = 'blur(2px)';
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      ctx.filter = 'none';
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
