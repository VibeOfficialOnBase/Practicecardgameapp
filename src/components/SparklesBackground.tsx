import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function SparklesBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate 30 sparkles with random positions and timings
    const newSparkles: Sparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes sparkle-float {
            0%, 100% {
              opacity: 0;
              transform: translateY(0) scale(0);
            }
            10% {
              opacity: 1;
              transform: translateY(-10px) scale(1);
            }
            90% {
              opacity: 1;
              transform: translateY(-30px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-40px) scale(0);
            }
          }
          
          @keyframes sparkle-twinkle {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }

          .sparkle {
            position: absolute;
            pointer-events: none;
            animation: sparkle-float var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
          }

          .sparkle::before,
          .sparkle::after {
            content: '';
            position: absolute;
            background: white;
            animation: sparkle-twinkle 1.5s ease-in-out infinite;
          }

          .sparkle::before {
            width: var(--size);
            height: calc(var(--size) / 4);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8),
                        0 0 12px rgba(147, 51, 234, 0.6),
                        0 0 16px rgba(168, 85, 247, 0.4);
          }

          .sparkle::after {
            width: calc(var(--size) / 4);
            height: var(--size);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8),
                        0 0 12px rgba(147, 51, 234, 0.6),
                        0 0 16px rgba(168, 85, 247, 0.4);
          }
        `
      }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              '--size': `${sparkle.size}px`,
              '--delay': `${sparkle.delay}s`,
              '--duration': `${sparkle.duration}s`,
            } as React.CSSProperties & { '--size': string; '--delay': string; '--duration': string }}
          />
        ))}
      </div>
    </>
  );
}
