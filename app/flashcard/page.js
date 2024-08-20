"use client";
import { writeBatch } from "firebase/firestore";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { db } from "../firebase";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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
  const [prompt, setPrompt] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const generateFlashcards = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setFlashcards(data.flashcards);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Error generating flashcards");
        console.error("Error generating flashcards:", errorData.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!collectionName) {
      alert("Please enter a name");
      return;
    }

    if (!isLoaded || !isSignedIn || !user) {
      alert("Please sign in to save your flashcards.");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === collectionName)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({ name: collectionName });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name: collectionName }] });
    }

    const colref = collection(userDocRef, collectionName);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colref);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    router.push("/flashcard");
    setCollectionName("");
    handleClose();
  };

  const handleSave = () => {
    console.log("Saving collection:", collectionName);
    saveFlashcards();
    handleClose();
  };

  return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="container p-4 ">
        <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Flashcard Generator
        </h1>
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
          {isLoading ? "Generating..." : "Generate"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcards.map((card, index) => (
            <Flashcard key={index} front={card.front} back={card.back} />
          ))}
        </div>
        {flashcards.length > 0 && (
          <button
            className="bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600 text-white p-2 rounded-xl mt-4"
            onClick={handleOpen}
          >
            Save
          </button>
        )}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Please enter a name for your flashcards collection
              </h2>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="border p-2 rounded w-full mb-4"
                placeholder="Collection Name"
              />
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-black p-2 rounded mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-yellow-500 text-white p-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
