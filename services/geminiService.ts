
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { TabType, PromptInput, AIResult } from "../types";
import { SYSTEM_PROMPTS } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateContent = async (tab: TabType, input: PromptInput): Promise<AIResult> => {
  const ai = getAIClient();
  
  if (tab === TabType.IMAGE_EDIT) {
    return handleImageEdit(ai, input);
  }

  const modelName = 'gemini-3-flash-preview';
  const systemInstruction = SYSTEM_PROMPTS[tab];
  
  // Use search grounding for Universal or YouTube to ensure trending info is used in the prompt
  const useSearch = tab === TabType.UNIVERSAL || tab === TabType.YOUTUBE;

  const promptParts = `
USER INPUTS FOR PROMPT ENGINEERING:
Goal/Task: ${input.goal || 'Not specified'}
Context/Background: ${input.context || 'Not specified'}
Target Audience: ${input.audience || 'Not specified'}
Desired Output Format of the Final AI: ${input.format || 'Standard'}
Constraints/Rules: ${input.constraints || 'Not specified'}
${tab === TabType.EDUCATION ? `Educational Depth Level: ${input.depth}` : ''}
${tab === TabType.PLATFORM ? `Specific Platform Optimization: ${input.platform}` : ''}

INSTRUCTIONS: 
Transform the above inputs into a single, cohesive, high-performance PROMPT. 
Do NOT fulfill the request. Only provide the text that will fulfill it when given to another AI.
  `.trim();

  const response = await ai.models.generateContent({
    model: modelName,
    contents: promptParts,
    config: {
      systemInstruction,
      tools: useSearch ? [{ googleSearch: {} }] : undefined,
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    uri: chunk.web?.uri,
    title: chunk.web?.title
  })).filter((s: any) => s.uri && s.title) || [];

  return {
    text: response.text || "Failed to engineer the prompt.",
    sources: sources.length > 0 ? sources : undefined
  };
};

const handleImageEdit = async (ai: any, input: PromptInput): Promise<AIResult> => {
  if (!input.image) throw new Error("No image provided for analysis.");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: input.image.split(',')[1], mimeType: 'image/png' } },
        { text: `Analyze this image and the user's request: "${input.imagePrompt || 'Enhance this image.'}". Instead of performing the edit, generate a technical instruction prompt that can be sent to an image-to-image AI model to achieve this result. Be highly descriptive about lighting, color, and composition changes.` }
      ]
    }
  });

  let imageUrl = "";
  let text = "";

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    } else if (part.text) {
      text = part.text;
    }
  }

  return { text, imageUrl };
};
