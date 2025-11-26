import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'code';

export interface ToastProps {
  message: string;
  type?: ToastType;
  code?: string;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({ message, type = 'info', code, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'code':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-400/50';
      case 'error':
        return 'bg-red-500/20 border-red-400/50';
      case 'code':
        return 'bg-blue-500/20 border-blue-400/50';
      default:
        return 'bg-blue-500/20 border-blue-400/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md w-full mx-4 backdrop-blur-lg border-2 rounded-xl p-4 shadow-2xl ${getStyles()}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
          {code && (
            <div className="mt-3 bg-black/30 border border-white/20 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-1">Your verification code:</p>
              <p className="text-2xl font-mono font-bold text-white tracking-widest text-center">
                {code}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="sync">
      {children}
    </AnimatePresence>
  );
}
