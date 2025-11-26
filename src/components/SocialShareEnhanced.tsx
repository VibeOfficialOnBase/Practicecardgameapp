import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { PracticeCard } from '@/data/cardsWithRarity';

interface SocialShareEnhancedProps {
  card: PracticeCard;
  username: string;
  streak: number;
}

export function SocialShareEnhanced({ card, username, streak }: SocialShareEnhancedProps) {
  const [copied, setCopied] = useState(false);
  
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const ogImageUrl = `${appUrl}/api/og?cardId=${card.id}&affirmation=${encodeURIComponent(card.affirmation)}&username=${encodeURIComponent(username)}&streak=${streak}`;
  
  const shareText = `I just pulled my daily PRACTICE card! ✨\n\n"${card.affirmation}"\n\n🔥 ${streak} Day Streak!\n\nJoin me on the journey → ${appUrl}\n\n#PRACTICE #VibeOfficial #SelfImprovement #Base`;

  const handleCopyImage = async () => {
    try {
      setCopied(true);
      await navigator.clipboard.writeText(ogImageUrl);
      toast.success('Image URL copied! Paste it anywhere to share your card');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy image URL');
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My PRACTICE Card',
          text: shareText,
          url: appUrl,
        });
        
        // Track share
        if (typeof window !== 'undefined') {
          const { recordShare } = require('@/utils/shareTracking');
          recordShare(username, card.id, 'native_share');
          
          const { awardXP, XP_REWARDS } = require('@/utils/xpTracking');
          awardXP(username, XP_REWARDS.SHARE_CARD, `Shared card #${card.id}`);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  };

  const handleFarcasterFrameShare = () => {
    const frameUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out my PRACTICE card! 🌟`)}&embeds[]=${encodeURIComponent(appUrl)}`;
    window.open(frameUrl, '_blank');
    
    // Track share
    if (typeof window !== 'undefined') {
      const { recordShare } = require('@/utils/shareTracking');
      recordShare(username, card.id, 'farcaster_frame');
      
      const { awardXP, XP_REWARDS } = require('@/utils/xpTracking');
      awardXP(username, XP_REWARDS.SHARE_CARD, `Shared card #${card.id} as Farcaster frame`);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={handleCopyImage}
        variant="outline"
        size="sm"
        className="glass-card border-white/20 text-white hover:glass-card-hover"
      >
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? 'Copied!' : 'Copy Image'}
      </Button>
      
      {typeof window !== 'undefined' && 'share' in navigator && (
        <Button
          onClick={handleShareNative}
          variant="outline"
          size="sm"
          className="glass-card border-white/20 text-white hover:glass-card-hover"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      )}
      
      <Button
        onClick={handleFarcasterFrameShare}
        variant="outline"
        size="sm"
        className="bg-purple-600/20 border-purple-400/30 text-white hover:bg-purple-600/30"
      >
        🎭 Farcaster
      </Button>
    </div>
  );
}
