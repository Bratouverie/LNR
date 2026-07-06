import React from 'react';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

// Read-only preview for submitted anketas — no editing allowed
export default function AnketaReadOnly({ anketa, candidateInfo, submittedAt }) {
  const formatDate = (iso) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString('ru-RU'); } catch { return iso; }
  };

  const Row = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-muted-foreground sm:w-48 shrink-0">{label}</span>
      <span className="text-sm text-foreground font-medium">{value || '—'}</span>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-0">{children}</div>
    </div>
  );

  const docs = anketa?.readyDocuments || {};
  const readyDocLabels = {
    passport: 'Паспорт', militaryId: 'Военный билет', snils: 'СНИЛС', inn: 'ИНН',
    workBook: 'Трудовая книжка', medicalBook: 'Медкнижка',
    driverLicense: 'Вод. удостоверение', diploma: 'Диплом', certificates: 'Сертификаты',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Status banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Анкета отправлена на проверку</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ваша анкета передана менеджеру и находится на проверке.
              {submittedAt && ` Отправлена: ${formatDate(submittedAt)}.`}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Если нужно внести изменения — обратитесь к менеджеру для получения новой ссылки.
            </p>
          </div>
        </div>

        {candidateInfo && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {candidateInfo.fullName} · {candidateInfo.phone}
            </p>
          </div>
        )}

        {/* Section 1: Персональные данные */}
        <Section title="1. Персональные данные">
          <Row label="ФИО" value={anketa?.fullName} />
          <Row label="Дата рождения" value={formatDate(anketa?.birthDate)} />
          <Row label="Гражданство" value={anketa?.citizenship} />
          <Row label="Город проживания" value={anketa?.cityOfResidence} />
          <Row label="Место рождения" value={anketa?.placeOfBirth} />
          <Row label="Адрес регистрации" value={anketa?.registrationAddress} />
          <Row label="Фактический адрес" value={anketa?.actualAddress} />
          <Row label="Дата прибытия" value={formatDate(anketa?.plannedArrivalDate)} />
          <Row label="Паспорт" value={`${anketa?.passportSeries || ''} ${anketa?.passportNumber || ''}`.trim() || '—'} />
          <Row label="Кем выдан" value={anketa?.passportIssuedBy} />
          <Row label="Дата выдачи" value={formatDate(anketa?.passportIssueDate)} />
          <Row label="Код подразделения" value={anketa?.passportDepartmentCode} />
          <Row label="Email" value={anketa?.email} />
          <Row label="Резервный телефон" value={anketa?.backupPhone} />
        </Section>

        {/* Section 2: Специализация */}
        <Section title="2. Специализация и квалификация">
          <Row label="Желаемая должность" value={anketa?.desiredPosition} />
          <Row label="Уровень образования" value={anketa?.educationLevel} />
          <Row label="Год окончания" value={anketa?.graduationYear} />
          <Row label="Учебное заведение" value={anketa?.institution} />
          <Row label="Специальность" value={anketa?.speciality} />
          <Row label="Профессиональные навыки" value={(anketa?.professionalSkills || []).join(', ')} />
        </Section>

        {/* Section 3: Опыт работы */}
        <Section title="3. Опыт работы">
          <Row label="Общий опыт" value={anketa?.totalWorkExperience} />
          <Row label="Вахтовый опыт" value={anketa?.shiftWorkExperience} />
          <Row label="Последний работодатель" value={anketa?.lastEmployer} />
          <Row label="Должность" value={anketa?.lastPosition} />
          <Row label="Период работы" value={`${formatDate(anketa?.workStartDate)} — ${formatDate(anketa?.workEndDate)}`} />
          <Row label="Причина увольнения" value={anketa?.reasonForDismissal} />
        </Section>

        {/* Section 4: Здоровье */}
        <Section title="4. Состояние здоровья">
          <Row label="Хронические заболевания" value={anketa?.chronicDiseases} />
          <Row label="Группа крови" value={anketa?.bloodType} />
          <Row label="Рост" value={anketa?.height ? `${anketa.height} см` : null} />
          <Row label="Вес" value={anketa?.weight ? `${anketa.weight} кг` : null} />
          <Row label="Инвалидность / ограничения" value={anketa?.disabilities} />
          <Row label="Доп. сведения о здоровье" value={anketa?.healthNotes} />
        </Section>

        {/* Section 5: Семья */}
        <Section title="5. Семья и близкие">
          <Row label="Семейное положение" value={anketa?.maritalStatus} />
          <Row label="Количество детей" value={anketa?.childrenCount} />
          <Row label="Контактное лицо" value={anketa?.emergencyContactName} />
          <Row label="Телефон контактного" value={anketa?.emergencyContactPhone} />
          <Row label="Степень родства" value={anketa?.emergencyContactRelation} />
        </Section>

        {/* Section 6: Воинский учёт */}
        <Section title="6. Воинский учёт">
          <Row label="Воинское звание" value={anketa?.militaryRank} />
          <Row label="Военная специальность" value={anketa?.militarySpecialty} />
          <Row label="Воинская часть" value={anketa?.militaryUnit} />
        </Section>

        {/* Section 7: Судимость */}
        <Section title="7. Судимость">
          <Row label="Наличие судимости" value={anketa?.hasConvictions} />
          <Row label="Детали судимости" value={anketa?.convictionDetails} />
        </Section>

        {/* Section 8: Мотивация */}
        <Section title="8. Мотивация и ожидания">
          <Row label="Ожидаемая зарплата" value={anketa?.expectedSalary ? `${anketa.expectedSalary} руб` : null} />
          <Row label="Готов приступить с" value={formatDate(anketa?.readyToStartDate)} />
          <Row label="Мотивация" value={anketa?.motivation} />
        </Section>

        {/* Section 9: Готовность документов */}
        <Section title="9. Готовность документов">
          <div className="flex flex-wrap gap-2 py-2">
            {Object.entries(readyDocLabels).map(([key, label]) => (
              <span
                key={key}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  docs[key]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {label}: {docs[key] ? '✓' : '—'}
              </span>
            ))}
          </div>
        </Section>

        {/* Section 10: Документы */}
        <Section title="10. Загруженные документы">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
            {[
              { url: anketa?.passportPhotoUrl, label: 'Паспорт (фото)' },
              { url: anketa?.passportRegistrationUrl, label: 'Паспорт (прописка)' },
              { url: anketa?.snilsUrl, label: 'СНИЛС' },
              { url: anketa?.innUrl, label: 'ИНН' },
              { url: anketa?.militaryIdUrl, label: 'Военный билет' },
              { url: anketa?.driverLicenseUrl, label: 'Вод. удостоверение' },
              { url: anketa?.workBookUrl, label: 'Трудовая книжка' },
              { url: anketa?.diplomaUrl, label: 'Диплом' },
              { url: anketa?.medicalReportUrl, label: 'Медсправка' },
              { url: anketa?.certificatesUrl, label: 'Сертификаты' },
            ].filter((d) => d.url).map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-accent/30 transition-colors">
                <FileText className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs text-foreground truncate">{d.label}</span>
              </a>
            ))}
          </div>
        </Section>

        {/* Section 12: Доп. информация */}
        {anketa?.additionalNotes && (
          <Section title="12. Дополнительная информация">
            <p className="text-sm text-foreground py-2">{anketa.additionalNotes}</p>
          </Section>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <Clock className="w-3.5 h-3.5" />
          Анкета в режиме просмотра. Редактирование недоступно.
        </div>
      </div>
    </div>
  );
}