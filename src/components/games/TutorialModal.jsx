import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TutorialModal({ isOpen, onClose, title, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95 border-purple-500/50 shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold text-white" style={{ textShadow: '0 0 30px rgba(138,75,255,0.8)' }}>
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-white/90"
          >
            {children}
          </motion.div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #5E00FF 0%, #8A4BFF 50%, #B366FF 100%)',
              boxShadow: '0 0 20px rgba(138,75,255,0.5)',
            }}
          >
            Got it!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}