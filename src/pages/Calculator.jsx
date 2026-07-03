import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SalaryCalculator from "@/components/SalaryCalculator/SalaryCalculator";
import ApplicationModal from "@/components/ApplicationModal";

export default function Calculator() {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState("");

  const openApplication = (vacancy) => {
    setSelectedVacancy(typeof vacancy === "string" ? vacancy : "");
    setAppModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070A]">
      <Navbar onOpenApplication={() => openApplication("")} />
      <SalaryCalculator onApply={openApplication} />
      <Footer />
      <ApplicationModal
        open={appModalOpen}
        onClose={() => setAppModalOpen(false)}
        preselectedVacancy={selectedVacancy}
      />
    </div>
  );
}