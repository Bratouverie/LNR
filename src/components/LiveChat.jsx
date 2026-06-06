import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Phone, ChevronDown } from "lucide-react";

const BOT_RESPONSES = [
  "Здравствуйте! 👋 Я готов ответить на ваши вопросы о программе восстановления ЛНР и ДНР.",
  "Уточните, пожалуйста, какая специальность вас интересует? Мы рассмотрим вашу кандидатуру в приоритетном порядке.",
  "Хорошо! Наш специалист по кадрам свяжется с вами в ближайшее время. Также вы можете позвонить прямо сейчас: 8-800-222-84-63 (бесплатно).",
  "Подъёмные 2 500 000 ₽ выплачиваются всем участникам в течение 5 рабочих дней после подписания договора.",
  "Жильё, питание и проезд полностью оплачиваются работодателем. Условия подробно описаны на сайте.",
  "Для быстрого оформления оставьте заявку на сайте — мы перезвоним в течение часа.",
];

const QUICK_QUESTIONS = [
  "Какая зарплата?",
  "Как получить подъёмные?",
  "Какие документы нужны?",
  "Условия проживания?",
];

let botResponseIdx = 0;

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Здравствуйте! 👋 Я консультант программы восстановления ЛНР и ДНР. Готов ответить на ваши вопросы о вакансиях, зарплатах и условиях участия.",
      time: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bottomRef = useRef(null);

  // Show bubble after 5s
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: msg, time: new Date() }]);
    setTyping(true);

    setTimeout(() => {
      const response = BOT_RESPONSES[botResponseIdx % BOT_RESPONSES.length];
      botResponseIdx++;
      setMessages((prev) => [...prev, { role: "bot", text: response, time: new Date() }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const fmt = (d) =>
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Attention bubble */}
      {showBubble && !open && (
        <div
          onClick={() => { setOpen(true); setShowBubble(false); }}
          className="fixed bottom-24 right-4 sm:right-6 z-50 bg-white rounded-2xl rounded-br-sm shadow-xl border border-border px-4 py-3 max-w-[220px] cursor-pointer hover:shadow-2xl transition-all animate-bounce-slow"
        >
          <p className="font-inter text-sm text-foreground leading-snug">
            💬 Есть вопросы по вахте? Спросите нас!
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
            className="absolute -top-2 -right-2 bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false); setShowBubble(false); }}
        className="fixed bottom-20 right-4 sm:right-6 z-50 w-14 h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105"
        aria-label="Открыть чат"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-36 right-4 sm:right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold font-inter text-sm">
                МД
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-inter font-bold text-sm text-white">Михаил Дорофеев</div>
              <div className="font-inter text-xs text-white/60">Менеджер по персоналу · онлайн</div>
            </div>
            <div className="flex items-center gap-1">
              <a href="tel:88002228463" className="p-1.5 text-white/60 hover:text-white transition-colors" title="Позвонить">
                <Phone className="h-4 w-4" />
              </a>
              <button onClick={() => setMinimized(!minimized)} className="p-1.5 text-white/60 hover:text-white transition-colors">
                <ChevronDown className={`h-4 w-4 transition-transform ${minimized ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 bg-secondary/30">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      m.role === "user"
                        ? "bg-accent text-accent-foreground rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}>
                      <p className="font-inter text-sm leading-relaxed">{m.text}</p>
                      <p className={`font-inter text-[10px] mt-1 ${m.role === "user" ? "text-white/60 text-right" : "text-muted-foreground"}`}>
                        {fmt(m.time)}
                      </p>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick questions */}
              <div className="px-3 pt-2 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs font-inter bg-secondary hover:bg-secondary/80 text-foreground px-2.5 py-1 rounded-full transition-colors border border-border"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 flex gap-2 border-t border-border">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Напишите вопрос..."
                  className="flex-1 border border-border rounded-xl px-3 py-2 font-inter text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-accent hover:bg-accent/90 disabled:opacity-40 text-accent-foreground rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}