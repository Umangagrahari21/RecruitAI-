// "use client";

import React from 'react'
import DashboardProvider from './provider'
// import AppSideBar from './_components/AppSideBar'

const DashboardLayout= ({children}) => {
  return (
    <div>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout
