import { useState, useEffect, useRef } from "react";
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
  const phoneRef = useRef("");

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
      toast({ title: "Не удалось сохранить подтверждение", description: "Нажмите «Сделал» ещё раз", variant: "destructive" });
    } finally {
      setMaxDoneSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailTrim = (form.email || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrim);
    // ТЗ w 27.09: сообщение со списком незаполненных обязательных полей
    const miss = [];
    if (!form.full_name.trim()) miss.push("ФИО");
    if (!form.phone.trim()) miss.push("телефон");
    if (!emailOk) miss.push("E-mail");
    if (!form.birth_date) miss.push("дата рождения");
    if (!form.consent) miss.push("согласие на обработку персональных данных");
    if (!form.max_status) miss.push("МАКС");
    if (miss.length) {
      toast({
        title: "Заполните обязательные поля",
        description: "Не заполнено: " + miss.join(", "),
        variant: "destructive",
      });
      return;
    }
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
        onClose();
      }, 45000);
    } catch (err) {
      toast({
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
                src="https://bro-crm.ru/max-settings.png"
                alt="Настройка МАКС: Найти меня по номеру → Могут все"
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
              <div>
                <Label className="font-inter">ФИО *</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="font-inter">Телефон *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="font-inter">Мессенджер МАКС на этом номере *</Label>
                <p className="text-xs text-muted-foreground font-inter mt-1">
                  Связь по заявке идёт в МАКС. Если он не установлен — установите (App Store / Google Play / max.ru).
                </p>
                <Select value={form.max_status} onValueChange={(v) => setForm({ ...form, max_status: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите вариант" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">МАКС есть</SelectItem>
                    <SelectItem value="no">МАКС нет</SelectItem>
                    <SelectItem value="will">Сделаю (установлю)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-inter">E-mail *</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-inter">Дата рождения *</Label>
                <Input
                  value={form.birth_date}
                  onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                  type="date"
                  required
                  className="mt-1"
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
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={form.consent}
                  onCheckedChange={(c) => setForm({ ...form, consent: !!c })}
                  id="consent"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground font-inter leading-snug cursor-pointer">
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