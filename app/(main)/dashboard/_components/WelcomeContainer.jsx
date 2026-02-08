"use client";

import React, { useState } from "react";
import { useUser } from "@/app/provider";
import Image from "next/image";
import { supabase } from "@/services/SupabaseClient";
import { useRouter } from "next/navigation";

const WelcomeContainer = () => {
  const { user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/"); // ✅ redirect to MAIN page
  };

  return (
    <div className="p-4 pl-6">
      <div className="bg-gray-200 p-4 pl-6 rounded-2xl shadow flex justify-between items-center relative">
        {/* Welcome text */}
        <div>
          <h2 className="text-lg font-bold">
            Welcome Back{user?.name ? `, ${user.name}` : ""}
          </h2>
          <h2 className="text-gray-800">
            AI-driven Interview, Hassle free
          </h2>
        </div>

        {/* Avatar + Dropdown */}
        {user && (
          <div className="relative">
            <Image
              src={user.picture}
              alt="userAvatar"
              width={40}
              height={40}
              className="rounded-full cursor-pointer border"
              onClick={() => setOpen(!open)}
            />

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeContainer;
