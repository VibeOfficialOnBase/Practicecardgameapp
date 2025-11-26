import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Copy, Check, Download } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import { toPng } from 'html-to-image';

interface QuickShareButtonProps {
  card: PracticeCard;
  username: string;
  streak: number;
}

export function QuickShareButton({ card, username, streak }: QuickShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const shareText = `${card.affirmation}\n\n${card.mission}\n\n#PRACTICE ${streak > 0 ? `🔥 ${streak}-day streak!` : ''}`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://practice.xyz`;
    window.open(url, '_blank');
    setShowOptions(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleGenerateImage = async () => {
    setGenerating(true);
    
    try {
      // Create temporary element for image
      const element = document.createElement('div');
      element.style.width = '1200px';
      element.style.height = '630px';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      
      element.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            padding: 50px 60px;
            max-width: 1000px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            text-align: center;
          ">
            <div style="
              font-size: 48px;
              font-weight: 800;
              color: #1f2937;
              margin-bottom: 30px;
              line-height: 1.3;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            ">
              ${card.affirmation}
            </div>
            
            <div style="
              font-size: 28px;
              color: #4b5563;
              margin-bottom: 40px;
              line-height: 1.5;
            ">
              ${card.mission}
            </div>
            
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 30px;
              border-top: 2px solid #e5e7eb;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 15px;
              ">
                <div style="
                  font-size: 24px;
                  font-weight: 700;
                  color: #667eea;
                ">
                  PRACTICE
                </div>
                ${streak > 0 ? `
                  <div style="
                    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 18px;
                    font-weight: 700;
                  ">
                    🔥 ${streak} Day Streak
                  </div>
                ` : ''}
              </div>
              <div style="
                font-size: 18px;
                color: #9ca3af;
                font-weight: 600;
              ">
                ${username}
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(element);
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });
      
      document.body.removeChild(element);
      
      // Download automatically
      const link = document.createElement('a');
      link.download = `practice-card-${card.id}.png`;
      link.href = dataUrl;
      link.click();
      
      setShowOptions(false);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setShowOptions(!showOptions)}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Quick Share
        </Button>
      </motion.div>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-2xl border-2 border-purple-200 p-3 min-w-[220px] z-50"
          >
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleTwitterShare}
                variant="ghost"
                className="w-full justify-start hover:bg-blue-50 text-blue-600"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Share to X
              </Button>
              
              <Button
                onClick={handleCopy}
                variant="ghost"
                className="w-full justify-start hover:bg-green-50 text-green-600"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleGenerateImage}
                disabled={generating}
                variant="ghost"
                className="w-full justify-start hover:bg-purple-50 text-purple-600"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Share your PRACTICE journey!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
