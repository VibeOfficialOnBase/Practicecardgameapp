import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripePaymentModal({ isOpen, onClose }: StripePaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Access',
      price: '$4.99',
      period: '/month',
      features: [
        'Daily card pulls',
        'Full access to 365 cards',
        'Journal & track progress',
        'Achievements & XP',
        'Community features',
      ],
      popular: false,
    },
    {
      id: 'annual',
      name: 'Annual Access',
      price: '$49.99',
      period: '/year',
      savings: 'Save $10!',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Priority support',
        'Early access to LECHE',
        'Exclusive badges',
      ],
      popular: true,
    },
  ];

  const handleSubscribe = async (planId: string) => {
    // This will be implemented with actual Stripe integration
    alert(`Stripe integration coming soon! Selected plan: ${planId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/30"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="p-6 sm:p-8 text-center border-b border-white/10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Choose Your Plan
              </h2>
              <p className="text-purple-200 text-sm sm:text-base">
                Get unlimited access to PRACTICE with subscription
              </p>
            </div>

            {/* Info Banner */}
            <div className="mx-6 mt-6 p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-100 text-sm">
                  <span className="font-bold">Token Holders Get Perks:</span> If you hold $VibeOfficial tokens, you'll get special benefits including exclusive badges, 2x XP multiplier, and access to LECHE cards!
                </p>
              </div>
            </div>

            {/* Plans */}
            <div className="p-6 sm:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden border-2 backdrop-blur-sm transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-br from-purple-600/40 to-pink-600/40 border-purple-400/50 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 border-white/20 hover:border-white/30'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-white/60">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-green-400 text-sm font-semibold mt-1">{plan.savings}</p>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features */}
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Subscribe Button */}
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                        } text-white font-bold py-3`}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Token Option */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-400/40 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🪙</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">
                      Or Hold $VibeOfficial Tokens
                    </h3>
                    <p className="text-green-200/90 text-sm mb-4">
                      Hold 1,000+ $VibeOfficial tokens for free lifetime access plus exclusive perks! Token holders get special badges, 2x XP, and more.
                    </p>
                    <Button
                      onClick={() => window.open('https://go.cb-w.com/swap?asset=0xee22c1dc292907b4f6cCb40d3cFd827D5a55d4b5&network=base', '_blank')}
                      variant="outline"
                      className="border-green-400/50 text-green-300 hover:bg-green-500/20"
                    >
                      Buy $VibeOfficial Tokens
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <p className="text-center text-white/40 text-xs mt-6">
                Secure payment powered by Stripe • Cancel anytime • No hidden fees
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Badge component (if not already imported)
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
