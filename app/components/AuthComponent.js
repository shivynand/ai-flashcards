// app/components/auth.server.js
"use server";
import { auth } from "@clerk/nextjs/server";

export default async function Auth() {
  const { userId } = await auth();
  return userId;
}
