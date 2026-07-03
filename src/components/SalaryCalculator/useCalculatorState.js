import { useState, useEffect, useMemo } from "react";
import { VACANCIES, SALARY_DATA, calculateVacancySalary } from "@/data/vacanciesConfig";

function normalizeToVacancyId(id) {
  if (!id) return "raznorabochiy";
  if (VACANCIES.find((v) => v.id === id)) return id;
  if (id.startsWith("voditel")) return "voditel";
  if (SALARY_DATA[id]) {
    for (const v of VACANCIES) {
      if (v.salary.type === "by-category") {
        for (const cat of Object.values(v.salary.categories)) {
          if (cat.calcKey === id) return v.id;
        }
      }
    }
  }
  return "raznorabochiy";
}

function extractDriverCategory(id) {
  if (id && id.startsWith("voditel_")) {
    return id.replace("voditel_", "").toUpperCase();
  }
  return "B";
}

export function useCalculatorState(initialVacancyId = "raznorabochiy") {
  const [selectedVacancyId, setSelectedVacancyId] = useState(normalizeToVacancyId(initialVacancyId));
  const [selectedLevel, setSelectedLevel] = useState("min");
  const [selectedDriverCategory, setSelectedDriverCategory] = useState(extractDriverCategory(initialVacancyId));

  useEffect(() => {
    if (initialVacancyId) {
      setSelectedVacancyId(normalizeToVacancyId(initialVacancyId));
      setSelectedDriverCategory(extractDriverCategory(initialVacancyId));
    }
  }, [initialVacancyId]);

  const vacancy = useMemo(
    () => VACANCIES.find((v) => v.id === selectedVacancyId),
    [selectedVacancyId]
  );
  const isDriver = selectedVacancyId === "voditel";

  const salary = useMemo(
    () => calculateVacancySalary(selectedVacancyId, selectedLevel, isDriver ? selectedDriverCategory : null),
    [selectedVacancyId, selectedLevel, selectedDriverCategory, isDriver]
  );

  const handleVacancyChange = (vacancyId) => {
    setSelectedVacancyId(vacancyId);
    setSelectedLevel("min");
    setSelectedDriverCategory("B");
  };

  return {
    selectedVacancyId,
    selectedLevel,
    selectedDriverCategory,
    vacancy,
    isDriver,
    salary,
    allVacancies: VACANCIES,
    handleVacancyChange,
    handleLevelChange: setSelectedLevel,
    handleDriverCategoryChange: setSelectedDriverCategory,
  };
}