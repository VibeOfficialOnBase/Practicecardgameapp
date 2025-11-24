import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function ChakraBlasterHowToPlay({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl text-white bg-gradient-to-br from-purple-800 to-indigo-800 border-purple-500 shadow-lg ensure-readable-strong">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-white ensure-readable-strong">How to Play Chakra Blaster MAX</DialogTitle>
          <DialogDescription className="text-center text-purple-200 ensure-readable">
            Unleash your inner power to overcome emotional challenges!
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-4 text-purple-100 ensure-readable">
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-white ensure-readable-strong">Objective</h3>
            <p className="mb-2">Clear waves of emotional enemies to reach higher levels. Defeat bosses to unlock new worlds and deeper understanding.</p>
            <p>Every enemy cleared and boss defeated grants Lumina Coins and affirmations, helping you grow stronger!</p>
          </section>

          <Separator className="my-6 bg-purple-500/50" />

          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-white ensure-readable-strong">Controls</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Movement (Desktop):</strong> Arrow keys or WASD to navigate your meditating figure.</li>
              <li><strong>Movement (Mobile/Touch):</strong> Touch and drag to move your figure, or tap to shoot.</li>
              <li><strong>Shoot:</strong> Spacebar or click/tap to fire light-energy orbs. Your character will also auto-fire.</li>
              <li><strong>Pause:</strong> Click the settings icon in the top right.</li>
            </ul>
          </section>

          <Separator className="my-6 bg-purple-500/50" />

          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-white ensure-readable-strong">Enemy Types & Behaviors</h3>
            <p className="mb-2">Each enemy embodies a different emotional challenge:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Anger (Red):</strong> Fast, aggressive, rushes toward you. Stay agile!</li>
              <li><strong>Fear (Blue):</strong> Zigzags unpredictably. Hard to predict!</li>
              <li><strong>Regret (Purple):</strong> Slow but tanky. Takes multiple hits.</li>
              <li><strong>Sadness (Light Blue):</strong> Orbits around you slowly. Keep moving!</li>
              <li><strong>Guilt (Orange):</strong> Moves in wave patterns. Time your shots!</li>
              <li><strong>Shame (Dark Red):</strong> Spirals inward. Don't get trapped!</li>
              <li><strong>Anxiety (Yellow):</strong> Erratic, sudden movements. Very unpredictable!</li>
            </ul>
          </section>

          <Separator className="my-6 bg-purple-500/50" />

          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-white ensure-readable-strong">Boss Battles</h3>
            <p className="mb-2">Every few levels, face powerful Bosses:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Much larger and themed to intense emotions.</li>
              <li>Possess multiple phases with distinct attack patterns.</li>
              <li>Defeating a boss unlocks the next level and rewards you with extra coins and affirmations.</li>
            </ul>
          </section>

          <Separator className="my-6 bg-purple-500/50" />

          <section>
            <h3 className="text-xl font-semibold mb-2 text-white ensure-readable-strong">Upgrades</h3>
            <p className="mb-2">Spend your Lumina Coins in the Upgrade Menu to enhance your abilities:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Fire Rate:</strong> Shoot faster to clear enemies quickly.</li>
              <li><strong>Bullet Power:</strong> Deal more damage per shot.</li>
              <li><strong>Extra Lives:</strong> Increase your maximum health.</li>
              <li><strong>Shield Duration:</strong> Stay protected longer.</li>
              <li>All purchased upgrades apply immediately to your gameplay!</li>
            </ul>
          </section>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}