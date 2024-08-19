import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <SignUp />
    </div>
  );
}
