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
    // Enhanced formatting for professional AI responses
    let formatted = text;
    
    // Format bold text **text** → <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
    
    // Format numbered lists
    formatted = formatted.replace(/^(\d+)\.\s/gm, '<span class="text-accent font-medium">$1.</span> ');
    
    // Format bullet points
    formatted = formatted.replace(/^[•\-\*]\s/gm, '<span class="text-accent">•</span> ');
    
    // Format section headers (lines ending with :)
    formatted = formatted.replace(/^([A-Z][^:\n]*):$/gm, '<div class="text-primary font-semibold text-base mt-3 mb-1 border-b border-primary/20 pb-1">$1</div>');
    
    // Format code blocks or technical terms in backticks
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-muted/30 text-accent px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Add line breaks for better readability
    formatted = formatted.replace(/\n\n/g, '</p><p class="mt-3">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags if not already wrapped
    if (!formatted.startsWith('<p') && !formatted.startsWith('<div')) {
      formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
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
      <div className="flex flex-col max-w-[85%]">
        <div className="bg-card/80 border border-border/30 px-5 py-4 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300">
          <div 
            className="text-sm leading-relaxed text-card-foreground prose prose-sm prose-invert max-w-none
                      [&>p]:mb-2 [&>p:last-child]:mb-0
                      [&>div]:mb-2 [&>div:last-child]:mb-0
                      [&_code]:text-xs [&_code]:font-mono
                      [&_strong]:text-primary [&_strong]:font-semibold"
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