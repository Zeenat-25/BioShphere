"use client";

import { useRef, useState, useEffect } from "react";
import type { ExperienceLevel } from "@/lib/biosphere/types";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Is today a good day to spray biologicals?",
  "Explain the disease risk score",
  "What government schemes apply to me?",
];

export function AIAssistant({ experience }: { experience: ExperienceLevel | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "I'm the BioSphere assistant. Ask me about weather, sensors, biologicals, or schemes." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, experience }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong reaching the assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-h-[28rem] card flex flex-col overflow-hidden fade-in">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">BioSphere Assistant</span>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground text-sm">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-[13px] leading-relaxed max-w-[90%] rounded-lg px-3 py-2 ${
                  m.role === "user" ? "ml-auto bg-accent text-panel" : "bg-panel-2 text-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-[13px] text-muted px-3">Thinking…</div>}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2 py-1 rounded-full border border-border text-muted hover:text-foreground hover:border-accent/50 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-2.5 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your farm…"
              className="flex-1 text-[13px] bg-transparent outline-none px-2 text-foreground placeholder:text-muted/70"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-md bg-accent text-panel disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open BioSphere assistant"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-accent text-panel shadow-lg flex items-center justify-center text-lg font-semibold hover:opacity-90 transition pulse-ring"
      >
        {open ? "✕" : "AI"}
      </button>
    </>
  );
}
