"use client";
import { useState } from "react"; 

function MCQ({ question, options, onAnswerSelect, correctAnswer, feedback }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    // Toggle selection
    if (selectedOption === option) {
      setSelectedOption(null); // Deselect if already selected
      onAnswerSelect(question, null); // Notify parent of deselection
    } else {
      setSelectedOption(option);
      onAnswerSelect(question, option); // Notify parent of selection
    }
  };

  // Determine border color and width based on correctness
  const borderColor =
    feedback[question] === true
      ? "border-green-500 border-4" // Thicker green border for correct answers
      : feedback[question] === false
      ? "border-red-500 border-4" // Thicker red border for incorrect answers
      : "border-gray-300"; // Default gray border

  return (
    <div
      className={`border p-4 rounded shadow bg-white flex flex-col justify-between ${borderColor}`}
    >
      <h3 className="font-bold">{question}</h3>
      <ul className="mt-2 flex-grow">
        {Object.entries(options).map(([key, value]) => (
          <li key={key} className="p-1">
            <label>
              <input
                type="radio"
                name={question} // Group by question
                value={key}
                checked={selectedOption === key}
                onChange={() => handleOptionSelect(key)}
                className="mr-2"
              />
              {key}: {value}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MCQGenerator() {
  const [prompt, setPrompt] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  const generateMCQs = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-mcqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setMcqs(data.questions);
        setSelectedAnswers({}); // Reset selected answers
        setFeedback({}); // Reset feedback
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Error generating MCQs");
        console.error("Error generating MCQs:", errorData.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (question, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question]: selectedOption,
    }));
  };

  const handleFinalSubmit = () => {
    let correctCount = 0;
    const newFeedback = {}; // Create a new feedback object

    mcqs.forEach((mcq) => {
      // Log the user's answer and the correct answer for debugging
      console.log(
        `User Answer: ${selectedAnswers[mcq.question]}, Correct Answer: ${
          mcq.correct
        }`
      );

      // Check if the user's answer matches the correct answer
      if (selectedAnswers[mcq.question] === mcq.correct) {
        correctCount++;
        newFeedback[mcq.question] = true; // Mark as correct
      } else {
        newFeedback[mcq.question] = false; // Mark as incorrect
      }
    });

    const totalQuestions = mcqs.length;
    setFeedback((prev) => ({
      ...prev,
      ...newFeedback, // Merge the new feedback with the previous feedback
      score: `You scored ${correctCount} out of ${totalQuestions}`,
    }));
  };

  return (
    <div className="bg-zinc-800 min-h-screen">
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          MCQ Generator
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your topic or content"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={generateMCQs}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mcqs.map((mcq, index) => (
            <div key={index}>
              <MCQ
                question={mcq.question}
                options={mcq.options}
                onAnswerSelect={handleAnswerSelect}
                correctAnswer={mcq.correct}
                feedback={feedback}
              />
            </div>
          ))}
        </div>
        {mcqs.length > 0 && (
          <div className="flex mt-4">
            <button
              onClick={handleFinalSubmit}
              className="rounded-xl px-4 py-2 bg-yellow-500 text-white hover:cursor-pointer hover:bg-yellow-600"
            >
              Submit
            </button>
          </div>
        )}
        {feedback.score && (
          <p className="text-lg font-bold mt-4 text-white">{feedback.score}</p>
        )}
      </div>
    </div>
  );
}
