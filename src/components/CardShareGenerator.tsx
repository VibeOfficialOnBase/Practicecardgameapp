import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Share2, Twitter } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import html2canvas from 'html-to-image';


interface CardShareGeneratorProps {
  card: PracticeCard;
  streak: number;
  username: string;
}

export function CardShareGenerator({ card, streak, username }: CardShareGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return null;

    setIsGenerating(true);
    try {
      const dataUrl = await html2canvas.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
      return dataUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `practice-card-${card.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShareTwitter = async () => {
    const text = `${card.affirmation}\n\nDay ${streak} of my PRACTICE journey! 🌟\n\n`;
    const url = window.location.origin;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShare = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'practice-card.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'PRACTICE Card',
          text: `${card.affirmation}\n\nDay ${streak} of my PRACTICE journey!`,
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Share cancelled or failed:', error);
        }
      }
    } else {
      // Fallback to download
      handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      {/* Share Card Preview (hidden from view but rendered for capture) */}
      <div className="relative overflow-hidden">
        <div
          ref={cardRef}
          className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 rounded-2xl p-8 relative"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-white text-4xl font-bold mb-2 font-practice">PRACTICE</h1>
              <p className="text-purple-200 text-sm">Day {streak} Streak 🔥</p>
            </div>

            {/* Card content */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-purple-300 text-xs uppercase tracking-wider">Affirmation</p>
                <p className="text-white text-xl font-bold leading-relaxed">
                  {card.affirmation}
                </p>
              </div>

              <div className="text-center space-y-2">
                <p className="text-purple-300 text-xs uppercase tracking-wider">Mission</p>
                <p className="text-white/90 text-base leading-relaxed">
                  {card.mission}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-2">
              <p className="text-purple-300 text-sm">@{username}</p>
              <p className="text-purple-400/60 text-xs">Powered by $VibeOfficial on Base</p>
            </div>
          </div>

          {/* VibeOfficial Logo - Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div 
              style={{ 
                borderRadius: '50%', 
                overflow: 'hidden',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(216, 180, 254, 0.5)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              }}
            >
              <img
                src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                alt="VibeOfficial"
                width={50}
                height={50}
                style={{ borderRadius: '50%', display: 'block' }}
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Share Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          variant="outline"
          className="glass-card border-2 text-white hover:glass-card-hover"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? 'Wait...' : 'Save'}
        </Button>
        <Button
          onClick={handleShareTwitter}
          disabled={isGenerating}
          variant="outline"
          className="glass-card border-2 text-white hover:glass-card-hover bg-blue-500/10"
        >
          <Twitter className="w-4 h-4 mr-2" />
          X
        </Button>
        <Button
          onClick={handleShare}
          disabled={isGenerating}
          variant="gradient"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
