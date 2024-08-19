import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API client
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

async function generateFlashcards(prompt) {
  try {
    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text();
    console.log("Raw response text:", responseText);
    const cleanedResponseText = responseText.replace(/```json|```/g, '').trim(); // Remove backticks and 'json'
    
    // Parse the cleaned response text
    const generatedContent = JSON.parse(cleanedResponseText); 

    return generatedContent.flashcards;
  } catch (error) {
    console.error("Error in generating flashcards:", error);
    throw new Error("Failed to generate flashcards using Gemini API.");
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    const flashcards = await generateFlashcards(data.prompt);
    console.log("Generated flashcards:", flashcards);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}