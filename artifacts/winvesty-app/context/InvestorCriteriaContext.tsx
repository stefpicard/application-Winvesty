import React, { createContext, useCallback, useContext, useState } from "react";

import { InvestorCriteria, mockInvestorCriteria } from "@/data/mockData";

interface InvestorCriteriaContextType {
  criteria: InvestorCriteria;
  updateCriteria: (partial: Partial<InvestorCriteria>) => void;
  resetCriteria: () => void;
}

const InvestorCriteriaContext = createContext<InvestorCriteriaContextType | null>(null);

export function InvestorCriteriaProvider({ children }: { children: React.ReactNode }) {
  const [criteria, setCriteria] = useState<InvestorCriteria>(mockInvestorCriteria);

  const updateCriteria = useCallback((partial: Partial<InvestorCriteria>) => {
    setCriteria((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetCriteria = useCallback(() => {
    setCriteria(mockInvestorCriteria);
  }, []);

  return (
    <InvestorCriteriaContext.Provider value={{ criteria, updateCriteria, resetCriteria }}>
      {children}
    </InvestorCriteriaContext.Provider>
  );
}

export function useInvestorCriteria() {
  const ctx = useContext(InvestorCriteriaContext);
  if (!ctx) throw new Error("useInvestorCriteria must be used within InvestorCriteriaProvider");
  return ctx;
}
