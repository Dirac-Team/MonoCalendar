import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyPlanResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get the model name
const MODEL_NAME = 'gemini-3-flash-preview';

export const generateWeeklyPlan = async (profile: UserProfile, startDate: Date): Promise<WeeklyPlanResponse> => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const activeDays = profile.postingDays.map(d => daysOfWeek[d]).join(", ");
  
  // Format pillars with their descriptions for the AI
  const pillarsContext = profile.contentPillars
    .map(p => `- ${p.name}: ${p.description || 'No specific details.'}`)
    .join("\n");
  
  const prompt = `
    You are an expert content strategist for a ${profile.brandType} brand on ${profile.platform}.
    
    BRAND IDENTITY:
    - Name: ${profile.name}
    - Persona/Voice: ${profile.persona}
    - Visual Style: ${profile.visualStyle}
    
    ADDITIONAL CONTEXT (Important):
    ${profile.additionalInfo || "None provided."}
    
    SCHEDULING:
    - Active Days: ${activeDays}
    
    CONTENT FORMATS (Pillars):
    ${pillarsContext}
    
    CRITICAL: Create a PREDICTABLE PROGRAMMING SCHEDULE based on these pillars.
    Assign a specific 'Content Pillar' or 'Format' to each active day of the week to create a habit for the audience.
    
    Rules:
    1. Consistency: Map specific pillars to specific days where it makes sense (e.g. "Tutorial Tuesdays").
    2. Rotation: If a format is high-effort, schedule it less frequently if needed, but maintain the specific day-of-week slot.
    3. Variety: Ensure the schedule mixes the pillars to keep the audience engaged.
    4. Context: Use the 'Additional Context' to inform themes (e.g. if they have an ongoing series, schedule the next episode).
    
    Task:
    Generate a 7-day content plan starting from ${startDate.toDateString()}.
    For active days, assign a specific idea based on the pillar you assigned to that day of the week.
    For non-active days, suggest a rest day or low-effort engagement (e.g. Story/Poll).

    Return a JSON object containing an array of plans.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayOffset: { type: Type.INTEGER, description: "0 for the start date, 1 for the next day, etc." },
                  theme: { type: Type.STRING, description: "Short, punchy title for the content." },
                  description: { type: Type.STRING, description: "A 1-sentence summary." },
                  pillar: { type: Type.STRING, description: "The exact name of the Content Pillar assigned to this day." }
                },
                required: ["dayOffset", "theme", "description"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as WeeklyPlanResponse;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const createChatSession = (profile: UserProfile, dayTheme: string, dayDescription: string) => {
  const pillarsContext = profile.contentPillars
    .map(p => `${p.name} (${p.description})`)
    .join(", ");

  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `
        You are a specialized content assistant for a ${profile.brandType} brand on ${profile.platform}.
        
        BRAND PROFILE:
        - Name: ${profile.name}
        - Voice/Persona: ${profile.persona}
        - Visual Aesthetic/Color Grading: ${profile.visualStyle}
        
        ADDITIONAL CONTEXT (Ongoing series, sponsors, life updates):
        ${profile.additionalInfo || "None provided."}
        
        AVAILABLE FORMATS:
        ${pillarsContext}
        
        CURRENT TASK:
        Planning content for a specific day.
        Theme: ${dayTheme}
        Context: ${dayDescription}
        
        Your goal is to help them execute this specific piece of content for ${profile.platform}.
        Be concise, creative, and aligned with their specific style.
        
        If asked for scripts, provide formatting appropriate for ${profile.platform} (e.g., ${profile.platform === 'YouTube' ? 'Hook, Intro, Value Props, CTA' : 'Visual Hook, Audio cue, Caption'}).
      `
    }
  });
};