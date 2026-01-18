"use client";

import { UserDetailContext } from "@/context/userDetailContext";
import { supabase } from "@/services/SupabaseClient";
import React, { useEffect, useState ,useContext} from "react"; // 

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
    <UserDetailContext.Provider value={{user,setUser}}>
      <div>
      {children}
    </div>
    </UserDetailContext.Provider>
    
  );
}

export default Provider;

export const useUser=()=>{
  const context=useContext(UserDetailContext);
  return context;
}
// export const useUser = () => {
//   const context = useContext(UserDetailContext);

//   if (!context) {
//     return { user: null, setUser: () => {} };
//   }

//   return context;
// };

