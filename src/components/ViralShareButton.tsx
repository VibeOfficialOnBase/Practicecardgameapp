import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, Check, Twitter, MessageCircle } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';

interface ViralShareButtonProps {
  card: PracticeCard;
  username: string;
  streak: number;
}

export function ViralShareButton({ card, username, streak }: ViralShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Today's PRACTICE card 🌟\n\n"${card.affirmation}"\n\n${card.mission}\n\n${streak > 0 ? `🔥 ${streak}-day streak!` : ''}\n\nGet yours at practice.xyz`;

  const generateAndDownloadImage = async () => {
    setGenerating(true);
    
    try {
      const element = document.createElement('div');
      element.style.width = '1080px';
      element.style.height = '1080px';
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
          padding: 80px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        ">
          <!-- Decorative orbs -->
          <div style="position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -300px; left: -300px; width: 800px; height: 800px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
          
          <!-- Main card -->
          <div style="
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%);
            border-radius: 32px;
            padding: 60px;
            max-width: 900px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3), 0 0 100px rgba(168,85,247,0.3);
            text-align: center;
            position: relative;
            z-index: 1;
            border: 4px solid rgba(255,255,255,0.5);
          ">
            <!-- Sparkle decorations -->
            <div style="position: absolute; top: 20px; right: 20px; font-size: 40px;">✨</div>
            <div style="position: absolute; top: 20px; left: 20px; font-size: 40px;">🌟</div>
            <div style="position: absolute; bottom: 20px; right: 20px; font-size: 40px;">💫</div>
            <div style="position: absolute; bottom: 20px; left: 20px; font-size: 40px;">⭐</div>
            
            <!-- Affirmation -->
            <div style="
              font-size: 64px;
              font-weight: 900;
              color: #1f2937;
              margin-bottom: 40px;
              line-height: 1.2;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
              "${card.affirmation}"
            </div>
            
            <!-- Mission -->
            <div style="
              font-size: 32px;
              color: #4b5563;
              margin-bottom: 50px;
              line-height: 1.5;
              font-weight: 600;
            ">
              ${card.mission}
            </div>
            
            <!-- Streak badge -->
            ${streak > 0 ? `
              <div style="
                display: inline-flex;
                align-items: center;
                gap: 12px;
                background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
                color: white;
                padding: 16px 32px;
                border-radius: 50px;
                font-size: 28px;
                font-weight: 800;
                box-shadow: 0 8px 16px rgba(239,68,68,0.3);
                margin-bottom: 40px;
              ">
                🔥 ${streak} Day Streak
              </div>
            ` : ''}
            
            <!-- Footer -->
            <div style="
              padding-top: 40px;
              border-top: 3px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <div style="
                font-size: 36px;
                font-weight: 900;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">
                PRACTICE
              </div>
              <div style="
                font-size: 24px;
                color: #9ca3af;
                font-weight: 700;
              ">
                ${username}
              </div>
            </div>
          </div>
          
          <!-- Bottom CTA -->
          <div style="
            margin-top: 50px;
            font-size: 32px;
            color: white;
            font-weight: 800;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            z-index: 1;
            position: relative;
          ">
            ✨ Get yours at practice.xyz ✨
          </div>
        </div>
      `;
      
      document.body.appendChild(element);
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: 'transparent',
      });
      
      document.body.removeChild(element);
      
      // Download
      const link = document.createElement('a');
      link.download = `practice-day-${streak || 'today'}.png`;
      link.href = dataUrl;
      link.click();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34D399', '#60A5FA', '#A78BFA'],
      });
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=PRACTICE,SelfImprovement,DailyAffirmations`;
    window.open(url, '_blank', 'width=550,height=420');
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1DA1F2'],
    });
  };

  const shareToFarcaster = () => {
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=600');
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8A63D2'],
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#34D399'],
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowShareMenu(!showShareMenu)}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold shadow-lg"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Share Your Magic ✨
      </Button>

      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 right-0 mb-3 z-50"
          >
            <Card className="p-4 bg-white/95 backdrop-blur-xl border-2 border-purple-400/30 shadow-2xl">
              <div className="space-y-2">
                {/* Download Image */}
                <Button
                  onClick={generateAndDownloadImage}
                  disabled={generating}
                  variant="outline"
                  className="w-full justify-start border-2 hover:border-purple-400 hover:bg-purple-50"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-3" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-3" />
                      <span>Download as Image</span>
                    </>
                  )}
                </Button>

                {/* Share to X (Twitter) */}
                <Button
                  onClick={shareToTwitter}
                  variant="outline"
                  className="w-full justify-start border-2 hover:border-blue-400 hover:bg-blue-50"
                >
                  <Twitter className="w-4 h-4 mr-3 text-blue-500" />
                  <span>Share to X/Twitter</span>
                </Button>

                {/* Share to Farcaster */}
                <Button
                  onClick={shareToFarcaster}
                  variant="outline"
                  className="w-full justify-start border-2 hover:border-purple-400 hover:bg-purple-50"
                >
                  <MessageCircle className="w-4 h-4 mr-3 text-purple-500" />
                  <span>Share to Farcaster</span>
                </Button>

                {/* Copy Text */}
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className={`w-full justify-start border-2 transition-all ${
                    copied 
                      ? 'border-green-400 bg-green-50' 
                      : 'hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-3 text-green-600" />
                      <span className="text-green-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Close hint */}
              <p className="text-xs text-center text-gray-500 mt-3">
                Click outside to close
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
