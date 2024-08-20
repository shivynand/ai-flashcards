import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Header() {
  const { userId } = auth();
  return (
    <div className="bg-zinc-900">
      <div className="container mx-auto flex items-center justify-between py-4 text-white">
        <Link
          className="hover:text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 lg:-ml-16"
          href="/"
        >
          Home
        </Link>
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
              className="bg-yellow-500 p-2 rounded-xl hover:bg-yellow-600 text-white"
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
