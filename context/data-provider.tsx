"use client";
import React, { createContext, useContext, useState } from "react";

interface AssessmentContextType {
  assessmentData: any;
  setAssessmentData: (data: any) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children, 

}) => {   

  
  const [assessmentData, setAssessmentData] = useState(null);

  return (   
    
    <AssessmentContext.Provider value={{ assessmentData, setAssessmentData }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};
