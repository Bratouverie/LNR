import { useState } from "react";
import { motion } from "framer-motion";
import VacancySpecialties from "./VacancySpecialties";
import VacancyRequirements from "./VacancyRequirements";
import VacancyResponsibilities from "./VacancyResponsibilities";
import VacancyCompensation from "./VacancyCompensation";
import VacancyCareer from "./VacancyCareer";
import VacancyContract from "./VacancyContract";

const TABS = [
  { id: "specialties", label: "📋 Специальности" },
  { id: "requirements", label: "✅ Требования" },
  { id: "responsibilities", label: "📌 Обязанности" },
  { id: "compensation", label: "💰 Компенсация" },
  { id: "career", label: "📈 Карьера и льготы" },
  { id: "contract", label: "📄 Договор" },
];

export default function VacancyTabs({ vacancy }) {
  const [activeTab, setActiveTab] = useState("specialties");

  return (
    <div>
      <div className="flex gap-2 mb-12 overflow-x-auto pb-4 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-lg font-inter font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "specialties" && <VacancySpecialties vacancy={vacancy} />}
        {activeTab === "requirements" && <VacancyRequirements vacancy={vacancy} />}
        {activeTab === "responsibilities" && <VacancyResponsibilities vacancy={vacancy} />}
        {activeTab === "compensation" && <VacancyCompensation vacancy={vacancy} />}
        {activeTab === "career" && <VacancyCareer vacancy={vacancy} />}
        {activeTab === "contract" && <VacancyContract vacancy={vacancy} />}
      </motion.div>
    </div>
  );
}