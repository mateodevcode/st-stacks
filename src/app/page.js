"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { data: session } = useSession();

  console.log(session);

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signin");
  }
}
