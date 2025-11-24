import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Link, Check } from 'lucide-react';

export default function ShareCard({ card }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `I just pulled "${card.title}" from PRACTICE - ${card.affirmation}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-6"
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full btn-primary flex items-center justify-center gap-2"
        variant="outline"
      >
        <Share2 className="w-5 h-5" />
        Share Your Practice
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 card-organic p-6 space-y-4"
        >
          <p className="text-sm text-slate-300 text-center font-medium">
            Share your practice journey with others
          </p>

          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Twitter className="w-6 h-6" />
              <span className="text-xs font-semibold">Twitter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-xs font-semibold">Facebook</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {copied ? <Check className="w-6 h-6" /> : <Link className="w-6 h-6" />}
              <span className="text-xs font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}