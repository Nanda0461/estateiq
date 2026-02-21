"use client";

import { useState, useRef, useEffect } from "react";
import { ai } from "@/ai/genkit";
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

import { useAuth } from "@/hooks/use-auth";

export function AIChatbot({ propertyContext }: { propertyContext?: string }) {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, loading]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = message.trim();
        setMessage("");
        setHistory((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: history,
                    propertyContext,
                }),
            });

            const data = await res.json();
            if (data.response) {
                setHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
            } else {
                setHistory((prev) => [
                    ...prev,
                    { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
                ]);
            }
        } catch (error) {
            setHistory((prev) => [
                ...prev,
                { role: "assistant", content: "Could not connect to the AI assistant." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-amber-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <MessageSquare className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            height: isMinimized ? "64px" : "500px"
                        }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="w-[350px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                <span className="font-semibold text-sm">EstateIQ AI Assistant</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Chat Area */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950"
                                >
                                    {history.length === 0 && (
                                        <div className="text-center py-8 px-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Hi! I'm your AI assistant. Ask me anything about properties, locations, or pricing!
                                            </p>
                                        </div>
                                    )}

                                    {history.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user"
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-blue-600 text-white"
                                                    }`}>
                                                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-sm ${msg.role === "user"
                                                    ? "bg-blue-500 text-white rounded-tr-none"
                                                    : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-tl-none"
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-2 items-center text-neutral-500">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <Bot className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                                                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your question..."
                                            className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors pr-10"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || loading}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 disabled:text-neutral-400 transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
