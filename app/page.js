import Link from "next/link";
import getStripe from "@/utils/get-stripe";
import { auth } from "@clerk/nextjs/server";

export default function Home() {
  const { userId } = auth();
  return (
    <div className="items-center justify-center bg-zinc-900 min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center w-full p-12 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          SmartCards
        </h1>
        <p className="text-2xl max-w-xl lg:text-nowrap flex justify-center">
          The better way of learning and making information stick 🧠
          <br />
          <br />
          Say 👋 BYE BYE 👋 to traditional, passive learning and learn better.
          You deserve to.
        </p>
        <div className="mt-10">
          {userId ? (
            <div></div>
          ) : (
            <Link
              className="p-4 text-4xl px-10 bg-yellow-500 rounded-xl"
              href="/sign-up"
            >
              Try it out
            </Link>
          )}
        </div>
      </section>

      {/* Features Copy */}
      <section className="flex flex-col w-full bg-zinc-900 text-white text-center">
        <h1 className="text-4xl font-extrabold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Features
        </h1>
        <div className="rounded-2xl items-center justify-center mx-auto mt-4">
          <grid className="space-x-4 flex flex-row">
            <div className="rounded-2xl p-5 flex flex-col w-[50%] border border-yellow-400 bg-zinc-900">
              <h2 className="text-2xl font-bold mb-2">❌ COPYING TEXTBOOKS</h2>
              <div className="text-md text-center bg-clip-border bg-gradient-to-r">
                <div className="p-3">
                  <strong className="text-gray-400 text-lg">
                    Long,Dull Textbooks &rarr;{" "}
                  </strong>
                  <strong className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 text-lg">
                    Short,Engaging Flashcards.
                  </strong>
                  <br />
                </div>
                Instead of copying your textbook, learn your textbook through
                SmartCards.
              </div>
            </div>
            <div className="p-5 flex flex-col rounded-2xl w-[50%] border border-yellow-400 bg-zinc-900">
              <h2 className="text-2xl font-bold mb-2 text-nowrap bg-clip-text">
                🎯 CRAM EFFICIENTLY
              </h2>
              <div className="text-md text-center">
                <div className="p-3">
                  Have a test tommorow and feel clueless? 😰
                  <br />
                  😩 Or an assignment where you need to learn complex topics
                  fast?
                  <br />
                </div>
                <p className="text-lg font-bold">
                  We got you. Type your topic and let SmartCards do the rest.
                </p>
              </div>
            </div>
          </grid>
        </div>
      </section>

      {/* Pricing Options
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
      </section> */}
    </div>
  );
}
