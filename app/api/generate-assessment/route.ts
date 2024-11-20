
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
    modelType,
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
    "Summary": "Based on the provided data, the client presents with ${symptoms}. The diagnosis is ${diagnosis}, with a treatment plan focusing on ${treatmentPlan}. Key next steps include ${treatmentGoals}.",
    "IdentityAndCulturalConsiderations": "The client identifies as ${gender}, with potential cultural factors like ${maritalStatus} and household dynamics (${householdDetails}) impacting recovery. Education (${education}) and occupation (${occupation}) also play a role in their understanding of the illness.",
    "ExplanationOfIllness": "The client is seeking help now due to ${symptomsDuration}-long symptoms affecting daily functioning (${dailyImpact}). They perceive the condition as ${diagnosis}, which aligns with the assessment.",
    "StrengthsPreferencesAndPriorities": "The client has strengths such as ${strengthsRiskFactors}, along with community and natural supports. These assets can aid in coping and recovery.",
    "StageOfChange": "The client is at the ${
      treatmentPlan.stageOfChange || "contemplation"
    } stage for achieving the treatment goals of ${treatmentGoals}. This determination is based on their motivation and engagement.",
    "SummaryOfPriorityNeedsAndBarriers": "Symptoms such as ${symptoms} and barriers like ${dailyImpact} impede recovery. Environmental factors (${householdDetails}, ${occupation}) also contribute to stressors impacting progress.",
    "Hypotheses": "Central themes include ${diagnosis}-related challenges, ${mood}, and ${affect}. Past treatment (${
  seenSpecialist ? "engaged" : "not engaged"
}) informs the current approach.",
    "TreatmentRecommendations": "It is recommended to initiate ${treatmentPlan} with services tailored to address ${symptoms} and enhance coping mechanisms (${strengthsRiskFactors})."
  }
}

Ensure that the output is in valid JSON format.
`;



const model = modelType || "gpt-3.5-turbo";



  // OpenAI API call
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
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
    return NextResponse.json(errorResponse);
  }

  const result = await response.json();
  var assessment =
    result.choices?.[0]?.message?.content || "No assessment generated.";
  assessment = assessment.replace(/[*#]/g, "");
  const parsedAssessment = JSON.parse(assessment);
  console.log(parsedAssessment);

  return NextResponse.json(parsedAssessment);
}
