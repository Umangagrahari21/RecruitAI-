"use client";

import { supabase } from "@/services/SupabaseClient";
import React, { useEffect, useState } from "react"; // 

function Provider({ children }) {

  const [user, setUser] = useState();

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // check if user exists
    let { data: Users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email);

    console.log(Users);

    // if not create new
    if (Users?.length === 0) {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: user.user_metadata?.name,
            email: user.email,
            picture: user.user_metadata?.picture,
          },
        ]);

      console.log(data);
      setUser(data);
      return;
    }

    setUser(Users[0]); 
  };

  return (
    <div>
      {children}
    </div>
  );
}

export default Provider;
