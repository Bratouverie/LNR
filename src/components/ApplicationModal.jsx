import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ALL_POSITION_OPTIONS } from "@/data/vacanciesConfig";

const VACANCIES = ALL_POSITION_OPTIONS;

// ── ТЗ w 27.09 (22:42): удобный ввод даты рождения ─────────────────────────
const MONTHS = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];
const YEARS = []; for (let y = 2012; y >= 1935; y--) YEARS.push(y);
const pad2 = (n) => String(n).padStart(2, "0");

const isoToDmy = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
};
const dmyToIso = (dmy) => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(dmy || "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
};
const validDmy = (dmy) => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(dmy || "");
  if (!m) return false;
  const dd = +m[1], mm = +m[2], yy = +m[3];
  if (mm < 1 || mm > 12 || yy < 1935 || yy > 2012) return false;
  const dim = new Date(yy, mm, 0).getDate();
  return dd >= 1 && dd <= dim;
};

function DateField({ value, onChange, invalid }) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState(isoToDmy(value));
  const [view, setView] = useState(() => {
    const d = value ? new Date(value) : new Date(2000, 0, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const wrapRef = useRef(null);

  useEffect(() => { setRaw(isoToDmy(value)); }, [value]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Ввод с автопереходом: число → месяц → год, без ручного переключения блоков
  const handleType = (v) => {
    const d = (v || "").replace(/\D/g, "").slice(0, 8);
    const disp = d.length > 4 ? `${d.slice(0,2)}.${d.slice(2,4)}.${d.slice(4)}`
      : d.length > 2 ? `${d.slice(0,2)}.${d.slice(2)}`
      : d;
    setRaw(disp);
    if (d.length === 8) {
      const iso = dmyToIso(disp);
      if (validDmy(disp)) { onChange(iso); setOpen(false); }
    }
  };

  // Календарь с выбором месяца И года (не только дня)
  const firstDay = new Date(view.y, view.m, 1);
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const lead = (firstDay.getDay() + 6) % 7; // Пн=0
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const iso = `${view.y}-${pad2(view.m + 1)}-`;

  return (
    <div className="relative mt-1" ref={wrapRef}>
      <div className="flex gap-2">
        <Input
          value={raw}
          onChange={(e) => handleType(e.target.value)}
          placeholder="ДД.ММ.ГГГГ"
          inputMode="numeric"
          autoComplete="bday"
          className={cn(invalid && "border-red-500 bg-red-50/60 focus-visible:ring-red-400")}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const d = value ? new Date(value) : new Date(2000, 0, 1);
            setView({ y: d.getFullYear(), m: d.getMonth() });
            setOpen(!open);
          }}
          className={cn("shrink-0 px-3", invalid && "border-red-500")}
          aria-label="Выбрать дату в календаре"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
      {open && (
        <div className="absolute z-50 mt-2 left-0 right-0 rounded-lg border border-border bg-background shadow-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <select
              value={view.m}
              onChange={(e) => setView({ ...view, m: +e.target.value })}
              className="flex-1 h-8 rounded-md border border-input bg-transparent px-2 text-sm"
              aria-label="Месяц"
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select
              value={view.y}
              onChange={(e) => setView({ ...view, y: +e.target.value })}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
              aria-label="Год"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-7 text-center text-[10px] text-muted-foreground mb-1">
            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
            {cells.map((d, i) => d === null ? (
              <div key={i} />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => { onChange(iso + pad2(d)); setOpen(false); }}
                className={cn(
                  "h-8 w-full rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                  value === iso + pad2(d) && "bg-accent text-accent-foreground font-bold"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ──────────────────────────────────────────────────────────────────────────

const EXPERIENCE = ["до 1 года", "1–3 года", "3+ года"];

export default function ApplicationModal({ open, onClose, preselectedVacancy, preselectedObject }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    birth_date: "",
    vacancy: preselectedVacancy || "",
    experience: "",
    comment: preselectedObject ? `Интересует объект: ${preselectedObject}` : "",
    max_status: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successKind, setSuccessKind] = useState("new");
  // ТЗ w 27.09 (П3): МАКС — подтверждение «Сделал» после заявки
  const [maxDone, setMaxDone] = useState(false);
  const [maxDoneSending, setMaxDoneSending] = useState(false);
  const [maxDoneSent, setMaxDoneSent] = useState(false);
  // ТЗ w 27.09 (22:42): подсветка незаполненных обязательных полей
  const [errs, setErrs] = useState({});
  const phoneRef = useRef("");

  const clearErr = (k) => setErrs((p) => (p[k] ? { ...p, [k]: false } : p));

  // Sync preselected values when modal opens
  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        vacancy: preselectedVacancy || "",
        comment: preselectedObject ? `Интересует объект: ${preselectedObject}` : "",
      }));
    }
  }, [open, preselectedVacancy, preselectedObject]);

  // ТЗ w 27.09 (П3): кандидат подтвердил настройку МАКС «Могут все»
  const confirmMaxDone = async () => {
    setMaxDoneSending(true);
    try {
      const res = await fetch('https://bro-crm.ru/api/public/max-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneRef.current }),
      });
      if (!res.ok) throw new Error();
      setMaxDoneSent(true);
    } catch {
      toast({ id: "lead-max", title: "Не удалось сохранить подтверждение", description: "Нажмите «Сделал» ещё раз", variant: "destructive" });
    } finally {
      setMaxDoneSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailTrim = (form.email || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrim);
    const phoneDigits = (form.phone || "").replace(/\D/g, "");
    const phoneOk = phoneDigits.length >= 10;
    // ТЗ w 27.09 (22:42): красная подсветка незаполненных полей + тост без дублей
    const miss = [];
    const e2 = {};
    if (!form.full_name.trim()) { miss.push("ФИО"); e2.full_name = true; }
    if (!phoneOk) { miss.push("телефон (в формате +7 ...)"); e2.phone = true; }
    if (!emailOk) { miss.push("E-mail"); e2.email = true; }
    if (!form.birth_date) { miss.push("дата рождения"); e2.birth_date = true; }
    if (!form.consent) { miss.push("согласие на обработку персональных данных"); e2.consent = true; }
    if (!form.max_status) { miss.push("МАКС"); e2.max_status = true; }
    if (miss.length) {
      setErrs(e2);
      const first = document.querySelector("[data-err='1']");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({
        id: "lead-miss",
        title: "Заполните обязательные поля",
        description: "Не заполнено: " + miss.join(", "),
        variant: "destructive",
      });
      return;
    }
    setErrs({});
    setLoading(true);
    phoneRef.current = form.phone;
    try {
      // ТЗ w 24.09: заявки уходят напрямую в БРО-СРМ с отметкой источника
      // ТЗ w 27.09: + дата рождения передаётся в карточку кандидата
      const res = await fetch('https://bro-crm.ru/api/public/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || null,
          birth_date: form.birth_date || null,
          position: form.vacancy || null,
          experience: form.experience || null,
          comment: form.comment || null,
          max_status: form.max_status || null,
          source: 'vosstanovim-dnr.ru',
        }),
      });
      if (!res.ok) {
        let msg = "Проверьте интернет-соединение и попробуйте снова";
        try {
          const j = await res.json();
          if (j && j.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }
      const j = await res.json();
      // Антидубль (ТЗ w 27.09): сервер мог ответить «заявка уже принята»
      setSuccessKind(j && j.data && j.data.already ? "already" : "new");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSuccessKind("new");
        setMaxDone(false);
        setMaxDoneSent(false);
        setForm({ full_name: "", phone: "", email: "", birth_date: "", vacancy: "", experience: "", comment: "", max_status: "", consent: false });
        setErrs({});
        onClose();
      }, 45000);
    } catch (err) {
      toast({
        id: "lead-fail",
        title: "Не удалось отправить заявку",
        description: err.message || "Проверьте интернет-соединение и попробуйте снова",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="font-inter font-bold text-xl text-foreground">
              {successKind === "already" ? "✅ Ваша заявка уже принята!" : "🎉 Заявка принята!"}
            </h3>
            <p className="text-muted-foreground font-inter text-center">
              {successKind === "already"
                ? "Она уже находится на рассмотрении. Менеджер свяжется с вами в порядке очереди — спасибо за терпение!"
                : "Менеджер свяжется с вами в порядке очереди. Сейчас очень много обращений — спасибо за терпение!"}
            </p>
            <p className="text-sm text-muted-foreground font-inter text-center">
              Хотите ускорить рассмотрение? Напишите нашему ИИ-консультанту в MAX —
              он ответит на вопросы и сразу пришлёт персональную ссылку на анкету.
            </p>
            <div className="w-full rounded-lg border border-accent/40 bg-accent/5 p-4 text-left space-y-3">
              <p className="font-inter font-bold text-sm text-foreground">📨 Важно: настройка МАКС</p>
              <p className="text-sm text-muted-foreground font-inter">
                Связь с менеджером идёт в мессенджере <b>МАКС</b> на вашем номере телефона. Чтобы менеджер смог вам написать, откройте в МАКС:
              </p>
              <p className="text-sm font-inter font-bold text-foreground">
                Настройки → Безопасность → «Найти меня по номеру» → «Могут все»
              </p>
              <img
                src="/max-settings.jpg"
                alt="Настройка МАКС: Настройки → Безопасность → Найти меня по номеру → Могут все"
                className="rounded-lg border w-full max-w-[220px]"
                loading="lazy"
              />
              {maxDoneSent ? (
                <p className="text-xs font-inter font-bold text-green-600">✅ Спасибо! Настройка подтверждена — менеджер сможет вам написать.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={maxDone}
                      onCheckedChange={(c) => setMaxDone(!!c)}
                      id="max-done"
                    />
                    <Label htmlFor="max-done" className="text-sm text-muted-foreground font-inter cursor-pointer">
                      «Сделал» — подтверждаю, что включил «Могут все»
                    </Label>
                  </div>
                  {maxDone && (
                    <Button
                      type="button"
                      onClick={confirmMaxDone}
                      disabled={maxDoneSending}
                      variant="outline"
                      className="w-full font-inter font-bold"
                    >
                      {maxDoneSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Подтвердить настройку"}
                    </Button>
                  )}
                </div>
              )}
            </div>
            <a
              href="https://max.ru/se13611113_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-6 px-4"
            >
              💬 Написать консультанту в MAX
            </a>
            <button type="button" onClick={onClose} className="text-xs text-muted-foreground font-inter underline hover:no-underline">
              Закрыть окно
            </button>
            <p className="text-xs text-muted-foreground font-inter text-center">
              Заявка зарегистрирована в системе подбора персонала
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-inter font-bold text-xl">Оставить заявку</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div data-err={errs.full_name ? "1" : undefined}>
                <Label className={cn("font-inter", errs.full_name && "text-red-600")}>ФИО *</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => { setForm({ ...form, full_name: e.target.value }); clearErr("full_name"); }}
                  placeholder="Иванов Иван Иванович"
                  className={cn("mt-1", errs.full_name && "border-red-500 bg-red-50/60 focus-visible:ring-red-400")}
                  required
                />
              </div>
              <div data-err={errs.phone ? "1" : undefined}>
                <Label className={cn("font-inter", errs.phone && "text-red-600")}>Телефон *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearErr("phone"); }}
                  placeholder="+7 (999) 123-45-67"
                  inputMode="tel"
                  className={cn("mt-1", errs.phone && "border-red-500 bg-red-50/60 focus-visible:ring-red-400")}
                  required
                />
              </div>
              <div data-err={errs.max_status ? "1" : undefined}>
                <Label className={cn("font-inter", errs.max_status && "text-red-600")}>Мессенджер МАКС на этом номере *</Label>
                <p className="text-xs text-muted-foreground font-inter mt-1">
                  Связь по заявке идёт в МАКС. Если он не установлен — установите (App Store / Google Play / max.ru).
                </p>
                <Select value={form.max_status} onValueChange={(v) => { setForm({ ...form, max_status: v }); clearErr("max_status"); }}>
                  <SelectTrigger className={cn("mt-1", errs.max_status && "border-red-500 bg-red-50/60")}>
                    <SelectValue placeholder="Выберите вариант" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">МАКС есть</SelectItem>
                    <SelectItem value="no">МАКС нет</SelectItem>
                    <SelectItem value="will">Сделаю (установлю)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div data-err={errs.email ? "1" : undefined}>
                <Label className={cn("font-inter", errs.email && "text-red-600")}>E-mail *</Label>
                <Input
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); clearErr("email"); }}
                  placeholder="email@example.com"
                  type="email"
                  required
                  className={cn("mt-1", errs.email && "border-red-500 bg-red-50/60 focus-visible:ring-red-400")}
                />
              </div>
              <div data-err={errs.birth_date ? "1" : undefined}>
                <Label className={cn("font-inter", errs.birth_date && "text-red-600")}>Дата рождения *</Label>
                <p className="text-xs text-muted-foreground font-inter mt-0.5">
                  Введите в формате ДД.ММ.ГГГГ (переход по блокам автоматический) или выберите в календаре.
                </p>
                <DateField
                  value={form.birth_date}
                  onChange={(v) => { setForm({ ...form, birth_date: v }); clearErr("birth_date"); }}
                  invalid={!!errs.birth_date}
                />
              </div>
              <div>
                <Label className="font-inter">Вакансия</Label>
                <Select value={form.vacancy} onValueChange={(v) => setForm({ ...form, vacancy: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите вакансию" />
                  </SelectTrigger>
                  <SelectContent>
                    {VACANCIES.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-inter">Опыт работы</Label>
                <Select value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите опыт" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-inter">Комментарий</Label>
                <Textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Дополнительная информация..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div data-err={errs.consent ? "1" : undefined} className="flex items-start gap-3">
                <Checkbox
                  checked={form.consent}
                  onCheckedChange={(c) => { setForm({ ...form, consent: !!c }); clearErr("consent"); }}
                  id="consent"
                  className={cn(errs.consent && "data-[state=unchecked]:border-red-500 data-[state=unchecked]:bg-red-50")}
                />
                <Label htmlFor="consent" className={cn("text-sm text-muted-foreground font-inter leading-snug cursor-pointer", errs.consent && "text-red-600")}>
                  Согласен на{" "}
                  <a href="/consent" target="_blank" className="text-accent underline hover:no-underline">
                    обработку персональных данных
                  </a>
                </Label>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-6"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Отправить заявку"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}