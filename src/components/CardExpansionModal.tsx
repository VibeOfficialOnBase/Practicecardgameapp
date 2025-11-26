import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Heart, Wind, Lightbulb, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CardExpansion } from '@/data/cardExpansions';
import type { PracticeCard } from '@/data/cards';

interface CardExpansionModalProps {
  open: boolean;
  onClose: () => void;
  card: PracticeCard;
  expansion: CardExpansion | null;
}

export function CardExpansionModal({ open, onClose, card, expansion }: CardExpansionModalProps) {
  if (!expansion) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white/20">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white group z-10"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm text-purple-300 font-semibold">Card #{card.id}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                    {card.affirmation}
                  </h2>
                  <p className="text-indigo-200 text-lg italic">
                    "{card.inspiration}"
                  </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="deeper" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-black/30 p-2 rounded-lg">
                    <TabsTrigger value="deeper" className="data-[state=active]:bg-purple-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Deeper
                    </TabsTrigger>
                    <TabsTrigger value="practice" className="data-[state=active]:bg-indigo-600">
                      <Target className="w-4 h-4 mr-2" />
                      Practice
                    </TabsTrigger>
                    <TabsTrigger value="reflect" className="data-[state=active]:bg-pink-600">
                      <Heart className="w-4 h-4 mr-2" />
                      Reflect
                    </TabsTrigger>
                    {expansion.breathwork && (
                      <TabsTrigger value="breathwork" className="data-[state=active]:bg-blue-600">
                        <Wind className="w-4 h-4 mr-2" />
                        Breathwork
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {/* Deeper Meaning */}
                  <TabsContent value="deeper" className="space-y-4 mt-6">
                    <div className="glass-card p-6 rounded-xl border border-purple-400/30">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        Deeper Meaning
                      </h3>
                      <p className="text-indigo-100 leading-relaxed whitespace-pre-line">
                        {expansion.deeperMeaning}
                      </p>
                    </div>

                    {/* LECHE Connection */}
                    <div className="glass-card p-6 rounded-xl border border-pink-400/30 bg-gradient-to-br from-pink-900/20 to-purple-900/20">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        LECHE Connection
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {expansion.lecheConnection.pillars.map((pillar: string) => (
                          <span
                            key={pillar}
                            className="px-3 py-1 bg-pink-500/30 rounded-full text-pink-200 text-sm font-semibold"
                          >
                            {pillar}
                          </span>
                        ))}
                      </div>
                      <p className="text-pink-100 leading-relaxed">
                        {expansion.lecheConnection.explanation}
                      </p>
                    </div>
                  </TabsContent>

                  {/* Practice */}
                  <TabsContent value="practice" className="space-y-4 mt-6">
                    <div className="glass-card p-6 rounded-xl border border-indigo-400/30">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" />
                        The Practice
                      </h3>
                      <p className="text-indigo-100 leading-relaxed mb-4">
                        {expansion.practice}
                      </p>
                    </div>

                    {/* Integration Tips */}
                    <div className="glass-card p-6 rounded-xl border border-green-400/30">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-green-400" />
                        Integration Tips
                      </h3>
                      <ul className="space-y-2">
                        {expansion.integration.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-green-100">
                            <span className="text-green-400 mt-1">✓</span>
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Reflection */}
                  <TabsContent value="reflect" className="space-y-4 mt-6">
                    <div className="glass-card p-6 rounded-xl border border-pink-400/30">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        Reflection Questions
                      </h3>
                      <div className="space-y-4">
                        {expansion.reflectionQuestions.map((question: string, index: number) => (
                          <div key={index} className="bg-black/30 p-4 rounded-lg">
                            <p className="text-pink-100 leading-relaxed italic">
                              {index + 1}. {question}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-purple-900/30 rounded-lg border border-purple-400/30">
                        <p className="text-purple-200 text-sm">
                          💡 <strong>Tip:</strong> Use the journal feature to explore these questions deeply. Writing creates clarity.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Breathwork */}
                  {expansion.breathwork && (
                    <TabsContent value="breathwork" className="space-y-4 mt-6">
                      <div className="glass-card p-6 rounded-xl border border-blue-400/30">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                          <Wind className="w-6 h-6 text-blue-400" />
                          {expansion.breathwork.name}
                        </h3>
                        <div className="flex gap-3 mb-4 text-sm">
                          <span className="px-3 py-1 bg-blue-500/30 rounded-full text-blue-200">
                            {expansion.breathwork.technique}
                          </span>
                          <span className="px-3 py-1 bg-blue-500/30 rounded-full text-blue-200">
                            {expansion.breathwork.duration}
                          </span>
                        </div>

                        {/* Instructions */}
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-white mb-3">Instructions</h4>
                          <ol className="space-y-2">
                            {expansion.breathwork.instructions.map((instruction: string, index: number) => (
                              <li key={index} className="flex items-start gap-3 text-blue-100">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 text-sm font-bold">
                                  {index + 1}
                                </span>
                                <span className="leading-relaxed">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Benefits */}
                        <div className="mb-6 p-4 bg-green-900/20 rounded-lg border border-green-400/30">
                          <h4 className="text-lg font-bold text-white mb-3">Benefits</h4>
                          <ul className="space-y-2">
                            {expansion.breathwork.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-green-100">
                                <span className="text-green-400">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {/* Footer CTA */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-400/30 text-center">
                  <p className="text-white text-sm mb-2">
                    <strong>Ready to practice?</strong> Close this modal and journal about today's card, or share it with your community!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
