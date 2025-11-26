'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Coffee, Heart, Sparkles, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AboutCreatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutCreatorModal({ isOpen, onClose }: AboutCreatorModalProps) {
  const baseAddress = '0xee22c1dc292907b4f6cCb40d3cFd827D5a55d4b5'

  const copyAddress = () => {
    navigator.clipboard.writeText(baseAddress)
    toast.success('Address copied to clipboard!')
  }

  const handleSupport = () => {
    // Open in a new window to support Base payment
    window.open(`https://base.org/address/${baseAddress}`, '_blank')
    toast.success('Thank you for your support! 💜')
  }

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
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl shadow-2xl border border-purple-500/30"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Header with Sparkles */}
              <div className="text-center mb-5">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="inline-block mb-3"
                >
                  <Sparkles className="w-10 h-10 text-yellow-300" />
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  About the Creator
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
              </div>

              {/* PRACTICE → LECHE Visual Flow - MOVED TO TOP */}
              <div className="mb-5 relative bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-center text-white mb-3">PRACTICE to Get LECHE 🥛</h3>
                
                <div className="grid gap-3">
                  {/* PRACTICE Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-purple-600/40 to-indigo-600/40 rounded-lg p-3 border border-purple-400/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <h4 className="text-base font-bold text-white">PRACTICE</h4>
                      <span className="text-[10px] bg-purple-500/40 px-2 py-0.5 rounded-full text-purple-200">The Daily Work</span>
                    </div>
                    <p className="text-purple-200 text-xs">
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
                        className="text-3xl"
                      >
                        ↓
                      </motion.div>
                      <p className="text-yellow-300 font-bold text-xs">equals</p>
                    </div>
                  </motion.div>

                  {/* LECHE Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-pink-600/40 to-rose-600/40 rounded-lg p-3 border-2 border-pink-400/60 shadow-lg shadow-pink-500/30"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Heart className="w-4 h-4 text-pink-300" />
                      </motion.div>
                      <h4 className="text-base font-bold text-white">LECHE</h4>
                      <span className="text-[10px] bg-pink-500/50 px-2 py-0.5 rounded-full text-pink-200">Sweet Reward 🍼</span>
                    </div>
                    <p className="text-pink-200 text-xs">
                      <span className="font-semibold">Love, Empathy, Community, Healing, Empowerment</span>
                    </p>
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </div>

              {/* Creator Info */}
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Eddie Pabon
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-purple-100 leading-relaxed">
                    Eddie Pabon is a <span className="font-semibold text-white">multidimensional healer, creator, and community builder</span> with over 20 years of experience working with diverse populations. He helps people reconnect with their limitless light, love, and potentiality through breathwork, meditation, and bodywork that awaken, ground, and transform.
                  </p>
                  <p className="text-purple-100 leading-relaxed">
                    Blending sacred masculinity, humor, and heart, Eddie guides participants through his signature <span className="font-semibold text-white">Transcendental Breathwork practice</span>, <span className="italic text-pink-300">Getting High Off Your Own Supply</span>—a dynamic, transformative technique that uses intentional breathing to release stress, elevate consciousness, and induce profound states of clarity, empowerment, and bliss.
                  </p>
                  <p className="text-purple-100 leading-relaxed">
                    Eddie's creativity extends beyond the healing space. He's the visionary behind <span className="font-semibold text-white">$VibeOfficial</span>, <a href="https://x.com/algoleagues" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors">Algo Leagues</a>, and a practice card game designed to inspire daily growth and intention. He's also the author of <a href="https://www.amazon.com/Son-Will-Rise-December/dp/0999189530/ref=mp_s_a_1_1?crid=15CSZ0JI6PLB0&dib=eyJ2IjoiMSJ9.ObVLaac3ABDLtqZHE7pcyw.lmqW_fYvZ0udmNL4AOREzw4zIHgCJ1yNHVkwxeLoHl0&dib_tag=se&keywords=the+son+will+rise+in+december+book&qid=1761693732&sprefix=the+son+will+rise+in+december+book%2Caps%2C111&sr=8-1" target="_blank" rel="noopener noreferrer" className="italic text-pink-300 hover:text-pink-200 underline transition-colors cursor-pointer">The Son Will Rise In December</a>, a work that blends storytelling with heartfelt guidance, uplifting readers through transformative insights. Eddie leads a thriving Meetup community, holding space for authentic connection, healing, and joy.
                  </p>
                  <p className="text-purple-100 leading-relaxed">
                    Through his philosophies of <span className="font-semibold text-white">PRACTICE</span> (Patiently Repeating Altruistic Challenges To Inspire Core Excellence) and <span className="font-semibold text-white">LECHE</span> (Love, Empathy, Community, Healing, Empowerment), Eddie reminds us that true expansion comes not from perfection but from presence, breath, and heart.
                  </p>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-purple-400/30">
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="w-5 h-5 text-yellow-300" />
                  <h4 className="text-lg font-bold text-white">Support the Creator</h4>
                </div>
                <p className="text-purple-100 mb-3 text-xs leading-relaxed">
                  Love PRACTICE? Support Eddie's work and help bring more healing and transformation to the world. Every contribution fuels the mission of empowerment and community building.
                </p>
                
                {/* Base Address */}
                <div className="mb-3">
                  <p className="text-purple-200 text-xs mb-2 font-semibold">Base Address:</p>
                  <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3">
                    <code className="text-purple-200 text-xs flex-1 break-all font-mono">
                      {baseAddress}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Social Follow Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Zora Button */}
                  <Button
                    onClick={() => window.open('https://zora.co/invite/vibeofficial', '_blank')}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L0 12L12 24L24 12L12 0ZM12 18L6 12L12 6L18 12L12 18Z"/>
                    </svg>
                    Zora
                  </Button>

                  {/* X (Twitter) Button */}
                  <Button
                    onClick={() => window.open('https://x.com/HaveHonorfaith', '_blank')}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Twitter className="w-5 h-5" />
                    Follow on X
                  </Button>
                </div>
              </div>

              {/* Tutorial Section */}
              <div className="mt-5 pt-5 border-t border-white/20">
                <button
                  onClick={() => {
                    localStorage.removeItem('practice_tutorial_completed');
                    onClose();
                    // Reload page to trigger tutorial
                    window.location.reload();
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                             text-white font-bold rounded-xl hover:scale-105 
                             transition-transform shadow-lg hover:shadow-purple-500/50 
                             flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  📖 Show Tutorial Again
                </button>
                <p className="text-xs text-white/60 text-center mt-2">
                  Restart the welcome tutorial to review PRACTICE features
                </p>
              </div>

              {/* Footer Quote */}
              <div className="mt-5 text-center">
                <p className="text-purple-300 text-xs italic">
                  "Know that you are limitless light, love, and potentiality no matter what your challenge is."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
