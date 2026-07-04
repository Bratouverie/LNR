import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SalaryCalculator from "@/components/SalaryCalculator/SalaryCalculator";
import VacanciesSection from "../components/VacanciesSection";
import DayOfSpecialist from "../components/DayOfSpecialist";
import ReviewsBlock from "@/components/reviews/ReviewsBlock";
import RecoveryObjects from "../components/RecoveryObjects";
import InteractiveMap from "../components/InteractiveMap";
import NotMilitaryContract from "../components/NotMilitaryContract";
import ProcessSection from "../components/ProcessSection";
import CollectionPoints from "../components/CollectionPoints";
import MedicalCommission from "../components/MedicalCommission";
import SafetySection from "../components/SafetySection";
import HonestRisks from "../components/HonestRisks";
import RestCities from "../components/RestCities";
import BenefitsSection from "../components/BenefitsSection";
import DocumentsSection from "../components/DocumentsSection";
import AboutCompany from "../components/AboutCompany";
import CompanyLeadership from "../components/CompanyLeadership";
import FaqSection from "../components/FaqSection";
import FinalCTA from "../components/FinalCTA";
import ProjectInfoSection from "../components/ProjectInfoSection";
import ProjectStatusSection from "../components/ProjectStatusSection";
import PhotoGallerySection from "../components/PhotoGallerySection";
import ContactsSection from "../components/ContactsSection";
import Footer from "../components/Footer";
import ApplicationModal from "../components/ApplicationModal";
import CallbackModal from "../components/CallbackModal";
import StickyCommandBar from "../components/StickyCommandBar";
import VisitorCounter from "../components/VisitorCounter";
import LiveChat from "../components/LiveChat";

export default function Home() {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [calcPosition, setCalcPosition] = useState(null);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    }
  }, []);

  const openApplication = (vacancy) => {
    setSelectedVacancy(typeof vacancy === "string" ? vacancy : "");
    setSelectedObject("");
    setAppModalOpen(true);
  };

  const openApplicationForObject = (objectName) => {
    setSelectedVacancy("");
    setSelectedObject(objectName);
    setAppModalOpen(true);
  };

  const handleCalculate = (positionKey) => {
    setCalcPosition(positionKey);
    setTimeout(() => {
      const el = document.getElementById("calculator");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenApplication={() => openApplication("")} />

      {/* SECTION 1 – HERO */}
      <HeroSection onOpenApplication={() => openApplication("")} />

      {/* SECTION 2 – CALCULATOR */}
      <SalaryCalculator preselectedPosition={calcPosition} onApply={openApplication} />

      {/* SECTION 3 – VACANCIES */}
      <VacanciesSection onApply={openApplication} onCalculate={handleCalculate} />

      {/* SECTION 4 – DAY OF SPECIALIST */}
      <DayOfSpecialist />

      {/* SECTION 5 – REVIEWS */}
      <ReviewsBlock />

      {/* SECTION 6 – RECOVERY OBJECTS */}
      <RecoveryObjects />

      {/* SECTION 6.5 – INTERACTIVE MAP */}
      <InteractiveMap onApply={openApplicationForObject} />

      {/* SECTION 7 – NOT MILITARY CONTRACT */}
      <NotMilitaryContract />

      {/* SECTION 8 – PROCESS (10 STEPS) */}
      <ProcessSection />

      {/* SECTION 9 – COLLECTION POINTS */}
      <CollectionPoints />

      {/* SECTION 10 – MEDICAL COMMISSION */}
      <MedicalCommission />

      {/* SECTION 11 – SAFETY (THREE LEVELS) */}
      <SafetySection />

      {/* SECTION 12 – HONEST RISKS */}
      <HonestRisks />

      {/* SECTION 13 – REST CITIES */}
      <RestCities />

      {/* SECTION 14 – BENEFITS (TWO TABLES) */}
      <BenefitsSection />

      {/* SECTION 15 – DOCUMENTS */}
      <DocumentsSection />

      {/* SECTION 16 – ABOUT COMPANY */}
      <AboutCompany />

      {/* SECTION 17 – COMPANY LEADERSHIP */}
      <CompanyLeadership />

      {/* SECTION 18 – FAQ */}
      <FaqSection />

      {/* SECTION 19 – FINAL CTA */}
      <FinalCTA onOpenApplication={() => openApplication("")} onCallback={() => setCallbackOpen(true)} />

      {/* KEEP: Project info & status */}
      <ProjectInfoSection />
      <ProjectStatusSection />
      <PhotoGallerySection />

      {/* CONTACTS + FOOTER */}
      <ContactsSection onCallback={() => setCallbackOpen(true)} />
      <Footer />

      {/* Sticky elements */}
      <StickyCommandBar onOpenApplication={() => openApplication("")} />
      <VisitorCounter />
      <LiveChat />

      {/* Modals */}
      <ApplicationModal
        open={appModalOpen}
        onClose={() => setAppModalOpen(false)}
        preselectedVacancy={selectedVacancy}
        preselectedObject={selectedObject}
      />
      <CallbackModal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
      />
    </div>
  );
}