import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from './MessageBubble';
import { geminiService } from '@/services/geminiService';
import { Send, Zap, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm **AI Nexus**, your specialized AI assistant powered by Gemini 1.5 Flash. I can only help with topics related to Artificial Intelligence, including machine learning, deep learning, NLP, computer vision, AI ethics, and more. What AI topic would you like to explore?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Gemini service is available
    setApiAvailable(geminiService.isAvailable());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await geminiService.generateResponse(currentInput);
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-bg">
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-border/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-primary animate-pulse-glow">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Nexus
            </h1>
            <p className="text-sm text-muted-foreground">
              {apiAvailable ? 'Powered by Gemini 1.5 Flash' : 'API Configuration Required'}
            </p>
          </div>
        </div>
        {!apiAvailable && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-yellow-400 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-yellow-400/20">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">API Key Required</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-gradient-card flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border/20 backdrop-blur-sm">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about AI..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            variant="neon"
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 max-w-2xl mx-auto">
          AI Nexus specializes in AI topics only and is powered by Gemini 1.5 Flash. 
          Ask about machine learning, deep learning, NLP, computer vision, AI ethics, or related fields.
          {!apiAvailable && (
            <span className="block mt-1 text-yellow-400">
              Note: Set VITE_GEMINI_API_KEY environment variable for full functionality.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};