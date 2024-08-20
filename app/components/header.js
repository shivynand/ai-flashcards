import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Header() {
  const { userId } = auth();
  return (
    <div className="bg-black">
      <div className="container mx-auto flex items-center justify-between py-4 text-white">
        <Link href="/">
          <img
            src="Smartcards.svg"
            alt="Smartcards"
            className="lg:-ml-10 w-full h-10 mb-4"
          />
        </Link>
        <div className="flex justify-center mx-auto gap-10">
          <div
            id="features"
            className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 "
          >
            Features
          </div>
          <div
            id="pricing"
            className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
          >
            Pricing
          </div>
        </div>
        {/* New MCQ Generator Link */}
        <div className="flex-grow" /> {/* Spacer */}
        <div className="flex items-center gap-10">
          {userId ? (
            <>
              <Link
                className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 lg:ml-4"
                href="/mcq-generator"
              >
                MCQ Generator
              </Link>
              <Link
                className="rounded-xl px-4 py-2 bg-yellow-500 text-white hover:cursor-pointer hover:bg-yellow-600"
                href="/flashcard"
              >
                Flashcards!
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Link
              className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
              href="/sign-up"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
