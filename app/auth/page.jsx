"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/SupabaseClient";
import { LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  // ✅ Google login → redirect to dashboard
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-8 rounded-lg" />
          </div>
          <span className="text-xl font-bold text-gray-800">
            AI Recruiter
          </span>
        </Link>

        <Link href="/">
          <button className="text-gray-600 hover:text-green-600 font-medium">
            Back to Home
          </button>
        </Link>
      </header>

      {/* LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md max-w-md w-full p-8 border">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <LogIn size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Welcome back
          </h2>

          <p className="text-sm text-center text-gray-500 mt-2 mb-8">
            Sign in to continue to{" "}
            <span className="font-medium">AI Recruiter</span>
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Continue with Google
          </button>

          <p className="text-xs text-center text-gray-400 mt-6">
            By signing in, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} AI Recruiter. All rights reserved.
      </footer>
    </div>
  );
}
