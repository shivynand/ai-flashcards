import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import FlashcardGenerator from "../flashcard/page";

export default async function Header() {
  const { userId } = auth();
  return (
    <div className="bg-black">
      <div className="container mx-auto flex items-center justify-between py-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
        <Link className="hover:text-white" href="/">Home</Link>
        <div>
          {userId ? (
            <div>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link className="bg-yellow-500 p-2 rounded-xl hover:bg-yellow-600 text-white" href="/sign-up">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
