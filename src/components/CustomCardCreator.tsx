import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Save, Eye, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';


export interface CustomCard {
  id: string;
  affirmation: string;
  mission: string;
  inspiration: string;
  createdBy: string;
  timestamp: number;
  uses: number;
}

interface CustomCardCreatorProps {
  username: string;
  onCardCreated?: (card: CustomCard) => void;
}

const CUSTOM_CARDS_KEY = 'practice_custom_cards';

export default function CustomCardCreator({ username, onCardCreated }: CustomCardCreatorProps) {
  const [affirmation, setAffirmation] = useState('');
  const [mission, setMission] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [preview, setPreview] = useState(false);
  const [userCards, setUserCards] = useState<CustomCard[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadUserCards = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const data = localStorage.getItem(CUSTOM_CARDS_KEY);
      if (data) {
        const allCards: CustomCard[] = JSON.parse(data);
        setUserCards(allCards.filter((c) => c.createdBy === username));
      }
    } catch (error) {
      console.error('Error loading custom cards:', error);
    }
  };

  useState(() => {
    loadUserCards();
  });

  const createCard = () => {
    if (!affirmation.trim() || !mission.trim() || !inspiration.trim()) {
      alert('Please in all fields');
      return;
    }

    const newCard: CustomCard = {
      id: `custom_${Date.now()}_${username}`,
      affirmation: affirmation.trim(),
      mission: mission.trim(),
      inspiration: inspiration.trim(),
      createdBy: username,
      timestamp: Date.now(),
      uses: 0
    };

    try {
      const data = localStorage.getItem(CUSTOM_CARDS_KEY);
      const allCards: CustomCard[] = data ? JSON.parse(data) : [];
      allCards.push(newCard);
      localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(allCards));
      
      setUserCards([...userCards, newCard]);
      setAffirmation('');
      setMission('');
      setInspiration('');
      setPreview(false);
      setShowSuccess(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => setShowSuccess(false), 3000);
      
      onCardCreated?.(newCard);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const deleteCard = (cardId: string) => {
    if (!confirm('Delete this card?')) return;

    try {
      const data = localStorage.getItem(CUSTOM_CARDS_KEY);
      if (data) {
        const allCards: CustomCard[] = JSON.parse(data);
        const filtered = allCards.filter((c) => c.id !== cardId);
        localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(filtered));
        setUserCards(userCards.filter((c) => c.id !== cardId));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8" />
          Custom Card Creator
        </h2>
        <p className="text-indigo-200 text-sm">
          Design your own personalized PRACTICE cards
        </p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/50">
            <AlertDescription className="text-green-300">
              ✨ Card created successfully! You can now use it in your daily pulls.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Creator Form */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Design Your Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affirmation" className="text-white">
                Affirmation
              </Label>
              <Input
                id="affirmation"
                placeholder="I am..."
                value={affirmation}
                onChange={(e) => setAffirmation(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                maxLength={100}
              />
              <p className="text-gray-400 text-xs text-right">{affirmation.length}/100</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission" className="text-white">
                Today's Mission
              </Label>
              <Textarea
                id="mission"
                placeholder="Complete one task..."
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                rows={3}
                maxLength={200}
              />
              <p className="text-gray-400 text-xs text-right">{mission.length}/200</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspiration" className="text-white">
                Inspiration Quote
              </Label>
              <Textarea
                id="inspiration"
                placeholder="A powerful message..."
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                rows={3}
                maxLength={200}
              />
              <p className="text-gray-400 text-xs text-right">{inspiration.length}/200</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setPreview(!preview)}
                variant="outline"
                className="flex-1 bg-white/10 border-purple-500/30 text-white hover:bg-white/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                {preview ? 'Hide' : 'Preview'}
              </Button>
              <Button
                onClick={createCard}
                disabled={!affirmation.trim() || !mission.trim() || !inspiration.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Card
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {preview && affirmation && mission && inspiration ? (
              <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/3c7aff8f-230d-47f2-bcf1-e867252a5833-XsinrK6LfchksIA9GYIBPFTSm2RHNO"
                  alt="PRACTICE Card"
                 
                  className="object-cover"
                />
                
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-white/90 text-xs uppercase tracking-wider font-bold drop-shadow-lg">
                      Affirmation
                    </h3>
                    <p className="text-white text-lg font-bold leading-relaxed drop-shadow-lg">
                      {affirmation}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-white/90 text-xs uppercase tracking-wider font-bold drop-shadow-lg">
                      Today's Mission
                    </h3>
                    <p className="text-white text-base leading-relaxed drop-shadow-lg font-semibold">
                      {mission}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-white/90 text-xs uppercase tracking-wider font-bold drop-shadow-lg">
                      Inspiration
                    </h3>
                    <p className="text-white/95 text-sm italic leading-relaxed drop-shadow-lg font-medium">
                      "{inspiration}"
                    </p>
                  </div>

                  <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/50">
                    Custom Card
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Fill in the fields to see a preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Your Custom Cards */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Your Custom Cards
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              {userCards.length} cards
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userCards.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              You haven't created any custom cards yet
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {userCards.map((card) => (
                <Card key={card.id} className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                        Custom
                      </Badge>
                      <Button
                        onClick={() => deleteCard(card.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-white font-semibold text-sm">{card.affirmation}</p>
                    <p className="text-gray-300 text-xs">{card.mission}</p>
                    <p className="text-gray-400 text-xs italic">"{card.inspiration}"</p>
                    <div className="pt-2 border-t border-white/10 text-xs text-gray-500">
                      Used {card.uses} times
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
