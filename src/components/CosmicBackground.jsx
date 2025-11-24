import React from 'react';
import { motion } from 'framer-motion';

export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Cosmic Nebula Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0820] via-[#1A0F35] via-[#2D1B5E] to-[#0F0820]" />
      
      {/* Nebula Clouds */}
      <motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(138,75,255,0.6) 0%, rgba(94,0,255,0.4) 30%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(107,140,255,0.5) 0%, rgba(79,70,229,0.3) 30%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -60, 0],
          y: [0, 40, 0],
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(184,153,255,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Starfield */}
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() > 0.8 ? '3px' : Math.random() > 0.5 ? '2px' : '1px',
            height: Math.random() > 0.8 ? '3px' : Math.random() > 0.5 ? '2px' : '1px',
            background: `radial-gradient(circle, rgba(230,212,255,${0.6 + Math.random() * 0.4}), transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating Dust Motes */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`mote-${i}`}
          className="absolute rounded-full"
          style={{
            width: '4px',
            height: '4px',
            background: 'radial-gradient(circle, rgba(169,116,255,0.7), transparent)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Subtle Light Beams */}
      <motion.div
        className="absolute top-0 left-1/4 w-1 h-full opacity-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(169,116,255,0.4), transparent)',
        }}
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scaleX: [1, 1.5, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-0 right-1/3 w-1 h-full opacity-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(107,140,255,0.3), transparent)',
        }}
        animate={{
          opacity: [0.05, 0.12, 0.05],
          scaleX: [1, 1.3, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}