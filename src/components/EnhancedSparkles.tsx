import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: 'star' | 'circle' | 'diamond';
}

export function EnhancedSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const types: Array<'star' | 'circle' | 'diamond'> = ['star', 'circle', 'diamond'];
    const newSparkles: Sparkle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 3,
      type: types[Math.floor(Math.random() * types.length)],
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes sparkle-twinkle-enhanced {
            0%, 100% {
              opacity: 0;
              transform: scale(0) rotate(0deg);
            }
            10% {
              opacity: 1;
              transform: scale(1) rotate(180deg);
            }
            90% {
              opacity: 1;
              transform: scale(1) rotate(360deg);
            }
          }
          
          @keyframes sparkle-color-shift {
            0%, 100% {
              filter: hue-rotate(0deg);
            }
            50% {
              filter: hue-rotate(60deg);
            }
          }

          .enhanced-sparkle {
            position: absolute;
            pointer-events: none;
            animation: sparkle-twinkle-enhanced var(--duration) ease-in-out infinite,
                       sparkle-color-shift 5s ease-in-out infinite;
            animation-delay: var(--delay);
          }

          .enhanced-sparkle.star::before,
          .enhanced-sparkle.star::after {
            content: '★';
            position: absolute;
            font-size: var(--size);
            color: #fff;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.8),
                         0 0 20px rgba(236, 72, 153, 0.6);
          }

          .enhanced-sparkle.circle::before {
            content: '';
            position: absolute;
            width: var(--size);
            height: var(--size);
            background: radial-gradient(circle, rgba(250, 204, 21, 0.8), rgba(236, 72, 153, 0.4));
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(250, 204, 21, 0.8);
          }

          .enhanced-sparkle.diamond::before {
            content: '◆';
            position: absolute;
            font-size: var(--size);
            color: #fff;
            text-shadow: 0 0 10px rgba(147, 51, 234, 0.8),
                         0 0 20px rgba(168, 85, 247, 0.6);
          }
        `
      }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className={`enhanced-sparkle ${sparkle.type}`}
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
