import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Flame, Heart, Award, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Leaderboard() {
  const [user, setUser] = useState(null);

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

  // Fetch all user profiles for streak leaderboard
  const { data: allProfiles = [] } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: () => base44.entities.UserProfile.list('-current_streak', 50),
  });

  // Fetch all posts with likes for helpful member leaderboard
  const { data: allPosts = [] } = useQuery({
    queryKey: ['allPostsForLeaderboard'],
    queryFn: () => base44.entities.CommunityPost.list('-hearts_count', 200),
  });

  // Fetch all badges for badge collector leaderboard
  const { data: allBadges = [] } = useQuery({
    queryKey: ['allBadges'],
    queryFn: () => base44.entities.Badge.list('-created_date', 500),
  });

  // Calculate helpful members based on total hearts received
  const helpfulMembers = React.useMemo(() => {
    const userHeartsMap = {};
    allPosts.forEach(post => {
      const email = post.created_by;
      if (!userHeartsMap[email]) {
        userHeartsMap[email] = 0;
      }
      userHeartsMap[email] += post.hearts_count || 0;
    });
    
    return Object.entries(userHeartsMap)
      .map(([email, hearts]) => ({ email, hearts }))
      .sort((a, b) => b.hearts - a.hearts)
      .slice(0, 20);
  }, [allPosts]);

  // Calculate badge collectors
  const badgeCollectors = React.useMemo(() => {
    const userBadgeMap = {};
    allBadges.forEach(badge => {
      const email = badge.user_email;
      if (!userBadgeMap[email]) {
        userBadgeMap[email] = [];
      }
      userBadgeMap[email].push(badge);
    });
    
    return Object.entries(userBadgeMap)
      .map(([email, badges]) => ({ 
        email, 
        badgeCount: badges.length,
        platinumCount: badges.filter(b => b.tier === 'platinum').length,
        goldCount: badges.filter(b => b.tier === 'gold').length
      }))
      .sort((a, b) => {
        if (b.platinumCount !== a.platinumCount) return b.platinumCount - a.platinumCount;
        if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
        return b.badgeCount - a.badgeCount;
      })
      .slice(0, 20);
  }, [allBadges]);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-label font-bold">#{index + 1}</span>;
  };

  const LeaderboardCard = ({ items, icon: Icon, title, valueKey, valueLabel, emptyMessage }) => (
    <Card className="card-organic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Icon className="w-7 h-7 text-purple-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-body text-center py-8">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  item.email === user?.email 
                    ? 'bg-purple-100 border-2 border-purple-500' 
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="w-12 flex items-center justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.email ? item.email[0].toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-contrast">
                    {item.display_name || item.email?.split('@')[0] || 'Anonymous'}
                  </p>
                  {item.email === user?.email && (
                    <span className="text-xs text-purple-600 font-medium">You!</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{item[valueKey]}</p>
                  <p className="text-xs text-label">{valueLabel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">Community Leaderboards</h1>
        <p className="text-body text-lg">Celebrating our most dedicated practitioners</p>
      </div>

      <Tabs defaultValue="streaks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="streaks">🔥 Streaks</TabsTrigger>
          <TabsTrigger value="helpful">💜 Helpful</TabsTrigger>
          <TabsTrigger value="badges">🏆 Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="streaks">
          <LeaderboardCard
            items={allProfiles}
            icon={Flame}
            title="Most Consistent Practice"
            valueKey="current_streak"
            valueLabel="day streak"
            emptyMessage="No streaks yet. Start practicing!"
          />
        </TabsContent>

        <TabsContent value="helpful">
          <LeaderboardCard
            items={helpfulMembers}
            icon={Heart}
            title="Most Helpful Community Members"
            valueKey="hearts"
            valueLabel="hearts received"
            emptyMessage="No community interactions yet"
          />
        </TabsContent>

        <TabsContent value="badges">
          <Card className="card-organic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-7 h-7 text-purple-500" />
                Top Badge Collectors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badgeCollectors.length === 0 ? (
                <p className="text-body text-center py-8">No badges earned yet</p>
              ) : (
                <div className="space-y-3">
                  {badgeCollectors.map((item, index) => (
                    <motion.div
                      key={item.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        item.email === user?.email 
                          ? 'bg-purple-100 border-2 border-purple-500' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.email ? item.email[0].toUpperCase() : '?'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-contrast">
                          {item.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        {item.email === user?.email && (
                          <span className="text-xs text-purple-600 font-medium">You!</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{item.badgeCount}</p>
                        <p className="text-xs text-label">total badges</p>
                        <div className="flex gap-1 justify-end mt-1">
                          {item.platinumCount > 0 && (
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded">
                              {item.platinumCount}💎
                            </span>
                          )}
                          {item.goldCount > 0 && (
                            <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded">
                              {item.goldCount}⭐
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}