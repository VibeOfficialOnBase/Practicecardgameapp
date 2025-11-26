import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BreathworkPattern {
  id: string;
  name: string;
  description: string;
  pattern: { phase: string; duration: number; instruction: string }[];
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in seconds
  category: 'calm' | 'focus' | 'sleep' | 'gratitude' | 'breathing';
  script: { timestamp: number; text: string }[];
}

const BREATHWORK_PATTERNS: BreathworkPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Calm your nervous system with equal breathing',
    pattern: [
      { phase: 'inhale', duration: 4, instruction: 'Breathe in through your nose' },
      { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
      { phase: 'exhale', duration: 4, instruction: 'Breathe out through your mouth' },
      { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
    ],
    benefits: ['Reduces stress', 'Improves focus', 'Lowers blood pressure'],
    difficulty: 'beginner'
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Natural tranquilizer for the nervous system',
    pattern: [
      { phase: 'inhale', duration: 4, instruction: 'Breathe in quietly through your nose' },
      { phase: 'hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'exhale', duration: 8, instruction: 'Exhale completely through your mouth' },
    ],
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Manages stress'],
    difficulty: 'beginner'
  },
  {
    id: 'wimhof',
    name: 'Wim Hof Method',
    description: 'Powerful breathing technique for energy and health',
    pattern: [
      { phase: 'inhale', duration: 2, instruction: 'Deep breath in through nose or mouth' },
      { phase: 'exhale', duration: 1, instruction: 'Relaxed exhale (don\'t force)' },
    ],
    benefits: ['Boosts energy', 'Strengthens immune system', 'Increases focus'],
    difficulty: 'advanced'
  }
];

const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: 'calm-3min',
    title: '3-Minute Calm',
    duration: 180,
    category: 'calm',
    script: [
      { timestamp: 0, text: 'Find a comfortable position and gently close your eyes.' },
      { timestamp: 10, text: 'Take a deep breath in... and slowly release.' },
      { timestamp: 20, text: 'Notice the natural rhythm of your breathing.' },
      { timestamp: 40, text: 'With each exhale, release any tension you\'re holding.' },
      { timestamp: 60, text: 'You are safe. You are calm. You are present.' },
      { timestamp: 90, text: 'Continue breathing naturally, finding your center.' },
      { timestamp: 120, text: 'Feel the peace that exists within you, always available.' },
      { timestamp: 150, text: 'As we prepare to finish, take one more deep breath.' },
      { timestamp: 170, text: 'Slowly bring your awareness back to the room.' },
      { timestamp: 175, text: 'When ready, gently open your eyes. Well done.' }
    ]
  },
  {
    id: 'focus-5min',
    title: '5-Minute Focus',
    duration: 300,
    category: 'focus',
    script: [
      { timestamp: 0, text: 'Sit upright with your spine straight and eyes closed.' },
      { timestamp: 15, text: 'Bring your attention to a single point - your breath.' },
      { timestamp: 30, text: 'Notice the sensation of air entering your nostrils.' },
      { timestamp: 60, text: 'When thoughts arise, simply notice them and return to your breath.' },
      { timestamp: 120, text: 'Your mind may wander - this is normal. Gently guide it back.' },
      { timestamp: 180, text: 'Feel your concentration growing stronger with each moment.' },
      { timestamp: 240, text: 'You are training your mind to focus at will.' },
      { timestamp: 270, text: 'Take three final deep breaths, anchoring this clarity.' },
      { timestamp: 290, text: 'Slowly open your eyes, carrying this focus into your day.' }
    ]
  }
];

interface MeditationPlayerProps {
  onComplete?: (duration: number, type: string) => void;
}

export function MeditationPlayer({ onComplete }: MeditationPlayerProps) {
  const [activeTab, setActiveTab] = useState<'breathwork' | 'meditation'>('breathwork');
  const [selectedBreathwork, setSelectedBreathwork] = useState<BreathworkPattern | null>(null);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [meditationTime, setMeditationTime] = useState(0);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play gentle tone for breathwork phases
  const playTone = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  // Breathwork timer logic
  useEffect(() => {
    if (!isPlaying || !selectedBreathwork) return;

    intervalRef.current = setInterval(() => {
      setPhaseProgress(prev => {
        const currentPhase = selectedBreathwork.pattern[currentPhaseIndex];
        const newProgress = prev + 100 / currentPhase.duration;

        if (newProgress >= 100) {
          // Move to next phase
          const nextIndex = (currentPhaseIndex + 1) % selectedBreathwork.pattern.length;
          setCurrentPhaseIndex(nextIndex);
          
          // Play tone for phase change
          playTone(nextIndex === 0 ? 440 : 330, 0.2);
          
          // Count cycles
          if (nextIndex === 0) {
            setCycleCount(prev => prev + 1);
          }
          
          return 0;
        }

        return newProgress;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentPhaseIndex, selectedBreathwork, soundEnabled]);

  // Meditation timer logic
  useEffect(() => {
    if (!isPlaying || !selectedMeditation) return;

    intervalRef.current = setInterval(() => {
      setMeditationTime(prev => {
        const newTime = prev + 1;
        
        // Check if we should show next script
        if (selectedMeditation.script[currentScriptIndex + 1]?.timestamp <= newTime) {
          setCurrentScriptIndex(prev => prev + 1);
          playTone(528, 0.3); // Gentle notification
        }
        
        // Complete meditation
        if (newTime >= selectedMeditation.duration) {
          setIsPlaying(false);
          if (onComplete) {
            onComplete(selectedMeditation.duration, 'meditation');
          }
          return selectedMeditation.duration;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, meditationTime, selectedMeditation, currentScriptIndex, onComplete, soundEnabled]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && (selectedBreathwork || selectedMeditation)) {
      playTone(440, 0.2);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setCycleCount(0);
    setMeditationTime(0);
    setCurrentScriptIndex(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => {
            setActiveTab('breathwork');
            handleReset();
          }}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'breathwork'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          🫁 Breathwork
        </button>
        <button
          onClick={() => {
            setActiveTab('meditation');
            handleReset();
          }}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'meditation'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          🧘 Meditation
        </button>
      </div>

      {/* Breathwork Section */}
      {activeTab === 'breathwork' && (
        <div className="space-y-6">
          {!selectedBreathwork ? (
            <div className="grid gap-4">
              {BREATHWORK_PATTERNS.map((pattern) => (
                <motion.div
                  key={pattern.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="glass-card glass-card-hover cursor-pointer" onClick={() => setSelectedBreathwork(pattern)}>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>{pattern.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pattern.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                          pattern.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {pattern.difficulty}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 text-sm mb-4">{pattern.description}</p>
                      <div className="space-y-2">
                        <p className="text-white/60 text-xs font-semibold">Benefits:</p>
                        <div className="flex flex-wrap gap-2">
                          {pattern.benefits.map((benefit, idx) => (
                            <span key={idx} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Breathwork Player */}
              <Card className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{selectedBreathwork.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBreathwork(null);
                        handleReset();
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      ← Back
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Visual Breathing Circle */}
                  <div className="flex items-center justify-center py-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPhaseIndex}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: selectedBreathwork.pattern[currentPhaseIndex].phase === 'inhale' ? [0.8, 1.2] :
                                 selectedBreathwork.pattern[currentPhaseIndex].phase === 'exhale' ? [1.2, 0.8] : 1,
                          opacity: 1
                        }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                          scale: {
                            duration: selectedBreathwork.pattern[currentPhaseIndex].duration,
                            ease: 'easeInOut',
                            repeat: isPlaying ? Infinity : 0
                          }
                        }}
                        className={`w-48 h-48 rounded-full ${
                          selectedBreathwork.pattern[currentPhaseIndex].phase === 'inhale' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                          selectedBreathwork.pattern[currentPhaseIndex].phase === 'exhale' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                          'bg-gradient-to-br from-yellow-400 to-orange-500'
                        } shadow-2xl flex items-center justify-center`}
                      >
                        <div className="text-center">
                          <p className="text-white text-2xl font-bold capitalize">
                            {selectedBreathwork.pattern[currentPhaseIndex].phase}
                          </p>
                          <p className="text-white/80 text-sm mt-2">
                            {Math.ceil(selectedBreathwork.pattern[currentPhaseIndex].duration * (1 - phaseProgress / 100))}s
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Instruction Text */}
                  <div className="text-center">
                    <motion.p
                      key={`instruction-${currentPhaseIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white text-lg font-semibold"
                    >
                      {selectedBreathwork.pattern[currentPhaseIndex].instruction}
                    </motion.p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Progress value={phaseProgress} className="h-2" />
                    <p className="text-white/60 text-center text-sm">
                      {cycleCount} cycles completed
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      className="glass-card text-white hover:glass-card-hover"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={handlePlayPause}
                      className="w-20 h-20 rounded-full"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="glass-card text-white hover:glass-card-hover"
                    >
                      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Meditation Section */}
      {activeTab === 'meditation' && (
        <div className="space-y-6">
          {!selectedMeditation ? (
            <div className="grid gap-4">
              {MEDITATION_SESSIONS.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="glass-card glass-card-hover cursor-pointer" onClick={() => setSelectedMeditation(session)}>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>{session.title}</span>
                        <span className="text-sm text-white/60">{Math.floor(session.duration / 60)} min</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full">
                        {session.category}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Meditation Player */}
              <Card className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{selectedMeditation.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMeditation(null);
                        handleReset();
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      ← Back
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Meditation Visual */}
                  <div className="flex items-center justify-center py-12">
                    <motion.div
                      animate={{
                        scale: isPlaying ? [1, 1.05, 1] : 1,
                        opacity: isPlaying ? [0.8, 1, 0.8] : 1
                      }}
                      transition={{
                        duration: 4,
                        repeat: isPlaying ? Infinity : 0,
                        ease: 'easeInOut'
                      }}
                      className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 shadow-2xl flex items-center justify-center"
                    >
                      <div className="text-center">
                        <p className="text-white text-3xl font-bold">
                          {formatTime(meditationTime)}
                        </p>
                        <p className="text-white/80 text-sm mt-2">
                          / {formatTime(selectedMeditation.duration)}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Script Text */}
                  <div className="min-h-[100px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`script-${currentScriptIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-white text-center text-lg font-medium px-6 leading-relaxed"
                      >
                        {selectedMeditation.script[currentScriptIndex]?.text}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Progress value={(meditationTime / selectedMeditation.duration) * 100} className="h-2" />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      className="glass-card text-white hover:glass-card-hover"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={handlePlayPause}
                      className="w-20 h-20 rounded-full"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="glass-card text-white hover:glass-card-hover"
                    >
                      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
