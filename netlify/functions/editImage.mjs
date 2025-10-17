
import { GoogleGenAI, Modality } from "@google/genai";

// This is the secure, server-side handler for the Gemini API call.
// The API_KEY is stored as an environment variable in Netlify, not exposed to the browser.
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // This error will be visible in the Netlify function logs.
  throw new Error("GEMINI_API_KEY environment variable not set in Netlify.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.models['gemini-2.5-flash-image'];

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { base64ImageData, mimeType, prompt } = JSON.parse(event.body);

    if (!base64ImageData || !mimeType || !prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters.' }),
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    let generatedImage = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        generatedImage = part.inlineData.data;
        break;
      }
    }

    if (!generatedImage) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'The AI model did not return an image.'})
        }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ base64Image: generatedImage }),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate image from AI model." }),
    };
  }
};
