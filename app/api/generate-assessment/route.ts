// // app/api/generate-assessment/route.ts
// import { NextResponse } from "next/server";
// import { useRouter } from "next/navigation";

// export async function POST(request: Request) {
//   const {
//     gender,
//     dateOfAssessment,
//     diagnosis,
//     symptoms,
//     symptomsDuration,
//     dailyImpact,
//     seenSpecialist,
//     specialistDuration,
//     treatmentGoals,
//     maritalStatus,
//     spouse,
//     children,
//     householdDetails,
//     education,
//     occupation,
//     appearanceBehavior,
//     speechLanguage,
//     mood,
//     affect,
//     thoughtProcess,
//     thoughtContent,
//     perceptions,
//     cognition,
//     insight,
//     judgment,
//     hallucinations,
//     suicidalThoughts,
//     selfHarm,
//     eatingDisorders,
//   } = await request.json();



//   // Construct the prompt for the Hugging Face model
// const prompt = `
// Generate a comprehensive psychological assessment using the following information:

// Client Information:
// - Gender: ${gender}, Date of Assessment: ${dateOfAssessment}
// - Diagnosis: ${diagnosis}
// - Symptoms: ${symptoms} lasting for ${symptomsDuration}, affecting daily life (${dailyImpact})
// - Specialist Seen: ${
//   seenSpecialist ? "Yes" : "No"
// } (Duration: ${specialistDuration})
// - Treatment Goals: ${treatmentGoals}
// - Marital Status: ${maritalStatus}, ${spouse ? "Married" : "Single"}, ${
//   children ? "With children" : "No children"
// }
// - Household: ${householdDetails}
// - Education: ${education}, Occupation: ${occupation}

// Mental Status:
// - Appearance/Behavior: ${appearanceBehavior}
// - Speech/Language: ${speechLanguage}
// - Mood: ${mood}, Affect: ${affect}
// - Thought Process: ${thoughtProcess}, Thought Content: ${thoughtContent}
// - Perceptions: ${perceptions}, Cognition: ${cognition}
// - Insight: ${insight}, Judgment: ${judgment}
// - Hallucinations: ${hallucinations ? "Yes" : "No"}, Suicidal Thoughts: ${
//   suicidalThoughts ? "Yes" : "No"
// }, Self-Harm: ${selfHarm ? "Yes" : "No"}, Eating Disorders: ${
//   eatingDisorders ? "Yes" : "No"
// }

// Please provide the assessment in a narrative format. Ensure that each section connects and offers a holistic view of the client's condition. For example:

// Symptoms: The client presents with ${symptoms}, lasting ${symptomsDuration}, which aligns with the diagnosis of ${diagnosis}. The impact on daily functioning (${dailyImpact}) is notable, and may be influenced by other factors such as ${
//   hallucinations ? "hallucinations" : "no hallucinations"
// } and ${
//   suicidalThoughts ? "suicidal thoughts" : "absence of suicidal thoughts"
// }.

// Mental Status Exam: The client demonstrates ${appearanceBehavior} and ${speechLanguage} in speech. Their mood is ${mood} with an affect of ${affect}, while thought process is ${thoughtProcess} and content reveals ${thoughtContent}. There are ${
//   hallucinations ? "hallucinations present" : "no hallucinations"
// } and ${suicidalThoughts ? "suicidal ideation" : "no suicidal ideation"}.

// Treatment Plan: The proposed plan includes ${treatmentGoals} to address both the symptoms and the underlying causes. ${
//   seenSpecialist ? "Continued specialist care" : "Referral to a specialist"
// } is recommended based on the ${diagnosis} and mental health status.

// Conclusion: The client’s current condition requires monitoring, focusing on ${diagnosis} and the history of ${symptomsDuration}. Further evaluation or adjustments to the treatment plan may be needed based on response and progress.

// Ensure the narrative is well-structured and provides a clear, connected assessment of the client's psychological condition.
// `;





//   // Hugging Face API call
//   const response = await fetch(
//     "https://api-inference.huggingface.co/models/gpt2-medium",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//       },
//       body: JSON.stringify({
//         inputs: prompt,
//         options: { use_cache: false },
//         max_length: 500, // Adjust based on the expected response length
//         temperature: 0.7, // Controls randomness: lower is more deterministic
//       }),
//     }
//   );

//   if (!response.ok) {
//     const errorResponse = await response.json();
//     console.error("Hugging Face API error:", errorResponse);
//     return NextResponse.json(
//       { error: "Failed to generate assessment." },
//       { status: 500 }
//     );
//   }

//   const result = await response.json();
//   const assessment = result[0]?.generated_text || "No assessment generated.";
//   console.log("Assessment:", assessment);

//   return NextResponse.json({ assessment });
// }


// app/api/generate-assessment/route.ts
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
  } = await request.json();

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
}), their household (${householdDetails}), education, and occupation.

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
  - Identify the client’s personal strengths and any potential risk factors. Include information on their support systems, personal resilience, and any behaviors or conditions that might present as risk factors.

  - Treatment Plan:
  - Lay out a structured plan to address the client’s mental health concerns, including any recommendations for future specialist care, adjustments to their current treatment goals (${treatmentGoals}), or specific interventions needed based on the symptoms (${diagnosis}, ${symptoms}). Mention if referral to a specialist is recommended (${
  seenSpecialist ? "Continued specialist care" : "Referral to a specialist"
}).

   Conclusion:
  - Summarize the overall assessment findings, emphasizing the importance of addressing the identified issues and the proposed treatment plan. Highlight the expected outcomes of the treatment and the need for regular follow-up to monitor progress and make necessary adjustments.

  Provide this information in a cohesive narrative format, ensuring that each section connects logically to offer a holistic view of the client’s psychological condition.

  so give me  assessment only this the title and description desplay on the the same line not use a new line each of the titles contain at least 2000 words not more than 3000.:

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
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a psychologist providing assessments." },
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
  var assessment = result.choices?.[0]?.message?.content || "No assessment generated.";
  assessment = assessment.replace(/[*#]/g, "");
  console.log("Assessment:", assessment);

  return NextResponse.json({ assessment });
}
