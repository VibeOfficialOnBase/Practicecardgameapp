import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Check, X, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  id: string;
  username: string;
  streak: number;
  lastPull: string;
  status: 'active' | 'pending' | 'inactive';
}

interface AccountabilityPartnersProps {
  username: string;
}

export function AccountabilityPartners({ username }: AccountabilityPartnersProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [inviteUsername, setInviteUsername] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    loadPartners();
  }, [username]);

  const loadPartners = () => {
    const stored = localStorage.getItem(`practice_partners_${username}`);
    if (stored) {
      setPartners(JSON.parse(stored));
    }
  };

  const savePartners = (newPartners: Partner[]) => {
    localStorage.setItem(`practice_partners_${username}`, JSON.stringify(newPartners));
    setPartners(newPartners);
  };

  const handleInvite = () => {
    if (!inviteUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (inviteUsername === username) {
      toast.error("You can't partner with yourself!");
      return;
    }

    if (partners.some(p => p.username === inviteUsername)) {
      toast.error('Already partners or invite pending');
      return;
    }

    const newPartner: Partner = {
      id: Date.now().toString(),
      username: inviteUsername,
      streak: 0,
      lastPull: '',
      status: 'pending',
    };

    savePartners([...partners, newPartner]);
    setInviteUsername('');
    setShowInvite(false);
    toast.success(`Partnership invite sent to ${inviteUsername}!`);
  };

  const handleRemovePartner = (partnerId: string) => {
    const updatedPartners = partners.filter(p => p.id !== partnerId);
    savePartners(updatedPartners);
    toast.success('Partner removed');
  };

  const handleAcceptInvite = (partnerId: string) => {
    const updatedPartners = partners.map(p =>
      p.id === partnerId ? { ...p, status: 'active' as const } : p
    );
    savePartners(updatedPartners);
    toast.success('Partnership accepted! Time to hold each other accountable! 🤝');
  };

  const handleDeclineInvite = (partnerId: string) => {
    handleRemovePartner(partnerId);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Accountability Partners
          </span>
          <Button
            onClick={() => setShowInvite(!showInvite)}
            size="sm"
            variant="outline"
            className="glass-card text-white border-white/20 hover:bg-white/10"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Invite Form */}
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <Input
              value={inviteUsername}
              onChange={(e) => setInviteUsername(e.target.value)}
              placeholder="Enter username..."
              className="glass-card text-white border-white/20"
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleInvite}
                size="sm"
                variant="gradient"
                className="flex-1"
              >
                Send Invite
              </Button>
              <Button
                onClick={() => setShowInvite(false)}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Partners List */}
        {partners.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No accountability partners yet</p>
            <p className="text-white/40 text-sm">
              Partner up to motivate each other and build streaks together!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${
                  partner.status === 'pending'
                    ? 'bg-yellow-900/20 border-yellow-400/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {partner.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{partner.username}</p>
                      {partner.status === 'active' && (
                        <div className="flex items-center gap-1 text-sm text-orange-300">
                          <Flame className="w-4 h-4" />
                          <span>{partner.streak} day streak</span>
                        </div>
                      )}
                      {partner.status === 'pending' && (
                        <p className="text-yellow-300 text-sm">Invite pending</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {partner.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleAcceptInvite(partner.id)}
                          size="sm"
                          variant="outline"
                          className="border-green-400/50 text-green-300 hover:bg-green-500/20"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeclineInvite(partner.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {partner.status === 'active' && (
                      <Button
                        onClick={() => handleRemovePartner(partner.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Partner Benefits */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400/30">
          <p className="text-white font-semibold mb-2">🤝 Partner Benefits</p>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Get notified when partners pull their cards</li>
            <li>• Celebrate milestone achievements together</li>
            <li>• Motivate each other to maintain streaks</li>
            <li>• Share your favorite cards and insights</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
