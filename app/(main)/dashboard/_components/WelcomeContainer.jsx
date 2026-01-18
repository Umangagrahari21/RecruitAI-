"use client"
import React from 'react'
import { useUser } from "@/app/provider";
import Image from 'next/image';


const WelcomeContainer = () => {
    const {user}=useUser();
  return (
    <div className=' p-4 pl-6 '>
      <div className={'bg-gray-200 p-4 pl-6 rounded-2xl shadow flex justify-between items-center'}>
        <div >
            <h2 className='text-lg font-bold'>Welcome Back,{user?.name}</h2>
            <h2 className='text-gray-800'>AI-driven Interview,Hassle free</h2>
        </div>
       {user &&<Image src={user?.picture} alt='useAvator' width ={40} height ={40}
       className='rounded-full '/>}
      
    </div>
      </div>
        
  )
}

export default WelcomeContainer
