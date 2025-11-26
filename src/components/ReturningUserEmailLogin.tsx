import { useState } from 'react';
import { ToastNotification, ToastContainer } from '@/components/ui/toast-notification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReturningUserEmailLoginProps {
  onBack: () => void;
  onCodeSent: (email: string) => void;
}

export function ReturningUserEmailLogin({ onBack, onCodeSent }: ReturningUserEmailLoginProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; code?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Failed to send verification code';
        throw new Error(errorMsg);
      }

      // If email service is not configured, show the code in toast
      if (data.code && data.noEmail) {
        setToast({
          message: 'Email service not configured. Here is your verification code:',
          code: data.code,
        });
      }

      // Success! Move to code verification step
      onCodeSent(email.trim().toLowerCase());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer>
        {toast && (
          <ToastNotification
            message={toast.message}
            code={toast.code}
            type="code"
            onClose={() => setToast(null)}
            duration={0} // Don't auto-dismiss when showing code
          />
        )}
      </ToastContainer>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16 sm:pt-4 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="w-fit mb-4 text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <CardTitle className="text-3xl font-bold text-white text-center">
                Welcome Back!
              </CardTitle>
              <CardDescription className="text-indigo-200 text-center">
                Enter your email to verify your identity
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="your@email.com"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 pl-10"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-white/50">
                    We'll send a verification code to this email
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-2xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-center text-white/60 text-xs">
                  💡 Can't remember your email? Create a new account instead
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </>
  );
}
