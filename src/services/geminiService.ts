import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Multiplier, Prediction, RangeCategory } from '../types';
import { INITIAL_PREDICTION } from '../constants';

// FIX: The API key must be obtained from process.env.API_KEY as per the coding guidelines.
// This also resolves the TypeScript error with `import.meta.env`. It is assumed to be pre-configured and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
    type: Type.OBJECT,
    properties: {
        patternAnalysis: {
            type: Type.STRING,
            description: 'A brief analysis of recent patterns in the multiplier history. Example: "After a series of low multipliers, a medium one is likely."'
        },
        nextRoundPrediction: {
            type: Type.STRING,
            description: 'The predicted range category for the next round (Low, Medium, or High).'
        },
        probabilities: {
            type: Type.OBJECT,
            properties: {
                low: { type: Type.NUMBER, description: 'Probability of a low result (<=1.3x) in percentage. e.g. 60' },
                medium: { type: Type.NUMBER, description: 'Probability of a medium result (1.3x-5x) in percentage. e.g. 30' },
                high: { type: Type.NUMBER, description: 'Probability of a high result (>5x) in percentage. e.g. 10' }
            },
            required: ['low', 'medium', 'high']
        },
        cashOutTarget: {
            type: Type.NUMBER,
            description: 'A specific multiplier value to target for cashing out. e.g. 1.85'
        },
        investmentAdvice: {
            type: Type.STRING,
            description: 'Brief, actionable advice on investment for the next round. Example: "Consider a safe bet, aiming for a quick cash out."'
        }
    },
    required: ['patternAnalysis', 'nextRoundPrediction', 'probabilities', 'cashOutTarget', 'investmentAdvice']
};

export const getPrediction = async (history: Multiplier[]): Promise<Prediction> => {
  if (history.length < 5) {
    return INITIAL_PREDICTION;
  }

  const lowCount = history.filter(h => h.category === RangeCategory.LOW).length;
  const mediumCount = history.filter(h => h.category === RangeCategory.MEDIUM).length;
  const highCount = history.filter(h => h.category === RangeCategory.HIGH).length;

  const lowPercent = ((lowCount / history.length) * 100).toFixed(0);
  const mediumPercent = ((mediumCount / history.length) * 100).toFixed(0);
  const highPercent = ((highCount / history.length) * 100).toFixed(0);

  const recentTrendString = history.slice(0, 5).map(h => `${h.value.toFixed(2)}x (${h.category})`).join(', ');

  let streakInfo = "No significant streak.";
  if (history.length >= 3) {
      const firstCat = history[0].category;
      if (history.slice(1, 3).every(h => h.category === firstCat)) {
          let streakCount = 3;
          for (let i = 3; i < history.length; i++) {
              if (history[i].category === firstCat) {
                  streakCount++;
              } else {
                  break;
              }
          }
          streakInfo = `${streakCount} consecutive ${firstCat} rounds.`;
      }
  }

  const totalValue = history.reduce((sum, h) => sum + h.value, 0);
  const averageMultiplier = totalValue / history.length;

  const highestMultiplier = Math.max(...history.map(h => h.value));
  
  const historyString = history.map(h => h.value.toFixed(2)).join(', ');

  const systemInstruction = `You are an expert analyst for the game 'Aviator'. Your task is to predict the outcome of the next round based on statistical analysis of the game's history. You must provide your analysis in a structured JSON format without any additional commentary. The multiplier ranges are defined as: Low (<=1.3x), Medium (1.3x - 5x), High (>5x).`;

  const prompt = `
    **Game State Analysis**
    - Total Rounds Analyzed: ${history.length}
    - Category Distribution: Low: ${lowCount} (${lowPercent}%), Medium: ${mediumCount} (${mediumPercent}%), High: ${highCount} (${highPercent}%)
    - Recent Trend (last 5): ${recentTrendString}
    - Current Streak: ${streakInfo}
    - Average Multiplier: ${averageMultiplier.toFixed(2)}x
    - Highest Multiplier in History: ${highestMultiplier.toFixed(2)}x

    **Full Multiplier History (most recent first):**
    ${historyString}

    Based on the comprehensive analysis above, provide a detailed prediction for the next round. Your response MUST be in the provided JSON schema.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Received empty response from the API.");
    }
    const sanitizedText = text.trim().replace(/^```json\s*|```$/g, '');
    const parsedJson = JSON.parse(sanitizedText);
    return parsedJson as Prediction;

  } catch (error) {
    console.error("Error fetching prediction from Gemini API:", error);
    return {
      ...INITIAL_PREDICTION,
      patternAnalysis: 'Error fetching analysis.',
      investmentAdvice: 'Could not connect to the prediction service.'
    };
  }
};