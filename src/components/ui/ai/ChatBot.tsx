"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, SendHorizontal, User, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { getAIChatReply } from "@/services/ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const quickPrompts = [
  "How do I book a tutor?",
  "Show payment help",
  "How can I become a tutor?",
  "What subjects are available?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m TutorByte AI Assistant. I can help with booking, tutor info, payments, and FAQs.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const newMessage: ChatMessage = { 
      role: "user", 
      content, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    const nextMessages = [...messages, newMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // Filter messages to ensure Gemini starts with a 'user' message and alternates roles correctly.
      // We also strip the 'timestamp' field before sending.
      const apiMessages = nextMessages
        .filter((msg, idx) => {
          // If the first message is from assistant (welcome message), skip it for the AI context
          if (idx === 0 && msg.role === "assistant") return false;
          return true;
        })
        .map(({ role, content }) => ({ role, content }));

      const result = await getAIChatReply(apiMessages);

      if (!result?.success || !result?.data?.reply) {
        throw new Error(result?.message || "Chat failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to get reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-border">
      {/* Header */}
      <div className="relative flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-5 py-5 text-primary-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner ring-1 ring-white/30">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight">AI Assistant</h3>
          <div className="flex items-center gap-1.5 opacity-90">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Support Online</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden bg-muted/5 p-4">
        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2 scrollbar-thin scrollbar-thumb-muted">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ring-2 ring-background ${
                    msg.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                </div>

                <div
                  className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.content}
                  <div className={`mt-1.5 flex items-center gap-1 text-[10px] font-medium opacity-60 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                    <Clock size={10} />
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot size={14} />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-muted/50 animate-pulse delay-75" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Bar */}
        <div className="mt-4 space-y-3">
          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 px-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95"
                >
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="relative flex items-center gap-2 px-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              className="h-12 flex-1 rounded-2xl border border-border bg-card px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-40"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}