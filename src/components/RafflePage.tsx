import { CommunityGiveawayPage } from '@/components/CommunityGiveawayPage';
import { GiveawayEmailCaptureForm } from '@/components/GiveawayEmailCaptureForm';

export function RafflePage() {
  return (
    <div className="space-y-8 pb-8">
      <CommunityGiveawayPage />
      
      {/* Email Capture Form */}
      <div className="w-full max-w-2xl mx-auto px-4">
        <GiveawayEmailCaptureForm />
      </div>
    </div>
  );
}

