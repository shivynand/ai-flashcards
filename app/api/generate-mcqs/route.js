import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const systemPrompt = `
You are a question creator. Your task is to generate multiple-choice questions (MCQs) based on the given topic or content. Follow these guidelines:
1. Create a clear and concise question.
2. Provide four answer options, labeling them A, B, C, and D.
3. Indicate the correct answer among the options by adding a 'correct' key in the options object.
4. Ensure that the questions are relevant and cover key concepts.
5. Use simple language to make the questions accessible to a wide range of learners.
Return in the following JSON format:
{
    "questions": [
        {
            "question": str,
            "options": {
                "A": str,
                "B": str,
                "C": str,
                "D": str,
                "correct": str // Ensure this is included and correct
            }
        }
    ]
}
`;

async function generateMCQs(prompt) {
  try {
    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text();
    console.log("Raw response text:", responseText); // Log the raw response

    const cleanedResponseText = responseText.replace(/```json|```/g, "").trim(); // Remove backticks and 'json'

    // Check if the response is valid JSON
    if (!cleanedResponseText.startsWith("{")) {
      throw new Error("Invalid response format: " + cleanedResponseText);
    }

    // Parse the cleaned response text
    const generatedContent = JSON.parse(cleanedResponseText);

    // Adjust the structure to exclude the correct answer from the options
    const questions = generatedContent.questions.map((question) => {
      const options = { ...question.options }; // Clone options
      delete options.correct; // Remove the correct answer from options
      return {
        question: question.question,
        options: options,
        correct: question.options.correct, // Keep correct answer for scoring
      };
    });

    return questions;
  } catch (error) {
    console.error("Error in generating MCQs:", error);
    throw new Error("Failed to generate MCQs using Gemini API.");
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    const questions = await generateMCQs(data.prompt);
    console.log("Generated questions:", questions);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating MCQs:", error);
    return NextResponse.json(
      { error: "Failed to generate MCQs." },
      { status: 500 }
    );
  }
}
