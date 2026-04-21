"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Bot, Sparkles } from "lucide-react";
import ChatBot from "./ChatBot";

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Show button after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-2 w-[95vw] max-w-[420px] animate-in fade-in slide-in-from-bottom-10 duration-500 ease-out">
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/30 ring-1 ring-border bg-card">
            <ChatBot />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-black/5 text-muted-foreground hover:bg-black/10 hover:text-foreground transition lg:hidden z-50 backdrop-blur-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-500 hover:scale-110 active:scale-90 ${
          isVisible 
            ? "opacity-100 translate-y-0 scale-100 animate-in zoom-in-50 duration-500" 
            : "opacity-0 translate-y-20 scale-50"
        } ${isOpen ? "rotate-180" : "hover:rotate-12"}`}
      >
        {isOpen ? (
          <X className="h-7 w-7 animate-in spin-in-180 duration-500" />
        ) : (
          <div className="relative">
            <Bot className="h-7 w-7 animate-in zoom-in duration-500" />
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-primary"></span>
            </div>
          </div>
        )}

        {/* Label on hover */}
        {!isOpen && isVisible && (
          <div className="absolute right-20 whitespace-nowrap rounded-xl bg-foreground px-4 py-2 text-xs font-black text-background opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-2 pointer-events-none shadow-xl hidden md:block">
            Need help? Chat with AI Assistant
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 rotate-45 h-2 w-2 bg-foreground" />
          </div>
        )}
      </button>
    </div>
  );
}

