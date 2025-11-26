import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gift, Sparkles, Heart, Users, Trophy, Check, ExternalLink, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GiveawayTier {
  name: string;
  minTokens: number;
  color: string;
  bgGradient: string;
  icon: string;
  benefits: string[];
  entries: number;
}

const GIVEAWAY_TIERS: GiveawayTier[] = [
  {
    name: 'Bronze Believer',
    minTokens: 1000,
    color: 'text-amber-600',
    bgGradient: 'from-amber-900/30 to-orange-900/30',
    icon: '🥉',
    benefits: [
      '1 entry per giveaway',
      'Bronze badge on your profile'
    ],
    entries: 1
  },
  {
    name: 'Silver Supporter',
    minTokens: 10000,
    color: 'text-slate-400',
    bgGradient: 'from-slate-800/40 to-slate-900/40',
    icon: '🥈',
    benefits: [
      '3 entries per giveaway',
      'Silver badge on your profile'
    ],
    entries: 3
  },
  {
    name: 'Gold Guardian',
    minTokens: 100000,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900/40 to-amber-900/40',
    icon: '🥇',
    benefits: [
      '5 entries per giveaway',
      'Gold badge on your profile'
    ],
    entries: 5
  },
  {
    name: 'Platinum Pioneer',
    minTokens: 500000,
    color: 'text-cyan-300',
    bgGradient: 'from-cyan-900/40 to-teal-900/40',
    icon: '💎',
    benefits: [
      '10 entries per giveaway',
      'Platinum badge on your profile'
    ],
    entries: 10
  },
  {
    name: 'Diamond Luminary',
    minTokens: 1000000,
    color: 'text-blue-300',
    bgGradient: 'from-blue-900/40 to-purple-900/40',
    icon: '💠',
    benefits: [
      '20 entries per giveaway',
      'Diamond badge on your profile'
    ],
    entries: 20
  }
];

export function CommunityGiveawayPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-2 sm:px-4 pb-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Gift className="w-12 h-12 text-purple-400 animate-bounce-subtle" />
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Community Giveaways
          </h1>
          <Users className="w-12 h-12 text-pink-400 animate-bounce-subtle" style={{ animationDelay: '0.2s' }} />
        </motion.div>
        
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-indigo-200 text-lg max-w-2xl mx-auto mb-4"
        >
          Celebrating our $VibeOfficial community with exclusive giveaways, merch, and experiences
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-pink-300 text-sm"
        >
          <Heart className="w-4 h-4" />
          <span>Love • Empathy • Community • Healing • Empowerment</span>
          <Heart className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-white/80 text-sm">Powered By</span>
        <img
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/7c5f1896-f11b-4229-b9b9-2e9aea5bb543-USUKADwyIN8ZDriizlUoypra0FvUWW"
          alt="VibeOfficial"
          width={32}
          height={32}
          className="object-contain rounded-full shadow-lg border-2 border-purple-300/50"
        />
        <span className="text-white font-bold">$VibeOfficial</span>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-400/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <CardHeader className="relative z-10 text-center pb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="mx-auto mb-4"
            >
              <Clock className="w-20 h-20 text-yellow-400" />
            </motion.div>
            <CardTitle className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-pink-400 animate-pulse" />
              Coming Soon
              <Sparkles className="w-10 h-10 text-pink-400 animate-pulse" />
            </CardTitle>
            <CardDescription className="text-indigo-200 text-xl mt-3">
              Exclusive giveaways for $VibeOfficial token holders
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-6">
            {/* Merch Teaser */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl"></div>
              <div className="relative bg-white/5 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/76712288-5f7e-4e68-a4fd-ee239e958fd5-NrnR7Z7uBnjR3GqBGuJSZP4svrWQc5"
                    alt="VibeOfficial Merch Preview"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-2xl opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg flex items-end justify-center pb-6">
                    <div className="text-center">
                      <p className="text-white font-bold text-2xl mb-2">Giveaways Coming Soon!</p>
                      <p className="text-indigo-200">Stay tuned for announcements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-indigo-900/40 p-6 rounded-xl border border-indigo-400/30">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                What to Expect
              </h3>
              <ul className="space-y-3 text-indigo-200">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold text-xl">•</span>
                  <span>Exclusive VibeOfficial merchandise drops</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold text-xl">•</span>
                  <span>Tiered entry system based on $VibeOfficial token holdings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold text-xl">•</span>
                  <span>Earn exclusive badges on your profile based on your tier</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold text-xl">•</span>
                  <span>More entries = higher chances to win</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold text-xl">•</span>
                  <span>Show your support with visible holder recognition</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center bg-purple-900/30 p-6 rounded-xl border border-purple-400/30">
              <p className="text-white font-semibold text-lg mb-4">
                🔔 Get notified when giveaways launch
              </p>
              <p className="text-white/80 text-sm mb-4">
                Follow us on X for the latest updates and announcements
              </p>
              <Button
                onClick={() => window.open('https://x.com/havehonorfaith', '_blank')}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold"
              >
                Follow @havehonorfaith
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tier Breakdown */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Planned Holder Tiers & Benefits
          </CardTitle>
          <CardDescription className="text-indigo-200">
            The more $VibeOfficial you hold, the more entries you get and the better your profile badge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GIVEAWAY_TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${tier.bgGradient} p-6 rounded-xl border-2 border-white/10 hover:border-white/30 transition-all hover-scale`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{tier.icon}</span>
                  <div>
                    <h4 className={`text-xl font-bold ${tier.color}`}>
                      {tier.name}
                    </h4>
                    <p className="text-white/60 text-sm">
                      {tier.minTokens.toLocaleString()}+ $VibeOfficial
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-full text-sm inline-block">
                    {tier.entries} {tier.entries === 1 ? 'Entry' : 'Entries'} per Giveaway
                  </div>
                </div>

                <div className="space-y-2">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-indigo-100 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Values */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-400" />
            Our Community Values
          </CardTitle>
          <CardDescription className="text-indigo-200">
            Giveaways are a celebration of LECHE: Love, Empathy, Community, Healing, Empowerment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '💝', label: 'Love', desc: 'Celebrating our community' },
              { icon: '🤝', label: 'Empathy', desc: 'Supporting each other' },
              { icon: '👥', label: 'Community', desc: 'Growing together' },
              { icon: '🌱', label: 'Healing', desc: 'Nurturing growth' },
              { icon: '⚡', label: 'Empowerment', desc: 'Uplifting all' }
            ].map((value) => (
              <div key={value.label} className="glass-card p-4 rounded-xl text-center hover-scale">
                <div className="text-4xl mb-2">{value.icon}</div>
                <h4 className="text-white font-bold mb-1">{value.label}</h4>
                <p className="text-indigo-200 text-xs">{value.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-center pt-6 border-t border-white/20">
        <p className="text-white/80 mb-4">
          Stay updated on giveaways and community events
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://x.com/havehonorfaith', '_blank')}
            className="border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/20"
          >
            Follow on X
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://zora.co/vibeofficial', '_blank')}
            className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20"
          >
            Visit Zora
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
