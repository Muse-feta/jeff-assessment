"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useAssessment } from "@/context/data-provider";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AssessmentForm: React.FC = () => {
  const { setAssessmentData, assessmentData } = useAssessment();
  const assessmentRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const [formData, setFormData] = useState({
    gender: "",
    dateOfAssessment: "",
    diagnosis: "",
    symptoms: "",
    symptomsDuration: "",
    dailyImpact: "",
    seenSpecialist: false,
    specialistDuration: "",
    treatmentGoals: "",
    maritalStatus: "",
    spouse: false,
    children: false,
    householdDetails: "",
    education: "",
    occupation: "",
    appearanceBehavior: "",
    speechLanguage: "",
    mood: "",
    affect: "",
    thoughtProcess: "",
    thoughtContent: "",
    perceptions: "",
    cognition: "",
    insight: "",
    judgment: "",
    hallucinations: false,
    suicidalThoughts: false,
    selfHarm: false,
    eatingDisorders: false,
    arrestHistory: false,
    strengthsRiskFactors: "",
    treatmentPlan: "",
    substanceUse: false,
    medicalHistory: "",
  });

  const [assessment, setAssessment] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prevState) => ({
        ...prevState,
        [name]: target.checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const data = await response.json();
      console.log("data", data);
      setAssessment(data.assessment);
      // Set assessment data in context
      setAssessmentData(data);

      //  console.log("assessmentData", assessmentData);
      // Navigate to results page
      // router.push("/assessment-results");
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      setLoading(false);
    }
  };

  const assessmentLines = assessment
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(": ").map((part) => part.trim()));

  const downloadPDF = async () => {
    if (assessmentRef.current) {
      const element = assessmentRef.current;

      // Temporarily hide the download button
      const button = document.getElementById("download-button");
      if (button) {
        button.style.display = "none"; // Hide the button
      }

      // Use html2canvas to create a canvas from the assessment div
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Set width of the image in PDF
      const pageHeight = pdf.internal.pageSize.height; // Get the page height
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height based on width
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to PDF and handle page breaks
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("assessment.pdf"); // Download the PDF

      // Restore the button visibility
      if (button) {
        button.style.display = "block"; // Show the button again
      }
    }
  };

  return (
    <div>
      <form
        className="p-6 max-w-3xl mx-auto space-y-8 border bg-gray-50 shadow-lg rounded-xl my-8 "
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl text-center font-bold text-gray-800 mb-6">
          Medical Assessment Form
        </h1>

        {/* Personal Information */}
        <h2 className="text-md font-semibold mb-4 border-b pb-2 bg-gray-100 px-2 rounded-t-lg shadow-sm text-gray-700">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Gender *
            </label>
            <select
              name="gender"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Date of Assessment *
            </label>
            <input
              type="date"
              name="dateOfAssessment"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.dateOfAssessment}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Presenting Problems */}
        <h2 className="text-md font-semibold mb-4 border-b pb-2 bg-gray-100 px-2 rounded-t-lg shadow-sm text-gray-700">
          Presenting Problems
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Describe the symptoms for which you’re seeking help *
            </label>
            <textarea
              name="symptoms"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.symptoms}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Medical History
            </label>
            <textarea
              name="medicalHistory"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Medical history, medications, allergies, etc."
              value={formData.medicalHistory}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              How long have you been experiencing these symptoms?
            </label>
            <input
              type="text"
              name="symptomsDuration"
              placeholder="e.g., 1 year, 6 months"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.symptomsDuration}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              How are these symptoms affecting your daily life? *
            </label>
            <select
              name="dailyImpact"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.dailyImpact}
              onChange={handleChange}
              required
            >
              <option value="">Select Impact</option>
              <option value="Minimal">Minimal</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Debilitating">Debilitating</option>
            </select>
          </div>
        </div>

        {/* Behavioral Health */}
        <h2 className="text-md font-semibold mb-4 border-b pb-2 bg-gray-100 px-2 rounded-t-lg shadow-sm text-gray-700">
          Behavioral Health Problems
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 flex items-center">
            <input
              type="checkbox"
              name="seenSpecialist"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.seenSpecialist}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Have you ever seen a specialist to help with the above problem(s)?
            </label>
          </div>
          {formData.seenSpecialist && (
            <div>
              <label className="block text-sm font-medium text-gray-600">
                For how long did you see the specialist(s)?
              </label>
              <input
                type="text"
                name="specialistDuration"
                className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                value={formData.specialistDuration}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              What are your treatment goals?
            </label>
            <textarea
              name="treatmentGoals"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.treatmentGoals}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Mental Status Exam */}
        <h2 className="text-md font-semibold mb-4 border-b pb-2 bg-gray-100 px-2 rounded-t-lg shadow-sm text-gray-700">
          Mental Status Exam
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Appearance and Behavior */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Appearance and Behavior
            </label>
            <textarea
              name="appearanceBehavior"
              placeholder="Assess the client’s overall appearance, grooming, posture, and movements."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.appearanceBehavior}
              onChange={handleChange}
            />
          </div>
          {/* Speech and Language */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Speech and Language
            </label>
            <textarea
              name="speechLanguage"
              placeholder="Observe speech rate, fluency, coherence, and any language abnormalities."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.speechLanguage}
              onChange={handleChange}
            />
          </div>
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Mood
            </label>
            <input
              type="text"
              name="mood"
              placeholder="Explore the client’s emotional state (e.g., sad, anxious, elated)."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.mood}
              onChange={handleChange}
            />
          </div>
          {/* Affect */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Affect
            </label>
            <input
              type="text"
              name="affect"
              placeholder="Evaluate the emotional expression (e.g., flat, blunted, labile)."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.affect}
              onChange={handleChange}
            />
          </div>
          {/* Thought Process */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Thought Process
            </label>
            <textarea
              name="thoughtProcess"
              placeholder="Investigate the flow and organization of thoughts (e.g., logical, tangential, circumstantial)."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.thoughtProcess}
              onChange={handleChange}
            />
          </div>
          {/* Thought Content */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Thought Content
            </label>
            <textarea
              name="thoughtContent"
              placeholder="Discuss the content of the client’s thoughts (e.g., delusions, obsessions, suicidal ideation)."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.thoughtContent}
              onChange={handleChange}
            />
          </div>
          {/* Perceptions */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Perceptions
            </label>
            <textarea
              name="perceptions"
              placeholder="Inquire about hallucinations (e.g., auditory, visual)."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.perceptions}
              onChange={handleChange}
            />
          </div>
          {/* Cognition */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Cognition
            </label>
            <textarea
              name="cognition"
              placeholder="Assess memory, attention, concentration, and reasoning abilities."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.cognition}
              onChange={handleChange}
            />
          </div>
          {/* Strengths, Risk, and Protective Factors */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Strengths, Risk, and Protective Factors
            </label>
            <textarea
              name="strengthsRiskFactors"
              placeholder="E.g., Resilience, Empathy, Adaptability, Creativity, Leadership, Communication, Problem-Solving, Integrity, Teamwork, Time Management"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.strengthsRiskFactors}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Treatment Plan
            </label>
            <textarea
              name="treatmentPlan"
              placeholder="Treatment Plan"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.treatmentPlan}
              onChange={handleChange}
            />
          </div>
          {/* Insight */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Insight
            </label>
            <input
              type="text"
              name="insight"
              placeholder="Determine the client’s awareness of their condition."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.insight}
              onChange={handleChange}
            />
          </div>
          {/* Judgment */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Judgment
            </label>
            <input
              type="text"
              name="judgment"
              placeholder="Evaluate decision-making and problem-solving skills."
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.judgment}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Additional Yes/No Questions */}
        <h2 className="text-md font-semibold mb-4 border-b pb-2 bg-gray-100 px-2 rounded-t-lg shadow-sm text-gray-700">
          Additional Questions
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hallucinations"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.hallucinations}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Do you hear or see things that others can’t?
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="suicidalThoughts"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.suicidalThoughts}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Have you attempted suicide in the past or do you ever have
              thoughts about not wanting to be here?
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="arrestHistory"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.arrestHistory}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Have you ever been arrested?
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="substanceUse"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.substanceUse}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Have you ever used mood-altering substances?
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="selfHarm"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.selfHarm}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Have you engaged in self-harming behaviors?
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="eatingDisorders"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.eatingDisorders}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Have you ever experienced problems with eating too much or too
              little?
            </label>
          </div>
        </div>

        {/* Social and Occupational History */}
        <h2 className="text-md font-semibold mb-4 border-b pb-2 bg-gray-100 px-2 rounded-t-lg shadow-sm text-gray-700">
          Social and Occupational History
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Marital Status *
            </label>
            <select
              name="maritalStatus"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="spouse"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.spouse}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Do you live with a spouse or partner?
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="children"
              className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={formData.children}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium text-gray-600">
              Do you have children living with you?
            </label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Household Details
            </label>
            <textarea
              name="householdDetails"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.householdDetails}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Education
            </label>
            <input
              type="text"
              name="education"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.education}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              className="border p-2 rounded-lg w-full mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Generate Assessment"}
          </button>
        </div>
      </form>

      {assessment && (
        <div
          className="mt-6 p-4 border rounded-md bg-gray-50"
          ref={assessmentRef}
        >
          <h2 className="text-sm text-center font-bold mb-4">
            Medical Assessment Details
          </h2>

          {/* Existing assessment details */}
          <div className="space-y-6">
            {assessmentLines.map((line, index) => {
              if (line.length > 1) {
                const field = line[0];
                const details = line.slice(1).join(": ");
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

          <button
            id="download-button"
            onClick={downloadPDF}
            className="mt-4 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
