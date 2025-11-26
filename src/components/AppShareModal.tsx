import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Users, Award, Sparkles, MessageCircle, Twitter, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getReferralCode, getUserReferrals, type Referral } from '@/utils/referralTracking';
import { awardXP, XP_REWARDS } from '@/utils/xpTracking';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShareModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

export function AppShareModal({ open, onClose, username }: AppShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (open && username) {
      // Get user's referral code
      const code = getReferralCode(username);
      setReferralCode(code);
      
      // Get referral stats
      const userRefs = getUserReferrals(username);
      setReferrals(userRefs);
      
      // Generate share URL
      if (typeof window !== 'undefined') {
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}?ref=${code}`);
      }
    }
  }, [open, username]);

  const completedReferrals = referrals.filter((r: Referral) => r.completed).length;
  const pendingReferrals = referrals.length - completedReferrals;

  const shareMessage = `🌟 Join me on PRACTICE! ✨

Daily affirmations, missions & inspiration to level up your life.
Built on Base blockchain with the Vibe community 💜

${shareUrl}

#PRACTICE #SelfImprovement #VibeOfficial`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard! ✨');
      
      // Award XP for generating share link
      awardXP(username, 10, 'Generated referral link');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join me on PRACTICE! ✨',
          text: shareMessage,
          url: shareUrl,
        });
        
        // Award XP for sharing
        awardXP(username, XP_REWARDS.SHARE_CARD, 'Shared PRACTICE app');
        toast.success('Thanks for sharing PRACTICE! ✨');
      } else {
        // Fallback to copy
        handleCopyLink();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
  };

  const handlePlatformShare = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent('🌟 Join me on PRACTICE! ✨\n\nDaily affirmations, missions & inspiration to level up your life.')}`,
      discord: shareUrl, // Discord doesn't have direct share links, just copy
      farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(`🌟 Join me on PRACTICE! ✨\n\nDaily affirmations, missions & inspiration to level up your life.\n\n${shareUrl}\n\n#PRACTICE #VibeOfficial`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🌟 Join me on PRACTICE! ✨\n\nDaily affirmations, missions & inspiration to level up your life.\n\n#PRACTICE #VibeOfficial`)}&url=${encodedUrl}`,
    };

    const link = links[platform];
    if (link) {
      if (platform === 'discord') {
        // For Discord, just copy the link
        handleCopyLink();
        toast.success('Link copied! Paste it in your Discord channel ✨');
      } else {
        window.open(link, '_blank', 'width=600,height=600');
        
        // Award XP for sharing
        awardXP(username, XP_REWARDS.SHARE_CARD, `Shared PRACTICE on ${platform}`);
      }
    }
  };

  const achievementMilestones = [
    { count: 1, label: 'First Invite! 🎉', unlocked: referrals.length >= 1 },
    { count: 5, label: 'Community Builder 🏗️', unlocked: completedReferrals >= 5 },
    { count: 10, label: 'PRACTICE Advocate 🌟', unlocked: completedReferrals >= 10 },
    { count: 25, label: 'Inspiration Leader 👑', unlocked: completedReferrals >= 25 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-indigo-950 to-purple-900 border-white/20 text-white max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-300" />
            Share PRACTICE ✨
          </DialogTitle>
          <DialogDescription className="text-indigo-200 text-sm">
            Invite friends to join your PRACTICE journey and earn rewards!
          </DialogDescription>
        </DialogHeader>

        {/* Referral Stats */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-300" />
              <span className="text-white font-semibold">Your Referrals</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
                <span className="text-green-300 text-sm font-bold">{completedReferrals} Joined</span>
              </div>
              {pendingReferrals > 0 && (
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-full px-3 py-1">
                  <span className="text-yellow-300 text-sm font-bold">{pendingReferrals} Pending</span>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="space-y-2 mt-4">
            {achievementMilestones.map((milestone) => (
              <div key={milestone.count} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  milestone.unlocked 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {milestone.unlocked ? '✓' : milestone.count}
                </div>
                <span className={`text-sm ${milestone.unlocked ? 'text-white' : 'text-white/60'}`}>
                  {milestone.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-4">
          <label className="text-sm text-indigo-200 mb-2 block font-semibold">Your Personalized Link</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm break-all">
              {shareUrl}
            </div>
            <Button
              onClick={handleCopyLink}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all hover:scale-105"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          <p className="text-xs text-indigo-300 mt-2">
            Your code: <span className="font-bold text-purple-300">{referralCode}</span>
          </p>
        </div>

        {/* Referral Benefits */}
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-300" />
            <span className="text-white font-semibold text-sm">Referral Rewards</span>
          </div>
          <div className="space-y-2 text-xs text-green-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
              <span><span className="font-bold">You get:</span> Bonus XP & achievements for every friend who joins</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
              <span><span className="font-bold">They get:</span> Welcome bonus & guided onboarding experience</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
              <span><span className="font-bold">Together:</span> Build a community of daily PRACTICE</span>
            </div>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="space-y-3">
          <p className="text-sm text-indigo-200 font-semibold">Quick Share</p>
          
          {/* Native Share (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              onClick={handleNativeShare}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-6 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>Share via...</span>
              </div>
            </Button>
          )}

          {/* Platform Specific Shares */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handlePlatformShare('whatsapp')}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-6 shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </div>
            </Button>

            <Button
              onClick={() => handlePlatformShare('telegram')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                <span>Telegram</span>
              </div>
            </Button>

            <Button
              onClick={() => handlePlatformShare('farcaster')}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold py-6 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Farcaster</span>
              </div>
            </Button>

            <Button
              onClick={() => handlePlatformShare('x')}
              className="group relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-800 hover:from-black hover:via-gray-900 hover:to-black text-white font-semibold py-6 shadow-lg hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Twitter className="w-5 h-5" />
                <span>X (Twitter)</span>
              </div>
            </Button>

            <Button
              onClick={() => handlePlatformShare('discord')}
              className="group relative overflow-hidden col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Discord</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="text-center text-xs text-indigo-300 mt-4 p-3 bg-white/5 rounded-lg">
          💡 <span className="font-semibold">Pro Tip:</span> Friends who join via your link will automatically be connected to you!
        </div>
      </DialogContent>
    </Dialog>
  );
}
