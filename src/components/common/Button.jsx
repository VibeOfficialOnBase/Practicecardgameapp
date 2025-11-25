import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled,
  icon: Icon
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    icon: 'p-3 rounded-full bg-[var(--bg-secondary)] hover:bg-black/5 active:scale-90 transition-all shadow-sm'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cn(variants[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}
