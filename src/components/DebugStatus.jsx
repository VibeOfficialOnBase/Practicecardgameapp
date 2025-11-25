
import React from 'react';

export default function DebugStatus() {
  const isDemo = import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_ANON_KEY === undefined;

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center z-[9999] pointer-events-none">
      {isDemo ? (
        <span className="text-yellow-400">⚠️ DEMO MODE (No Supabase Keys) - Data will not persist</span>
      ) : (
        <span className="text-green-400">✅ Connected to Supabase</span>
      )}
    </div>
  );
}
