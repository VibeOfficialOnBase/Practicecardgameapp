import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function DirectMessage({ buddyEmail, userEmail }) {
  const [message, setMessage] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', userEmail, buddyEmail],
    queryFn: async () => {
      const sent = await base44.entities.Message.filter({
        from_email: userEmail,
        to_email: buddyEmail
      });
      const received = await base44.entities.Message.filter({
        from_email: buddyEmail,
        to_email: userEmail
      });
      return [...sent, ...received].sort((a, b) => 
        new Date(a.created_date) - new Date(b.created_date)
      );
    },
    enabled: !!userEmail && !!buddyEmail
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      await base44.entities.Message.create({
        from_email: userEmail,
        to_email: buddyEmail,
        content: message
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessage('');
    }
  });

  const unreadCount = messages.filter(m => 
    m.to_email === userEmail && !m.read
  ).length;

  return (
    <div>
      <Button
        onClick={() => setShowMessages(!showMessages)}
        variant="outline"
        className="rounded-xl relative"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Message
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {showMessages && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 card-organic p-4 space-y-4"
          >
            <div className="max-h-64 overflow-y-auto space-y-2">
              {messages.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">
                  No messages yet. Start a conversation!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl ${
                      msg.from_email === userEmail
                        ? 'bg-amber-100 ml-8'
                        : 'bg-slate-100 mr-8'
                    }`}
                  >
                    <p className="text-sm text-slate-800">{msg.content}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(msg.created_date), { addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-16 rounded-xl"
              />
              <Button
                onClick={() => sendMessage.mutate()}
                disabled={!message.trim() || sendMessage.isPending}
                className="bg-amber-500 hover:bg-amber-600 rounded-xl px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}