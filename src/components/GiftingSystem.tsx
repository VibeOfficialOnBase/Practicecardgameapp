import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Send, Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface GiftingSystemProps {
  username: string;
  hasBalance: boolean;
}

export function GiftingSystem({ username, hasBalance }: GiftingSystemProps) {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [selectedGift, setSelectedGift] = useState<'pack' | 'insurance' | 'bonus' | null>(null);
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [sending, setSending] = useState(false);

  const gifts = [
    {
      id: 'pack' as const,
      name: 'Free Pack Claim',
      description: 'Gift a friend a free card pack',
      icon: '🎁',
      color: 'from-purple-500 to-pink-500',
      requiresBalance: true,
    },
    {
      id: 'insurance' as const,
      name: 'Streak Insurance',
      description: 'Help a friend protect their streak',
      icon: '🛡️',
      color: 'from-blue-500 to-cyan-500',
      requiresBalance: false,
    },
    {
      id: 'bonus' as const,
      name: 'XP Bonus',
      description: 'Send a motivation boost (+100 XP)',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      requiresBalance: false,
    },
  ];

  const handleSelectGift = (giftType: typeof gifts[0]['id']) => {
    const gift = gifts.find(g => g.id === giftType);
    if (gift?.requiresBalance && !hasBalance) {
      toast.error('You need to hold $VibeOfficial tokens to send this gift');
      return;
    }
    setSelectedGift(giftType);
    setShowGiftForm(true);
  };

  const handleSendGift = () => {
    if (!recipientUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (recipientUsername === username) {
      toast.error("You can't gift yourself!");
      return;
    }

    if (!selectedGift) return;

    setSending(true);

    // Simulate sending gift
    setTimeout(() => {
      const gift = gifts.find(g => g.id === selectedGift);
      
      // Store gift in recipient's localStorage (simplified for demo)
      const giftKey = `practice_gift_${recipientUsername}_${Date.now()}`;
      localStorage.setItem(giftKey, JSON.stringify({
        from: username,
        type: selectedGift,
        timestamp: Date.now(),
      }));

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#A78BFA', '#EC4899', '#F59E0B'],
      });

      toast.success(`${gift?.icon} Gift sent to ${recipientUsername}!`, {
        description: `They'll receive your ${gift?.name}`,
      });

      setRecipientUsername('');
      setSelectedGift(null);
      setShowGiftForm(false);
      setSending(false);
    }, 1000);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Gift className="w-6 h-6 text-pink-400" />
          Send a Gift
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gift Selection */}
        {!showGiftForm ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {gifts.map((gift) => (
              <motion.button
                key={gift.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectGift(gift.id)}
                disabled={gift.requiresBalance && !hasBalance}
                className={`
                  p-6 rounded-xl border-2 transition-all text-center
                  ${gift.requiresBalance && !hasBalance
                    ? 'opacity-50 cursor-not-allowed border-white/10 bg-white/5'
                    : `bg-gradient-to-br ${gift.color} border-white/20 hover:border-white/40`
                  }
                `}
              >
                <div className="text-4xl mb-2">{gift.icon}</div>
                <p className="text-white font-bold mb-1">{gift.name}</p>
                <p className="text-white/70 text-xs">{gift.description}</p>
                {gift.requiresBalance && !hasBalance && (
                  <p className="text-yellow-300 text-xs mt-2">
                    Requires $VibeOfficial
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          /* Gift Form */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className={`p-6 rounded-lg bg-gradient-to-br ${gifts.find(g => g.id === selectedGift)?.color}`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    {gifts.find(g => g.id === selectedGift)?.icon}
                  </div>
                  <p className="text-white font-bold text-lg">
                    {gifts.find(g => g.id === selectedGift)?.name}
                  </p>
                  <p className="text-white/80 text-sm">
                    {gifts.find(g => g.id === selectedGift)?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">
                    Recipient Username
                  </label>
                  <Input
                    value={recipientUsername}
                    onChange={(e) => setRecipientUsername(e.target.value)}
                    placeholder="Enter username..."
                    className="glass-card text-white border-white/20"
                    disabled={sending}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendGift}
                    disabled={sending || !recipientUsername.trim()}
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                  >
                    {sending ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Gift
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowGiftForm(false);
                      setSelectedGift(null);
                      setRecipientUsername('');
                    }}
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={sending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-xs text-center">
                  💝 Spread the love and help friends on their PRACTICE journey
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Info */}
        {!showGiftForm && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-400/30">
            <p className="text-pink-200 text-sm font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Why Gift?
            </p>
            <ul className="text-white/70 text-xs space-y-1">
              <li>• Strengthen friendships through shared practice</li>
              <li>• Help others build their streaks</li>
              <li>• Spread positivity and motivation</li>
              <li>• Earn karma points for generous acts</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
