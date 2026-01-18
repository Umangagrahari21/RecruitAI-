// "use client";

import React from 'react'
import DashboardProvider from './provider'
import Provider from "@/app/provider";
// import AppSideBar from './_components/AppSideBar'


const DashboardLayout= ({children}) => {
  return (
    <div>
      <Provider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
      </Provider>
    </div>
  )
}

export default DashboardLayout

// "use client";

// import Provider from "@/app/provider";
// import DashboardProvider from "./provider";

// export default function MainLayout({ children }) {
//   return (
//     <Provider>
//       <DashboardProvider>
//         {children}
//       </DashboardProvider>
//     </Provider>
//   );
// }
//   const context = useContext(UserDetailContext);
//   return context;
// } 