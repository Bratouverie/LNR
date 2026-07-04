import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import ReviewStars from "./ReviewStars";
import { validateReview, validatePhoto } from "@/lib/reviewValidator";

const POSITIONS = [
  "Разнорабочий", "Каменщик", "Бетонщик", "Сварщик", "Крановщик",
  "Водитель", "Автослесарь", "Фельдшер", "Медик", "Охранник",
  "Электрик", "Сантехник", "Монтажник", "Отделочник", "Прораб",
];

const CITIES = [
  "Донецк", "Луганск", "Мариуполь", "Макеевка", "Горловка",
  "Енакиево", "Харцызск", "Стаханов", "Алчевск", "Брянка",
  "Красный Луч", "Антрацит", "Ровеньки", "Свердловск",
];

export default function ReviewForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "", position: "", city: "", stars: 0, text: "", monthsInProgram: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  // Honeypot
  const [website, setWebsite] = useState("");

  const update = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    const err = validatePhoto(file);
    if (err) {
      setPhotoError(err);
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot — silently succeed for bots
    if (website) {
      onSuccess();
      return;
    }

    const validationErrors = validateReview({ ...formData, photo: photoFile });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Upload photo
      const uploadRes = await base44.integrations.Core.UploadFile({ file: photoFile });

      // Submit review
      const response = await base44.functions.invoke("submitReview", {
        photo: uploadRes.file_url,
        name: formData.name,
        position: formData.position,
        city: formData.city,
        stars: Number(formData.stars),
        text: formData.text,
        monthsInProgram: Number(formData.monthsInProgram),
      });

      if (response.data?.success) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 2500);
      } else {
        setSubmitError(response.data?.message || "Ошибка отправки");
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Сервер недоступен. Попробуйте позже."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
        <h3 className="font-inter font-bold text-xl text-foreground">Спасибо за отзыв!</h3>
        <p className="font-inter text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Ваш отзыв отправлен на модерацию и появится на сайте после проверки администратором.
        </p>
      </div>
    );
  }

  const textLength = formData.text.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo upload */}
      <div>
        <label className="font-inter text-sm font-medium text-foreground block mb-2">Фото *</label>
        {photoPreview ? (
          <div className="relative inline-block">
            <img src={photoPreview} alt="preview" className="w-24 h-24 rounded-xl object-cover border border-border" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-accent/50 transition-colors text-muted-foreground hover:text-accent"
          >
            <Upload className="h-6 w-6" />
            <span className="font-inter text-xs mt-1">Загрузить</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        {photoError && <p className="font-inter text-xs text-destructive mt-1">{photoError}</p>}
      </div>

      {/* Name */}
      <div>
        <label className="font-inter text-sm font-medium text-foreground block mb-1">Имя *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => update("name", e.target.value)}
          maxLength={100}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 font-inter text-sm"
          placeholder="Ваше имя"
        />
        {errors.name && <p className="font-inter text-xs text-destructive mt-1">{errors.name}</p>}
      </div>

      {/* Position + City */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-inter text-sm font-medium text-foreground block mb-1">Должность *</label>
          <select
            value={formData.position}
            onChange={(e) => update("position", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-inter text-sm"
          >
            <option value="">Выберите…</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.position && <p className="font-inter text-xs text-destructive mt-1">{errors.position}</p>}
        </div>
        <div>
          <label className="font-inter text-sm font-medium text-foreground block mb-1">Город *</label>
          <select
            value={formData.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 font-inter text-sm"
          >
            <option value="">Выберите…</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="font-inter text-xs text-destructive mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Stars */}
      <div>
        <label className="font-inter text-sm font-medium text-foreground block mb-1">Оценка *</label>
        <ReviewStars value={formData.stars} onChange={(v) => update("stars", v)} size={28} />
        {errors.stars && <p className="font-inter text-xs text-destructive mt-1">{errors.stars}</p>}
      </div>

      {/* Months */}
      <div>
        <label className="font-inter text-sm font-medium text-foreground block mb-1">Месяцев в программе *</label>
        <select
          value={formData.monthsInProgram}
          onChange={(e) => update("monthsInProgram", e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 font-inter text-sm"
        >
          <option value="">Выберите…</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m} мес.</option>
          ))}
        </select>
        {errors.monthsInProgram && <p className="font-inter text-xs text-destructive mt-1">{errors.monthsInProgram}</p>}
      </div>

      {/* Text */}
      <div>
        <label className="font-inter text-sm font-medium text-foreground block mb-1">Отзыв *</label>
        <textarea
          value={formData.text}
          onChange={(e) => update("text", e.target.value)}
          maxLength={1000}
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 font-inter text-sm resize-none"
          placeholder="Расскажите о вашем опыте работы в программе…"
        />
        <div className="flex justify-end mt-1">
          <span className={`font-mono text-xs ${textLength > 950 ? "text-destructive" : "text-muted-foreground"}`}>
            {textLength}/1000
          </span>
        </div>
        {errors.text && <p className="font-inter text-xs text-destructive mt-1">{errors.text}</p>}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Submit error */}
      {submitError && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="font-inter text-xs text-destructive">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-border px-4 py-2.5 font-inter text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-2.5 font-inter text-sm font-bold disabled:opacity-50 transition-opacity"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Отправка…" : "Отправить"}
        </button>
      </div>
    </form>
  );
}