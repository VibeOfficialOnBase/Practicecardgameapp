import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export function MagicalParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 50 magical particles with different colors
    const colors = [
      'rgba(147, 51, 234, 0.6)',   // purple
      'rgba(168, 85, 247, 0.6)',   // light purple
      'rgba(236, 72, 153, 0.6)',   // pink
      'rgba(250, 204, 21, 0.6)',   // yellow
      'rgba(255, 255, 255, 0.8)',  // white
    ];

    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 3,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes particle-float {
            0% {
              transform: translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(0, -20px) scale(1);
            }
            90% {
              opacity: 1;
              transform: translate(0, -80px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(0, -100px) scale(0);
            }
          }
          
          @keyframes particle-glow {
            0%, 100% {
              filter: brightness(1);
            }
            50% {
              filter: brightness(1.5);
            }
          }

          .magical-particle {
            position: absolute;
            pointer-events: none;
            border-radius: 50%;
            animation: particle-float var(--duration) ease-in-out infinite,
                       particle-glow 2s ease-in-out infinite;
            animation-delay: var(--delay);
            background: var(--color);
            box-shadow: 0 0 10px var(--color), 0 0 20px var(--color);
          }
        `
      }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="magical-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              '--delay': `${particle.delay}s`,
              '--duration': `${particle.duration}s`,
              '--color': particle.color,
            } as React.CSSProperties & { '--delay': string; '--duration': string; '--color': string }}
          />
        ))}
      </div>
    </>
  );
}
