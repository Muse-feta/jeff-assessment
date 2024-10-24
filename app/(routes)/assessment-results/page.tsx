"use client";
import React, { useEffect, useState } from "react";
import { useAssessment } from "@/context/data-provider";

const AssessmentResults: React.FC = () => {
  const { setAssessmentData, assessmentData } = useAssessment();
  const [assessmentLines, setAssessmentLines] = useState<string[][]>([]);

  useEffect(() => {
    if (assessmentData) {
      // Check if assessmentData is a string or object and handle accordingly
      const extractedLines =
        typeof assessmentData === "string"
          ? extractSectionsFromString(assessmentData)
          : extractSectionsFromObject(assessmentData);
      setAssessmentLines(extractedLines);
    }
  }, [assessmentData]);

  const extractSectionsFromString = (data: string): string[][] => {
    const sectionsToExtract = [
      "Symptoms",
      "Mental Status Exam",
      "Treatment Plan",
      "Conclusion",
    ];
    const lines = data.split("\n").map((line) => line.trim());

    const extracted = sectionsToExtract
      .map((section) => {
        const startIndex = lines.findIndex((line) => line.startsWith(section));
        if (startIndex !== -1) {
          const details = lines[startIndex].split(":")[1]?.trim();
          return [section, details];
        }
        return null;
      })
      .filter((item): item is string[] => item !== null);

    return extracted;
  };

  const extractSectionsFromObject = (data: any): string[][] => {
    // Assuming assessmentData is an object, we can directly access fields like Symptoms, Mental Status Exam, etc.
    const sections = [
      "Symptoms",
      "Mental Status Exam",
      "Treatment Plan",
      "Conclusion",
    ];
    const extracted = sections
      .map((section) => {
        if (data[section]) {
          return [section, data[section]];
        }
        return null;
      })
      .filter((item): item is string[] => item !== null);

    return extracted;
  };

  if (!assessmentData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Patient Assessment</h1>
      <div className="space-y-6">
        {assessmentLines.map((line, index) => {
          if (line && line.length > 1) {
            const field = line[0];
            const details = line[1];
            return (
              <div key={index} className="border-b border-gray-300 pb-2">
                <div className="bg-gray-100 py-1 px-2">
                  <h3 className="font-bold text-[12px] text-gray-800">
                    {field}
                  </h3>
                </div>
                <div className="py-2 px-4">
                  <p className="text-[12px] text-gray-600">{details}</p>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default AssessmentResults;
