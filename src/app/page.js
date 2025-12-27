"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signin");
  }
}
