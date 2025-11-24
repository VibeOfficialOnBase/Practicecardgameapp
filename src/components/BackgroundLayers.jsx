import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundLayers() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3] via-[#F5E6D3] to-[#E8D5C4]" />
      
      {/* Subtle paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Organic blob shapes - top right */}
      <motion.div 
        className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4A574] rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Organic blob shapes - bottom left */}
      <motion.div 
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#8B7355] rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 hidden md:block">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4A574] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}