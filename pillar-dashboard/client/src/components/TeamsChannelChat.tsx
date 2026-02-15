import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Hash } from 'lucide-react';
import { ChannelMessage, ChannelInfo } from '@/lib/types';

const CHANNEL_COLORS: Record<string, string> = {
  'I': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  'II': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'III': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'IV': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'V': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

const CHANNEL_ACCENT: Record<string, string> = {
  'I': 'border-violet-400 dark:border-violet-600',
  'II': 'border-blue-400 dark:border-blue-600',
  'III': 'border-emerald-400 dark:border-emerald-600',
  'IV': 'border-amber-400 dark:border-amber-600',
  'V': 'border-rose-400 dark:border-rose-600',
};

interface TeamsChannelChatProps {
  channel: ChannelInfo;
  messages: ChannelMessage[];
  onSendMessage: (channelNumber: string, text: string) => void;
  onClose: () => void;
}

function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function TeamsChannelChat({ channel, messages, onSendMessage, onClose }: TeamsChannelChatProps) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    // Focus input on open
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(channel.number, text);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border" style={{ width: 420 }}>
      {/* Channel Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b-2 ${CHANNEL_ACCENT[channel.number] || 'border-border'} bg-card`}>
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
          <Badge className={`${CHANNEL_COLORS[channel.number]} shrink-0`}>{channel.number}</Badge>
          <span className="font-semibold text-sm text-foreground truncate">{channel.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0 ml-2">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Channel description */}
      <div className="px-4 py-2 bg-muted/30 border-b border-border">
        <p className="text-xs text-muted-foreground">{channel.description}</p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Hash className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start the conversation in #{channel.name}
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="group flex gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {msg.author.charAt(0).toUpperCase()}
                </div>
                {/* Message body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">{msg.author}</span>
                    <span className="text-[10px] text-muted-foreground">{formatMessageTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channel.name}...`}
            className="flex-1 text-sm"
          />
          <Button size="sm" onClick={handleSend} disabled={!draft.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
