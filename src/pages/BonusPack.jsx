import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Wallet, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PulledCard from '../components/PulledCard';
import ShareToFeed from '../components/ShareToFeed';
import AICardInsights from '../components/AICardInsights';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';

export default function BonusPack() {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [pulledCard, setPulledCard] = useState(null);
  const queryClient = useQueryClient();
  const { play } = useSound();
  const { trigger } = useHaptic();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (userProfile?.wallet_address) {
      setWalletAddress(userProfile.wallet_address);
    }
  }, [userProfile]);

  const { data: practiceCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: () => base44.entities.PracticeCard.list('-created_date', 100),
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: todaysBonusPulls = [] } = useQuery({
    queryKey: ['bonusPulls', user?.email, today],
    queryFn: () => base44.entities.BonusPull.filter({
      user_email: user?.email,
      pulled_date: today
    }),
    enabled: !!user
  });

  const hasPulledToday = todaysBonusPulls.length > 0;

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask or a Base-compatible wallet');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      setWalletAddress(address);

      if (userProfile) {
        await base44.entities.UserProfile.update(userProfile.id, {
          wallet_address: address
        });
      } else {
        await base44.entities.UserProfile.create({
          wallet_address: address
        });
      }

      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      play('success');
      trigger('light');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet');
    }
    setIsConnecting(false);
  };

  const verifyAndPull = useMutation({
    mutationFn: async () => {
      setVerificationStatus('verifying');
      
      const response = await base44.functions.invoke('verifyTokenBalance', {
        walletAddress
      });

      if (!response.data.verified) {
        setVerificationStatus('failed');
        throw new Error('Insufficient token balance. You need at least 1000 $VibeOfficial tokens.');
      }

      setVerificationStatus('verified');
      
      const randomCard = practiceCards[Math.floor(Math.random() * practiceCards.length)];
      
      await base44.entities.BonusPull.create({
        user_email: user?.email,
        practice_card_id: randomCard.id,
        pulled_date: today,
        wallet_verified: true
      });

      return randomCard;
    },
    onSuccess: (card) => {
      setPulledCard(card);
      queryClient.invalidateQueries({ queryKey: ['bonusPulls'] });
      play('card-flip');
      trigger('strong');
    },
    onError: (error) => {
      alert(error.message);
      setVerificationStatus(null);
    }
  });

  if (pulledCard) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
            <Gift className="w-12 h-12 text-amber-500" />
            Bonus Card!
          </h1>
          <p className="text-slate-600 text-lg">Your exclusive holder reward</p>
        </motion.div>

        <PulledCard card={pulledCard} userEmail={user?.email} />

        <AICardInsights card={pulledCard} userEmail={user?.email} />
        
        <ShareToFeed card={pulledCard} userEmail={user?.email} cardType="bonus" />

        <Button
          onClick={() => setPulledCard(null)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl py-6"
        >
          Back to Bonus Pack
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
          <Gift className="w-12 h-12 text-amber-500" />
          Daily Bonus Pack
        </h1>
        <p className="text-slate-600 text-lg">
          Exclusive for $VibeOfficial holders (1000+ tokens)
        </p>
      </motion.div>

      <div className="card-organic p-8 space-y-6">
        {!walletAddress ? (
          <>
            <div className="text-center space-y-4">
              <Wallet className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900">Connect Your Wallet</h2>
              <p className="text-slate-600">
                Connect your Base wallet to verify your $VibeOfficial token balance
              </p>
            </div>

            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl py-6 text-lg"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </>
        ) : hasPulledToday ? (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Already Pulled Today!</h2>
            <p className="text-slate-600">
              You've already claimed your bonus card today. Come back tomorrow for another exclusive pull!
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Wallet Connected</span>
              </div>
              <p className="text-sm text-slate-500">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {verificationStatus === 'verifying' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-slate-600">Verifying token balance...</p>
                </motion.div>
              )}

              {verificationStatus === 'verified' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-semibold">Verified! Drawing your card...</p>
                </motion.div>
              )}

              {verificationStatus === 'failed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-semibold">Insufficient tokens</p>
                  <p className="text-sm text-slate-600 mt-2">You need at least 1000 $VibeOfficial</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!verificationStatus && (
              <Button
                onClick={() => verifyAndPull.mutate()}
                disabled={verifyAndPull.isPending}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl py-6 text-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Pull Bonus Card
              </Button>
            )}
          </>
        )}
      </div>

      <div className="card-organic p-6">
        <h3 className="font-bold text-slate-900 mb-3">How it works:</h3>
        <ul className="space-y-2 text-slate-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">1.</span>
            Connect your Base wallet
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">2.</span>
            We verify you hold at least 1000 $VibeOfficial tokens
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">3.</span>
            Pull one exclusive bonus card per day
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">4.</span>
            Daily cooldown resets at midnight
          </li>
        </ul>
      </div>
    </div>
  );
}