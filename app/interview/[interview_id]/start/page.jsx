"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import InterviewDataContext from "@/context/InterviewDataContext";
import { Mic, Timer, Phone } from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";

export default function StartInterview() {
  const context = useContext(InterviewDataContext);
  const vapiRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [speaking, setSpeaking] = useState(null); // "ai" | "user" | null

  /* ---------- INIT VAPI ONCE ---------- */
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

      vapiRef.current.on("call-start", () => {
        console.log("📞 Call started");
        setCallStarted(true);
        setSpeaking("ai");
      });

      vapiRef.current.on("speech-start", () => {
        console.log("🗣️ AI speaking");
        setSpeaking("ai");
      });

      vapiRef.current.on("speech-end", () => {
        console.log("🎧 User turn");
        setSpeaking("user");
      });

      vapiRef.current.on("call-end", () => {
        console.log("📴 Call ended");
        setCallStarted(false);
        setSpeaking(null);
      });

      vapiRef.current.on("error", (err) => {
        console.error("❌ Vapi error:", err);
        setSpeaking(null);
        setCallStarted(false);
      });
    }
  }, []);

  if (!context) {
    return <p className="text-red-500">Context not found</p>;
  }

  const { interviewInfo } = context;

  const userInitial = interviewInfo?.userName
    ? interviewInfo.userName.charAt(0).toUpperCase()
    : "?";

  /* ---------- START CALL (USER CLICK) ---------- */
  const startCall = async () => {
    if (callStarted) return;

    await navigator.mediaDevices.getUserMedia({ audio: true });

    const questionList = interviewInfo?.interviewData?.questionList
      ?.map((item) => item.question)
      .join(", ");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, welcome to your ${interviewInfo?.interviewData?.jobPosition} interview.`,
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Ask questions one by one.

Job Position: ${interviewInfo?.interviewData?.jobPosition}
Questions: ${questionList}

Start by greeting the candidate and asking the first question out loud.
            `.trim(),
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
  };

  /* ---------- STOP CALL ---------- */
  const stopInterview = () => {
    vapiRef.current?.stop();
    setCallStarted(false);
    setSpeaking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 lg:px-32 xl:px-40">
      <h2 className="font-bold text-xl mb-3">AI Interview Session</h2>

      <div className="flex gap-2 items-center text-gray-700 mb-8">
        <Timer size={20} />
        <span>00:00:00</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* AI Recruiter */}
        <div
          className={`bg-white p-10 rounded-lg border flex flex-col items-center gap-3 transition-all duration-300 ${
            speaking === "ai"
              ? "ring-4 ring-blue-500 scale-105"
              : "opacity-80"
          }`}
        >
          <Image
            src="/ai.png"
            alt="AI Recruiter"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <h2 className="font-medium">AI Recruiter</h2>
        </div>

        {/* User */}
        <div
          className={`bg-white p-10 rounded-lg border flex flex-col items-center gap-3 transition-all duration-300 ${
            speaking === "user"
              ? "ring-4 ring-green-500 scale-105"
              : "opacity-80"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {userInitial}
          </div>
          <h2 className="font-medium">{interviewInfo?.userName}</h2>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic
          onClick={startCall}
          className={`h-12 w-12 p-3 text-white rounded-full cursor-pointer ${
            callStarted ? "bg-gray-400" : "bg-green-600"
          }`}
        />

        <AlertConfirmation stopInterview={stopInterview}>
          <Phone className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer" />
        </AlertConfirmation>
      </div>

      <h2 className="text-sm text-gray-400 text-center mt-5">
        {!callStarted && "Click the mic to start"}
        {callStarted && speaking === "ai" && "AI is speaking..."}
        {callStarted && speaking === "user" && "Listening to you..."}
      </h2>
    </div>
  );
}
