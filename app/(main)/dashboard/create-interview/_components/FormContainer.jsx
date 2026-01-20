// "use client"

import React,{useState,useEffect} from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {InterviewType} from '@/services/constants'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
// import {onHandleInputChange} from './dashboard/_components/page'


const FormContainer = ({onHandleInputChange,GoToNext} ) => {
    const [interviewType,setInterviewType]=useState([]);
    useEffect(()=>{
        if(interviewType){
            onHandleInputChange('type',interviewType)
        }
    },[interviewType]) 
    const AddInterviewType=(type)=>{
        const data=interviewType.includes(type);
        if(!data){
            setInterviewType(prev =>[...prev ,type])
        }
        else{
            const result=interviewType.filter(item=>item!=type);
            setInterviewType(result);
        }
    }

  return (
    <div className="p-5 bg-gray-100 rounded">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input placeholder="e.g. Full Stack Developer" className="mt-2"
        onChange={(event)=>onHandleInputChange('jobPosition', event.target.value)} />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <textarea
          placeholder="Enter job description"
          className="h-[200px] mt-2 w-full rounded-md border border-gray-300 p-2"
           onChange={(event)=>onHandleInputChange('jobDescription',event.target.value)}
        />
      </div>

       <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
       <Select onValueChange={(value)=>onHandleInputChange('duration',value)}>
  <SelectTrigger className="w-full mt-2">
    <SelectValue placeholder="Select Duration" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="5 Min">5 Min</SelectItem>
    <SelectItem value="15 Min">15 Min</SelectItem>
    <SelectItem value="30 Min">30 Min</SelectItem>
    <SelectItem value="45 Min">45 Min</SelectItem>
    <SelectItem value="60 Min">60 Min</SelectItem>
  </SelectContent>
</Select>
      {/* </div> */}



     <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-3 flex-wrap mt-3">
          {InterviewType.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => AddInterviewType(item.title)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
                  bg-white cursor-pointer transition-all
                  ${
                    interviewType.includes(item.title)
                      ? "border-primary bg-secondary"
                      : "hover:bg-secondary hover:border-primary"
                  }`}
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      

      {/* <div className="mt-5">
  <h2 className="text-sm font-medium">Interview Type</h2>
  <div className="flex gap-3 flex-wrap mt-3">
    {InterviewType.map((item, index) => {
      const Icon = item.icon
      return (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border 
                     bg-white cursor-pointer
                     hover:bg-secondary hover:border-primary
                     hover:shadow-md hover:scale-105
                     transition-all duration-200 ease-in-out
                     active:scale-95"
                     onClick={()=>setInterviewType(prev=>[...prev,type.name])}
                    // onClick={() =>AddInterviewType(type.title)}

        >
          <Icon className="w-5 h-5 text-primary transition-colors duration-200" />
          <span className="text-sm font-medium">{item.title}</span>
        </div>
      )
    })} */}
    {/* {InterviewType.map((item, index) => {
  const Icon = item.icon
  return (
    <div
      key={index}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border 
                 bg-white cursor-pointer
                 hover:bg-secondary hover:border-primary
                 hover:shadow-md hover:scale-105
                 transition-all duration-200 ease-in-out
                 active:scale-95"
      onClick={() => AddInterviewType(item.title)}
    >
      <Icon className="w-5 h-5 text-primary transition-colors duration-200" />
      <span className="text-sm font-medium">{item.title}</span>
    </div>
  )
})} */}

  {/* </div> */}
</div>

      
      <div className='mt-6 flex justify-end' onClick={()=>GoToNext()}>
        <Button>Generate Question <ArrowRight/> </Button>
      </div>
      
    </div>
  )
}

export default FormContainer
