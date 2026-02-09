"use client";

import Link from "next/link";
import { Video, Phone, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl  flex items-center justify-center">
            <img
              src="/logo.png"
              alt="AIcruiter Logo"
              className="h-8 rounded-lg"
            />
          </div>
          <span className="text-xl font-bold text-gray-800">
            AI Recruiter
          </span>
        </div>

        <Link href="/auth">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition">
            Login
          </button>
        </Link>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          AI-Driven Interviews, <br />
          <span className="text-green-600">Hassle-Free Hiring</span>
        </h1>

        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
          Conduct automated interviews, screen candidates smarter,
          and save time using AI-powered voice interviews.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/auth">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Get Started
            </button>
          </Link>

          <Link href="https://www.geeksforgeeks.org/artificial-intelligence/generative-ai-interview-question-with-answer/">
          <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition">
            Learn More
          </button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <Video />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            AI Video Interviews
          </h3>
          <p className="mt-2 text-gray-500 text-sm">
            Create and conduct AI-powered interviews automatically.
          </p>
        </div>
        <div><br/></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <Phone />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            Phone Screening
          </h3>
          <p className="mt-2 text-gray-500 text-sm">
            Schedule AI phone screening calls with candidates.
          </p>
        </div>


      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} AI Recruiter. All rights reserved.
      </footer>
    </div>
  );
}
