"use client"
import React from 'react'
import {useUser} from '@/app/provider'

const WelcomeContainer = () => {
    const {user}=useUser();
  return (
    <div>
        <div>
            <h2>Welcome Back,{user?.name}</h2>ll
        </div>
      
    </div>
  )
}

export default WelcomeContainer
