import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationModal from "@/components/ApplicationModal";
import VacancyHero from "@/components/Vacancy/VacancyHero";
import VacancyTabs from "@/components/Vacancy/VacancyTabs";
import { getVacancyWithDetails } from "@/data/vacanciesConfig";

export default function VacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appOpen, setAppOpen] = useState(false);

  const vacancy = getVacancyWithDetails(id);

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-black text-[#F8FAFC] mb-4">Вакансия не найдена</h1>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-[#7B3FBF] text-white rounded-lg font-bold hover:bg-[#8B4FCF] transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A]">
      <Navbar onOpenApplication={() => setAppOpen(true)} />

      <div className="pt-20 px-6 lg:px-10 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#F8FAFC]/50 hover:text-[#7B3FBF] transition-colors mb-6"
        >
          <ArrowLeft size={18} /> Вернуться
        </button>
      </div>

      <VacancyHero vacancy={vacancy} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <VacancyTabs vacancy={vacancy} />
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="glass-card-gold rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-[#F8FAFC] mb-4">Готовы подать заявку?</h2>
          <p className="text-[#F8FAFC]/60 mb-6">Заполните форму — мы свяжемся с вами в ближайшее время</p>
          <button
            onClick={() => setAppOpen(true)}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#7B3FBF] to-[#8B4FCF] hover:from-[#8B4FCF] hover:to-[#9B5FDF] text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(123,63,191,0.4)]"
          >
            📝 Оставить заявку
          </button>
        </div>
      </div>

      <Footer />

      <ApplicationModal
        open={appOpen}
        onClose={() => setAppOpen(false)}
        preselectedVacancy={vacancy.position}
      />
    </div>
  );
}