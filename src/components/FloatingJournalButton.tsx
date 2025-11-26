import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JournalModal from '@/components/JournalModal';
import type { PracticeCard } from '@/data/cards';

interface FloatingJournalButtonProps {
  card: PracticeCard | null;
  username: string;
  streakDay: number;
  onJournalSave?: (wordCount: number) => void;
}

export function FloatingJournalButton({ card, username, streakDay, onJournalSave }: FloatingJournalButtonProps) {
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);

  // Only show if card is pulled
  if (!card) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={() => setIsJournalOpen(true)}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl border-2 border-white/20 hover:scale-110 transition-transform duration-200"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </motion.div>
          </Button>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </AnimatePresence>

      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        card={card}
        userId={username}
        streakDay={streakDay}
        onSave={(wordCount) => {
          if (onJournalSave) {
            onJournalSave(wordCount);
          }
        }}
      />
    </>
  );
}
