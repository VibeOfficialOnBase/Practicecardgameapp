import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Target, Sparkles, Wind, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { educationalArticles, type EducationalArticle } from '@/data/educationalArticles';
import { breathworkGuides, type BreathworkGuide } from '@/data/breathworkGuides';

export function LearnSection() {
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<BreathworkGuide | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    Philosophy: <Sparkles className="w-5 h-5" />,
    Psychology: <Brain className="w-5 h-5" />,
    LECHE: <Heart className="w-5 h-5" />,
    Practical: <Target className="w-5 h-5" />,
    Consciousness: <BookOpen className="w-5 h-5" />
  };

  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-green-500/20 text-green-300 border-green-400/30',
    Intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    Advanced: 'bg-red-500/20 text-red-300 border-red-400/30'
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedArticle(null)}
            variant="ghost"
            className="text-white mb-6"
          >
            ← Back to Learn
          </Button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl border border-white/20"
          >
            {/* Article Header */}
            <div className="flex items-center gap-3 mb-4">
              {categoryIcons[selectedArticle.category]}
              <span className="text-purple-300 font-semibold">{selectedArticle.category}</span>
              <span className="text-white/60">•</span>
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-white/60">{selectedArticle.readTime}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              {selectedArticle.title}
            </h1>

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-indigo-100 leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="glass-card p-6 rounded-xl border border-purple-400/30 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {selectedArticle.keyTakeaways.map((takeaway: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-indigo-100">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Prompts */}
            <div className="glass-card p-6 rounded-xl border border-pink-400/30 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Practice Prompts
              </h3>
              <ul className="space-y-3">
                {selectedArticle.practicePrompts.map((prompt: string, index: number) => (
                  <li key={index} className="text-pink-100 italic">
                    {index + 1}. {prompt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            {selectedArticle.resources.length > 0 && (
              <div className="glass-card p-6 rounded-xl border border-blue-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Recommended Resources
                </h3>
                <ul className="space-y-2">
                  {selectedArticle.resources.map((resource: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-blue-100">
                      <ChevronRight className="w-4 h-4 text-blue-400 mt-1" />
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.article>
        </div>
      </div>
    );
  }

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedGuide(null)}
            variant="ghost"
            className="text-white mb-6"
          >
            ← Back to Learn
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl border border-white/20"
          >
            {/* Guide Header */}
            <div className="flex items-center gap-3 mb-4">
              <Wind className="w-6 h-6 text-blue-400" />
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${difficultyColors[selectedGuide.difficulty]}`}>
                {selectedGuide.difficulty}
              </span>
              <span className="text-white/60">•</span>
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-white/60">{selectedGuide.duration}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              {selectedGuide.name}
            </h1>

            {/* Best For */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">Best For:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGuide.bestFor.map((use: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-200 text-sm">
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="glass-card p-6 rounded-xl border border-blue-400/30 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Step-by-Step Instructions
              </h3>
              <ol className="space-y-3">
                {selectedGuide.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-indigo-100">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 font-bold">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Benefits */}
            <div className="glass-card p-6 rounded-xl border border-green-400/30 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-400" />
                Benefits
              </h3>
              <ul className="space-y-2">
                {selectedGuide.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-green-100">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Science */}
            <div className="glass-card p-6 rounded-xl border border-purple-400/30 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                The Science
              </h3>
              <p className="text-purple-100 leading-relaxed">
                {selectedGuide.science}
              </p>
            </div>

            {/* Tips */}
            <div className="glass-card p-6 rounded-xl border border-yellow-400/30 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Pro Tips
              </h3>
              <ul className="space-y-2">
                {selectedGuide.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-yellow-100">
                    <span className="text-yellow-400 mt-1">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            <div className="p-6 bg-red-900/20 rounded-xl border border-red-400/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                ⚠️ Safety & Contraindications
              </h3>
              <ul className="space-y-2">
                {selectedGuide.contraindications.map((warning: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-red-100">
                    <span className="text-red-400 mt-1">!</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold gradient-text mb-4">
            PRACTICE Academy
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Deepen your understanding with articles, guides, and practices to transform your journey
          </p>
        </motion.div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-4 bg-black/30 p-2 rounded-lg mb-8">
            <TabsTrigger value="articles" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="breathwork" className="data-[state=active]:bg-blue-600">
              <Wind className="w-4 h-4 mr-2" />
              Breathwork Guides
            </TabsTrigger>
          </TabsList>

          {/* Articles */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {educationalArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <Card className="glass-card border-2 border-white/20 hover:border-purple-400/50 transition-all h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {categoryIcons[article.category]}
                        <span className="text-purple-300 font-semibold">{article.category}</span>
                        <span className="text-white/60">•</span>
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">{article.readTime}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-purple-300 font-semibold">
                        Read Article
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Breathwork Guides */}
          <TabsContent value="breathwork" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {breathworkGuides.map((guide) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedGuide(guide)}
                >
                  <Card className="glass-card border-2 border-white/20 hover:border-blue-400/50 transition-all h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Wind className="w-5 h-5 text-blue-400" />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[guide.difficulty]}`}>
                          {guide.difficulty}
                        </span>
                        <span className="text-white/60">•</span>
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">{guide.duration}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {guide.name}
                      </h3>
                      <p className="text-indigo-200 text-sm mb-4">
                        Best for: {guide.bestFor.slice(0, 2).join(', ')}
                      </p>
                      <div className="flex items-center text-blue-300 font-semibold">
                        View Guide
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
