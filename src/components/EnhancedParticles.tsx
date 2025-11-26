import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export function EnhancedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 50;
    const colors = ['#a78bfa', '#ec4899', '#fbbf24', '#8b5cf6', '#f472b6'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 150) * 0.2;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// Floating orbs component for extra visual flair
export function FloatingOrbs() {
  const orbs = [
    { size: 'w-64 h-64', color: 'bg-purple-500/20', position: 'top-1/4 left-1/4', delay: '0s' },
    { size: 'w-96 h-96', color: 'bg-pink-500/20', position: 'bottom-1/4 right-1/4', delay: '2s' },
    { size: 'w-80 h-80', color: 'bg-indigo-500/20', position: 'top-1/2 left-1/2', delay: '4s' },
    { size: 'w-72 h-72', color: 'bg-fuchsia-500/15', position: 'top-3/4 right-1/3', delay: '1s' },
    { size: 'w-56 h-56', color: 'bg-violet-500/15', position: 'bottom-1/3 left-1/3', delay: '3s' },
  ];

  return (
    <>
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} ${orb.color} rounded-full blur-3xl`}
          style={{
            top: orb.position.includes('top') ? orb.position.split(' ')[0].replace('top-', '') : 'auto',
            bottom: orb.position.includes('bottom') ? orb.position.split(' ')[0].replace('bottom-', '') : 'auto',
            left: orb.position.includes('left') ? orb.position.split(' ')[1].replace('left-', '') : 'auto',
            right: orb.position.includes('right') ? orb.position.split(' ')[1].replace('right-', '') : 'auto',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: parseFloat(orb.delay),
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
}
