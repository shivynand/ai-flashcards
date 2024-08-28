"use client";
import { useState } from "react"; 

function MCQ({ question, options, onAnswerSelect, correctAnswer, feedback }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    if (selectedOption === option) {
      setSelectedOption(null);
      onAnswerSelect(question, null);
    } else {
      setSelectedOption(option);
      onAnswerSelect(question, option);
    }
  };

  const borderColor =
    feedback[question] === true
      ? "border-green-500 border-4"
      : feedback[question] === false
      ? "border-red-500 border-4"
      : "border-gray-300";

  return (
    <div
      className={`p-6 rounded-lg shadow bg-zinc-950 w-full flex flex-col justify-between relative`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg"
        style={{ zIndex: -1 }}
      />
      <h3 className="font-bold text-white text-lg">{question}</h3>
      <ul className="mt-4 flex flex-col text-white text-base space-y-2">
        {Object.entries(options).map(([key, value], index) => (
          <li key={key}>
            <div
              className={`p-4 rounded-lg cursor-pointer border ${
                selectedOption === key
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                  : ""
              }`}
              onClick={() => handleOptionSelect(key)}
            >
              {["A)", "B)", "C)", "D)"][index]} {value}
            </div>
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
        setSelectedAnswers({});
        setFeedback({});
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
    const newFeedback = {};

    mcqs.forEach((mcq) => {
      console.log(
        `User Answer: ${selectedAnswers[mcq.question]}, Correct Answer: ${
          mcq.correct
        }`
      );

      if (selectedAnswers[mcq.question] === mcq.correct) {
        correctCount++;
        newFeedback[mcq.question] = true;
      } else {
        newFeedback[mcq.question] = false;
      }
    });

    const totalQuestions = mcqs.length;
    setFeedback((prev) => ({
      ...prev,
      ...newFeedback,
      score: `You scored ${correctCount} out of ${totalQuestions}`,
    }));
  };

  const handleSave = () => {
    // Add your save logic here
    console.log("Save button clicked");
  };

  return (
    <div className="bg-zinc-800 min-h-screen">
      <div className="container p-6 w-full">
        <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          MCQ Generator
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your topic or content"
            className="w-full p-4 border rounded-lg"
          />
        </div>
        <div className="flex gap-5 mt-4">
          <button
            onClick={generateMCQs}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          {mcqs.length > 0 && (
            <button
              onClick={handleSave}
              className="bg-yellow-500 text-white p-2 px-4 rounded hover:bg-yellow-600"
            >
              Save
            </button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 space-y-4">
          {mcqs.map((mcq, index) => (
            <MCQ
              key={index}
              question={mcq.question}
              options={mcq.options}
              onAnswerSelect={handleAnswerSelect}
              correctAnswer={mcq.correct}
              feedback={feedback}
            />
          ))}
        </div>
        {mcqs.length > 0 && (
          <div className="flex mt-4 justify-end">
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
