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
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-inter font-black text-foreground mb-4">Вакансия не найдена</h1>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-inter font-bold hover:bg-accent/90 transition-colors"
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
    <div className="min-h-screen bg-background">
      <Navbar onOpenApplication={() => setAppOpen(true)} />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-6 font-inter text-sm"
        >
          <ArrowLeft size={18} /> Вернуться
        </button>
      </div>

      <VacancyHero vacancy={vacancy} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <VacancyTabs vacancy={vacancy} />
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-secondary border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-inter font-black text-foreground mb-4">Готовы подать заявку?</h2>
          <p className="text-muted-foreground font-inter mb-6">Заполните форму — мы свяжемся с вами в ближайшее время</p>
          <button
            onClick={() => setAppOpen(true)}
            className="px-8 py-4 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold text-lg transition-all shadow-lg shadow-accent/25"
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