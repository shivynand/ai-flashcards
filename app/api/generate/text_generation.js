import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Define the system prompt for generating flashcards
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative information for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types including multiple choice, definitions, examples, and applications.
6. Avoid overly complex terminology or ambiguous phrasing in both questions and answers for each flashcard.
7. When appropriate, use mnemonics and memory aids to help reinforce information. For example, spaced repetition and active recall.
8. Tailor the difficulty level of the flashcards based on the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcard.
10. For flashcards that a user struggles to learn or retain in their memory, use storytelling techniques to enhance the content of the answer.
11. Utilise the 80/20 principle. Focus on the 20% of essential concepts and knowledge the person needs to know for the topic and briefly skim over the 80% of small details. We want to make it so that the person clearly understands the overall fundamentals and essential concepts, which can then facilitate the learning of the smaller intricate details.

Remember, the goal is to facilitate effective and fun learning and retention of knowledge through these flashcards.

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`;

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function generateFlashcards(prompt, imagePath = null) {
    const parts = [systemPrompt, prompt];
  
    if (imagePath) {
      const imagePart = fileToGenerativePart(imagePath, "image/jpeg");
      parts.push(imagePart);
    }
  
    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    console.log(responseText);
  
    // Remove any markdown formatting if present
    const jsonString = responseText.replace(/```json\n|\n```/g, '').trim();
  
    try {
      return JSON.parse(jsonString).flashcards;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid response format from AI model");
    }
  }
export { generateFlashcards };