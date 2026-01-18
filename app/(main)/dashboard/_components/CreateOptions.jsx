import React from 'react'
import { Video,Phone } from 'lucide-react'

const CreateOptions = () => {
  return (
    <div className='p-6'>
         <div className=' grid grid-cols-2 gap-5'>
      <div className=' bg-white border border-gray-300 rounded-lg p-5 '>
        <Video className='p-3 text-primary bg-red-100 rounded-lg h-12 w-12' />
        <h2 className=' font-bold'>Create New Interview</h2>
        <p className='text-gray-400'> Create AI interview and schedule</p>
      </div>
      <div>
         <div className=' bg-white border border-gray-300 rounded-lg p-5 '>
        <Phone className='p-3 text-primary bg-red-100 rounded-lg h-12 w-12' />
        <h2 className=' font-bold'>Create Phone Screeing Call</h2>
        <p className='text-gray-400'> Schedule phone screening call with candidates</p>
      </div>
      </div>
    </div>
    </div>
   
  )
}

export default CreateOptions
