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
        <div className="back font-bold text-xl">{back}</div> // Display back with bold and larger font
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

      if (res.ok) {
        const data = await res.json();
        setFlashcards(data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false); // Reset flip state
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

  const nextFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false); // Reset flip state
  };

  const prevFlashcard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setIsFlipped(false); // Reset flip state
  };

  const toggleFlip = () => {
    setIsFlipped((prevState) => !prevState);
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
        <button
          onClick={generateFlashcards}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {flashcards.length > 0 && (
        <div className="mt-4 flex flex-col items-center">
          <div className="flex justify-between items-center w-[800px]">
            <button
              onClick={prevFlashcard}
              className="bg-gray-300 text-black p-4 rounded mr-4"
            >
              &#9664; {/* Left Arrow */}
            </button>

            <div className="bg-white p-10 rounded-lg shadow-lg w-[800px] h-[400px] flex flex-col items-center justify-center">
              <Flashcard
                front={flashcards[currentIndex].front} // Question displayed
                back={flashcards[currentIndex].back} // Answer displayed
                isFlipped={isFlipped}
                onClick={toggleFlip} // Flip on click
              />
            </div>

            <button
              onClick={nextFlashcard}
              className="bg-gray-300 text-black p-4 rounded ml-4"
            >
              &#9654; {/* Right Arrow */}
            </button>
          </div>

          <button
            onClick={handleOpen}
            className="bg-yellow-500 text-white p-2 mt-7 rounded  w-[200px] h-[50px]"
          >
            Save Flashcards
          </button>
        </div>
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
  );
}
