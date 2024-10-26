
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
  Generate a comprehensive psychological assessment based on the following client information:
 
   **Client Information:**
  - Gender: ${gender}
  - Date of Assessment: ${dateOfAssessment}
  - Marital Status: ${maritalStatus}
  - Education and Occupation: ${education}, ${occupation}

  Additional Details:
  - Diagnosis: ${diagnosis}
  - Symptoms: ${symptoms}, lasting for ${symptomsDuration}, affecting daily life (${dailyImpact})
  - Specialist Seen: ${
    seenSpecialist ? "Yes" : "No"
  }, Duration: ${specialistDuration}
  - Treatment Goals: ${treatmentGoals}
  - Household: ${householdDetails}
  - Has Been Arrested: ${arrestHistory ? "Yes" : "No"}
  - Medical History: ${medicalHistory}
  - Uses Mood-Altering Substances: ${substanceUse ? "Yes" : "No"}

  Please organize the assessment into the following sections:

  - Presenting Problems/Chief Complaint:
  - Describe the client's primary symptoms and how they affect their daily life and functioning. Include how long they have experienced these symptoms (${symptomsDuration}) and the diagnosis (${diagnosis}).

  - Behavioral Health:
  - Detail the client’s previous mental health treatment and goals. Include whether they have seen a specialist (${
    seenSpecialist ? "Yes" : "No"
  }) and the duration of specialist care (${specialistDuration}). Also, highlight their treatment goals (${treatmentGoals}).

  - Psychosocial Factors:
  - Include information about the client’s family (${maritalStatus}, ${
    spouse ? "Married" : "Single"
  }, ${
    children ? "With children" : "No children"
  }), their household (${householdDetails}), education, and occupation. Note any criminal history (${
    arrestHistory ? "Yes" : "No"
  }) and medical history (${medicalHistory}).

  - Mental Status Exam:
  - Provide an analysis of the client’s mental status, including:
    - Appearance/Behavior: ${appearanceBehavior}
    - Speech/Language: ${speechLanguage}
    - Mood: ${mood}, Affect: ${affect}
    - Thought Process: ${thoughtProcess}, Thought Content: ${thoughtContent}
    - Perceptions: ${perceptions}, Cognition: ${cognition}
    - Insight: ${insight}, Judgment: ${judgment}
    - Hallucinations: ${hallucinations ? "Yes" : "No"}
    - Suicidal Thoughts: ${suicidalThoughts ? "Yes" : "No"}
    - Self-Harm: ${selfHarm ? "Yes" : "No"}
    - Eating Disorders: ${eatingDisorders ? "Yes" : "No"}

  - Strengths and Risk Factors:
  - Identify the client’s personal strengths and any potential risk factors. Include information on their support systems, personal resilience, empathy, adaptability, creativity, leadership, communication, problem-solving, integrity, teamwork, and time management (${strengthsRiskFactors}). Note if they have a history of using mood-altering substances (${
    substanceUse ? "Yes" : "No"
  }).

  - Treatment Plan:
  - Lay out a structured plan to address the client’s mental health concerns, including any recommendations for future specialist care, adjustments to their current treatment goals (${treatmentPlan}), or specific interventions needed based on the symptoms (${diagnosis}, ${symptoms}). Mention if referral to a specialist is recommended (${
    seenSpecialist ? "Continued specialist care" : "Referral to a specialist"
  }).

   Conclusion:
  - Summarize the overall assessment findings, emphasizing the importance of addressing the identified issues and the proposed treatment plan. Highlight the expected outcomes of the treatment and the need for regular follow-up to monitor progress and make necessary adjustments.

  Provide this information in a cohesive narrative format, ensuring that each section connects logically to offer a holistic view of the client’s psychological condition.

  so give me assessment only this the title and description display on the same line not use a new line each of the titles contain at least 2000 words not more than 3000:

Date of Assessment: _______
Gender: ________
Marital Status: ________
Education and Occupation: ______
Presenting Problems/Chief Complaint: _______
Behavioral Health: ________
Psychosocial Factors:  ______
Mental Status Exam: ________
Strengths and Risk Factors: _______
Treatment Plan: ________
Conclusion: _______
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
  assessment = assessment.replace(
    /(?<!\b(Date of Assessment|Gender|Marital Status|Education and Occupation|Presenting Problems\/Chief Complaint|Behavioral Health|Psychosocial Factors|Mental Status Exam|Strengths and Risk Factors|Treatment Plan|Conclusion)):\s/g,
    ""
  );
  // assessment = assessment.replace(/\n/g, " ");
  const titles = [
    "Date of Assessment:",
    "Gender:",
    "Marital Status:",
    "Education and Occupation:",
    "Presenting Problems/Chief Complaint:",
    "Behavioral Health:",
    "Psychosocial Factors:",
    "Mental Status Exam:",
    "Strengths and Risk Factors:",
    "Treatment Plan:",
    "Conclusion:",
  ];
  titles.forEach((title) => {
    const regex = new RegExp(`\\s*${title}`, "g");
    assessment = assessment.replace(regex, `\n${title}`);
  });
  assessment = assessment.replace(/\n(?=\w+:\s)/g, " ");
  console.log("Assessment:", assessment);

  return NextResponse.json({ assessment });
}
