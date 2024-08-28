import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Define a more concise system prompt
const systemPrompt = `
You are a flashcard creator. Generate effective flashcards based on the topic. 
1. Create clear questions for the front.
2. Provide accurate information for the back.
3. Generate 12 flashcards unless specified.
Return in JSON format: {"flashcards": [{"front": "question", "back": "answer"}]}.
`;

async function generateFlashcards(prompt) {
  try {
    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text();
    
    // Log the raw response for debugging
    console.log("Raw response text:", responseText);

    // Simplified response parsing
    const cleanedResponseText = responseText.replace(/```json|```/g, "").trim();
    const generatedContent = JSON.parse(cleanedResponseText);
    
    return generatedContent.flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards: " + error.message);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    // Set a timeout for the API call
    const flashcards = await Promise.race([
      generateFlashcards(data.prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 15000)) // 15 seconds timeout
    ]);

    console.log("Generated flashcards:", flashcards);
    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}