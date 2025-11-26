import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gift, Clock, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface GiveawayEmailCaptureFormProps {
  onSuccess?: () => void;
}

export function GiveawayEmailCaptureForm({ onSuccess }: GiveawayEmailCaptureFormProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-400/30 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mx-auto mb-4"
          >
            <Gift className="w-16 h-16 text-purple-400" />
          </motion.div>
          <CardTitle className="text-3xl text-white flex items-center justify-center gap-3">
            <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />
            Coming Soon
          </CardTitle>
          <CardDescription className="text-indigo-200 text-lg mt-2">
            Community giveaways are being prepared
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-6 pt-4">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Bell className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-bounce" />
            <p className="text-white/90 text-lg mb-2">
              Exciting giveaways for $VibeOfficial Holders are on the way!
            </p>
            <p className="text-indigo-200 text-sm">
              Stay tuned for announcements on X and in-app notifications
            </p>
          </div>

          <div className="space-y-3 text-left">
            <p className="text-white/80 font-semibold">What&apos;s Coming:</p>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✨</span>
                <span>Exclusive merch drops for token holders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✨</span>
                <span>Tiered entry system based on $VibeOfficial holdings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✨</span>
                <span>VIP experiences and community events</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✨</span>
                <span>Special benefits for top holders</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-white/60 text-xs">
              Follow{' '}
              <a 
                href="https://x.com/havehonorfaith" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 underline"
              >
                @havehonorfaith
              </a>
              {' '}for updates
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
