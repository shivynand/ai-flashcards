"use client";
import React, { useEffect, useState } from "react";
import StudySet from "../components/study-set";
import { db } from "../firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const userDocRef = doc(db, "users", "userId");
      const colref = collection(userDocRef, "flashcards");
      const querySnapshot = await getDocs(colref);
      const collectionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCollections(collectionsData);
    };
    fetchCollections();
  }, []);

  const handleCollectionClick = (collection) => {
    router.push(`/flashcards/${collection.name}`);
  };

  return (
    <div className="bg-zinc-800 min-h-screen">
      <div className="container px-6 py-8">
        <div className="border border-zinc-700 rounded-md p-6 mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Flashcards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <StudySet
                key={collection.id}
                title={collection.name}
                description="Click to view flashcards"
                onClick={() => handleCollectionClick(collection)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container px-6 py-8">
        <div className="border border-zinc-700 rounded-md p-6 mb-12">
          <h2 className="text-xl font-bold text-white mb-4">
            Practice Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <StudySet
                key={collection.id}
                title={collection.name}
                description="Click to view flashcards"
                onClick={() => handleCollectionClick(collection)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
