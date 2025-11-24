import React from 'react';

export default function Section({ 
  children, 
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-transparent',
    warm: 'bg-gradient-to-br from-[#D4A574]/20 to-transparent',
    cool: 'bg-gradient-to-br from-[#A8B5A0]/20 to-transparent',
    elevated: 'bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#D4A574]/10',
  };
  
  return (
    <section className={`p-6 ${variants[variant]} ${className}`}>
      {children}
    </section>
  );
}