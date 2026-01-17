"use client";

import React from "react";
import { supabase } from "@/services/SupabaseClient";

function Login() {

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // options: {
      //   redirectTo: "http://localhost:3000/candidate/dashboard",
      // },
    });

    if (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Card */}
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="AIcruiter Logo"
            className="h-12"
          />
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <img
            src="/login-illustration.png"
            alt="Login Illustration"
            className="w-full max-w-xs"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome to AIcruiter
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-center text-gray-500 mt-1 mb-6">
          Sign in with Google Authentication
        </p>

        {/* Google Login Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
        >
          Login with Google
        </button>

      </div>
    </div>
  );
}

export default Login;
