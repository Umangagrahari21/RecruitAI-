"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, Camera, Wifi, Volume2 } from "lucide-react";
import InterviewHeader from "../_components/InterviewHeader";
import { useParams } from "next/navigation";
import { supabase } from "@/services/SupabaseClient";
import { toast } from "sonner";
import InterviewDataContext from "@/context/InterviewDataContext";
import { useRouter } from "next/navigation";
import QuestionList from "@/app/(main)/dashboard/create-interview/_components/QuestionList";


export default function Interview() {
  const [name, setName] = useState("");
  const [checklist, setChecklist] = useState({
    camera: false,
    internet: false,
    quiet: false
  });

  const toggleCheck = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const allChecked = Object.values(checklist).every(val => val);

  //logic
  const {interview_id}=useParams();
  console.log(interview_id)
  const [interviewData,setInterviewData]=useState();
  const[userName,setUserName]=useState();
  const [loading,setLoading]=useState(false);
  const { interviewInfo, setInterviewInfo } =
    useContext(InterviewDataContext);

  const router=useRouter();
  

  useEffect(() => {
  if (interview_id) {
    GetInterviewDetails();
  }
}, [interview_id]);


 const GetInterviewDetails = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from("interview")
      .select("jobPosition, jobDescription, duration, type")
      .eq("interview_id", interview_id)
      .single();

    if (error || !data) {
      toast("Incorrect Interview Link");
      return;
    }

    setInterviewData(data);
  } catch (e) {
    toast("Incorrect Interview Link");
  } finally {
    setLoading(false);
  }
};


  const onJoinInterview = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from("interview")
      .select("*")
      .eq("interview_id", interview_id)
      .single();

    if (error || !data) {
      toast("Invalid interview link");
      return;
    }

    setInterviewInfo({
  ...data,
  userName: name,  
});
    router.push(`/interview/${interview_id}/start`);
  } catch (e) {
    toast("Something went wrong");
  } finally {
    setLoading(false);
  }
};




  return (
    <div>
      {/* Main Content */}
      <div className="flex items-center justify-center p-4 py-10">
        <div className="
          bg-white
          p-8 md:p-10
          rounded-2xl
          shadow-xl
          w-full
          max-w-3xl
          flex
          flex-col
          gap-8
          transition-all
          duration-300
          hover:shadow-2xl
        ">

          {/* Top Section */}
          <div className="text-center">

            {/* Subtitle */}
            <h2 className="text-gray-500 text-lg font-medium">
              AI-Powered Interview Platform
            </h2>

            {/* Illustration */}
            <div className="flex justify-center my-8">
              <div className="relative group">
                <Image
                  src="/interview.jpg"
                  alt="interview"
                  width={500}
                  height={500}
                  className="w-[320px] transition-all duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-bold text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {interviewData?.jobPosition}
            </h2>

            {/* Duration */}
            <div className="flex gap-2 items-center justify-center text-gray-500 mt-4 text-lg">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{interviewData?.duration}</span>
            </div>
          </div>

          {/* Middle Section */}
          <div className="space-y-6">

            {/* Name Input */}
            <div className="w-full">
              <label className="font-semibold mb-3 block text-gray-700">
                Enter your full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
                className="
                  w-full
                  border-2
                  border-gray-200
                  rounded-xl
                  px-5
                  py-4
                  text-lg
                  focus:outline-none
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/20
                  transition-all
                  duration-300
                  hover:border-gray-300
                "
              />
            </div>

            {/* Interactive Checklist */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <h2 className="font-semibold mb-4 text-lg text-gray-800 flex items-center gap-2">
                <span>Before you begin</span>
                {allChecked && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 animate-bounce" />
                )}
              </h2>
              <ul className="space-y-3">
                <li 
                  onClick={() => toggleCheck('camera')}
                  className="flex items-start gap-3 cursor-pointer group hover:translate-x-1 transition-transform duration-200"
                >
                  <div className={`
                    mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${checklist.camera 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300 group-hover:border-primary'
                    }
                  `}>
                    {checklist.camera && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Camera className="w-5 h-5 text-primary" />
                    <span className={`${checklist.camera ? 'text-gray-600 line-through' : 'text-gray-700'} transition-all`}>
                      Test your camera and microphone
                    </span>
                  </div>
                </li>
                
                <li 
                  onClick={() => toggleCheck('internet')}
                  className="flex items-start gap-3 cursor-pointer group hover:translate-x-1 transition-transform duration-200"
                >
                  <div className={`
                    mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${checklist.internet 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300 group-hover:border-primary'
                    }
                  `}>
                    {checklist.internet && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Wifi className="w-5 h-5 text-primary" />
                    <span className={`${checklist.internet ? 'text-gray-600 line-through' : 'text-gray-700'} transition-all`}>
                      Ensure you have a stable internet connection
                    </span>
                  </div>
                </li>
                
                <li 
                  onClick={() => toggleCheck('quiet')}
                  className="flex items-start gap-3 cursor-pointer group hover:translate-x-1 transition-transform duration-200"
                >
                  <div className={`
                    mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${checklist.quiet 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300 group-hover:border-primary'
                    }
                  `}>
                    {checklist.quiet && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <span className={`${checklist.quiet ? 'text-gray-600 line-through' : 'text-gray-700'} transition-all`}>
                      Find a quiet place for interview
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div>
            <button 
              disabled={!name.trim() || !allChecked}
              className={`
                w-full
                py-4
                rounded-xl
                font-semibold
                text-lg
                transition-all
                duration-300
                transform
                ${name.trim() && allChecked
                  ? 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
               onClick={()=>onJoinInterview()}>
              {name.trim() && allChecked ? '🚀 Join Interview' : 'Complete the checklist to continue'}
            </button>

            {/* Progress indicator */}
            {(!name.trim() || !allChecked) && (
              <p className="text-center text-sm text-gray-400 mt-3">
                {!name.trim() ? 'Please enter your name' : `${Object.values(checklist).filter(v => v).length}/3 checks completed`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}