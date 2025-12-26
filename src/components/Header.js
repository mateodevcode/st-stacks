"use client";

import { signOut, useSession } from "next-auth/react";
import { Terminal, LogOut } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-segundo border-b border-tercero/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-quinto p-2 rounded-lg group-hover:bg-tercero/10 transition-colors">
              <Terminal className="w-6 h-6 text-tercero" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-tercero">
                Stack Builder Pro
              </h1>
              <p className="text-xs text-gray-500 font-mono">
                {process.env.NEXT_PUBLIC_APP_NAME} v:
                {process.env.NEXT_PUBLIC_APP_VERSION}
              </p>
            </div>
          </Link>

          {/* User Info & Logout */}
          {session?.user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-tercero font-mono">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-xs text-gray-500">Authenticated</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex items-center gap-2 bg-quinto text-tercero hover:text-red-400 px-4 py-2 rounded-lg transition-all border border-tercero/20 hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-mono text-sm">Exit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
