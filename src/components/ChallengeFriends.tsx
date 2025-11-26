import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Swords, Trophy, Flame, Share2, Target } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  challenger: string;
  opponent: string;
  type: 'streak' | 'pulls' | 'cards';
  target: number;
  duration: number;
  status: 'active' | 'pending' | 'completed';
  progress: { challenger: number; opponent: number };
  createdAt: number;
  expiresAt: number;
}

interface ChallengeFriendsProps {
  username: string;
  currentStreak: number;
}

export function ChallengeFriends({ username, currentStreak }: ChallengeFriendsProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [challengeType, setChallengeType] = useState<'streak' | 'pulls' | 'cards'>('streak');

  useEffect(() => {
    loadChallenges();
  }, [username]);

  const loadChallenges = () => {
    const stored = localStorage.getItem(`practice_challenges_${username}`);
    if (stored) {
      const loadedChallenges = JSON.parse(stored);
      // Remove expired challenges
      const activeChallenges = loadedChallenges.filter((c: Challenge) => c.expiresAt > Date.now());
      setChallenges(activeChallenges);
      if (activeChallenges.length !== loadedChallenges.length) {
        saveChallenges(activeChallenges);
      }
    }
  };

  const saveChallenges = (newChallenges: Challenge[]) => {
    localStorage.setItem(`practice_challenges_${username}`, JSON.stringify(newChallenges));
    setChallenges(newChallenges);
  };

  const handleCreateChallenge = () => {
    if (!friendUsername.trim()) {
      toast.error('Please enter a friend\'s username');
      return;
    }

    if (friendUsername === username) {
      toast.error("You can't challenge yourself!");
      return;
    }

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      challenger: username,
      opponent: friendUsername,
      type: challengeType,
      target: challengeType === 'streak' ? 7 : challengeType === 'pulls' ? 30 : 10,
      duration: 30, // 30 days
      status: 'pending',
      progress: { challenger: 0, opponent: 0 },
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
    };

    saveChallenges([...challenges, newChallenge]);
    setFriendUsername('');
    setShowCreate(false);

    toast.success(`Challenge sent to ${friendUsername}! 🏆`, {
      description: `Race to ${newChallenge.target} ${challengeType}!`,
    });
  };

  const handleAcceptChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, status: 'active' as const } : c
    );
    saveChallenges(updatedChallenges);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    
    toast.success('Challenge accepted! Let the race begin! 🏁');
  };

  const handleDeclineChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.filter(c => c.id !== challengeId);
    saveChallenges(updatedChallenges);
    toast.info('Challenge declined');
  };

  const handleShareChallenge = (challenge: Challenge) => {
    const text = `I'm challenging ${challenge.opponent} to reach ${challenge.target} ${challenge.type} in PRACTICE! Can you beat my streak? 🏆`;
    
    if (navigator.share) {
      navigator.share({
        title: 'PRACTICE Challenge',
        text,
        url: window.location.origin,
      }).catch(() => {
        // Fallback to copy
        navigator.clipboard.writeText(text);
        toast.success('Challenge link copied!');
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Challenge link copied!');
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'pulls':
        return <Target className="w-5 h-5 text-blue-400" />;
      case 'cards':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <Swords className="w-5 h-5 text-purple-400" />;
    }
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-purple-400" />
            Friend Challenges
          </span>
          <Button
            onClick={() => setShowCreate(!showCreate)}
            size="sm"
            variant="outline"
            className="glass-card text-white border-white/20 hover:bg-white/10"
          >
            <Trophy className="w-4 h-4 mr-2" />
            New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Challenge Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30"
            >
              <Input
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                placeholder="Friend's username..."
                className="glass-card text-white border-white/20"
              />

              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => setChallengeType('streak')}
                  size="sm"
                  variant={challengeType === 'streak' ? 'gradient' : 'outline'}
                  className={challengeType !== 'streak' ? 'border-white/20 text-white hover:bg-white/10' : ''}
                >
                  <Flame className="w-4 h-4 mr-1" />
                  Streak
                </Button>
                <Button
                  onClick={() => setChallengeType('pulls')}
                  size="sm"
                  variant={challengeType === 'pulls' ? 'gradient' : 'outline'}
                  className={challengeType !== 'pulls' ? 'border-white/20 text-white hover:bg-white/10' : ''}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Pulls
                </Button>
                <Button
                  onClick={() => setChallengeType('cards')}
                  size="sm"
                  variant={challengeType === 'cards' ? 'gradient' : 'outline'}
                  className={challengeType !== 'cards' ? 'border-white/20 text-white hover:bg-white/10' : ''}
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  Cards
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateChallenge}
                  size="sm"
                  variant="gradient"
                  className="flex-1"
                >
                  Send Challenge
                </Button>
                <Button
                  onClick={() => setShowCreate(false)}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenges List */}
        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <Swords className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No active challenges</p>
            <p className="text-white/40 text-sm">
              Challenge friends to see who can build the best streak!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => {
              const isChallenger = challenge.challenger === username;
              const myProgress = isChallenger ? challenge.progress.challenger : challenge.progress.opponent;
              const theirProgress = isChallenger ? challenge.progress.opponent : challenge.progress.challenger;
              const opponent = isChallenger ? challenge.opponent : challenge.challenger;
              const daysLeft = Math.ceil((challenge.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    challenge.status === 'pending'
                      ? 'bg-yellow-900/20 border-yellow-400/30'
                      : 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getChallengeIcon(challenge.type)}
                      <div>
                        <p className="text-white font-semibold">
                          vs {opponent}
                        </p>
                        <p className="text-white/60 text-xs">
                          Race to {challenge.target} {challenge.type} • {daysLeft} days left
                        </p>
                      </div>
                    </div>
                    
                    {challenge.status === 'pending' && !isChallenger && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptChallenge(challenge.id)}
                          size="sm"
                          variant="outline"
                          className="border-green-400/50 text-green-300 hover:bg-green-500/20"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleDeclineChallenge(challenge.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {challenge.status === 'active' && (
                      <Button
                        onClick={() => handleShareChallenge(challenge)}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {challenge.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white">You</span>
                        <span className="text-white font-bold">{myProgress} / {challenge.target}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${getProgressPercentage(myProgress, challenge.target)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-white">{opponent}</span>
                        <span className="text-white font-bold">{theirProgress} / {challenge.target}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                          style={{ width: `${getProgressPercentage(theirProgress, challenge.target)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
