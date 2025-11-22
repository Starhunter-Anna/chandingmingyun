import { GoogleGenAI, Chat, Type } from "@google/genai";
import { BaziResult, Language, DailyFortuneResponse } from "../types";

const getAIClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const formatBaziForAI = (bazi: BaziResult): string => {
    return `
    Birth Place: ${bazi.birthPlace}
    Gender: ${bazi.gender}
    Birth Date: ${bazi.birthDate}
    
    Four Pillars (BaZi):
    - Year: ${bazi.yearPillar.gan}${bazi.yearPillar.zhi} (${bazi.yearPillar.zhiAnimal}) - Element: ${bazi.yearPillar.ganElement}
    - Month: ${bazi.monthPillar.gan}${bazi.monthPillar.zhi} - Element: ${bazi.monthPillar.ganElement}
    - Day (Day Master): ${bazi.dayPillar.gan}${bazi.dayPillar.zhi} - Element: ${bazi.dayPillar.ganElement}
    - Hour: ${bazi.hourPillar.gan}${bazi.hourPillar.zhi} - Element: ${bazi.hourPillar.ganElement}

    Current Major Cycle (Da Yun) context: The system assumes calculating current cycle based on current year ${new Date().getFullYear()}.
    `;
};

export const createBaziChat = (bazi: BaziResult, lang: Language): Chat => {
    const ai = getAIClient();
    const context = formatBaziForAI(bazi);
    
    const langInstruction = lang === 'zh' 
        ? "IMPORTANT: You MUST answer in simplified Chinese (简体中文)." 
        : "IMPORTANT: You MUST answer in English.";

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a wise, empathetic, and expert Master of Chinese Metaphysics (BaZi and Feng Shui). 
            You interpret the user's "Four Pillars of Destiny" provided in the context.
            
            ${langInstruction}

            Guidelines:
            1. Analyze the interaction between the Day Master (the Day Stem) and the other elements (Season, Strength).
            2. Be encouraging but honest. Use metaphors related to nature (e.g., "Weak Fire needs Wood to burn").
            3. Structure your answers clearly.
            4. If asked about "Love" (Zheng Yuan), look for the Spouse Star (Wealth element for men, Officer element for women).
            5. If asked about "Career", look for Officer/Resource/Wealth stars.
            6. Consider the birth place if relevant for geographical or directional advice.
            7. Keep the tone mystical yet grounded and helpful.
            8. Do not be fatalistic; always offer advice on how to improve luck (e.g., "Wear more blue," "Travel north").
            
            User's BaZi Data:
            ${context}
            `
        }
    });
};

export const getDailyFortune = async (bazi: BaziResult, lang: Language): Promise<DailyFortuneResponse | null> => {
    const ai = getAIClient();
    const context = formatBaziForAI(bazi);
    const today = new Date().toISOString().split('T')[0];
    
    const langPrompt = lang === 'zh' 
        ? "Provide the content in simplified Chinese (简体中文)." 
        : "Provide the content in English.";

    const prompt = `
    Based on the BaZi profile below, generate a specialized "Daily Fortune" for today (${today}).
    ${langPrompt}
    
    Return the result strictly in JSON format.
    
    Profile: ${context}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.INTEGER,
                            description: "A score from 0 to 100 representing overall luck today."
                        },
                        summary: {
                            type: Type.STRING,
                            description: "A one-sentence summary of the fortune."
                        },
                        analysis: {
                            type: Type.STRING,
                            description: "A detailed paragraph analyzing the day's energy relative to the user's chart."
                        },
                        advice: {
                            type: Type.STRING,
                            description: "Specific actionable advice for the day."
                        },
                        luckyColor: {
                            type: Type.STRING,
                            description: "The lucky color for today."
                        },
                        luckyDirection: {
                            type: Type.STRING,
                            description: "The lucky direction for today."
                        }
                    },
                    required: ["score", "summary", "analysis", "advice", "luckyColor", "luckyDirection"]
                }
            }
        });
        
        const text = response.text;
        if (text) {
            return JSON.parse(text) as DailyFortuneResponse;
        }
        return null;
    } catch (error) {
        console.error("Error fetching daily fortune:", error);
        return null;
    }
};