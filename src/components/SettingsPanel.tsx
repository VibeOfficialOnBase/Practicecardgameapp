import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { isDarkMode, toggleDarkMode, setDarkMode } from '@/utils/darkMode';
import { 
  isSoundEnabled, 
  toggleSound, 
  getSoundVolume, 
  setSoundVolume,
  playSound 
} from '@/utils/soundEffects';

export default function SettingsPanel() {
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    setDarkModeEnabled(isDarkMode());
    setSoundEnabled(isSoundEnabled());
    setVolume(getSoundVolume());
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = toggleDarkMode();
    setDarkModeEnabled(newMode);
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      playSound('button_click');
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setSoundVolume(newVolume);
    playSound('button_click');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">⚙️ Settings</h2>
        <p className="text-gray-300">
          Customize your PRACTICE experience
        </p>
      </div>

      {/* Appearance Settings */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">🎨 Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-white text-base">
                Dark Mode
              </Label>
              <p className="text-gray-400 text-sm">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkModeEnabled}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">🔊 Audio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-enabled" className="text-white text-base">
                Sound Effects
              </Label>
              <p className="text-gray-400 text-sm">
                Enable or disable all sound effects
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          {soundEnabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume" className="text-white text-base">
                  Volume
                </Label>
                <span className="text-gray-400 text-sm">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <Slider
                id="volume"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          )}

          {soundEnabled && (
            <div className="bg-white/5 rounded p-3">
              <p className="text-gray-400 text-sm mb-2">Test sounds:</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => playSound('button_click')}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-blue-500/30 text-white hover:bg-white/20"
                >
                  Click
                </Button>
                <Button
                  onClick={() => playSound('achievement_unlock')}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-blue-500/30 text-white hover:bg-white/20"
                >
                  Achievement
                </Button>
                <Button
                  onClick={() => playSound('level_up')}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-blue-500/30 text-white hover:bg-white/20"
                >
                  Level Up
                </Button>
                <Button
                  onClick={() => playSound('legendary_card')}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-blue-500/30 text-white hover:bg-white/20"
                >
                  Legendary
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">🔒 Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/5 rounded p-4">
            <p className="text-gray-300 text-sm mb-2">
              All your data is stored locally in your browser. Nothing is sent to external servers.
            </p>
            <p className="text-gray-400 text-xs">
              Journal entries, achievements, and progress are private to your device.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
            onClick={() => {
              if (confirm('Are you sure you want to clear ALL app data? This cannot be undone!')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
          >
            🗑️ Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">ℹ️ About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-300 text-sm">
            <strong>PRACTICE</strong> - Patiently Repeating Altruistic Challenges To Inspire Core Excellence
          </p>
          <p className="text-gray-400 text-xs">
            A daily card pull app for motivation and self-empowerment on Base
          </p>
          <div className="pt-4 flex items-center justify-between">
            <p className="text-gray-500 text-xs">Powered by $VibeOfficial</p>
            <p className="text-gray-500 text-xs">v1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
