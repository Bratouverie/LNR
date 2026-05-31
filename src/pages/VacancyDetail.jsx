import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Banknote, Calendar, MapPin, Users, Shield, GraduationCap, TrendingUp, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VACANCIES_DATA } from "@/lib/vacanciesData";
import ApplicationModal from "../components/ApplicationModal";

export default function VacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vacancy = VACANCIES_DATA.find((v) => v.id === id);
  const [appOpen, setAppOpen] = useState(false);

  if (!vacancy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-inter">Вакансия не найдена</p>
        <Button variant="outline" onClick={() => navigate("/", { state: { scrollTo: "vacancies" } })}>← Назад к вакансиям</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/", { state: { scrollTo: "vacancies" } })}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Все вакансии
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase mb-3 block">
                {vacancy.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-inter font-black text-white tracking-tight mb-4">
                {vacancy.title}
              </h1>
              <p className="text-white/70 font-inter text-base max-w-2xl leading-relaxed">
                {vacancy.role}
              </p>
            </div>
            <div className="shrink-0">
              <div className="bg-white/10 border border-white/15 rounded-2xl p-5 text-center min-w-[200px]">
                <div className="text-xs text-white/50 font-inter mb-1">Зарплата в месяц</div>
                <div className="text-2xl font-mono font-bold text-accent">
                  {vacancy.salaryMin.toLocaleString("ru-RU")} ₽
                </div>
                <div className="text-white/40 font-inter text-xs mt-0.5">
                  до {vacancy.salaryMax.toLocaleString("ru-RU")} ₽
                </div>
                <div className="border-t border-white/10 mt-3 pt-3">
                  <div className="text-xs text-white/50 font-inter mb-0.5">Подъёмные</div>
                  <div className="font-mono font-bold text-white text-lg">
                    {vacancy.bonus.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="bg-primary/90 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="text-white font-inter text-sm hidden sm:block">
            <span className="font-bold">{vacancy.title}</span>
            <span className="text-white/50"> · от {vacancy.salaryMin.toLocaleString("ru-RU")} ₽/мес</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <a href="tel:+79223120735" className="text-white/60 hover:text-white font-inter text-sm transition-colors">
              +7 922 312-07-35
            </a>
            <Button
              onClick={() => setAppOpen(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold text-sm px-6"
            >
              Откликнуться
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Duties */}
            <section>
              <h2 className="text-xl font-inter font-bold text-foreground mb-5 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Основные обязанности
              </h2>
              <ul className="space-y-3">
                {vacancy.duties.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-mono font-bold">{i + 1}</span>
                    </div>
                    <span className="font-inter text-foreground text-sm leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-inter font-bold text-foreground mb-5 flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Требования к кандидату
              </h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="text-xs font-mono text-accent font-semibold uppercase tracking-wider mb-1">Образование</div>
                  <p className="font-inter text-foreground text-sm">{vacancy.requirements.education}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="text-xs font-mono text-accent font-semibold uppercase tracking-wider mb-1">Опыт работы</div>
                  <p className="font-inter text-foreground text-sm">{vacancy.requirements.experience}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="text-xs font-mono text-accent font-semibold uppercase tracking-wider mb-2">Навыки</div>
                  <ul className="space-y-1.5">
                    {vacancy.requirements.skills.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-inter text-foreground">
                        <span className="text-accent mt-1 shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-xs font-mono text-accent font-semibold uppercase tracking-wider mb-1">Возраст</div>
                    <p className="font-inter text-foreground text-sm">{vacancy.requirements.age}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-xs font-mono text-amber-700 font-semibold uppercase tracking-wider">Противопоказания</span>
                    </div>
                    <p className="font-inter text-amber-900 text-sm">{vacancy.requirements.contraindications}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Conditions */}
            <section>
              <h2 className="text-xl font-inter font-bold text-foreground mb-5 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Условия работы
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: "Формат", value: vacancy.conditions.format },
                  { icon: Calendar, label: "График", value: vacancy.conditions.schedule },
                  { icon: MapPin, label: "Место работы", value: vacancy.conditions.location },
                  { icon: Shield, label: "Обеспечение", value: vacancy.conditions.provision },
                ].map((c) => (
                  <div key={c.label} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <c.icon className="h-4 w-4 text-accent" />
                      <span className="text-xs font-mono text-accent font-semibold uppercase tracking-wider">{c.label}</span>
                    </div>
                    <p className="font-inter text-foreground text-sm">{c.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary card */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="h-5 w-5 text-accent" />
                <h3 className="font-inter font-bold">Компенсационный пакет</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-white/50 font-inter mb-0.5">Базовый оклад</div>
                  <div className="font-mono font-bold text-white">{vacancy.salary.base}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 font-inter mb-0.5">Надбавки</div>
                  <div className="font-inter text-sm text-white/80">{vacancy.salary.bonus_monthly}</div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="text-xs text-accent font-mono font-semibold uppercase mb-0.5">Итого в месяц</div>
                  <div className="font-mono font-bold text-accent text-lg">{vacancy.salary.total}</div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="text-xs text-white/50 font-inter mb-0.5">Единовременная выплата</div>
                  <div className="font-mono font-bold text-white text-xl">
                    {vacancy.bonus.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setAppOpen(true)}
                className="w-full mt-5 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold"
              >
                Откликнуться
              </Button>
            </div>

            {/* Perks */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-inter font-bold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                Преимущества
              </h3>
              <ul className="space-y-2">
                {vacancy.perks.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contract */}
            {vacancy.contractUrl && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                  <Download className="h-4 w-4 text-accent" />
                  Ознакомительный договор
                </h3>
                <p className="font-inter text-xs text-muted-foreground mb-3 leading-relaxed">
                  Ознакомительная версия трудового договора. Официальная версия подписывается на месте несения вахты.
                </p>
                <a
                  href={vacancy.contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-inter font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Скачать договор (PDF)
                </a>
              </div>
            )}

            {/* Prospects */}
            <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5">
              <h3 className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Перспективы
              </h3>
              <p className="font-inter text-sm text-foreground/80 leading-relaxed">{vacancy.prospects}</p>
            </div>

            {/* CTA */}
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="font-inter text-sm text-muted-foreground mb-4">
                Есть вопросы? Позвоните нам или напишите в Макс.
              </p>
              <a
                href="tel:+79223120735"
                className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold py-3 rounded-lg transition-colors mb-2"
              >
                +7 922 312-07-35
              </a>
              <a
                href="tel:+79191072244"
                className="block w-full text-center bg-secondary hover:bg-secondary/80 text-secondary-foreground font-inter font-semibold py-3 rounded-lg transition-colors"
              >
                +7 919 107-22-44
              </a>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal
        open={appOpen}
        onClose={() => setAppOpen(false)}
        preselectedVacancy={vacancy.title}
      />
    </div>
  );
}