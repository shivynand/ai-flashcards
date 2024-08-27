import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Header() {
  const { userId } = auth();
  return (
    <div className="bg-black">
      <div className="container mx-auto flex items-center justify-between py-2 text-white">
        <Link href="/">
          <img
            src="SmartCards.svg"
            alt="Smartcards"
            className="lg:-ml-10 w-full h-10 mb-4"
          />
        </Link>
        {/* New MCQ Generator Link */}
        <div className="flex-grow" /> {/* Spacer */}
        <div className="flex items-center gap-10">
          {userId ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
              >
                Dashboard
              </Link>
              <Link
                className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 ml-2"
                href="/mcq-generator"
              >
                MCQ Generator
              </Link>
              <Link
                className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
                href="/flashcard"
              >
                Flashcards!
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <div className="flex justify-center mx-auto gap-10">
                <button
                  id="features"
                  className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 "
                >
                  Features
                </button>
                <button
                  id="pricing"
                  className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
                >
                  Pricing
                </button>
              </div>
              <Link
                className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
                href="/sign-up"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
