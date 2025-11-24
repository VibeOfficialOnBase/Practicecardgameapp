import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function LastCompletedIndicator({ lastCompletedDate, label = 'Last completed' }) {
  if (!lastCompletedDate) return null;

  const timeAgo = formatDistanceToNow(new Date(lastCompletedDate), { addSuffix: true });

  return (
    <div className="flex items-center gap-2 text-sm text-label bg-white/5 rounded-lg px-3 py-2">
      <CheckCircle2 className="w-4 h-4 text-green-500" />
      <Clock className="w-4 h-4" />
      <span>{label} {timeAgo}</span>
    </div>
  );
}