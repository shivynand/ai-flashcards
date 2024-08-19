import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Header() {
  const { userId } = auth();
  return (
    <div className="bg-slate-400">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/">Home</Link>
        <div>
          {userId ? (
            <div>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/sign-up">Sign up</Link>
              <Link href="/sign-in">Sign in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
