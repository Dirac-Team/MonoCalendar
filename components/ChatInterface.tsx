import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, DayPlan, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { Button } from './UI';
import { Send, Sparkles, FileText, Type, Video, Image as ImageIcon } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  dayPlan: DayPlan;
  userProfile: UserProfile;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ dayPlan, userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    chatSessionRef.current = createChatSession(userProfile, dayPlan.theme, dayPlan.description);
    
    // Initial greeting from AI
    const initialGreeting = async () => {
      setIsLoading(true);
      try {
        const result: GenerateContentResponse = await chatSessionRef.current!.sendMessage({
          message: "Introduce yourself briefly as my assistant for this platform and ask how you can help with today's content theme." 
        });
        setMessages([{
          id: 'init',
          role: 'model',
          text: result.text || "Ready to plan. What do you need?"
        }]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    initialGreeting();
  }, [dayPlan, userProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: text });
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: result.text || "I couldn't generate a response."
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Error connecting to AI. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Dynamic presets based on platform
  const getPresets = () => {
    const base = [
      { label: "Brainstorm Ideas", icon: Sparkles, prompt: "Give me 3 distinct execution angles for this theme." },
    ];

    if (userProfile.platform === 'YouTube') {
      return [
        ...base,
        { label: "Outline Script", icon: FileText, prompt: "Write a detailed script outline with timestamps." },
        { label: "Thumbnail Ideas", icon: ImageIcon, prompt: "Describe 3 clickable thumbnail concepts with text overlays." },
        { label: "Title Options", icon: Type, prompt: "Give me 5 SEO-friendly viral titles." }
      ];
    } else { // Instagram
      return [
        ...base,
        { label: "Reel Script", icon: Video, prompt: "Write a 30-second Reel script with visual cues and audio suggestions." },
        { label: "Caption & Hashtags", icon: Type, prompt: "Write an engaging caption with a hook and relevant hashtags." },
        { label: "Story Sequence", icon: ImageIcon, prompt: "Plan a 3-slide Story sequence to promote this." }
      ];
    }
  };

  const presets = getPresets();

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Preset Actions */}
      <div className="flex gap-2 p-4 border-b border-zinc-100 overflow-x-auto no-scrollbar">
        {presets.map((p, i) => (
          <button 
            key={i}
            onClick={() => sendMessage(p.prompt)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium uppercase tracking-wide border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-colors whitespace-nowrap rounded-sm"
          >
            <p.icon size={12} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-lg p-4 text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-zinc-100 text-black' 
                : 'bg-white border border-zinc-100 text-zinc-800'}
            `}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-zinc-100 p-4 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-100">
        <div className="relative flex items-center">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about your ${userProfile.platform} content...`}
            rows={1}
            className="w-full pr-12 py-3 pl-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-300 transition-all outline-none resize-none rounded-md"
            style={{ minHeight: '48px' }}
          />
          <button 
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 text-zinc-400 hover:text-black disabled:opacity-30 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};