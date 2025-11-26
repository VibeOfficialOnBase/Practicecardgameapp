import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationCodeInputProps {
  email: string;
  onBack: () => void;
  onVerified: (email: string) => void;
}

export function VerificationCodeInput({ email, onBack, onVerified }: VerificationCodeInputProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && value) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      setError('');
      // Auto-submit
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeString: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Invalid verification code';
        throw new Error(errorMsg);
      }

      // Success! Email is verified
      onVerified(email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code';
      setError(errorMessage);
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResent(false);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Failed to resend code';
        throw new Error(errorMsg);
      }

      // If email service is not configured, show the code
      if (data.code && data.noEmail) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Verification Code:', data.code);
        }
        alert(`⚠️ Email Service Not Configured\n\nYour new verification code is:\n\n${data.code}\n\nPlease enter this code to continue.`);
      }

      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code';
      setError(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
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
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <CardTitle className="text-3xl font-bold text-white text-center">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-indigo-200 text-center">
                We sent a 6-digit code to <br />
                <span className="font-semibold text-white">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Code Input Grid */}
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={loading}
                      className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all disabled:opacity-50"
                    />
                  ))}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg"
                  >
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {resent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/20 border border-green-400/50 rounded-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <p className="text-green-300 text-sm font-semibold">Code sent!</p>
                  </motion.div>
                )}

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-white/80">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Verifying code...</span>
                  </div>
                )}

                {/* Resend Button */}
                <div className="pt-4 border-t border-white/20 text-center space-y-3">
                  <p className="text-white/60 text-sm">Didn't receive the code?</p>
                  <Button
                    onClick={handleResend}
                    disabled={resending || loading}
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-center text-white/50 text-xs">
                    💡 The code expires in 10 minutes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
