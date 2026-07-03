import VisualPlaceholder from "./VisualPlaceholder";
import { Building2, MapPin, Phone, Mail, Globe, CheckCircle, ExternalLink } from "lucide-react";
import { COMPANY_INFO } from "@/lib/calculatorData";

const DIRECTIONS = [
"Восстановление ДНР/ЛНР",
"Арктический вызов",
"Программа КАДРЫ"];


export default function AboutCompany() {
  return (
    <section id="about-company" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">О компании</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            {COMPANY_INFO.name}
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            {COMPANY_INFO.fullName}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-inter font-bold text-foreground">Генеральный подрядчик государственного масштаба</h3>
                  <p className="font-inter text-xs text-muted-foreground">{COMPANY_INFO.directions}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center bg-secondary/50 rounded-xl p-4">
                  <div className="font-mono text-2xl font-black text-accent">{COMPANY_INFO.specialistsTrained}</div>
                  <div className="font-inter text-xs text-muted-foreground mt-1">специалистов подготовлено</div>
                </div>
                <div className="text-center bg-secondary/50 rounded-xl p-4">
                  <div className="font-mono text-2xl font-black text-accent">{COMPANY_INFO.regionsCount}</div>
                  <div className="font-inter text-xs text-muted-foreground mt-1">регионов присутствия</div>
                </div>
                <div className="text-center bg-secondary/50 rounded-xl p-4">
                  <div className="font-mono text-2xl font-black text-accent">{COMPANY_INFO.projectsCompleted}</div>
                  <div className="font-inter text-xs text-muted-foreground mt-1">проектов завершено</div>
                </div>
                <div className="text-center bg-secondary/50 rounded-xl p-4">
                  <div className="font-mono text-2xl font-black text-accent">{COMPANY_INFO.yearsActive}</div>
                  <div className="font-inter text-xs text-muted-foreground mt-1">года на рынке</div>
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-inter font-bold text-sm text-foreground mb-4">Проекты компании</h3>
              <div className="space-y-2">
                {DIRECTIONS.map((dir) =>
                <div key={dir} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    <span className="font-inter text-sm text-muted-foreground">{dir}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Requisites */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-inter font-bold text-sm text-foreground mb-4">Реквизиты для проверки</h3>
              <div className="space-y-3">
                <ReqRow label="ОГРН" value={COMPANY_INFO.ogrn} link={`https://egrul.nalog.ru/index.html?query=${COMPANY_INFO.ogrn}`} />
                <ReqRow label="ИНН" value={COMPANY_INFO.inn} link={`https://egrul.nalog.ru/index.html?query=${COMPANY_INFO.inn}`} />
                <ReqRow label="КПП" value={COMPANY_INFO.kpp} />
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-inter text-xs text-muted-foreground">Юридический адрес</div>
                    <div className="font-inter text-sm text-foreground">{COMPANY_INFO.legalAddress}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-inter text-xs text-muted-foreground">Офис</div>
                    <div className="font-inter text-sm text-foreground">{COMPANY_INFO.office}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-inter text-xs text-muted-foreground">Телефон</div>
                    <a href={`tel:${COMPANY_INFO.phone.replace(/[^+\d]/g, "")}`} className="font-inter text-sm text-foreground hover:text-accent">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-inter text-xs text-muted-foreground">Email</div>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="font-inter text-sm text-foreground hover:text-accent">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="font-inter text-xs text-muted-foreground">Сайт</div>
                    <a href={COMPANY_INFO.website} target="_blank" rel="noopener noreferrer" className="font-inter text-sm text-foreground hover:text-accent">
                      {COMPANY_INFO.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: visuals */}
          <div className="space-y-4">
            <VisualPlaceholder id={84} ratio="4:3" label="Грамота Правительства РФ" />
            <div className="grid grid-cols-2 gap-4">
              <VisualPlaceholder id={85} ratio="3:4" label="Благодарность Минздрава" />
              <VisualPlaceholder id={86} ratio="3:4" label="Грамота Минцифры" />
              <VisualPlaceholder id={87} ratio="3:4" label="Грамота Минпросвещения" />
              <VisualPlaceholder id={88} ratio="3:4" label="Награда" />
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="font-inter text-xs text-muted-foreground">Всего 12 грамот и благодарностей от Министерств и Правительства РФ

              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function ReqRow({ label, value, link }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-inter text-xs text-muted-foreground">{label}</span>
      {link ?
      <a href={link} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-accent hover:underline flex items-center gap-1">
          {value}
          <ExternalLink className="h-3 w-3" />
        </a> :

      <span className="font-mono text-sm text-foreground">{value}</span>
      }
    </div>);

}