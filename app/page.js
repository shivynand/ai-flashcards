// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center w-full p-12 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h1 className="text-5xl font-extrabold mb-4">AI Flashcards</h1>
        <p className="text-lg mb-6 max-w-xl">
          Enhance your learning experience with AI-generated flashcards tailored
          to your needs.
        </p>
      </section>

      {/* Flashcard Generator Section */}
      <Link href="/flashcard">Flashcards!</Link> {/* Add the FlashcardGenerator component here */}

      {/* Pricing Options */}
      <section className="w-full p-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-6">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-2">Basic</h3>
            <p className="text-3xl font-bold mb-4">$9/month</p>
            <p className="mb-4">Access to basic features.</p>
            <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">
              Choose Plan
            </button>
          </div>
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">$19/month</p>
            <p className="mb-4">
              Access to all features including AI-generated content.
            </p>
            <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">
              Choose Plan
            </button>
          </div>
          <div className="p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-2">Premium</h3>
            <p className="text-3xl font-bold mb-4">$29/month</p>
            <p className="mb-4">All Pro features plus priority support.</p>
            <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">
              Choose Plan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}