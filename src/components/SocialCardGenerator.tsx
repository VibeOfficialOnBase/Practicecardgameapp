import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download, Share2, Check } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialCardGeneratorProps {
  card: PracticeCard;
  username: string;
  streak: number;
}

export function SocialCardGenerator({ card, username, streak }: SocialCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        width: 1200,
        height: 630,
      });

      // Convert data URL to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      
      setGenerated(true);
      setTimeout(() => setGenerated(false), 2000);
      
      return blob;
    } catch (error) {
      console.error('Failed to generate image:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `practice-card-${card.id}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const file = new File([blob], `practice-card-${card.id}.png`, { type: 'image/png' });
    const text = `Day ${streak} of my PRACTICE journey 🌟\n\n"${card.affirmation}"\n\nJoin me: practice.xyz`;

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          text,
          files: [file],
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy text to clipboard
      await navigator.clipboard.writeText(text);
      alert('Text copied! Share manually with the downloaded image.');
      await handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden card for image generation */}
      <div className="fixed -left-[9999px] top-0 w-[1200px] h-[630px]">
        <div
          ref={cardRef}
          className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-12 flex flex-col justify-center items-center relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-8 max-w-4xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl">✨</div>
              <h1 className="text-7xl font-bold text-white font-practice">
                PRACTICE
              </h1>
            </div>

            {/* Affirmation */}
            <div className="space-y-3">
              <p className="text-white/80 text-2xl uppercase tracking-wider font-bold">
                Daily Affirmation
              </p>
              <p className="text-white text-5xl font-bold leading-tight">
                {card.affirmation}
              </p>
            </div>

            {/* Streak Badge */}
            {streak > 0 && (
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full">
                <span className="text-4xl">🔥</span>
                <span className="text-white font-bold text-3xl">{streak} Day Streak!</span>
              </div>
            )}

            {/* Footer */}
            <div className="space-y-2">
              <p className="text-white/60 text-xl">
                By @{username} • practice.xyz
              </p>
              <p className="text-white/40 text-lg italic">
                "{card.inspiration}"
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-12 right-12 text-6xl opacity-30">💫</div>
          <div className="absolute bottom-12 left-12 text-6xl opacity-30">🌟</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          variant="outline"
          className="flex-1 glass-card border-2 text-white hover:glass-card-hover"
        >
          <AnimatePresence mode="wait">
            {generated ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </motion.div>
            ) : (
              <motion.div
                key="download"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Download'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button
          onClick={handleShare}
          disabled={isGenerating}
          variant="gradient"
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Share Card'}
        </Button>
      </div>
    </div>
  );
}
