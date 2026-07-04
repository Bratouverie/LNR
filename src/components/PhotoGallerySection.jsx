import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const INITIAL_BATCH = 15;
const BATCH_SIZE = 8;

const B = "https://media.base44.com/images/public/69f4a665db2c72a42818d397/";

const PHOTOS = [
  // Объекты — строительство

  { src: `${B}a280218b3_Realistic_documentary_photo_of_a_Russian_construct-1782925903762.png`, caption: "Строительная бригада на объекте" },
  { src: `${B}bb3c2b8be_Real_photo_of_Russian_male_workers_only_no_women-1782926059352.png`, caption: "Рабочие на строительной площадке" },
  { src: `${B}fbcebed74_Real_photo_of_Russian_male_workers_only_no_women-1782926102307.png`, caption: "Бригада строителей" },
  { src: `${B}4b8421aa4_Photorealistic_documentary_photograph_43_aspect_-1783093834049.png`, caption: "Работа на объекте" },
  { src: `${B}31bc2efa6_Photorealistic_documentary_photograph_32_aspect_-1783093884301.png`, caption: "Строительные работы" },
  { src: `${B}511fbcc8a_Photorealistic_documentary_photograph_43_aspect_-1783093853721.png`, caption: "На стройплощадке" },
  { src: `${B}833968ac7_Real_phone-camera_photo_at_0800-1200_midday_on_a-1783074699067.png`, caption: "Дневная смена на объекте" },
  { src: `${B}116d94961_26171e998_Modern_construction_equipment_at_work_site_in_Donb-1777979805211.png`, caption: "Строительная техника на объекте" },
  { src: `${B}74d4437ac_584901098_Team_meeting_of_Russian_reconstruction_workers_sm-1777979808207.png`, caption: "Рабочее совещание бригады" },
  { src: `${B}72d1dd8ca_5872576cf_Russian_construction_workers_using_digital_tools_a-1777979779437.png`, caption: "Работа с цифровыми инструментами" },
  { src: `${B}d5340b266_09e5731f1_Handshake_between_Russian_construction_workers_sym-1777979770158.png`, caption: "Надёжное партнёрство" },
  { src: `${B}fdb099c05_75640b83f_Russian_workers_celebrating_completed_project_sma-1777979762941.png`, caption: "Команда завершила проект" },
  // Школы — до/во время/после
  { src: `${B}a6eb019a4_2f41071bb_War-damaged_school_building_before_reconstruction_-1777979792528.png`, caption: "ДО: повреждённая школа" },
  { src: `${B}39478f66c_0e7492be3_Same_school_building_after_complete_reconstruction-1777979789374.png`, caption: "ПОСЛЕ: восстановленная школа" },
  { src: `${B}f54a9a7a4_Real_photo_of_School_14_facade_in_Mariupol_Russi-1782926050852.png`, caption: "Школа №14 в Мариуполе — фасад" },
  { src: `${B}2990b4d9f_Wide_shot_of_School_14_facade_in_Mariupol_undergo-1782925848831.png`, caption: "Школа №14 — вид с улицы" },
  { src: `${B}8756a0a30_Active_school_renovation_scene_inside_a_classroom_-1782925858221.png`, caption: "Ремонт классной комнаты" },
  { src: `${B}db35a902d_Interior_of_a_school_classroom_under_renovation_A-1782925851808.png`, caption: "Кабинет 20-4А в ходе ремонта" },
  { src: `${B}08350160e_Real_photo_of_a_school_classroom_interior_in_Mariu-1782926054828.png`, caption: "Классная комната после ремонта" },
  { src: `${B}4baa76295_11efcd2e9_Restored_school_building_in_Donbass_region_after_r-1777979881026.png`, caption: "Восстановленная школа с площадкой" },
  // Больницы
  { src: `${B}08aec32ab_1dcae707e_Damaged_apartment_building_in_Donbass_before_recon-1777979853577.png`, caption: "Объект до начала восстановления" },
  { src: `${B}e4f0c7632_5a190bf00_Renovated_hospital_building_in_Eastern_Ukraine_pos-1777979876594.png`, caption: "Больница после восстановления" },
  { src: `${B}5f462e346_Hospital_interior_with_construction_team_working_f-1782925891752.png`, caption: "Ремонт в больничном коридоре" },
  { src: `${B}62185be32_Hospital_main_hall_interior_during_renovation_comp-1782925880090.png`, caption: "Реконструкция приёмного отделения" },
  { src: `${B}e2625c318_Real_photo_of_a_hospital_main_hall_interior_in_Mak-1782926071240.png`, caption: "Завершённое фойе больницы в Макеевке" },
  { src: `${B}3388835ba_6f6aa8a4e_Medical_worker_workplace_in_field_clinic_in_Donbas-1777979753067.png`, caption: "Полевой медпункт на объекте" },
  // Транспорт и техника
  { src: `${B}262fd234b_3c17104c1_Company_vehicle_fleet_parked_at_depot_in_Donbass_-1777979921012.png`, caption: "Автопарк компании" },
  { src: `${B}c4409b950_Portrait_testimonial_photo_of_a_male_truck_driver_-1782925830372.png`, caption: "Водитель грузового транспорта" },
  { src: `${B}8c666a14d_Real_testimonial_photo_of_a_Russian_truck_driver_D-1782926027094.png`, caption: "Опытный дальнобойщик" },
  { src: `${B}c98102518_Russian_male_driver_age_35-40_simple_honest_face-1782925915118.png`, caption: "Водитель категории С" },
  { src: `${B}686bcef8d_Russian_male_long-haul_truck_driver_age_30_plain-1782925932994.png`, caption: "Водитель КАМАЗ" },
  { src: `${B}12a0f64ca_Russian_male_truck_driver_age_50_weathered_exper-1782925923874.png`, caption: "Опытный водитель" },
  // Механики и авторемонт
  { src: `${B}77660fe76_Russian_male_auto_mechanic_age_45_real_greasy_wo-1782925938079.png`, caption: "Автослесарь в цехе" },

  // Охранники
  { src: `${B}e9a8fee3b_Real_testimonial_photo_of_a_Russian_security_guard-1782926040561.png`, caption: "Охранник на посту" },
  { src: `${B}6c41d01a5_Russian_male_security_guard_age_40_plain_honest_-1782925953105.png`, caption: "Охранник режимного объекта" },
  { src: `${B}3e0bbe456_0167630c5_Security_surveillance_system_at_construction_site_-1777979848532.png`, caption: "Система видеонаблюдения" },
  { src: `${B}96722c9ef_92dc79196_Safety_briefing_scene_at_construction_site_Russia-1777979845940.png`, caption: "Инструктаж по безопасности" },
  // Разнорабочие и специалисты
  { src: `${B}dd7ff213e_Real_reviewtestimonial_photo_of_a_Russian_constru-1782926021788.png`, caption: "Специалист-строитель" },
  { src: `${B}a3ba8bb18_Real_testimonial_photo_of_a_young_Russian_construc-1782926037093.png`, caption: "Молодой строитель" },
  { src: `${B}83dce5a49_Young_Russian_male_construction_laborer_age_25-30-1782925908181.png`, caption: "Разнорабочий на объекте" },
  { src: `${B}84828d63e_622c43fca_Portrait_of_young_Russian_construction_specialist-1777979799754.png`, caption: "Молодой специалист программы" },
  { src: `${B}724bc9435_0069169d4_Portrait_of_successful_Russian_female_medical_work-1777979812293.png`, caption: "Медицинский работник" },
  // Связь / инженер-связист

  { src: `${B}3bbeb9829_Russian_male_telecom_engineer_age_38_plain_Russi-1782925943055.png`, caption: "Техник связи на объекте" },
  // Быт и жизнь
  { src: `${B}51cd94f09_9821.png`, caption: "Бытовка — жильё на объекте" },
  { src: `${B}b9eb5e243_0854b0981_Worker_living_quarters_interior_in_reconstruction_-1777979748607.png`, caption: "Жилая комната вахтового посёлка" },
  { src: `${B}31ec50eb8_939c629fc_Basic_company_cafeteria_in_reconstruction_zone_si-1777979888387.png`, caption: "Столовая для работников" },
  { src: `${B}7a6b68b36_Real_evening_at_a_Russian_workers_camp_dining_hal-1782926015965.png`, caption: "Вечер в столовой вахтового посёлка" },
  { src: `${B}1caceed4e_Real_Russian_field_lunch_break_under_a_tarp_tent_o-1782926004227.png`, caption: "Обеденный перерыв на объекте" },
  { src: `${B}1b7168e0f_Real_Russian_afternoon_shift_at_a_construction_sit-1782926008587.png`, caption: "Дневная смена у бытовок" },
  { src: `${B}bcd2adc65_Real_phone-camera_photo_at_0630_in_a_Russian_work-1783090854122.png`, caption: "Раннее утро — подъём в 6:30" },
  { src: `${B}d661dfaa2_Real_phone-camera_photo_at_0700_morning_line-up_b-1783074689558.png`, caption: "Утренняя планёрка в 7:00" },
  { src: `${B}ca7d65c73_Real_phone-camera_photo_in_a_small_basic_Russian_w-1783091039486.png`, caption: "Жильё — небольшая вахтовая комната" },
  { src: `${B}0acbd7d87_Real_phone-camera_photo_in_a_small_basic_Russian_w-1783091048603.png`, caption: "Условия проживания" },
  { src: `${B}fb7d3129a_Photorealistic_documentary_photograph_43_aspect_-1783094596962.png`, caption: "Быт строителей" },
  { src: `${B}6651ac7f7_90a7121bd_Wide_panoramic_view_of_Donetsk_or_Lugansk_city_und-1777979951139.png`, caption: "Панорама города в ходе восстановления" },
  { src: `${B}1133c7bd7_4d485fdd5_Completed_residential_complex_in_Donbass_after_rec-1777979776309.png`, caption: "Готовый жилой комплекс" },
];

// Lazy-loaded image with blur-up effect
function LazyImage({ src, alt, onClick, index }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="group relative aspect-video rounded-xl overflow-hidden bg-secondary/60 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={alt}
    >
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted animate-pulse" />
      )}
      {visible && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end pointer-events-none">
        <p className="text-white text-xs font-inter px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight line-clamp-2">
          {alt}
        </p>
      </div>
    </button>
  );
}

export default function PhotoGallerySection() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [lightbox, setLightbox] = useState(null);
  const sentinelRef = useRef(null);

  const prev = useCallback(() => setLightbox((l) => (l === 0 ? PHOTOS.length - 1 : l - 1)), []);
  const next = useCallback(() => setLightbox((l) => (l === PHOTOS.length - 1 ? 0 : l + 1)), []);
  const close = useCallback(() => setLightbox(null), []);

  // Infinite scroll: load next batch when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + BATCH_SIZE, PHOTOS.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next, close]);

  const visiblePhotos = PHOTOS.slice(0, visibleCount);
  const hasMore = visibleCount < PHOTOS.length;

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
          <div className="flex items-center justify-center gap-2 mt-4">
            <Camera className="h-4 w-4 text-accent" />
            <span className="font-mono text-sm text-accent font-bold">{PHOTOS.length} фотографий</span>
          </div>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {visiblePhotos.map((photo, i) => (
            <div key={i} className="break-inside-avoid mb-3">
              <LazyImage
                src={photo.src}
                alt={photo.caption}
                index={i}
                onClick={() => setLightbox(i)}
              />
            </div>
          ))}
        </div>

        {/* Infinite scroll sentinel + loader */}
        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-8">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2.5 h-2.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Lightbox with Framer Motion */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={close}
              role="dialog"
              aria-modal="true"
              aria-label="Просмотр фото"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Close */}
              <button
                className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                onClick={close}
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Prev */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next */}
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Следующее фото"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image */}
              <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                <motion.img
                  key={lightbox}
                  src={PHOTOS[lightbox].src}
                  alt={PHOTOS[lightbox].caption}
                  className="w-full rounded-xl max-h-[80vh] object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
                <p className="text-white/80 font-inter text-center mt-3 text-sm">
                  {PHOTOS[lightbox].caption}
                </p>
                <p className="text-white/40 font-mono text-center text-xs mt-1">
                  {lightbox + 1} / {PHOTOS.length}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}