import { Phone, Mail } from "lucide-react";

const IMG_BASE = "https://media.base44.com/images/public/69f4a665db2c72a42818d397";
const LEADER_PHOTOS = {
  96: `${IMG_BASE}/8cbc0245c_96.png`,
  97: `${IMG_BASE}/de0af4154_97.png`,
  98: `${IMG_BASE}/cd5ca3013_98.png`
};

const LEADERS = [
{
  name: "Игорь Андреевич Михляев",
  role: "Генеральный директор, руководитель проекта отбора",
  experience: "18 лет в кадровом менеджменте, 5 лет гос. контрактов",
  education: "МГУ им. Ломоносова (экономика)",
  phone: "+7 (4212) 51-59-30 доб. 702",
  email: "igor.mikhlayev@bratouverie-snb.ru",
  visualId: 96
},
{
  name: "\u0411\u0430\u0442\u0440\u0430\u043A\u043E\u0432 \u0412\u0438\u043A\u0442\u043E\u0440 \u0421\u0435\u0440\u0433\u0435\u0435\u0432\u0438\u0447",
  role: "Начальник отдела безопасности",
  experience: "Бывший спецслужб, 10 лет охрана объектов",
  phone: "+7 (4212) 51-59-30 доб. 703",
  email: "security@bratouverie-snb.ru",
  visualId: 97
},
{
  name: "Главный юрист",
  role: "Руководитель юридического отдела",
  experience: "Адвокат, 12 лет трудовое право",
  phone: "+7 (4212) 51-59-30 доб. 704",
  email: "legal@bratouverie-snb.ru",
  visualId: 98
}];


export default function CompanyLeadership() {
  return (
    <section id="leadership" className="py-24 sm:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Руководство</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Команда, которая вас поддерживает
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Реальные люди с прямыми контактами — вы можете связаться с каждым
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEADERS.map((leader, i) =>
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
              <img src={LEADER_PHOTOS[leader.visualId]} alt={leader.name} loading="lazy" className="w-full aspect-[3/4] object-cover" />

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-inter font-bold text-base text-foreground">{leader.name}</h3>
                  <div className="font-inter text-xs text-accent font-medium mt-1">{leader.role}</div>
                </div>

                {leader.experience &&
              <div>
                    <div className="font-inter text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Опыт:</div>
                    <p className="font-inter text-xs text-muted-foreground">{leader.experience}</p>
                  </div>
              }

                {leader.education &&
              <div>
                    <div className="font-inter text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Образование:</div>
                    <p className="font-inter text-xs text-muted-foreground">{leader.education}</p>
                  </div>
              }

                <div className="border-t border-border pt-3 space-y-2">
                  <a href={`tel:${leader.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-xs font-inter text-foreground hover:text-accent transition-colors">
                    <Phone className="h-3.5 w-3.5 text-accent" />
                    {leader.phone}
                  </a>
                  <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-xs font-inter text-foreground hover:text-accent transition-colors">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    {leader.email}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}