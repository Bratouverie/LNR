import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Send, Phone, Loader2, X, RotateCcw } from "lucide-react";

const MARIA_PHOTO = "https://media.base44.com/images/public/69f4a665db2c72a42818d397/e7c87d0db_Create_a_polished_portrait_photo_of_a_young_woman_-1783342968140-2.png";

export default function ConsultantMaria() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState(0);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(false);
  const candidateData = useRef({});
  const sessionId = useRef("sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9));
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConfig = async () => {
    try {
      const res = await base44.functions.invoke("getConsultantConfig", {});
      const data = res.data?.data || res.data;
      setConfig(data);
      startConsultation(data);
    } catch (err) {
      setError("Ошибка загрузки. Перезагрузите страницу.");
      setLoading(false);
    }
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: "bot", text, time: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: "user", text, time: new Date() }]);
  };

  const startConsultation = (cfg) => {
    const totalIncome = cfg.program.total_income.toLocaleString("ru-RU");
    const bonus = (cfg.program.relocation_bonus / 1000).toLocaleString("ru-RU");
    addBotMessage(
      `Привет! 👋 Я Мария, консультант программы восстановления ДНР и ЛНР.\n\n` +
      `За 3 месяца работы можно заработать ${totalIncome} ₽ (включая ${bonus}K подъёмных).\n\n` +
      `За 2 года программы: ${cfg.safety.participants} участников, ${cfg.safety.healthy_return_percent}% вернулись здоровыми, ${cfg.safety.deaths} смертей.\n\n` +
      `Как тебя зовут? (Имя и фамилия)`
    );
    setPhase(1);
    setLoading(false);
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
        `Твои данные отправлены. Менеджер позвонит завтра до 11:00 на номер ${candidateData.current.phone}.\n\n` +
        `Если есть вопросы — позвони: +7(4212)51-59-30 доб.702\n\n` +
        `🚀 Удачи!`
      );
      setPhase(5);
    } catch (err) {
      setSubmitError(true);
      addBotMessage("❌ Ошибка при отправке. Нажми «Повторить» или позвони +7(4212)51-59-30");
    }
    setSubmitting(false);
  };

  const retrySubmit = () => {
    setSubmitError(false);
    handleConfirmation("да");
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

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || submitting || phase === 5 || submitError) return;
    setInput("");
    addUserMessage(msg);
    await new Promise(r => setTimeout(r, 300));
    if (phase > 1 && phase < 5 && handleObjection(msg)) return;
    if (phase === 1) handleName(msg);
    else if (phase === 2) handlePhone(msg);
    else if (phase === 3) handleSpecialization(msg);
    else if (phase === 4) await handleConfirmation(msg);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #FFB6D9 100%)" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white font-medium">Мария готовится...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #FFB6D9 100%)" }}>
        <p className="text-white font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4" style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #FFB6D9 100%)" }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: "85vh", maxHeight: "800px" }}>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 w-full">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${phase * 20}%`, background: "linear-gradient(90deg, #FF6B9D, #C44569)" }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 text-white" style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)" }}>
          <div className="relative">
            <img src={MARIA_PHOTO} alt="Мария" className="w-12 h-12 rounded-full object-cover border-2 border-white/30" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Мария</h1>
            <p className="text-xs text-white/80">Консультант программы восстановления ДНР/ЛНР · онлайн</p>
          </div>
          <a href="tel:88002228463" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Позвонить">
            <Phone className="h-5 w-5" />
          </a>
          {phase === 5 && (
            <button onClick={restart} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Начать заново">
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="На главную">
            <X className="h-5 w-5" />
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "bot" && (
                <img src={MARIA_PHOTO} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${m.role === "user"
                  ? "rounded-br-sm text-white"
                  : "rounded-bl-sm bg-white border border-gray-200 text-gray-800"
                }`}
                style={m.role === "user" ? { background: "#FF6B9D" } : {}}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0 text-sm">👤</div>
              )}
            </div>
          ))}
          {submitting && (
            <div className="flex gap-2 justify-start">
              <img src={MARIA_PHOTO} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          {submitError && (
            <div className="flex justify-center">
              <button onClick={retrySubmit} className="text-sm px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium border border-red-200">
                ↻ Повторить отправку
              </button>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={phase === 5 ? "Заявка отправлена!" : "Напишите ответ..."}
            disabled={submitting || phase === 5 || submitError}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors disabled:bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || submitting || phase === 5 || submitError}
            className="px-5 py-3 text-white rounded-xl font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-600 shrink-0"
            style={{ background: "#FF6B9D" }}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}