import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, Sparkles, Twitter, X, ExternalLink, Book, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';

export default function About() {
  const baseAddress = '0xee22c1dc292907b4f6cCb40d3cFd827D5a55d4b5';

  const copyAddress = () => {
    navigator.clipboard.writeText(baseAddress);
    toast.success('Address copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="About PRACTICE"
        subtitle="Learn about the creator and the mission"
      />

      {/* PRACTICE → LECHE Visual Flow */}
      <Card className="p-6 relative overflow-hidden glass-card">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        
        <div className="relative">
          <h3 className="text-lg font-bold text-center text-[var(--text-primary)] mb-4">
            PRACTICE to Get LECHE 🥛
          </h3>
          
          <div className="grid gap-4">
            {/* PRACTICE Card */}
            <motion.div 
              className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl p-4 border border-purple-400/30"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-bold text-[var(--text-primary)]">PRACTICE</h4>
                <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full text-purple-300">The Daily Work</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                <span className="font-semibold">Patiently Repeating Altruistic Challenges To Inspire Core Excellence</span>
              </p>
            </motion.div>

            {/* Flowing Arrow */}
            <motion.div 
              className="flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-3xl text-[var(--text-secondary)]"
                >
                  ↓
                </motion.div>
                <p className="text-amber-400 font-bold text-xs">equals</p>
              </div>
            </motion.div>

            {/* LECHE Card */}
            <motion.div 
              className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl p-4 border-2 border-pink-400/40 shadow-lg shadow-pink-500/20"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-5 h-5 text-pink-400" />
                </motion.div>
                <h4 className="text-lg font-bold text-[var(--text-primary)]">LECHE</h4>
                <span className="text-xs bg-pink-500/30 px-2 py-0.5 rounded-full text-pink-300">Sweet Reward 🍼</span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                <span className="font-semibold">Love, Empathy, Community, Healing, Empowerment</span>
              </p>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Creator Info */}
      <Section title="About the Creator">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white font-bold">
                EP
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Eddie Pabon</h3>
                <p className="text-sm text-[var(--text-secondary)]">Creator of PRACTICE</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <p>
                Eddie Pabon is a <span className="font-semibold text-[var(--text-primary)]">multidimensional healer, creator, and community builder</span> with over 20 years of experience working with diverse populations. He helps people reconnect with their limitless light, love, and potentiality through breathwork, meditation, and bodywork that awaken, ground, and transform.
              </p>
              <p>
                Blending sacred masculinity, humor, and heart, Eddie guides participants through his signature <span className="font-semibold text-[var(--text-primary)]">Transcendental Breathwork practice</span>, <span className="italic text-[var(--accent-primary)]">Getting High Off Your Own Supply</span>—a dynamic, transformative technique that uses intentional breathing to release stress, elevate consciousness, and induce profound states of clarity, empowerment, and bliss.
              </p>
              <p>
                Eddie's creativity extends beyond the healing space. He's the visionary behind <span className="font-semibold text-[var(--text-primary)]">$VibeOfficial</span>, Algo Leagues, and this practice card game designed to inspire daily growth and intention.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* Support Section */}
      <Section title="Support the Creator">
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-6 h-6 text-amber-400" />
            <h4 className="text-lg font-bold text-[var(--text-primary)]">Support the Mission</h4>
          </div>
          <p className="text-[var(--text-secondary)] mb-4 text-sm">
            Love PRACTICE? Support Eddie's work and help bring more healing and transformation to the world. Every contribution fuels the mission of empowerment and community building.
          </p>
          
          {/* Base Address */}
          <div className="mb-4">
            <p className="text-[var(--text-secondary)] text-xs mb-2 font-semibold">Base Address:</p>
            <div className="flex items-center gap-2 bg-black/20 rounded-lg p-3">
              <code className="text-purple-300 text-xs flex-1 break-all font-mono">
                {baseAddress}
              </code>
              <Button
                onClick={copyAddress}
                size="sm"
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs"
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Social Follow Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => window.open('https://zora.co/invite/vibeofficial', '_blank')}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Zora
            </Button>
            <Button
              onClick={() => window.open('https://x.com/HaveHonorfaith', '_blank')}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Follow on X
            </Button>
          </div>
        </Card>
      </Section>

      {/* Quote */}
      <Card className="p-6 text-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-block mb-3"
        >
          <Sparkles className="w-8 h-8 text-amber-400" />
        </motion.div>
        <p className="text-[var(--text-secondary)] italic text-sm">
          "Know that you are limitless light, love, and potentiality no matter what your challenge is."
        </p>
        <p className="text-[var(--accent-primary)] text-sm font-semibold mt-2">— Eddie Pabon</p>
      </Card>
    </div>
  );
}
