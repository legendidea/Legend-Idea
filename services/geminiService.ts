import { GoogleGenAI, Type } from "@google/genai";
import { Idea, User, CollaboratorMatch } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A simple check, though the environment should have it.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

export const findCollaborators = async (idea: Idea, users: User[]): Promise<CollaboratorMatch[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const userProfiles = users
    .filter(u => u.id !== idea.author.id) // Don't suggest the author as a collaborator
    .map(u => ({
      name: u.name,
      skills: u.skills,
      interests: u.interests,
      role: u.role,
    }));

  const prompt = `
    You are an expert talent-matching AI for a collaborative platform called Legend Idea.
    Your task is to match an idea with the most suitable potential collaborators from a list of available users.

    **Idea Details:**
    - Title: "${idea.title}"
    - Description: "${idea.description}"
    - Tags: ${idea.tags.join(', ')}

    **Available Users:**
    ${JSON.stringify(userProfiles, null, 2)}

    Based on the idea's requirements and the users' skills, interests, and preferred roles, identify the top 3 most suitable collaborators.
    For each suggestion, provide the user's name, their key skills, and a brief, compelling explanation (1-2 sentences) of why they are a good match for this specific idea.
    Focus on creating synergistic matches.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            collaborators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  reason: { type: Type.STRING }
                },
                required: ["name", "skills", "reason"]
              }
            }
          }
        },
      }
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.collaborators || [];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to find collaborators. The AI model might be unavailable.");
  }
};