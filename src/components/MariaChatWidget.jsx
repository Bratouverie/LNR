import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Phone, ChevronDown, Loader2, RotateCcw } from "lucide-react";

const MARIA_PHOTO = "https://media.base44.com/images/public/69f4a665db2c72a42818d397/e7c87d0db_Create_a_polished_portrait_photo_of_a_young_woman_-1783342968140-2.png";

export default function MariaChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState(0);
  const [config, setConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const candidateData = useRef({});
  const sessionId = useRef("sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9));
  const chatEndRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, submitting]);

  const loadConfig = async () => {
    if (configLoaded) return;
    try {
      const res = await base44.functions.invoke("getConsultantConfig", {});
      const data = res.data?.data || res.data;
      setConfig(data);
      setConfigLoaded(true);
      startConsultation(data);
    } catch (err) {
      setMessages([{ role: "bot", text: "⚠️ Не удалось загрузить данные. Нажмите чтобы повторить или позвоните 8-800-222-84-63.", time: new Date() }]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setShowBubble(false);
    setMinimized(false);
    if (phase === 0 && !configLoaded) loadConfig();
  };

  const startConsultation = (cfg) => {
    const totalIncome = cfg.program.total_income.toLocaleString("ru-RU");
    const bonus = (cfg.program.relocation_bonus / 1000).toLocaleString("ru-RU");
    addBotMessage(
      `Привет! 👋 Я Мария, консультант программы восстановления ДНР и ЛНР.\n\n` +
      `За 3 месяца работы можно заработать ${totalIncome} ₽ (включая ${bonus}K подъёмных).\n\n` +
      `Как тебя зовут? (Имя и фамилия)`
    );
    setPhase(1);
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: "bot", text, time: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: "user", text, time: new Date() }]);
  };

  const handleObjection = (userMessage) => {
    if (!config?.objections) return false;
    const lower = userMessage.toLowerCase();
    for (const [key, obj] of Object.entries(config.objections)) {
      if (obj.trigger_words.some(w => lower.includes(w))) {
        addBotMessage(obj.response);
        return true;
      }
    }
    return false;
  };

  const handleName = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2 || parts[0].length < 2) {
      addBotMessage("Введи, пожалуйста, полное имя и фамилию (например: Иван Иванов)");
      return;
    }
    candidateData.current.firstName = parts[0];
    candidateData.current.lastName = parts.slice(1).join(" ");
    addBotMessage(`Спасибо, ${candidateData.current.firstName}! 👌\n\nТеперь твой номер телефона (формат: +7 999 123-45-67)`);
    setPhase(2);
  };

  const handlePhone = (phone) => {
    const clean = phone.replace(/\D/g, "");
    if (clean.length !== 11 || !clean.startsWith("7")) {
      addBotMessage("Проверь номер. Должно быть 11 цифр, начинаться на 7.\nПример: +7 999 123 45 67");
      return;
    }
    candidateData.current.phone = "+" + clean;
    const specs = config.specializations;
    const specOptions = specs.map((s, i) =>
      `${i + 1}️⃣ ${s.icon} ${s.name} (${(s.salary_min / 1000)}K-${(s.salary_max / 1000)}K ₽)`
    ).join("\n");
    addBotMessage(`Отлично! ☎️\n\nВыбери специальность:\n\n${specOptions}\n\nНапиши цифру или название`);
    setPhase(3);
  };

  const handleSpecialization = (spec) => {
    const specs = config.specializations;
    let selected = null;
    if (spec.match(/^[0-9]$/)) {
      const idx = parseInt(spec) - 1;
      if (idx >= 0 && idx < specs.length) selected = specs[idx];
    }
    if (!selected) {
      selected = specs.find(s => s.name.toLowerCase().includes(spec.toLowerCase()));
    }
    if (!selected) {
      addBotMessage("Выбери из списка:\n\n" + specs.map((s, i) => `${i + 1}️⃣ ${s.name}`).join("\n"));
      return;
    }
    candidateData.current.specialization = selected.name;
    addBotMessage(
      `Отлично! "${selected.name}" — хороший выбор! 💪\n\n` +
      `Зарплата: ${(selected.salary_min / 1000)}K - ${(selected.salary_max / 1000)}K ₽/месяц\n\n` +
      `Ты готов? Скажи "Да" или "Готов"`
    );
    setPhase(4);
  };

  const handleConfirmation = async (answer) => {
    const isReady = answer.toLowerCase().includes("да") || answer.toLowerCase().includes("готов");
    if (!isReady) {
      addBotMessage("Понимаю. Может, есть вопросы? Задавай — я помогу! ❓\n\nЕсли передумаешь — напиши 'Да' или 'Готов'");
      return;
    }
    setSubmitting(true);
    setSubmitError(false);
    addBotMessage("⏳ Отправляю твои данные в систему...");
    try {
      const res = await base44.functions.invoke("submitConsultantBot", {
        session_id: sessionId.current,
        first_name: candidateData.current.firstName,
        last_name: candidateData.current.lastName,
        phone: candidateData.current.phone,
        specialization: candidateData.current.specialization,
        source: "ai_consultant_maria"
      });
      if (res.data?.error) throw new Error(res.data.error);
      addBotMessage(
        `✅ Готово, ${candidateData.current.firstName}!\n\n` +
        `Менеджер позвонит завтра до 11:00 на ${candidateData.current.phone}.\n\n` +
        `🚀 Удачи!`
      );
      setPhase(5);
    } catch (err) {
      setSubmitError(true);
      addBotMessage("❌ Ошибка отправки. Нажми «Повторить» или позвони 8-800-222-84-63.");
    }
    setSubmitting(false);
  };

  const retrySubmit = () => {
    setSubmitError(false);
    handleConfirmation("да");
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || submitting || phase === 5) return;
    setInput("");
    addUserMessage(msg);
    await new Promise(r => setTimeout(r, 300));
    if (phase > 1 && phase < 5 && handleObjection(msg)) return;
    if (phase === 1) handleName(msg);
    else if (phase === 2) handlePhone(msg);
    else if (phase === 3) handleSpecialization(msg);
    else if (phase === 4) await handleConfirmation(msg);
  };

  const restart = () => {
    setMessages([]);
    setPhase(0);
    setSubmitError(false);
    candidateData.current = {};
    sessionId.current = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    if (config) startConsultation(config);
    else loadConfig();
  };

  const fmt = (d) => d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Attention bubble */}
      {showBubble && !open && (
        <div
          onClick={handleOpen}
          className="fixed bottom-24 right-4 sm:right-6 z-50 bg-white rounded-2xl rounded-br-sm shadow-xl border border-border px-4 py-3 max-w-[220px] cursor-pointer hover:shadow-2xl transition-all"
        >
          <p className="font-inter text-sm text-foreground leading-snug">
            👩 Привет! Я Мария — помогу найти работу на восстановлении ДНР. Заработок до 1.6 млн ₽ за 3 месяца!
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
            className="absolute -top-2 -right-2 bg-muted rounded-full p-0.5"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { open ? setOpen(false) : handleOpen(); }}
        className="fixed bottom-20 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 text-white"
        style={{ background: "linear-gradient(135deg, #FF6B9D, #C44569)" }}
        aria-label="Открыть чат с Марией"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-36 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 text-white" style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)" }}>
            <div className="relative shrink-0">
              <img src={MARIA_PHOTO} alt="Мария" className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">Мария</div>
              <div className="text-xs text-white/80">Консультант · онлайн</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <a href="tel:88002228463" className="p-1.5 text-white/80 hover:text-white transition-colors" title="Позвонить">
                <Phone className="h-4 w-4" />
              </a>
              {phase === 5 && (
                <button onClick={restart} className="p-1.5 text-white/80 hover:text-white transition-colors" title="Начать заново">
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => setMinimized(!minimized)} className="p-1.5 text-white/80 hover:text-white transition-colors">
                <ChevronDown className={`h-4 w-4 transition-transform ${minimized ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {phase > 0 && (
            <div className="h-0.5 bg-gray-200 w-full">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${phase * 20}%`, background: "linear-gradient(90deg, #FF6B9D, #C44569)" }}
              />
            </div>
          )}

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 bg-secondary/30">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "bot" && (
                      <img src={MARIA_PHOTO} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                        m.role === "user"
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm bg-card border border-border text-foreground"
                      }`}
                      style={m.role === "user" ? { background: "#FF6B9D" } : {}}
                    >
                      {m.text}
                      <p className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/60 text-right" : "text-muted-foreground"}`}>
                        {fmt(m.time)}
                      </p>
                    </div>
                    {m.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center shrink-0 text-xs">👤</div>
                    )}
                  </div>
                ))}
                {submitting && (
                  <div className="flex gap-2 justify-start">
                    <img src={MARIA_PHOTO} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                {submitError && (
                  <div className="flex justify-center">
                    <button onClick={retrySubmit} className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                      ↻ Повторить отправку
                    </button>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 flex gap-2 border-t border-border">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={phase === 5 ? "Заявка отправлена!" : "Напишите ответ..."}
                  disabled={submitting || phase === 5 || submitError}
                  className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:bg-gray-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || submitting || phase === 5 || submitError}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 text-white disabled:opacity-40"
                  style={{ background: "#FF6B9D" }}
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