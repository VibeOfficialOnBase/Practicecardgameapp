import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingLightParticlesProps {
  count?: number;
  show: boolean;
}

export function FloatingLightParticles({ count = 8, show }: FloatingLightParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [show, count]);

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(168, 85, 247, 0.6) 50%, rgba(236, 72, 153, 0) 100%)`,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(168, 85, 247, 0.6)',
              }}
              initial={{ 
                opacity: 0, 
                scale: 0,
                y: 0 
              }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                y: [0, -100, -200],
              }}
              exit={{ 
                opacity: 0,
                scale: 0 
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
