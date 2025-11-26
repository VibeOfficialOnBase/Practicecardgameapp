import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Image as ImageIcon, Download, MessageCircle } from 'lucide-react';
import type { PracticeCard } from '@/data/cards';
import { CardImageGenerator } from './CardImageGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import { generateCardImage } from '@/utils/cardImageGenerator';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  card: PracticeCard;
  username: string;
  streak?: number;
}

export function ShareModal({ open, onClose, card, username, streak = 0 }: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const streakText = streak > 0 ? `\n\n🔥 ${streak} Day Streak!` : '';
  const shareText = `Today's PRACTICE Card ✨\n\n"${card.affirmation}"\n\nMission: ${card.mission}${streakText}\n\n#PRACTICE #VibeOfficial #SelfImprovement`;
  
  const encodedText = encodeURIComponent(shareText);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const shareLinks = {
    farcaster: `https://warpcast.com/~/compose?text=${encodedText}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${appUrl}`,
    zora: `https://zora.co/vibeofficial`,
    reddit: `https://reddit.com/submit?url=${appUrl}&title=${encodeURIComponent(`Today's PRACTICE Card ✨`)}`,
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'width=600,height=600');
      
      // Record share for tracking
      if (typeof window !== 'undefined') {
        try {
          const { recordShare } = require('@/utils/shareTracking');
          recordShare(username, card.id, platform);
          
          // Award XP for sharing
          const { awardXP, XP_REWARDS } = require('@/utils/xpTracking');
          awardXP(username, XP_REWARDS.SHARE_CARD, `Shared card #${card.id} on ${platform}`);
        } catch (error) {
          console.error('Error recording share:', error);
        }
      }
    }
  };

  const handleFarcasterShare = async () => {
    setIsSharing(true);
    try {
      if (typeof window === 'undefined') return;
      
      // Try to use native Web Share API first (works better in mobile/iframe contexts)
      if (navigator.share) {
        await navigator.share({
          title: 'PRACTICE Card',
          text: shareText,
          url: appUrl,
        });
        
        // Record share for tracking
        const { recordShare } = require('@/utils/shareTracking');
        recordShare(username, card.id, 'farcaster_native');
        
        // Award XP for sharing
        const { awardXP, XP_REWARDS } = require('@/utils/xpTracking');
        awardXP(username, XP_REWARDS.SHARE_CARD, `Shared card #${card.id} on Farcaster`);
        
        toast.success('Shared to Farcaster! ✨');
      } else {
        // Fallback to opening compose URL
        handleShare('farcaster');
      }
    } catch (error) {
      console.error('Farcaster share error:', error);
      // If user cancels or error occurs, fallback to web share
      if (error instanceof Error && error.name !== 'AbortError') {
        handleShare('farcaster');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-indigo-950 to-purple-900 border-white/20 text-white max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            ✨ Share Your PRACTICE ✨
          </DialogTitle>
          <DialogDescription className="text-indigo-200 text-sm">
            Share your magical daily card with the world
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-4">
            <TabsTrigger value="image" className="data-[state=active]:bg-white/20">
              <imgIcon className="w-4 h-4 mr-2" />
              Card Image
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-white/20">
              <Twitter className="w-4 h-4 mr-2" />
              Text Share
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <p className="text-indigo-200 text-sm text-center">
              Share your card as a beautiful image on social media
            </p>
            
            {/* Image Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={async () => {
                  setIsGeneratingImage(true);
                  try {
                    const blob = await generateCardImage({
                      card: {
                        id: card.id,
                        affirmation: card.affirmation,
                        mission: card.mission,
                        inspiration: card.inspiration,
                        rarity: card.rarity,
                      },
                      username,
                      streakDay: streak,
                      platform: 'whatsapp',
                    });
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'practice-card-whatsapp.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    // Open WhatsApp with text
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' [Image downloaded - attach from your photos]')}`;
                    window.open(whatsappUrl, '_blank');
                    
                    toast.success('Downloaded! Attach to WhatsApp message');
                  } catch (error) {
                    console.error('Error generating image:', error);
                    toast.error('Failed to generate image');
                  } finally {
                    setIsGeneratingImage(false);
                  }
                }}
                disabled={isGeneratingImage}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {isGeneratingImage ? 'Generating...' : 'WhatsApp'}
              </Button>

              <Button
                onClick={async () => {
                  setIsGeneratingImage(true);
                  try {
                    const blob = await generateCardImage({
                      card: {
                        id: card.id,
                        affirmation: card.affirmation,
                        mission: card.mission,
                        inspiration: card.inspiration,
                        rarity: card.rarity,
                      },
                      username,
                      streakDay: streak,
                      platform: 'download',
                    });
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'practice-card.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    toast.success('Card image downloaded! ✨');
                  } catch (error) {
                    console.error('Error generating image:', error);
                    toast.error('Failed to generate image');
                  } finally {
                    setIsGeneratingImage(false);
                  }
                }}
                disabled={isGeneratingImage}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4"
              >
                <Download className="w-5 h-5 mr-2" />
                {isGeneratingImage ? 'Generating...' : 'Download Card Image'}
              </Button>
            </div>

            <div className="text-center text-xs text-white/60 mt-2">
              Images are optimized for each platform
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            {/* Text Preview */}
            <div className="bg-white/10 p-4 rounded-lg border border-white/20">
              <p className="text-sm text-white/90 whitespace-pre-line">
                {shareText}
              </p>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => handleShare('reddit')}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:via-orange-600 hover:to-red-700 text-white font-semibold py-6 shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                  <span>Reddit</span>
                </div>
              </Button>
              
              <Button
                onClick={handleFarcasterShare}
                disabled={isSharing}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold py-6 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{isSharing ? 'Sharing...' : 'Share to Farcaster'}</span>
                </div>
              </Button>
              
              <Button
                onClick={() => handleShare('x')}
                className="group relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-800 hover:from-black hover:via-gray-900 hover:to-black text-white font-semibold py-6 shadow-lg hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Twitter className="w-5 h-5" />
                  <span>X</span>
                </div>
              </Button>
              
              <Button
                onClick={() => handleShare('zora')}
                className="group relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:from-pink-600 hover:via-purple-600 hover:to-purple-700 text-white font-semibold py-6 shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span>Zora</span>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
