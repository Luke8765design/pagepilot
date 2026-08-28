import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const suggestions = [
  "What can an AI chatbot do for me?",
  "Can AI answer my phone?",
  "How much does a website cost?",
];

const greeting = {
  role: "assistant",
  content: "Hi! I'm Pilot 👋 Ask me anything about our AI chatbots, AI receptionists or websites — or how we can help your business grow.",
};

export const ChatConversation = ({ variant = "inline" }) => {
  const { openBooking } = useBooking();
  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const sessionRef = useRef(Math.random().toString(36).slice(2));

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const send = useCallback(async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          session_id: sessionRef.current,
        }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop();
        for (const line of lines) {
          const m = line.match(/^data: (.*)$/s);
          if (!m) continue;
          const data = m[1];
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.t) {
              acc += parsed.t;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch (_) {}
        }
      }
      if (!acc) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: "Sorry, I had trouble responding. Please try again or book a quick call." };
          return copy;
        });
      }
    } catch (e) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "Connection issue — please try again." };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const height = variant === "float" ? "h-[22rem]" : "h-[26rem] md:h-[30rem]";

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 border-b border-black/5 bg-[#FDFBF4] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-white">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">Pilot Assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-ink/45">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" /> Online now
          </p>
        </div>
      </div>

      <div ref={scrollRef} className={`${height} space-y-4 overflow-y-auto px-5 py-5`} data-testid="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-ink text-white"
                  : "rounded-bl-md bg-[#F6F4EE] text-ink/80"
              }`}
              data-testid={`chat-msg-${m.role}`}
            >
              {m.content || (loading && i === messages.length - 1 ? <Loader2 size={15} className="animate-spin text-gold-dark" /> : "")}
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-ink/70 transition-colors duration-300 hover:border-gold hover:text-gold-dark"
              data-testid="chat-suggestion"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-black/5 px-4 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Pilot anything…"
          className="flex-1 rounded-full border border-black/10 bg-[#FAFAFA] px-4 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink/35 focus:border-gold focus:ring-2 focus:ring-gold/40"
          data-testid="chat-input"
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          data-testid="chat-send-button"
          aria-label="Send message"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
      <button
        onClick={() => openBooking()}
        className="border-t border-black/5 bg-white py-2.5 text-center text-xs font-medium text-gold-dark transition-colors duration-300 hover:bg-[#FDFBF4]"
        data-testid="chat-book-call-button"
      >
        Prefer to talk? Book a free call →
      </button>
    </div>
  );
};
