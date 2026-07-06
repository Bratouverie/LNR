import React, { useState, useEffect, useRef } from 'react';
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
import AnketaReadOnly from '@/components/anketa/AnketaReadOnly';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const TOTAL_SECTIONS = 12;
const EDUCATION_LEVELS = ['Среднее', 'Среднее специальное', 'Незаконченное высшее', 'Высшее'];
const BLOOD_TYPES = ['I (O)', 'II (A)', 'III (B)', 'IV (AB)'];
const MARITAL_STATUSES = ['Холост / Не замужем', 'Женат / Замужем', 'В разводе', 'Вдовец / Вдова'];
const MILITARY_RANKS = ['Не служил', 'Рядовой', 'Ефрейтор', 'Младший сержант', 'Сержант', 'Старший сержант', 'Старшина', 'Прапорщик', 'Лейтенант', 'Старший лейтенант', 'Капитан', 'Майор', 'Подполковник', 'Полковник'];
const RELATIONS = ['Супруг(а)', 'Отец', 'Мать', 'Сын', 'Дочь', 'Брат', 'Сестра', 'Другое'];
const CONVICTION_OPTIONS = [
  { value: 'нет', label: 'Нет' },
  { value: 'да', label: 'Да, непогашенная' },
  { value: 'погашена', label: 'Да, погашенная' },
];
const READY_DOC_TYPES = [
  { key: 'passport', label: 'Паспорт' },
  { key: 'militaryId', label: 'Военный билет / приписное' },
  { key: 'snils', label: 'СНИЛС' },
  { key: 'inn', label: 'ИНН' },
  { key: 'workBook', label: 'Трудовая книжка' },
  { key: 'medicalBook', label: 'Медицинская книжка' },
  { key: 'driverLicense', label: 'Водительское удостоверение' },
  { key: 'diploma', label: 'Диплом об образовании' },
  { key: 'certificates', label: 'Сертификаты / допуски' },
];

const CONSENT_TEXT_152FZ = `Я даю согласие на обработку моих персональных данных оператором в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».

Оператор вправе обрабатывать следующие категории данных: ФИО, дата рождения, гражданство, контактная информация, сведения о трудовой деятельности, медицинские данные (при наличии).

Цели обработки: рассмотрение кандидатуры на должность, проверка информации о соискателе, заключение трудового договора, выполнение обязательств по трудовому договору.

Я уведомлён(а) о праве на доступ, исправление, удаление и ограничение обработки моих персональных данных.`;

const getDraftKey = (token) => `anketa_draft_${token}`;

export default function CandidateAnketa() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [token, setToken] = useState('');
  const [submittedAnketa, setSubmittedAnketa] = useState(null);

  const [form, setForm] = useState({
    // Section 1: Персональные данные
    fullName: '', birthDate: '', citizenship: '', cityOfResidence: '', placeOfBirth: '',
    registrationAddress: '', actualAddress: '', plannedArrivalDate: '',
    passportSeries: '', passportNumber: '', passportIssuedBy: '', passportIssueDate: '', passportDepartmentCode: '',
    email: '', backupPhone: '',
    // Section 2: Специализация и квалификация
    desiredPosition: '', educationLevel: '', graduationYear: '', institution: '', speciality: '',
    professionalSkills: [],
    // Section 3: Опыт работы
    totalWorkExperience: '', shiftWorkExperience: '', lastEmployer: '', lastPosition: '', workStartDate: '', workEndDate: '', reasonForDismissal: '',
    // Section 4: Состояние здоровья
    chronicDiseases: '', bloodType: '', hasConvictions: '', height: '', weight: '',
    disabilities: '', healthNotes: '',
    // Section 5: Семья и близкие
    maritalStatus: '', childrenCount: '',
    emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
    // Section 6: Воинский учёт
    militaryRank: '', militarySpecialty: '', militaryUnit: '',
    // Section 7: Судимость
    convictionDetails: '',
    // Section 8: Мотивация и ожидания
    expectedSalary: '', motivation: '',
    // Section 9: Готовность документов
    readyDocuments: {},
    readyToStartDate: '',
    // Section 11: Согласие
    consentToDataProcessing: false, consentToWorkConditions: false,
    // Section 12: Дополнительная информация
    additionalNotes: '',
    // Meta
    version: 2,
  });

  const [files, setFiles] = useState({
    passportPhotoUrl: '', passportRegistrationUrl: '', snilsUrl: '',
    innUrl: '', militaryIdUrl: '', driverLicenseUrl: '', workBookUrl: '', certificatesUrl: '',
    diplomaUrl: '', medicalReportUrl: '',
    photoUrl: '', // DEPRECATED — kept for backward compat
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

  // ── Auto-save draft to localStorage every 30s ──
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (token) saveDraft();
    }, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [form, token]);

  const loadAnketa = async (t) => {
    try {
      const res = await base44.functions.invoke('getAnketa', { token: t });
      const data = res.data;
      setCandidateInfo(data.candidate);
      setDaysRemaining(data.daysRemaining || 7);

      if (data.anketa) {
        if (data.anketa.status === 'submitted') {
          setSubmittedAnketa(data.anketa);
        } else {
          mergeAnketa(data.anketa);
        }
      } else {
        const draft = loadDraft(t);
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

  // ── Merge with !== undefined (not ||) to preserve false/null ──
  const mergeAnketa = (data) => {
    setForm((f) => {
      const merged = { ...f };
      for (const key of Object.keys(f)) {
        if (data[key] !== undefined) {
          merged[key] = data[key];
        }
      }
      if (!Array.isArray(merged.professionalSkills)) merged.professionalSkills = [];
      if (typeof merged.readyDocuments !== 'object' || merged.readyDocuments === null) merged.readyDocuments = {};
      return merged;
    });
    setFiles((f) => {
      const merged = { ...f };
      for (const key of Object.keys(f)) {
        if (data[key] !== undefined) {
          merged[key] = data[key];
        }
      }
      return merged;
    });
  };

  const saveDraft = () => {
    if (!token) return;
    try { localStorage.setItem(getDraftKey(token), JSON.stringify({ ...form, ...files })); } catch {}
  };

  const loadDraft = (t) => {
    if (!t) return null;
    try { return JSON.parse(localStorage.getItem(getDraftKey(t))); } catch { return null; }
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

  const toggleReadyDoc = (docKey) => (checked) => {
    setForm((f) => ({
      ...f,
      readyDocuments: { ...f.readyDocuments, [docKey]: !!checked },
    }));
  };

  const updateFile = (field) => (url) => {
    setFiles((f) => ({ ...f, [field]: url }));
  };

  // ── Calculate filled sections (12) ──
  const sectionsFilled = [
    !!(form.fullName && form.birthDate),                                                    // 1. Персональные
    !!(form.desiredPosition || form.professionalSkills.length > 0),                          // 2. Специализация
    !!(form.totalWorkExperience || form.lastEmployer),                                      // 3. Опыт
    !!(form.chronicDiseases || form.bloodType),                                             // 4. Здоровье
    !!form.maritalStatus,                                                                   // 5. Семья
    !!(form.militaryRank || form.militaryUnit),                                             // 6. Воинский
    !!form.hasConvictions,                                                                  // 7. Судимость
    !!(form.motivation || form.expectedSalary),                                             // 8. Мотивация
    !!(form.readyToStartDate || Object.values(form.readyDocuments || {}).some(Boolean)),    // 9. Готовность
    !!(files.passportPhotoUrl && files.passportRegistrationUrl && files.snilsUrl),          // 10. Документы
    !!(form.consentToDataProcessing && form.consentToWorkConditions),                        // 11. Согласие
    true,                                                                                    // 12. Доп. инфо (optional)
  ].filter(Boolean).length;

  // ── Submit ──
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await base44.functions.invoke('submitAnketa', { token, form, files });
      if (res.data?.success) {
        setSuccess(true);
        localStorage.removeItem(getDraftKey(token));
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

  // ── Read-only mode: anketa already submitted ──
  if (submittedAnketa) {
    return (
      <AnketaReadOnly
        anketa={submittedAnketa}
        candidateInfo={candidateInfo}
        submittedAt={submittedAnketa.submittedAt}
      />
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

        {/* Section 1: Персональные данные */}
        <Section title="1. Персональные данные" filled={!!(form.fullName && form.birthDate)}>
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
            <Field label="Адрес регистрации" className="sm:col-span-2">
              <Textarea value={form.registrationAddress} onChange={update('registrationAddress')} rows={2} placeholder="Рег., район, город, улица, дом, кв." />
            </Field>
            <Field label="Фактический адрес" className="sm:col-span-2">
              <Textarea value={form.actualAddress} onChange={update('actualAddress')} rows={2} placeholder="Если отличается от регистрации" />
            </Field>
            <Field label="Запланированная дата прибытия">
              <Input type="date" value={form.plannedArrivalDate} onChange={update('plannedArrivalDate')} />
            </Field>
            <Field label="Серия паспорта" required>
              <Input value={form.passportSeries} onChange={update('passportSeries')} placeholder="0000" maxLength={4} />
            </Field>
            <Field label="Номер паспорта" required>
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
            <Field label="Телефон">
              <Input value={candidateInfo?.phone || ''} disabled className="bg-slate-50" />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={update('email')} placeholder="example@mail.ru" />
            </Field>
            <Field label="Резервный телефон" className="sm:col-span-2">
              <Input value={form.backupPhone} onChange={update('backupPhone')} placeholder="+7..." />
            </Field>
          </div>
        </Section>

        {/* Section 2: Специализация и квалификация */}
        <Section title="2. Специализация и квалификация" filled={!!(form.desiredPosition || form.professionalSkills.length > 0)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
          <SkillsSelector
            position={form.desiredPosition}
            selected={form.professionalSkills}
            onToggle={toggleSkill}
          />
        </Section>

        {/* Section 3: Опыт работы */}
        <Section title="3. Опыт работы" filled={!!(form.totalWorkExperience || form.lastEmployer)}>
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

        {/* Section 4: Состояние здоровья */}
        <Section title="4. Состояние здоровья" filled={!!(form.chronicDiseases || form.bloodType)}>
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
            <Field label="Рост (см)">
              <Input type="number" value={form.height} onChange={update('height')} placeholder="180" />
            </Field>
            <Field label="Вес (кг)">
              <Input type="number" value={form.weight} onChange={update('weight')} placeholder="75" />
            </Field>
            <Field label="Инвалидность / ограничения" className="sm:col-span-2">
              <Textarea value={form.disabilities} onChange={update('disabilities')} rows={2} placeholder="Если нет — оставьте пустым" />
            </Field>
            <Field label="Дополнительные сведения о здоровье" className="sm:col-span-2">
              <Textarea value={form.healthNotes} onChange={update('healthNotes')} rows={2} placeholder="Аллергии, ограничения по нагрузке и т.д." />
            </Field>
          </div>
        </Section>

        {/* Section 5: Семья и близкие */}
        <Section title="5. Семья и близкие" filled={!!form.maritalStatus}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Семейное положение">
              <select
                value={form.maritalStatus}
                onChange={update('maritalStatus')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                {MARITAL_STATUSES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Количество детей">
              <Input type="number" value={form.childrenCount} onChange={update('childrenCount')} placeholder="0" min={0} />
            </Field>
            <Field label="Контактное лицо (ФИО)">
              <Input value={form.emergencyContactName} onChange={update('emergencyContactName')} placeholder="Петров Пётр Петрович" />
            </Field>
            <Field label="Телефон контактного лица">
              <Input value={form.emergencyContactPhone} onChange={update('emergencyContactPhone')} placeholder="+7..." />
            </Field>
            <Field label="Степень родства" className="sm:col-span-2">
              <select
                value={form.emergencyContactRelation}
                onChange={update('emergencyContactRelation')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* Section 6: Воинский учёт */}
        <Section title="6. Воинский учёт" filled={!!(form.militaryRank || form.militaryUnit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Воинское звание">
              <select
                value={form.militaryRank}
                onChange={update('militaryRank')}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">— Выберите —</option>
                {MILITARY_RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Военная специальность (ВУС)">
              <Input value={form.militarySpecialty} onChange={update('militarySpecialty')} placeholder="Например: 100182" />
            </Field>
            <Field label="Воинская часть / место службы" className="sm:col-span-2">
              <Textarea value={form.militaryUnit} onChange={update('militaryUnit')} rows={2} placeholder="В/ч 00000, г. ..." />
            </Field>
          </div>
        </Section>

        {/* Section 7: Судимость */}
        <Section title="7. Судимость" filled={!!form.hasConvictions}>
          <div className="space-y-3">
            <Field label="Наличие судимости" required>
              <div className="flex flex-wrap gap-4 pt-1">
                {CONVICTION_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasConvictions"
                      value={opt.value}
                      checked={form.hasConvictions === opt.value}
                      onChange={(e) => update('hasConvictions')(e.target.value)}
                      className="w-4 h-4 accent-orange-600"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </Field>
            {form.hasConvictions && form.hasConvictions !== 'нет' && (
              <Field label="Детали судимости">
                <Textarea
                  value={form.convictionDetails}
                  onChange={update('convictionDetails')}
                  rows={3}
                  placeholder="Статья, дата, статус погашения..."
                />
              </Field>
            )}
          </div>
        </Section>

        {/* Section 8: Мотивация и ожидания */}
        <Section title="8. Мотивация и ожидания" filled={!!(form.motivation || form.expectedSalary)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Ожидаемая зарплата (руб/мес)">
              <Input type="number" value={form.expectedSalary} onChange={update('expectedSalary')} placeholder="350000" min={0} />
            </Field>
            <Field label="Готов приступить с">
              <Input type="date" value={form.readyToStartDate} onChange={update('readyToStartDate')} />
            </Field>
            <Field label="Мотивация участия" className="sm:col-span-2">
              <Textarea
                value={form.motivation}
                onChange={update('motivation')}
                rows={3}
                placeholder="Почему вы хотите участвовать в программе восстановления?"
              />
            </Field>
          </div>
        </Section>

        {/* Section 9: Готовность документов */}
        <Section title="9. Готовность документов" filled={!!(form.readyToStartDate || Object.values(form.readyDocuments || {}).some(Boolean))}>
          <p className="text-sm text-muted-foreground mb-3">Отметьте документы, которые у вас готовы:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {READY_DOC_TYPES.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  checked={!!form.readyDocuments[key]}
                  onCheckedChange={toggleReadyDoc(key)}
                />
                <Label className="text-sm font-normal cursor-pointer" onClick={() => toggleReadyDoc(key)(!form.readyDocuments[key])}>
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 10: Загрузка документов */}
        <Section title="10. Загрузка документов" filled={!!(files.passportPhotoUrl && files.passportRegistrationUrl && files.snilsUrl)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload label="Паспорт — разворот с фото" required onChange={updateFile('passportPhotoUrl')} />
            <FileUpload label="Паспорт — страница с пропиской" required onChange={updateFile('passportRegistrationUrl')} />
            <FileUpload label="СНИЛС" required onChange={updateFile('snilsUrl')} />
            <FileUpload label="ИНН" onChange={updateFile('innUrl')} />
            <FileUpload label="Военный билет / приписное" onChange={updateFile('militaryIdUrl')} />
            <FileUpload label="Водительское удостоверение" onChange={updateFile('driverLicenseUrl')} />
            <FileUpload label="Трудовая книжка" onChange={updateFile('workBookUrl')} />
            <FileUpload label="Диплом" onChange={updateFile('diplomaUrl')} />
            <FileUpload label="Медсправка" onChange={updateFile('medicalReportUrl')} />
            <FileUpload label="Сертификаты / допуски" onChange={updateFile('certificatesUrl')} />
          </div>
        </Section>

        {/* Section 11: Согласие */}
        <Section title="11. Согласие" filled={!!(form.consentToDataProcessing && form.consentToWorkConditions)}>
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 max-h-40 overflow-y-auto whitespace-pre-line">
              {CONSENT_TEXT_152FZ}
            </div>
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

        {/* Section 12: Дополнительная информация */}
        <Section title="12. Дополнительная информация" filled={true}>
          <Field label="Дополнительные сведения" className="sm:col-span-2">
            <Textarea
              value={form.additionalNotes}
              onChange={update('additionalNotes')}
              rows={3}
              placeholder="Любая дополнительная информация, которую хотите сообщить..."
            />
          </Field>
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