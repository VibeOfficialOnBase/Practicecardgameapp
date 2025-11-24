import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Heart, Sparkles, Trophy, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const groupTypeIcons = {
  practice: Sparkles,
  gaming: Trophy,
  support: Heart,
  general: Users
};

export default function Groups() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    group_type: 'general',
    privacy: 'public',
    leche_focus: 'All',
    avatar_emoji: '✨'
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: allGroups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.Group.filter({ is_active: true })
  });

  const { data: myMemberships = [] } = useQuery({
    queryKey: ['groupMemberships', user?.email],
    queryFn: () => base44.entities.GroupMember.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const myGroupIds = myMemberships.map(m => m.group_id);

  const createGroup = useMutation({
    mutationFn: async () => {
      const group = await base44.entities.Group.create({
        ...newGroup,
        creator_email: user.email,
        member_count: 1
      });
      
      // Add creator as admin member
      await base44.entities.GroupMember.create({
        group_id: group.id,
        user_email: user.email,
        role: 'admin',
        joined_date: new Date().toISOString()
      });

      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupMemberships'] });
      setShowCreateModal(false);
      setNewGroup({
        name: '',
        description: '',
        group_type: 'general',
        privacy: 'public',
        leche_focus: 'All',
        avatar_emoji: '✨'
      });
    }
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId) => {
      await base44.entities.GroupMember.create({
        group_id: groupId,
        user_email: user.email,
        role: 'member',
        joined_date: new Date().toISOString()
      });

      // Update member count
      const group = allGroups.find(g => g.id === groupId);
      if (group) {
        await base44.entities.Group.update(groupId, {
          member_count: group.member_count + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupMemberships'] });
    }
  });

  const leaveGroup = useMutation({
    mutationFn: async (groupId) => {
      const membership = myMemberships.find(m => m.group_id === groupId);
      if (membership) {
        await base44.entities.GroupMember.delete(membership.id);

        // Update member count
        const group = allGroups.find(g => g.id === groupId);
        if (group) {
          await base44.entities.Group.update(groupId, {
            member_count: Math.max(0, group.member_count - 1)
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupMemberships'] });
    }
  });

  const filteredGroups = allGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || group.group_type === filterType;
    return matchesSearch && matchesType;
  });

  const myGroups = filteredGroups.filter(g => myGroupIds.includes(g.id));
  const discoverGroups = filteredGroups.filter(g => !myGroupIds.includes(g.id));

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-center ensure-readable-strong">Groups & Communities</h1>
          <p className="text-center text-lg text-label mb-8">
            Find your tribe and grow together
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-label" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Group
            </Button>
          </div>
        </motion.div>

        {/* My Groups */}
        {myGroups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 ensure-readable-strong">My Groups</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={true}
                  onLeave={() => leaveGroup.mutate(group.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Discover Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4 ensure-readable-strong">Discover Groups</h2>
          {discoverGroups.length === 0 ? (
            <div className="card-organic p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-label" />
              <p className="text-lg ensure-readable mb-4">No groups found</p>
              <p className="text-label">Try adjusting your search or create a new group!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverGroups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={false}
                  onJoin={() => joinGroup.mutate(group.id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="card-organic p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold ensure-readable-strong">Create New Group</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-label hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Group Name</label>
                    <Input
                      placeholder="Enter group name..."
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Description</label>
                    <Textarea
                      placeholder="What is this group about?"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold ensure-readable mb-2 block">Type</label>
                      <Select value={newGroup.group_type} onValueChange={(value) => setNewGroup({...newGroup, group_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold ensure-readable mb-2 block">Privacy</label>
                      <Select value={newGroup.privacy} onValueChange={(value) => setNewGroup({...newGroup, privacy: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">LECHE Focus</label>
                    <Select value={newGroup.leche_focus} onValueChange={(value) => setNewGroup({...newGroup, leche_focus: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Values</SelectItem>
                        <SelectItem value="Love">Love</SelectItem>
                        <SelectItem value="Empathy">Empathy</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Healing">Healing</SelectItem>
                        <SelectItem value="Empowerment">Empowerment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold ensure-readable mb-2 block">Avatar Emoji</label>
                    <Input
                      placeholder="✨"
                      value={newGroup.avatar_emoji}
                      onChange={(e) => setNewGroup({...newGroup, avatar_emoji: e.target.value})}
                      maxLength={2}
                    />
                  </div>

                  <Button
                    onClick={() => createGroup.mutate()}
                    disabled={!newGroup.name || createGroup.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    Create Group
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GroupCard({ group, isMember, onJoin, onLeave }) {
  const Icon = groupTypeIcons[group.group_type] || Users;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card-organic p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{group.avatar_emoji}</div>
          <div>
            <h3 className="font-bold ensure-readable-strong">{group.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Icon className="w-4 h-4 text-label" />
              <span className="text-xs text-label capitalize">{group.group_type}</span>
              <span className="text-xs text-label">• {group.member_count} members</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-label mb-4 line-clamp-2">{group.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-label px-3 py-1 bg-purple-500/20 rounded-full">
          {group.leche_focus}
        </span>
        
        {isMember ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onLeave}
            className="text-red-400 border-red-400/30 hover:bg-red-500/10"
          >
            Leave
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onJoin}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            Join
          </Button>
        )}
      </div>
    </motion.div>
  );
}