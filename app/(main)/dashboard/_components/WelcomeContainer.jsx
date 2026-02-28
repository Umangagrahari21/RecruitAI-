"use client";

import React, { useState } from "react";
import { useUser } from "@/app/provider";
import Image from "next/image";
import { supabase } from "@/services/SupabaseClient";
import { useRouter } from "next/navigation";

const WelcomeContainer = () => {
  const { user } = useUser();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
          style={{ animation: "fadeIn 0.15s ease both" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "popIn 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            {/* Text */}
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Sign out?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to log out of your account?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600
                  bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white
                  bg-green-500 hover:bg-green-600 active:scale-95
                  transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Signing out…
                  </>
                ) : (
                  "Yes, logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 pl-6">
        <div className="bg-gray-200 p-4 pl-6 rounded-2xl shadow flex justify-between items-center">
          {/* Welcome text */}
          <div>
            <h2 className="text-lg font-bold">
              Welcome Back{user?.name ? `, ${user.name}` : ""}
            </h2>
            <h2 className="text-gray-800">
              Smarter interviews, seamlessly powered by AI
            </h2>
          </div>

          {/* Right side: Avatar + Logout icon */}
          {user && (
            <div className="flex items-center gap-3">
              <Image
                src={user.picture}
                alt="userAvatar"
                width={40}
                height={40}
                className="rounded-full border"
              />

              {/* Logout icon button */}
              <button
                onClick={() => setShowConfirm(true)}
                title="Logout"
                className="group flex items-center justify-center w-9 h-9 rounded-xl
                  bg-white/60 hover:bg-green-50 border border-transparent hover:border-green-300
                  text-gray-400 hover:text-green-500
                  transition-all duration-200 ease-in-out active:scale-95"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </>
  );
};

export default WelcomeContainer;