'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";

function Flashcard({ front, back }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div 
            className="border p-4 rounded shadow cursor-pointer h-48 flex items-center justify-center bg-white overflow-auto"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className="text-center max-h-48">
                {isFlipped ? (
                    <ReactMarkdown>{back}</ReactMarkdown>
                ) : (
                    <h3 className="font-bold">{front}</h3>
                )}
            </div>
        </div>
    );
}

export default function FlashcardGenerator() {
    const [prompt, setPrompt] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateFlashcards = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (res.ok) {
                const data = await res.json();
                setFlashcards(data.flashcards);
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Error generating flashcards');
                console.error('Error generating flashcards:', errorData.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Flashcard Generator</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your content"
                    className="w-full p-2 border rounded"
                />
            </div>
            <button 
                onClick={generateFlashcards}
                disabled={isLoading}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {flashcards.map((card, index) => (
                <Flashcard key={index} front={card.front} back={card.back} />
                ))}
            </div>
        </div>
    );
}