"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore"; // Ensure getDoc is imported
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const Flashcard = ({ front, back, isFlipped, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {isFlipped ? (
        <ReactMarkdown className="back font-bold text-xl">{back}</ReactMarkdown> // Display back with bold and larger font
      ) : (
        <div className="front font-bold text-2xl">{front}</div> // Display front with bold and larger font
      )}
    </div>
  );
};

export default function FlashcardGenerator() {
  const [prompt, setPrompt] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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
  
      const responseText = await res.text(); // Get raw response text
      console.log("Raw response:", responseText); // Log it for debugging
  
      if (res.ok) {
        const data = JSON.parse(responseText); // Parse JSON only if the response is OK
        setFlashcards(data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setError(responseText); // Set error to raw response
        console.error("Error generating flashcards:", responseText);
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

    const userId = user.id;
    if (!userId) {
      alert("User ID not available. Please try again.");
      return;
    }

    try {
      console.log("Saving flashcards for user:", userId);

      // Step 1: Get user document reference
      const userDocRef = doc(db, "users", userId);
      console.log("User document reference:", userDocRef);

      // Step 2: Check if user document exists
      const docSnap = await getDoc(userDocRef);
      console.log("User document snapshot:", docSnap);

      if (docSnap.exists()) {
        console.log("User document exists. Updating flashcards collection.");

        // Step 3: Update existing user document with new flashcard collection
        const collections = docSnap.data().flashcards || [];
        if (collections.find((f) => f.name === collectionName)) {
          alert("Flashcard collection with the same name already exists.");
          return;
        } else {
          collections.push({ name: collectionName });
          await setDoc(
            userDocRef,
            { flashcards: collections },
            { merge: true }
          );
          console.log("Updated user document with new flashcards collection.");
        }
      } else {
        console.log("User document does not exist. Creating new document.");
        await setDoc(userDocRef, { flashcards: [{ name: collectionName }] });
        console.log("Created new user document with flashcards collection.");
      }

      // Step 4: Save flashcards to the specified collection
      const colref = collection(userDocRef, collectionName);
      console.log("Flashcards collection reference:", colref);

      // Save JSON data
      const jsonData = JSON.stringify(flashcards);
      const jsonDocRef = doc(colref, "flashcards_json");
      await setDoc(jsonDocRef, { data: jsonData });
      console.log("JSON data saved successfully.");

      // Save individual flashcards
      flashcards.forEach((flashcard, index) => {
        const cardDocRef = doc(colref, `flashcard-${index}`);
        console.log(`Saving flashcard ${index}:`, flashcard);
        setDoc(cardDocRef, flashcard)
          .then(() => {
            console.log(`Flashcard ${index} saved successfully.`);
          })
          .catch((error) => {
            console.error(`Error saving flashcard ${index}:`, error);
          });
      });

      router.push("/dashboard");
      setCollectionName("");
      handleClose();
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSave = () => {
    saveFlashcards();
    handleClose();
  };

  const toggleFlip = (index) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index].isFlipped = !newFlashcards[index].isFlipped;
    setFlashcards(newFlashcards);
  };

  return (
    <div className="bg-zinc-800 min-h-screen items-center">
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Flashcard Generator
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your content"
            className="w-full p-4 border rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={generateFlashcards}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 px-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          {flashcards.length > 0 && (
            <button
              onClick={handleSave}
              className="bg-yellow-500 text-white p-3 px-4 rounded hover:bg-yellow-600"
            >
              Save
            </button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {flashcards.length > 0 && (
        <div className="mt-4 pb-4 grid grid-cols-3 gap-4 justify-items-center">
          {flashcards.map((flashcard, index) => (
            <div
              key={index}
              className="bg-zinc-900 text-white p-10 rounded-lg shadow-lg w-[30vw] h-[300px] flex flex-col items-center justify-center border-4 border-yellow-500"
            >
              <Flashcard
                front={flashcard.front} // Question displayed
                back={flashcard.back} // Answer displayed
                isFlipped={flashcard.isFlipped || false}
                onClick={() => toggleFlip(index)} // Flip on click
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
