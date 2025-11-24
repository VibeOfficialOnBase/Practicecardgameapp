import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function UserAvatar({ userEmail, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl'
  };

  const { data: profiles = [] } = useQuery({
    queryKey: ['userProfile', userEmail],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: userEmail }),
    enabled: !!userEmail
  });

  const profile = profiles[0];
  const initial = profile?.display_name?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || '?';

  if (profile?.profile_image_url) {
    return (
      <img
        src={profile.profile_image_url}
        alt="Profile"
        className={`${sizes[size]} rounded-full object-cover shadow-lg ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ${className}`}>
      {initial}
    </div>
  );
}