import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useDragControls } from "framer-motion";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AnimatedChatbotIcon } from "@/components/AnimatedChatbotIcon";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "portfolio_chat_history_v1";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const SUGGESTIONS = [
  "من أنت؟",
  "ما مهاراتك؟",
  "أرني مشاريعك",
  "كيف أتواصل معك؟",
];

const TOUR_MESSAGES = [
  "👋 مرحباً بك في بورتفوليو أحمد!",
  "🎯 هنا تجد مهاراتي وخبراتي",
  "🚀 اكتشف مشاريعي المميزة!",
  "💬 اضغط عليّ لتسألني أي شيء!",
];

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tourPhase, setTourPhase] = useState<"grow" | "travel" | "greet" | "return" | "idle">("grow");
  const [tourMsgIdx, setTourMsgIdx] = useState(0);
  const [showTourBubble, setShowTourBubble] = useState(false);
  const [botScale, setBotScale] = useState(1);
  const [iconHovered, setIconHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Drag position
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Tour animation sequence
  useEffect(() => {
    if (open) return;
    // Phase 1: Grow to 2x
    const t1 = setTimeout(() => {
      setBotScale(2);
      setTourPhase("travel");
    }, 800);

    // Phase 2: Travel to top-left area
    const t2 = setTimeout(() => {
      setTourPhase("greet");
      setShowTourBubble(true);
    }, 2200);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Cycle through tour greeting messages
  useEffect(() => {
    if (tourPhase !== "greet" || open) return;
    if (tourMsgIdx >= TOUR_MESSAGES.length) {
      // Done greeting, return home
      const t = setTimeout(() => {
        setShowTourBubble(false);
        setTourPhase("return");
        setBotScale(1);
        setTimeout(() => setTourPhase("idle"), 1200);
      }, 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTourMsgIdx((i) => i + 1), 2500);
    return () => clearTimeout(t);
  }, [tourPhase, tourMsgIdx, open]);

  // Load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {}
  }, [messages]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/portfolio-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });

      if (res.status === 429) { toast.error("الكثير من الطلبات. حاول لاحقاً."); throw new Error("rate"); }
      if (res.status === 402) { toast.error("AI credits exhausted."); throw new Error("credits"); }
      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const data = t.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError" && !["rate", "credits"].includes(e.message)) {
        toast.error("حدث خطأ. حاول مجدداً.");
      }
      setMessages((m) => (m[m.length - 1]?.content === "" ? m.slice(0, -1) : m));
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Compute tour position for the bot
  const getTourStyle = () => {
    if (tourPhase === "travel" || tourPhase === "greet") {
      return { bottom: "auto", top: "120px", right: "auto", left: "80px" };
    }
    return {};
  };

  const isTouring = tourPhase === "travel" || tourPhase === "greet";

  return (
    <>
      {/* Full-screen drag constraint */}
      <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none" />

      {/* Tour greeting bubble */}
      <AnimatePresence>
        {showTourBubble && !open && tourMsgIdx <= TOUR_MESSAGES.length && tourMsgIdx > 0 && (
          <motion.div
            key={`tour-${tourMsgIdx}`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed z-50 max-w-[260px] px-4 py-3 rounded-2xl rounded-tl-sm glass-strong border border-primary/30 text-sm font-medium shadow-glow-sm"
            style={{ top: "80px", left: "160px" }}
          >
            <span className="text-gradient">{TOUR_MESSAGES[tourMsgIdx - 1]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating draggable button */}
      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ x: dragX, y: dragY }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          ...(isTouring ? { position: "fixed" as any } : {}),
        }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        whileHover={{ scale: isTouring ? botScale : 1.08 }}
        onHoverStart={() => setIconHovered(true)}
        onHoverEnd={() => setIconHovered(false)}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setOpen((v) => !v);
          setTourPhase("idle");
          setShowTourBubble(false);
          setBotScale(1);
        }}
        className={`fixed z-50 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-700 ${
          isTouring ? "top-[120px] left-[80px] bottom-auto right-auto" : "bottom-6 right-6"
        }`}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              className="w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center text-primary-foreground"
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.img
              key="bot"
              src={chatbotIcon}
              alt="Chatbot"
              width={64}
              height={64}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{
                rotate: 0,
                opacity: 1,
                scale: botScale,
              }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, duration: 0.6 }}
              className="w-16 h-16 object-contain drop-shadow-[0_0_18px_hsl(var(--primary)/0.7)]"
            />
          )}
        </AnimatePresence>
        {!open && tourPhase === "idle" && (
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[calc(100vh-8rem)] rounded-2xl glass-strong border border-border/60 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Portfolio Assistant</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground transition">
                  Clear
                </button>
              )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-primary/20 flex items-center justify-center">
                    <Sparkles className="text-primary" size={22} />
                  </div>
                  <p className="text-sm font-semibold mb-1">مرحباً 👋</p>
                  <p className="text-xs text-muted-foreground mb-4">اسألني أي شيء عن الـ portfolio</p>
                  <div className="grid gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs text-right px-3 py-2 rounded-lg glass hover:border-primary/40 hover:text-primary transition border border-border/50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                        : "glass border border-border/50 rounded-bl-sm"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_a]:text-primary">
                        <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="glass border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border/50 flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب رسالتك..."
                disabled={loading}
                className="flex-1 bg-background/50"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-gradient-primary shrink-0">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
