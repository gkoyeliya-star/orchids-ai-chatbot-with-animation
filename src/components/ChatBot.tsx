"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, X, Loader2, History, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

function GlowingOrb() {
  return (
    <div className="absolute -top-20 -right-20 w-40 h-40 pointer-events-none animate-blob-rotate">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-30 blur-[40px]" />
      <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 opacity-40 blur-[30px] animate-blob-pulse" />
    </div>
  );
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat-history");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveToHistory = (msgs: Message[]) => {
    if (msgs.length === 0) return;
    const session: ChatSession = {
      id: Date.now().toString(),
      title: msgs[0].content.slice(0, 30) + (msgs[0].content.length > 30 ? "..." : ""),
      messages: msgs,
      timestamp: Date.now(),
    };
    const updated = [session, ...chatHistory].slice(0, 20);
    setChatHistory(updated);
    localStorage.setItem("chat-history", JSON.stringify(updated));
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setShowHistory(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chatHistory.filter((s) => s.id !== id);
    setChatHistory(updated);
    localStorage.setItem("chat-history", JSON.stringify(updated));
  };

  const handleClose = () => {
    if (messages.length > 0) {
      saveToHistory(messages);
    }
    setMessages([]);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "Sorry, I couldn't respond.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px]"
          >
            <div className="relative flex h-[650px] flex-col rounded-3xl border border-white/10 bg-[#0d0d14]/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
              <GlowingOrb />

              <div className="relative flex items-center justify-between p-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 animate-spin-slower">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
                      <div className="absolute inset-[2px] rounded-full bg-[#0d0d14] flex items-center justify-center">
                        <Bot className="h-5 w-5 text-fuchsia-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">AI Assistant</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-white/50">Online • Groq LLM</span>
                      </div>
                    </div>
                  </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHistory(!showHistory)}
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center transition-colors",
                      showHistory
                        ? "bg-fuchsia-500/20 text-fuchsia-400"
                        : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <History className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showHistory ? (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 overflow-y-auto p-4"
                  >
                    <h4 className="text-sm font-medium text-white/70 mb-3">Chat History</h4>
                    {chatHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <History className="h-10 w-10 text-white/20 mb-3" />
                        <p className="text-sm text-white/40">No history yet</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {chatHistory.map((session) => (
                          <motion.div
                            key={session.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => loadSession(session)}
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{session.title}</p>
                              <p className="text-xs text-white/40">
                                {new Date(session.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => deleteSession(session.id, e)}
                              className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 transition-opacity"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-5"
                  >
                    <div className="flex flex-col gap-4">
                      {messages.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative mb-6"
                          >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-2xl opacity-40" />
                            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                              <Bot className="h-10 w-10 text-fuchsia-400" />
                            </div>
                          </motion.div>
                          <h4 className="text-lg font-medium text-white">How can I help you?</h4>
                          <p className="mt-2 text-sm text-white/40 max-w-[200px]">
                            Ask me anything. I&apos;m powered by Groq&apos;s ultra-fast AI.
                          </p>
                        </motion.div>
                      )}

                      {messages.map((m, idx) => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "flex items-end gap-2",
                            m.role === "user" ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              m.role === "user"
                                ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                                : "bg-gradient-to-br from-cyan-500 to-blue-500"
                            )}
                          >
                            {m.role === "user" ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                              m.role === "user"
                                ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-sm"
                                : "bg-white/5 border border-white/10 text-white/90 rounded-bl-sm"
                            )}
                          >
                            {m.content}
                          </motion.div>
                        </motion.div>
                      ))}

                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-end gap-2"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 px-5 py-4">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                }}
                                className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showHistory && (
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-12 w-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </motion.button>
                  </form>
                  <p className="mt-3 text-center text-[10px] text-white/30">
                    Powered by Groq • Llama 3.3 70B
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
