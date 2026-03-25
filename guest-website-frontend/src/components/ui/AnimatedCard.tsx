// ─────────────────────────────────────────────────────────
// Animated Card Component
// ─────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'motion/react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export function AnimatedCard({ children, className = '', delay = 0, onClick }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.12)',
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        transition-colors duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
