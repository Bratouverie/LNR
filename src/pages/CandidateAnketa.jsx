import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import AnketaProgress from '@/components/anketa/AnketaProgress';
import SkillsSelector from '@/components/anketa/SkillsSelector';
import FileUpload from '@/components/anketa/FileUpload';
import { POSITIONS } from '@/lib/anketaSkills';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const DRAFT_KEY = 'anketa_draft';
const TOTAL_SECTIONS = 11;
const EDUCATION_LEVELS = ['Среднее', 'Среднее специальное', 'Незаконченное высшее', 'Высшее'];
const BLOOD_TYPES = ['I (O)', 'II (A)', 'III (B)', 'IV (AB)'];

export default function CandidateAnketa() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [token, setToken] = useState('');

  const [form, setForm] = useState({
    fullName: '', birthDate: '', citizenship: '', cityOfResidence: '', placeOfBirth: '',
    registrationAddress: '', actualAddress: '', plannedArrivalDate: '',
    passportSeries: '', passportNumber: '', passportIssuedBy: '', passportIssueDate: '', passportDepartmentCode: '',
    email: '', backupPhone: '',
    desiredPosition: '', educationLevel: '', graduationYear: '', institution: '', speciality: '',
    professionalSkills: [],
    totalWorkExperience: '', shiftWorkExperience: '', lastEmployer: '', lastPosition: '', workStartDate: '', workEndDate: '', reasonForDismissal: '',
    chronicDiseases: '', bloodType: '', hasConvictions: '', height: '', weight: '',
    consentToDataProcessing: false, consentToWorkConditions: false,
  });

  const [files, setFiles] = useState({
    passportPhotoUrl: '', passportRegistrationUrl: '', snilsUrl: '', photoUrl: '', diplomaUrl: '', medicalReportUrl: '',
  });
  const autoSaveRef = useRef(null);

  // ── Load anketa data ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) { setError('Токен не найден в ссылке'); setLoading(false); return; }
    setToken(t);
    loadAnketa(t);
  }, []);

  const loadAnketa = async (t) => {
    try {
      const res = await base44.functions.invoke('getAnketa', { token: t });
      const data = res.data;
      setCandidateInfo(data.candidate);
      setDaysRemaining(data.daysRemaining || 7);

      if (data.anketa) {
        mergeAnketa(data.anketa);
      } else {
        const draft = loadDraft();
        if (draft) mergeAnketa(draft);
        if (data.candidate?.desiredPosition) {
          setForm((f) => ({ ...f, desiredPosition: data.candidate.desiredPosition }));
        }
        if (data.candidate?.email) {
          setForm((f) => ({ ...f, email: data.candidate.email }));
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки анкеты');
    } finally {
      setLoading(false);
    }
  };

  const mergeAnketa = (data) => {
    setForm((f) => ({
      ...f,
      fullName: data.fullName || f.fullName,
      birthDate: data.birthDate || f.birthDate,
      citizenship: data.citizenship || f.citizenship,
      cityOfResidence: data.cityOfResidence || f.cityOfResidence,
      placeOfBirth: data.placeOfBirth || f.placeOfBirth,
      registrationAddress: data.registrationAddress || f.registrationAddress,
      actualAddress: data.actualAddress || f.actualAddress,
      plannedArrivalDate: data.plannedArrivalDate || f.plannedArrivalDate,
      passportSeries: data.passportSeries || f.passportSeries,
      passportNumber: data.passportNumber || f.passportNumber,
      passportIssuedBy: data.passportIssuedBy || f.passportIssuedBy,
      passportIssueDate: data.passportIssueDate || f.passportIssueDate,
      passportDepartmentCode: data.passportDepartmentCode || f.passportDepartmentCode,
      email: data.email || f.email,
      backupPhone: data.backupPhone || f.backupPhone,
      desiredPosition: data.desiredPosition || f.desiredPosition,
      educationLevel: data.educationLevel || f.educationLevel,
      graduationYear: data.graduationYear || f.graduationYear,
      institution: data.institution || f.institution,
      speciality: data.speciality || f.speciality,
      professionalSkills: data.professionalSkills || [],
      totalWorkExperience: data.totalWorkExperience || f.totalWorkExperience,
      shiftWorkExperience: data.shiftWorkExperience || f.shiftWorkExperience,
      lastEmployer: data.lastEmployer || f.lastEmployer,
      lastPosition: data.lastPosition || f.lastPosition,
      workStartDate: data.workStartDate || f.workStartDate,
      workEndDate: data.workEndDate || f.workEndDate,
      reasonForDismissal: data.reasonForDismissal || f.reasonForDismissal,
      chronicDiseases: data.chronicDiseases || f.chronicDiseases,
      bloodType: data.bloodType || f.bloodType,
      hasConvictions: data.hasConvictions || f.hasConvictions,
      height: data.height || f.height,
      weight: data.weight || f.weight,
      consentToDataProcessing: data.consentToDataProcessing ?? f.consentToDataProcessing,
      consentToWorkConditions: data.consentToWorkConditions ?? f.consentToWorkConditions,
    }));
    if (data.passportPhotoUrl || data.snilsUrl) {
      setFiles((f) => ({
        ...f,
        passportPhotoUrl: data.passportPhotoUrl || f.passportPhotoUrl,
        passportRegistrationUrl: data.passportRegistrationUrl || f.passportRegistrationUrl,
        snilsUrl: data.snilsUrl || f.snilsUrl,
        photoUrl: data.photoUrl || f.photoUrl,
        diplomaUrl: data.diplomaUrl || f.diplomaUrl,
        medicalReportUrl: data.medicalReportUrl || f.medicalReportUrl,
      }));
    }
  };

  // ── Auto-save draft to localStorage every 30s ──
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (token) saveDraft();
    }, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [form, token]);

  const saveDraft = () => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, ...files })); } catch {}
  };
  const loadDraft = () => {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch { return null; }
  };

  const update = (field) => (e) => {
    const val = typeof e === 'boolean' ? e : e?.target?.value ?? e;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      professionalSkills: f.professionalSkills.includes(skill)
        ? f.professionalSkills.filter((s) => s !== skill)
        : [...f.professionalSkills, skill],
    }));
  };

  const updateFile = (field) => (url) => {
    setFiles((f) => ({ ...f, [field]: url }));
  };

  // ── Calculate filled sections ──
  const sectionsFilled = [
    form.fullName && form.birthDate,
    form.registrationAddress || form.actualAddress,
    form.passportSeries && form.passportNumber,
    form.email || candidateInfo?.phone,
    form.desiredPosition,
    form.professionalSkills.length > 0,
    form.totalWorkExperience || form.lastEmployer,
    form.chronicDiseases && form.hasConvictions,
    files.passportPhotoUrl && files.passportRegistrationUrl && files.snilsUrl,
    form.consentToDataProcessing && form.consentToWorkConditions,
    true, // always count section 1 (progress bar itself)
  ].filter(Boolean).length;

  // ── Submit ──
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await base44.functions.invoke('submitAnketa', { token, form, files });
      if (res.data?.success) {
        setSuccess(true);
        localStorage.removeItem(DRAFT_KEY);
      } else {
        setError(res.data?.error || 'Ошибка отправки');
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        setError(data.details.join(', '));
      } else {
        setError(data?.error || 'Ошибка отправки анкеты');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Анкета отправлена!</h1>
          <p className="text-sm text-muted-foreground">
            Ваша анкета передана менеджеру. Ожидайте звонка в ближайшее время.
          </p>
        </div>
      </div>
    );
  }

  if (error && !candidateInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-foreground mb-2">Ошибка</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <AnketaProgress daysRemaining={daysRemaining} sectionsFilled={sectionsFilled} totalSections={TOTAL_SECTIONS} />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-foreground">Анкета кандидата</h1>
          {candidateInfo && (
            <p className="text-sm text-muted-foreground mt-1">
              {candidateInfo.fullName} · {candidateInfo.phone}
            </p>
          )}
        </div>

        {/* Section 2: Личные данные */}
        <Section title="2. Личные данные" filled={!!(form.fullName && form.birthDate)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="ФИО" required>
              <Input value={form.fullName} onChange={update('fullName')} placeholder="Иванов Иван Иванович" />
            </Field>
            <Field label="Дата рождения" required>
              <Input type="date" value={form.birthDate} onChange={update('birthDate')} />
            </Field>
            <Field label="Гражданство">
              <Input value={form.citizenship} onChange={update('citizenship')} placeholder="Российская Федерация" />
            </Field>
            <Field label="Город проживания">
              <Input value={form.cityOfResidence} onChange={update('cityOfResidence')} placeholder="Владивосток" />
            </Field>
            <Field label="Место рождения" className="sm:col-span-2">
              <Input value={form.placeOfBirth} onChange={update('placeOfBirth')} placeholder="г. Владивосток" />
            </Field>
          </div>
        </Section>

        {/* Section 3: Адреса */}
        <Section title="3. Адреса" filled={!!(form.registrationAddress || form.actualAddress)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Адрес регистрации">
              <Textarea value={form.registrationAddress} onChange={update('registrationAddress')} rows={2} placeholder="Рег., район, город, улица, дом, кв." />
            </Field>
            <Field label="Фактический адрес">
              <Textarea value={form.actualAddress} onChange={update('actualAddress')} rows={2} placeholder="Если отличается от регистрации" />
            </Field>
            <Field label="Запланированная дата прибытия">
              <Input type="date" value={form.plannedArrivalDate} onChange={update('plannedArrivalDate')} />
            </Field>
          </div>
        </Section>

        {/* Section 4: Паспорт */}
        <Section title="4. Паспортные данные" filled={!!(form.passportSeries && form.passportNumber)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Серия" required>
              <Input value={form.passportSeries} onChange={update('passportSeries')} placeholder="0000" maxLength={4} />
            </Field>
            <Field label="Номер" required>
              <Input value={form.passportNumber} onChange={update('passportNumber')} placeholder="000000" maxLength={6} />
            </Field>
            <Field label="Кем выдан" required className="sm:col-span-2">
              <Input value={form.passportIssuedBy} onChange={update('passportIssuedBy')} placeholder="ОВД района..." />
            </Field>
            <Field label="Дата выдачи" required>
              <Input type="date" value={form.passportIssueDate} onChange={update('passportIssueDate')} />
            </Field>
            <Field label="Код подразделения">
              <Input value={form.passportDepartmentCode} onChange={update('passportDepartmentCode')} placeholder="000-000" maxLength={7} />
            </Field>
          </div>
        </Section>

        {/* Section 5: Контакты */}
        <Section title="5. Контактные данные" filled={!!(form.email)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Телефон">
              <Input value={candidateInfo?.phone || ''} disabled className="bg-slate-50" />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={update('email')} placeholder="example@mail.ru" />
            </Field>
            <Field label="Резервный телефон">
              <Input value={form.backupPhone} onChange={update('backupPhone')} placeholder="+7..." />
            </Field>
          </div>
        </Section>

        {/* Section 6: Образование */}
        <Section title="6. Образование и должность" filled={!!(form.desiredPosition)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Желаемая должность" required className="sm:col-span-2">
              <select
                value={form.desiredPosition}
                onChange={update('desiredPosition')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите должность —</option>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Уровень образования">
              <select
                value={form.educationLevel}
                onChange={update('educationLevel')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </Field>
            <Field label="Год окончания">
              <Input type="number" value={form.graduationYear} onChange={update('graduationYear')} placeholder="2010" />
            </Field>
            <Field label="Учебное заведение" className="sm:col-span-2">
              <Input value={form.institution} onChange={update('institution')} placeholder="Название учебного заведения" />
            </Field>
            <Field label="Специальность" className="sm:col-span-2">
              <Input value={form.speciality} onChange={update('speciality')} />
            </Field>
          </div>
        </Section>

        {/* Section 7: Профессиональные навыки */}
        <Section title="7. Профессиональные навыки" filled={form.professionalSkills.length > 0}>
          <SkillsSelector
            position={form.desiredPosition}
            selected={form.professionalSkills}
            onToggle={toggleSkill}
          />
        </Section>

        {/* Section 8: Опыт работы */}
        <Section title="8. Опыт работы" filled={!!(form.totalWorkExperience || form.lastEmployer)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Общий опыт работы">
              <Input value={form.totalWorkExperience} onChange={update('totalWorkExperience')} placeholder="5 лет" />
            </Field>
            <Field label="Опыт вахтовой работы">
              <Input value={form.shiftWorkExperience} onChange={update('shiftWorkExperience')} placeholder="2 года" />
            </Field>
            <Field label="Последний работодатель" className="sm:col-span-2">
              <Input value={form.lastEmployer} onChange={update('lastEmployer')} />
            </Field>
            <Field label="Должность">
              <Input value={form.lastPosition} onChange={update('lastPosition')} />
            </Field>
            <Field label="Дата начала работы">
              <Input type="date" value={form.workStartDate} onChange={update('workStartDate')} />
            </Field>
            <Field label="Дата окончания работы">
              <Input type="date" value={form.workEndDate} onChange={update('workEndDate')} />
            </Field>
            <Field label="Причина увольнения" className="sm:col-span-2">
              <Textarea value={form.reasonForDismissal} onChange={update('reasonForDismissal')} rows={2} />
            </Field>
          </div>
        </Section>

        {/* Section 9: Здоровье */}
        <Section title="9. Здоровье" filled={!!(form.chronicDiseases && form.hasConvictions)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Хронические заболевания">
              <select
                value={form.chronicDiseases}
                onChange={update('chronicDiseases')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                <option value="нет">Нет</option>
                <option value="да">Да</option>
              </select>
            </Field>
            <Field label="Судимости">
              <select
                value={form.hasConvictions}
                onChange={update('hasConvictions')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                <option value="нет">Нет</option>
                <option value="да">Да</option>
              </select>
            </Field>
            <Field label="Группа крови">
              <select
                value={form.bloodType}
                onChange={update('bloodType')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Рост (см)">
                <Input type="number" value={form.height} onChange={update('height')} placeholder="180" />
              </Field>
              <Field label="Вес (кг)">
                <Input type="number" value={form.weight} onChange={update('weight')} placeholder="75" />
              </Field>
            </div>
          </div>
        </Section>

        {/* Section 10: Документы */}
        <Section title="10. Загрузка документов" filled={!!(files.passportPhotoUrl && files.passportRegistrationUrl && files.snilsUrl)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload label="Паспорт — разворот с фото" required onChange={updateFile('passportPhotoUrl')} />
            <FileUpload label="Паспорт — страница с пропиской" required onChange={updateFile('passportRegistrationUrl')} />
            <FileUpload label="СНИЛС" required onChange={updateFile('snilsUrl')} />
            <FileUpload label="Фото 3x4" onChange={updateFile('photoUrl')} />
            <FileUpload label="Диплом" onChange={updateFile('diplomaUrl')} />
            <FileUpload label="Медсправка" onChange={updateFile('medicalReportUrl')} />
          </div>
        </Section>

        {/* Section 11: Согласие */}
        <Section title="11. Согласие" filled={form.consentToDataProcessing && form.consentToWorkConditions}>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={form.consentToDataProcessing}
                onCheckedChange={(v) => setForm((f) => ({ ...f, consentToDataProcessing: !!v }))}
              />
              <Label className="text-sm font-normal cursor-pointer" onClick={() => setForm((f) => ({ ...f, consentToDataProcessing: !f.consentToDataProcessing }))}>
                Я согласен(на) на обработку персональных данных *
              </Label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={form.consentToWorkConditions}
                onCheckedChange={(v) => setForm((f) => ({ ...f, consentToWorkConditions: !!v }))}
              />
              <Label className="text-sm font-normal cursor-pointer" onClick={() => setForm((f) => ({ ...f, consentToWorkConditions: !f.consentToWorkConditions }))}>
                Я согласен(на) с условиями работы *
              </Label>
            </div>
          </div>
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => { saveDraft(); }} disabled={submitting}>
            Сохранить черновик
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-accent hover:bg-accent/90">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Отправить анкету
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, filled, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        {filled && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, required, className = '', children }) {
  return (
    <div className={className}>
      <Label className="text-sm font-medium flex items-center gap-0.5 mb-1">
        {label} {required && <span className="text-accent">*</span>}
      </Label>
      {children}
    </div>
  );
}