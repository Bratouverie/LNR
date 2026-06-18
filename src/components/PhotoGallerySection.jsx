import { useState } from "react";
import { Camera, Users, Building2, Home, ChevronLeft, ChevronRight, X } from "lucide-react";

const TABS = [
  { id: "work", label: "На объектах", icon: Building2 },
  { id: "before_after", label: "До и после", icon: Camera },
  { id: "team", label: "Команда", icon: Users },
  { id: "life", label: "Быт и условия", icon: Home },
];

const GALLERY = {
  work: [
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/b0f9b60ab_Russian_construction_workers_doing_manual_labor_at-1777979927794.png", caption: "Кирпичная кладка на объекте" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/5872576cf_Russian_construction_workers_using_digital_tools_a-1777979779437.png", caption: "Работа с цифровыми чертежами на стройплощадке" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/3122fca56_Russian_drone_operator_working_at_construction_sit-1777979901616.png", caption: "Оператор БПЛА за работой" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/ccf4b1bf9_Russian_EOD_specialist_in_protective_bomb_disposal-1777979907787.png", caption: "Сапёр за работой — разминирование территории" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/bcf402234_Russian_security_guard_patrolling_reconstruction_s-1777979898401.png", caption: "Охранник на страже стройплощадки" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/d4cb7d37a_Russian_telecommunications_technicians_installing_-1777979911537.png", caption: "Монтаж телекоммуникационного оборудования" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/26171e998_Modern_construction_equipment_at_work_site_in_Donb-1777979805211.png", caption: "Строительная техника на объекте" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/90a7121bd_Wide_panoramic_view_of_Donetsk_or_Lugansk_city_und-1777979951139.png", caption: "Панорама восстановления города" },
  ],
  before_after: [
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/1dcae707e_Damaged_apartment_building_in_Donbass_before_recon-1777979853577.png", caption: "ДО: разрушенный жилой дом" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/dfb1f1f96_Same_apartment_building_after_successful_reconstru-1777979851158.png", caption: "ПОСЛЕ: восстановленный жилой дом" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/2f41071bb_War-damaged_school_building_before_reconstruction_-1777979792528.png", caption: "ДО: разрушенная школа" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/0e7492be3_Same_school_building_after_complete_reconstruction-1777979789374.png", caption: "ПОСЛЕ: восстановленная школа" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/4d485fdd5_Completed_residential_complex_in_Donbass_after_rec-1777979776309.png", caption: "Готовый жилой комплекс" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/dea916812_Newly_reconstructed_residential_apartment_building-1777979872587.png", caption: "Новый жилой дом после восстановления" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/5a190bf00_Renovated_hospital_building_in_Eastern_Ukraine_pos-1777979876594.png", caption: "Восстановленная больница" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/11efcd2e9_Restored_school_building_in_Donbass_region_after_r-1777979881026.png", caption: "Восстановленная школа с детской площадкой" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/d730a632a_Wide_panoramic_view_of_successfully_reconstructed_-1777979766819.png", caption: "Восстановленный городской квартал" },
  ],
  team: [
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/b094ecc15_Group_photo_of_Russian_reconstruction_workers_team-1777979944114.png", caption: "Бригада после сдачи объекта" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/584901098_Team_meeting_of_Russian_reconstruction_workers_sm-1777979808207.png", caption: "Рабочее совещание бригады" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/92dc79196_Safety_briefing_scene_at_construction_site_Russia-1777979845940.png", caption: "Инструктаж по безопасности" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/09e5731f1_Handshake_between_Russian_construction_workers_sym-1777979770158.png", caption: "Рукопожатие — залог надёжного партнёрства" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/82d313bda_Portrait_of_Russian_civil_engineer_at_work_site_w-1777979864435.png", caption: "Инженер-строитель с проектом" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/7cd13e3d5_Portrait_of_successful_Russian_construction_forema-1777979867219.png", caption: "Прораб на объекте" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/0069169d4_Portrait_of_successful_Russian_female_medical_work-1777979812293.png", caption: "Медицинский работник программы" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/622c43fca_Portrait_of_young_Russian_construction_specialist-1777979799754.png", caption: "Молодой специалист-строитель" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/75640b83f_Russian_workers_celebrating_completed_project_sma-1777979762941.png", caption: "Команда отмечает завершение проекта" },
  ],
  life: [
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/0854b0981_Worker_living_quarters_interior_in_reconstruction_-1777979748607.png", caption: "Жилая комната в вахтовом посёлке" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/939c629fc_Basic_company_cafeteria_in_reconstruction_zone_si-1777979888387.png", caption: "Столовая для работников" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/d3788c4be_Russian_workers_having_lunch_break_together_in_caf-1777979773235.png", caption: "Обеденный перерыв в столовой" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/0d60e86ea_Aerial_view_layout_of_worker_camp_infrastructure_s-1777979982.png", caption: "Вахтовый посёлок с высоты птичьего полёта" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/6f6aa8a4e_Medical_worker_workplace_in_field_clinic_in_Donbas-1777979753067.png", caption: "Полевой медпункт на объекте" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/0167630c5_Security_surveillance_system_at_construction_site_-1777979848532.png", caption: "Система видеонаблюдения на объекте" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/5c5437504_Set_of_personal_protective_equipment_for_construct-1777979884273.png", caption: "Средства индивидуальной защиты" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/df5c9227a_Auto_mechanic_workplace_in_Eastern_Ukraine_garage-1777979756021.png", caption: "Автомастерская на базе" },
    { src: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/3c17104c1_Company_vehicle_fleet_parked_at_depot_in_Donbass_-1777979921012.png", caption: "Автопарк компании" },
  ],
};

export default function PhotoGallerySection() {
  const [activeTab, setActiveTab] = useState("work");
  const [lightbox, setLightbox] = useState(null); // index or null

  const photos = GALLERY[activeTab];

  const prev = () => setLightbox((l) => (l === 0 ? photos.length - 1 : l - 1));
  const next = () => setLightbox((l) => (l === photos.length - 1 ? 0 : l + 1));

  const handleTabChange = (id) => {
    setActiveTab(id);
    setLightbox(null);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Фотогалерея</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Программа в фотографиях
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Реальные снимки объектов, команды и условий работы участников программы восстановления.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-secondary hover:shadow-xl transition-all duration-300"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                decoding="async"
                width="400"
                height="225"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <p className="text-white text-xs font-inter px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                  {photo.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setLightbox(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/40 rounded-full"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/40 rounded-full"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={photos[lightbox].src}
                alt={photos[lightbox].caption}
                className="w-full rounded-xl max-h-[80vh] object-contain"
              />
              <p className="text-white/80 font-inter text-center mt-3 text-sm">
                {photos[lightbox].caption}
              </p>
              <p className="text-white/40 font-mono text-center text-xs mt-1">
                {lightbox + 1} / {photos.length}
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}