import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Check } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialCardImageGeneratorProps {
  card: PracticeCard;
  username: string;
  streak: number;
}

export function SocialCardImageGenerator({ card, username, streak }: SocialCardImageGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateImage = async () => {
    setGenerating(true);
    
    try {
      // Create a temporary div for the card design
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
          position: relative;
          overflow: hidden;
        ">
          <!-- Decorative background elements -->
          <div style="
            position: absolute;
            top: -100px;
            right: -100px;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
          "></div>
          <div style="
            position: absolute;
            bottom: -150px;
            left: -150px;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
          "></div>
          
          <!-- Main content -->
          <div style="
            background: rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            padding: 50px 60px;
            max-width: 1000px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            text-align: center;
            position: relative;
            z-index: 1;
          ">
            <!-- Affirmation -->
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
            
            <!-- Mission -->
            <div style="
              font-size: 28px;
              color: #4b5563;
              margin-bottom: 40px;
              line-height: 1.5;
              padding: 0 20px;
            ">
              ${card.mission}
            </div>
            
            <!-- Footer -->
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
                    display: flex;
                    align-items: center;
                    gap: 8px;
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
          
          <!-- VibeOfficial Logo - Bottom Center -->
          <div style="
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
          ">
            <img
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
              alt="VibeOfficial"
              style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              "
            />
          </div>
        </div>
      `;
      
      document.body.appendChild(element);
      
      // Wait for image to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate image
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });
      
      document.body.removeChild(element);
      
      setImageUrl(dataUrl);
      setGenerated(true);
      
      // Download automatically
      const link = document.createElement('a');
      link.download = `practice-card-${card.id}.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const shareToTwitter = () => {
    const text = `${card.affirmation}\n\n${card.mission}\n\n#PRACTICE ${streak > 0 ? `🔥 ${streak}-day streak!` : ''}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://practice.xyz`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={generateImage}
          disabled={generating}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating...
            </>
          ) : generated ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Generated!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Card Image
            </>
          )}
        </Button>
        
        <Button
          onClick={shareToTwitter}
          variant="outline"
          className="flex-1 border-2 border-blue-400 text-blue-600 hover:bg-blue-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share to X
        </Button>
      </div>
      
      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center"
          >
            <p className="text-green-800 font-semibold text-sm">
              ✅ Image downloaded! Share it on social media to spread the PRACTICE magic!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
