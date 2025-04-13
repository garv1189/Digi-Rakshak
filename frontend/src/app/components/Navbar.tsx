"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Analytics Hub
            </h1>
            <p className="text-sm text-gray-400">Unified Social Analytics</p>
          </div>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/docs"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Documentation
          </Link>
          <button
            onClick={() => router.push("/dashboard-reddit")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}
