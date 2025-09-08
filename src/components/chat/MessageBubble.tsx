import React from 'react';
import { User, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessage = (text: string) => {
    // Simple markdown-like formatting for **bold**
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end gap-3 group">
        <div className="flex flex-col items-end max-w-[80%]">
          <div className="bg-gradient-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow-glow-subtle group-hover:shadow-glow-primary transition-all duration-300">
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
          <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 ring-2 ring-border/20">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 group">
      <div className="w-8 h-8 rounded-full bg-gradient-card flex items-center justify-center shrink-0 ring-2 ring-primary/20 shadow-glow-subtle">
        <Zap className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col max-w-[80%]">
        <div className="bg-card border border-border/20 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300">
          <p 
            className="text-sm leading-relaxed text-card-foreground"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
          />
        </div>
        <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          AI Nexus • {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};