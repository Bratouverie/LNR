import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import VacanciesSection from "../components/VacanciesSection";
import ConditionsSection from "../components/ConditionsSection";
import PaymentSection from "../components/PaymentSection";
import HowToJoinSection from "../components/HowToJoinSection";
import ContactsSection from "../components/ContactsSection";
import Footer from "../components/Footer";
import ApplicationModal from "../components/ApplicationModal";
import CallbackModal from "../components/CallbackModal";
import StickyCommandBar from "../components/StickyCommandBar";

const IMAGES = {
  hero: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/4feb0c682_generated_15775d57.png",
  map: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/3e1457811_generated_20c64b59.png",
  housing: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/bd319ae39_generated_1c205c2c.png",
  team: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/81aa3f65e_generated_440986d5.png",
  dining: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/c83bd75fe_generated_ad393e13.png",
  security: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/db73de3ec_generated_098d4d00.png",
};

export default function Home() {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState("");

  const openApplication = (vacancy) => {
    setSelectedVacancy(typeof vacancy === "string" ? vacancy : "");
    setAppModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenApplication={() => openApplication("")} />
      <HeroSection
        onOpenApplication={() => openApplication("")}
        heroImg={IMAGES.hero}
        mapImg={IMAGES.map}
      />
      <AboutSection teamImg={IMAGES.team} />
      <VacanciesSection onApply={openApplication} />
      <ConditionsSection
        images={{
          security: IMAGES.security,
          housing: IMAGES.housing,
          dining: IMAGES.dining,
          team: IMAGES.team,
        }}
      />
      <PaymentSection />
      <HowToJoinSection />
      <ContactsSection onCallback={() => setCallbackOpen(true)} />
      <Footer />
      <StickyCommandBar onOpenApplication={() => openApplication("")} />

      <ApplicationModal
        open={appModalOpen}
        onClose={() => setAppModalOpen(false)}
        preselectedVacancy={selectedVacancy}
      />
      <CallbackModal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
      />
    </div>
  );
}