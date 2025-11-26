import { useRef, useState } from 'react';

import type { PracticeCard } from '@/data/cards';
import { toPng } from 'html-to-image';
import { Download, Twitter, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardImageGeneratorProps {
  card: PracticeCard;
  username: string;
}

export function CardImageGenerator({ card, username }: CardImageGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      setGenerating(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000',
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error generating card image:', error);
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const blob = await generateCardImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PRACTICE-card-${card.id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyImage = async () => {
    const blob = await generateCardImage();
    if (!blob) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying image:', error);
      alert('Could not copy image. Try downloading instead!');
    }
  };

  const handleShareToX = async () => {
    // For X/Twitter, we'll use text share with a link
    // Note: X doesn't support direct image upload from web clipboard
    const shareText = `Today's PRACTICE Card ✨\n\n"${card.affirmation}"\n\nMission: ${card.mission}\n\n#PRACTICE #VibeOfficial #SelfImprovement`;
    const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const encodedText = encodeURIComponent(shareText);
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${appUrl}`,
      '_blank',
      'width=600,height=600'
    );
  };

  return (
    <div className="space-y-4">
      {/* Hidden card for image generation */}
      <div className="fixed -left-[9999px]">
        <div
          ref={cardRef}
          style={{ width: '600px', height: '900px' }}
          className="relative bg-black"
        >
          {/* Card Background */}
          <div className="relative w-full h-full">
            <img
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3c7aff8f-230d-47f2-bcf1-e867252a5833-XsinrK6LfchksIA9GYIBPFTSm2RHNO"
              alt="PRACTICE Card"
             
              className="object-cover"
            />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-16 space-y-12">
              {/* Affirmation */}
              <div className="space-y-3">
                <h3 className="text-white/90 text-sm uppercase tracking-wider font-bold drop-shadow-lg">
                  Affirmation
                </h3>
                <p className="text-white text-3xl font-bold leading-relaxed drop-shadow-lg">
                  {card.affirmation}
                </p>
              </div>

              {/* Mission */}
              <div className="space-y-3">
                <h3 className="text-white/90 text-sm uppercase tracking-wider font-bold drop-shadow-lg">
                  Today's Mission
                </h3>
                <p className="text-white text-2xl leading-relaxed drop-shadow-lg font-semibold">
                  {card.mission}
                </p>
              </div>

              {/* Inspiration */}
              <div className="space-y-3">
                <h3 className="text-white/90 text-sm uppercase tracking-wider font-bold drop-shadow-lg">
                  Inspiration
                </h3>
                <p className="text-white/95 text-xl italic leading-relaxed drop-shadow-lg font-medium">
                  "{card.inspiration}"
                </p>
              </div>
            </div>

            {/* VibeOfficial Logo - Bottom Center */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-center">
              <img
                src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
                alt="VibeOfficial"
                width={60}
                height={60}
                className="rounded-full border-2 border-purple-300/50 shadow-lg"
              />
            </div>

            {/* Branding Footer */}
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex flex-col items-center gap-1">
                <span className="text-white font-bold text-base" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>PRACTICE</span>
                <p className="text-white/60 text-xs">
                  Daily inspiration • Token gated on Base
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={handleDownload}
          disabled={generating}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700 text-white font-semibold py-4 sm:py-6 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="relative flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            <span>{generating ? 'Generating...' : 'Download'}</span>
          </div>
        </Button>

        <Button
          onClick={handleShareToX}
          disabled={generating}
          className="group relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-800 hover:from-black hover:via-gray-900 hover:to-black text-white font-semibold py-4 sm:py-6 shadow-lg hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="relative flex items-center justify-center gap-2">
            <Twitter className="w-5 h-5" />
            <span>Share on X</span>
          </div>
        </Button>

        <Button
          onClick={handleCopyImage}
          disabled={generating}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-white font-semibold py-4 sm:py-6 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="relative flex items-center justify-center gap-2">
            {copySuccess ? (
              <>
                <span className="text-green-300">✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Image</span>
              </>
            )}
          </div>
        </Button>
      </div>

      <p className="text-center text-white/60 text-xs">
        ✨ Share your magical card and inspire others ✨
      </p>
    </div>
  );
}
