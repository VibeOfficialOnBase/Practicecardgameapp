import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function BaseNetworkReminder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 max-w-md mx-auto"
    >
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-100 text-sm font-semibold mb-1">
              📍 Network Requirement
            </p>
            <p className="text-blue-200/90 text-xs">
              $VibeOfficial tokens must be on <span className="font-bold text-white">Base network</span> to pull cards. If you have tokens on other networks (like Zora), please bridge them to Base first.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
