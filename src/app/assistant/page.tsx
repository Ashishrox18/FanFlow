/**
 * @fileoverview Multilingual Chat Assistant Page.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatSkeleton } from "@/components/ui/Skeleton";
import { useAssistant } from "@/hooks/useAssistant";
import { useChatStore } from "@/stores/chat.store";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import { Send, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const { sendMessage, clearMessages, isLoading, error } = useAssistant();
  const { messages } = useChatStore();
  const { language } = useAppStore();
  const stadium = useSelectedStadium();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    void sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden p-4 sm:p-6 lg:p-8" aria-labelledby="assistant-title">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 id="assistant-title" className="text-2xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Ask anything about {stadium.name} in {language}.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:ring-2"
              aria-label="Clear chat history"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          )}
        </header>

        {/* Chat Area */}
        <div 
          className="glass flex flex-1 flex-col overflow-hidden rounded-2xl border"
          role="log"
          aria-live="polite"
        >
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-60">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p>How can I help you today?</p>
                <p className="text-sm mt-2">Try asking for directions, food options, or emergency help.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}
            
            {isLoading && <ChatSkeleton />}
            
            {error && (
              <div className="flex items-center gap-2 text-brand-danger bg-brand-danger/10 p-3 rounded-md text-sm mx-auto w-full max-w-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSubmit}
            className="border-t border-border/50 bg-background/50 p-4"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask in ${language}...`}
                disabled={isLoading}
                className="w-full rounded-full border border-border bg-background px-4 py-3 pr-12 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full transition-all focus-visible:ring-2",
                  input.trim() && !isLoading
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
