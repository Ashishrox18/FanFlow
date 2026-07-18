/**
 * @fileoverview Individual chat message bubble.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { User, Bot } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex w-full gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-brand-secondary text-white",
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "relative flex max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%]",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm glass text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span className={cn("text-[10px] opacity-70", isUser ? "text-right" : "text-left")}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
