import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import SparklesBackground from '../components/particles/SparklesBackground';
import MagicalParticles from '../components/particles/MagicalParticles';
import { isDemoMode } from '@/api/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      toast({ title: "Success", description: "Logged in successfully!" });
      navigate('/');
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to login" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
        const { error } = await signInWithGoogle();
        if (error) throw error;
        navigate('/');
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message || "Failed to login with Google" });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <SparklesBackground />
        <MagicalParticles />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
            <motion.div
                className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-logo-glow opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center border-4 border-purple-400/30">
                    <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-200">V</span>
                </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2 drop-shadow-lg">
                PRACTICE
            </h1>
            <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase">
                Powered by $VibeOfficial
            </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl hover:scale-[1.01] transition-transform duration-500">
            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase ml-2">Email</label>
                    <Input
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400/20"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/70 uppercase ml-2">Password</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-purple-400 focus:ring-purple-400/20"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-900/20 animate-smooth-pulse"
                >
                    {loading ? 'Entering...' : '✨ ENTER SANCTUARY ✨'}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/40">Or continue with</span>
                </div>
            </div>

            <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl"
            >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
            </Button>

            <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-white/60">
                    New here?{' '}
                    <Link to="/signup" className="text-purple-300 hover:text-white font-semibold underline decoration-purple-400/30 underline-offset-4">
                        Create Account
                    </Link>
                </p>
                {isDemoMode && (
                    <p className="text-xs text-green-400 font-mono bg-green-400/10 py-1 px-2 rounded border border-green-400/20 inline-block">
                        ⚠️ DEMO MODE: Use demo@example.com
                    </p>
                )}
            </div>
        </div>
      </motion.div>
    </div>
  );
}
