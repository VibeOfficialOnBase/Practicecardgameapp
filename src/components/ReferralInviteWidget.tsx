import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Users, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getReferralCode } from '@/utils/referralTracking';

interface ReferralInviteWidgetProps {
  username: string;
  compact?: boolean;
}

export function ReferralInviteWidget({ username, compact = false }: ReferralInviteWidgetProps) {
  const [copied, setCopied] = useState(false);
  const referralCode = getReferralCode(username);
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    const text = `Join me on PRACTICE — daily affirmations, missions, and inspiration for self-improvement! 🌟\n\nUse my code: ${referralCode}\n\n${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join PRACTICE',
        text: text,
      }).catch(() => {
        // Fallback to copy
        handleCopy();
      });
    } else {
      // Fallback to Twitter
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        '_blank'
      );
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Invite Friends</p>
              <p className="text-xs text-purple-200">Share & earn rewards</p>
            </div>
          </div>
          <Button
            onClick={handleShare}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-300 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Invite Friends
          </h3>
          <p className="text-sm text-gray-700">Share PRACTICE & earn rewards</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-gray-600 font-semibold mb-1">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-bold text-purple-700 bg-purple-100 px-3 py-2 rounded">
              {referralCode}
            </code>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className={copied ? 'bg-green-100 text-green-700' : ''}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="bg-purple-100/50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold">💎 Rewards:</span> When friends join using your code, you both earn bonus XP and exclusive perks!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
