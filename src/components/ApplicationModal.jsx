import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";

const VACANCIES = [
  "Разнорабочий",
  "Строитель",
  "Автослесарь",
  "Водитель (кат. B)",
  "Водитель (кат. C)",
  "Водитель (кат. CE)",
  "Водитель (кат. CD)",
  "Медицинский работник",
  "Охранник",
];

const EXPERIENCE = ["до 1 года", "1–3 года", "3+ года"];

export default function ApplicationModal({ open, onClose, preselectedVacancy, preselectedObject }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    vacancy: preselectedVacancy || "",
    experience: "",
    comment: preselectedObject ? `Интересует объект: ${preselectedObject}` : "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent || !form.full_name || !form.phone) return;
    setLoading(true);
    try {
      await base44.entities.Application.create({ ...form, type: "application" });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({ full_name: "", phone: "", email: "", vacancy: "", experience: "", comment: "", consent: false });
        onClose();
      }, 2500);
    } catch (err) {
      toast({
        title: "Не удалось отправить заявку",
        description: "Проверьте интернет-соединение и попробуйте снова",
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
            <h3 className="font-inter font-bold text-xl text-foreground">Заявка отправлена!</h3>
            <p className="text-muted-foreground font-inter text-center">Мы свяжемся с вами в ближайшее время</p>
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
                <Label className="font-inter">E-mail</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
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
                disabled={loading || !form.consent || !form.full_name || !form.phone}
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