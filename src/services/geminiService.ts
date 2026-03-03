import { GoogleGenAI, Type } from "@google/genai";
import { ProfileData, EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function evaluateProfile(profileData: ProfileData): Promise<EvaluationResult> {
  const prompt = `
You are an advanced AI Career Intelligence Engine designed to evaluate Computer Science and Engineering students and early professionals in the Indian job market.

You must behave as:
• A FAANG-level technical interviewer
• A startup hiring manager
• A campus placement evaluator
• A realistic career strategist

You must be strict, analytical, and data-driven.
Do NOT provide motivational fluff.
Do NOT exaggerate salary.
Do NOT sugarcoat weaknesses.
Base your evaluation on demonstrated skill depth, measurable proof of work, and market competitiveness.

---------------------------------------------------------
INPUT PROFILE DATA
---------------------------------------------------------

Education: ${profileData.education}
Skills: ${profileData.skills}
GitHub summary: ${profileData.github}
LeetCode statistics: ${profileData.leetcode}
Projects: ${profileData.projects}
Internships: ${profileData.internships}
Certifications: ${profileData.certifications}
Career goal: ${profileData.careerGoal}

---------------------------------------------------------
EVALUATION INSTRUCTIONS
---------------------------------------------------------

STEP 1: Job Readiness Score (0–100)
Generate a total score and a breakdown across:
- DSA Strength (0–20)
- Development Skill (0–20)
- System Design Awareness (0–15)
- Project Quality & Depth (0–20)
- Practical Exposure (0–15)
- Market Competitiveness (0–10)
Scoring must reflect real hiring standards in India.
Calibrate scoring by internally comparing the candidate against:
• Average Tier 3 CS student
• Top 10% CS student
• Product-company ready candidate

STEP 2: Salary Prediction (Indian Market Only)
Provide:
- Current realistic CTC range
- 12-month projected CTC range (if roadmap followed)
- 24-month projected CTC range
Prediction must consider:
• Skill depth
• Portfolio strength
• Hiring competitiveness
• Current market conditions (non-hyped, realistic)
Do NOT output inflated salaries.

STEP 3: Critical Skill Gaps
Identify top 5 high-impact gaps.
For each gap:
- Explain why it matters in hiring
- Explain risk if ignored
- Suggest concrete improvement direction

STEP 4: Competitive Positioning
Classify candidate as ONE of:
• Below average
• Tier 3 average
• Above average
• Placement-ready
• Product-company ready
• FAANG-level ready
Explain reasoning in 3–5 concise bullet points.

STEP 5: 6-Month Actionable Roadmap
Create a structured roadmap:
Month 1–2: Exact topics to master, Target measurable goals. Also include specific interview preparation tips (common questions, behavioral, technical) based on the candidate's Competitive Positioning and Critical Skill Gaps.
Month 3–4: Project improvements, Skill upgrades, DSA milestones. Also include specific interview preparation tips (common questions, behavioral, technical) based on the candidate's Competitive Positioning and Critical Skill Gaps.
Month 5–6: Interview prep strategy, Portfolio polishing, Mock interview targets. Also include specific interview preparation tips (common questions, behavioral, technical) based on the candidate's Competitive Positioning and Critical Skill Gaps.
Roadmap must be: Specific, Measurable, Realistic, Execution-focused
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          job_readiness_score: { type: Type.NUMBER },
          score_breakdown: {
            type: Type.OBJECT,
            properties: {
              dsa_strength: { type: Type.NUMBER },
              development_skill: { type: Type.NUMBER },
              system_design_awareness: { type: Type.NUMBER },
              project_quality: { type: Type.NUMBER },
              practical_exposure: { type: Type.NUMBER },
              market_competitiveness: { type: Type.NUMBER },
            },
            required: ["dsa_strength", "development_skill", "system_design_awareness", "project_quality", "practical_exposure", "market_competitiveness"],
          },
          salary_prediction: {
            type: Type.OBJECT,
            properties: {
              current_ctc_range: { type: Type.STRING },
              "12_month_projection": { type: Type.STRING },
              "24_month_projection": { type: Type.STRING },
            },
            required: ["current_ctc_range", "12_month_projection", "24_month_projection"],
          },
          critical_skill_gaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                gap: { type: Type.STRING },
                why_it_matters: { type: Type.STRING },
                risk_if_ignored: { type: Type.STRING },
                improvement_direction: { type: Type.STRING },
              },
              required: ["gap", "why_it_matters", "risk_if_ignored", "improvement_direction"],
            },
          },
          competitive_positioning: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              reasoning: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["level", "reasoning"],
          },
          six_month_roadmap: {
            type: Type.OBJECT,
            properties: {
              month_1_2: {
                type: Type.OBJECT,
                properties: {
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  interview_prep_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["actions", "interview_prep_tips"],
              },
              month_3_4: {
                type: Type.OBJECT,
                properties: {
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  interview_prep_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["actions", "interview_prep_tips"],
              },
              month_5_6: {
                type: Type.OBJECT,
                properties: {
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  interview_prep_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["actions", "interview_prep_tips"],
              },
            },
            required: ["month_1_2", "month_3_4", "month_5_6"],
          },
        },
        required: [
          "job_readiness_score",
          "score_breakdown",
          "salary_prediction",
          "critical_skill_gaps",
          "competitive_positioning",
          "six_month_roadmap",
        ],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate evaluation.");
  }

  return JSON.parse(text) as EvaluationResult;
}

export async function extractProfileFromImage(base64Image: string, mimeType: string): Promise<Partial<ProfileData>> {
  const prompt = `
Extract the following information from the provided resume image.
Return a JSON object with these keys (leave empty string if not found):
- education
- skills
- github
- leetcode
- projects
- internships
- certifications
- careerGoal
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          education: { type: Type.STRING },
          skills: { type: Type.STRING },
          github: { type: Type.STRING },
          leetcode: { type: Type.STRING },
          projects: { type: Type.STRING },
          internships: { type: Type.STRING },
          certifications: { type: Type.STRING },
          careerGoal: { type: Type.STRING },
        },
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to extract profile from image.");
  }

  return JSON.parse(text) as Partial<ProfileData>;
}

export async function chatWithGemini(messages: { role: 'user' | 'model'; text: string }[], newMessage: string, profileContext?: EvaluationResult): Promise<string> {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `You are an advanced AI Career Intelligence Engine acting as a career advisor for a Computer Science student/professional in the Indian job market.
You are strict, analytical, and data-driven.
${profileContext ? `Here is the user's latest evaluation context: ${JSON.stringify(profileContext)}` : ''}
Answer the user's questions based on their profile and the Indian tech job market.`,
    },
  });

  // Replay history
  for (const msg of messages) {
    if (msg.role === 'user') {
      await chat.sendMessage({ message: msg.text });
    } else {
      // We can't easily inject model responses into the chat history without a complex setup,
      // so we'll just send the whole history as the first message if needed, or use a simpler approach.
      // Actually, the new SDK allows us to pass history when creating the chat, but the types might be tricky.
      // Let's just use a simple generateContent with the history formatted as text for simplicity, or just use the chat object.
    }
  }

  // To properly handle history with the new SDK, let's just use generateContent with a combined prompt for simplicity,
  // or we can format the history into the prompt.
  const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.text}`).join('\n');
  
  const prompt = `
${historyText}
User: ${newMessage}
Advisor:
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview", // Using pro-preview for chatbot as requested
    contents: prompt,
    config: {
      systemInstruction: `You are an advanced AI Career Intelligence Engine acting as a career advisor for a Computer Science student/professional in the Indian job market.
You are strict, analytical, and data-driven.
${profileContext ? `Here is the user's latest evaluation context: ${JSON.stringify(profileContext)}` : ''}
Answer the user's questions based on their profile and the Indian tech job market.`,
    }
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
}

export async function getQuickSummary(profileContext: EvaluationResult): Promise<string> {
  const prompt = `
Based on the following evaluation result, provide a very brief, punchy 2-sentence summary of the candidate's standing and immediate next step.
Evaluation: ${JSON.stringify(profileContext)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite", // Using flash-lite for fast AI responses as requested
    contents: prompt,
  });

  return response.text || "Summary unavailable.";
}
