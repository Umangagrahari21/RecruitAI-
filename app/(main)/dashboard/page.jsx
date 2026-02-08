"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/SupabaseClient";

import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewList from "./_components/LatestInterviewList";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      // ❌ NOT LOGGED IN → redirect to login
      if (!data?.session) {
        router.replace("/auth");
        return;
      }

      // ✅ LOGGED IN → allow dashboard
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // ⏳ Prevent UI flash while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  return (
    <div>
      {/* <WelcomeContainer /> */}
      <h2 className="my-3 font-bold text-2xl p-4">Dashboard</h2>
      <CreateOptions />
      <LatestInterviewList />
    </div>
  );
};

export default Dashboard;
