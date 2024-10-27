
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    gender,
    dateOfAssessment,
    diagnosis,
    symptoms,
    symptomsDuration,
    dailyImpact,
    seenSpecialist,
    specialistDuration,
    treatmentGoals,
    maritalStatus,
    spouse,
    children,
    householdDetails,
    education,
    occupation,
    appearanceBehavior,
    speechLanguage,
    mood,
    affect,
    thoughtProcess,
    thoughtContent,
    perceptions,
    cognition,
    insight,
    judgment,
    hallucinations,
    suicidalThoughts,
    selfHarm,
    eatingDisorders,
    arrestHistory,
    strengthsRiskFactors,
    treatmentPlan,
    substanceUse,
    medicalHistory,
  } = await request.json();

  // Construct the prompt for the OpenAI model
  // Construct the prompt for the OpenAI model
 const prompt = `
Role:
You are a mental health professional tasked with generating a comprehensive mental health assessment report based on client-provided information.
Task:
Create a detailed mental health assessment report with each section formatted as follows, and return the output in parsable JSON format.

Output Format (JSON):
{
  "ClientInformation": {
    "Gender": "${gender}",
    "DateOfAssessment": "${dateOfAssessment}",
    "MaritalStatus": "${maritalStatus}",
    "Education": "${education}",
    "Occupation": "${occupation}"
  },
  "SocialHistory": {
    "MaritalStatus": "${maritalStatus}",
    "Spouse": "${spouse ? "Married" : "Single"}",
    "Children": "${children ? "With children" : "No children"}",
    "Household": "${householdDetails}",
    "Education": "${education}",
    "Occupation": "${occupation}"
  },
  "PresentingConcerns": {
    "PrimarySymptoms": "${symptoms}",
    "DailyImpact": "${dailyImpact}",
    "Duration": "${symptomsDuration}",
    "Diagnosis": "${diagnosis}",
    "SeenSpecialist": "${seenSpecialist ? "Yes" : "No"}",
    "SpecialistDuration": "${specialistDuration}",
    "TreatmentGoals": "${treatmentGoals}"
  },
  "CurrentSymptomsChecklist": {
    "Mood": "${mood}",
    "Affect": "${affect}",
    "ThoughtProcess": "${thoughtProcess}",
    "ThoughtContent": "${thoughtContent}",
    "Perceptions": "${perceptions}",
    "Hallucinations": "${hallucinations ? "Yes" : "No"}",
    "SuicidalThoughts": "${suicidalThoughts ? "Yes" : "No"}",
    "SelfHarm": "${selfHarm ? "Yes" : "No"}",
    "EatingDisorders": "${eatingDisorders}",
    "ArrestHistory": "${arrestHistory}"
  },
  "DiagnosticImpressions": {
    "Diagnosis": "${diagnosis}",
    "RelatedSymptoms": "${symptoms}"
  },
  "Formulation": {
    "BiologicalFactors": "${medicalHistory}",
    "PsychologicalFactors": ["${mood}", "${affect}"],
    "SocialFactors": ["${householdDetails}", "${occupation}"]
  },
  "Recommendations": {
    "TreatmentPlan": "${treatmentPlan}",
    "SubstanceUse": "${substanceUse}",
    "ContinuedCareRecommendations": "..."
  },
  "Conclusion": {
    "Summary": "Summarize key findings, treatment plan, and next steps here."
  }
}

Ensure that the output is in valid JSON format.
`;






  // OpenAI API call
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a psychologist providing assessments.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000, // Adjust based on the expected response length
      temperature: 0.7, // Controls randomness: lower is more deterministic
    }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error("OpenAI API error:", errorResponse);
    return NextResponse.json(
      { error: "Failed to generate assessment." },
      { status: 500 }
    );
  }

  const result = await response.json();
  var assessment =
    result.choices?.[0]?.message?.content || "No assessment generated.";
  assessment = assessment.replace(/[*#]/g, "");
  const parsedAssessment = JSON.parse(assessment);
  console.log(parsedAssessment);

  return NextResponse.json(parsedAssessment);
}
