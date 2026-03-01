"use client";

import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import InterviewDataContext from "@/context/InterviewDataContext";
import { Mic, MicOff, Phone, Timer, Radio } from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";

/* ─────────────────────────────────────────
   Helper: parse "5 Min" / "15 Min" → seconds
───────────────────────────────────────── */
function parseDurationToSeconds(durationStr) {
  if (!durationStr) return 5 * 60;
  const num = parseInt(durationStr, 10);
  return isNaN(num) ? 5 * 60 : num * 60;
}

/* ─────────────────────────────────────────
   Helper: format seconds → MM:SS
───────────────────────────────────────── */
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ─────────────────────────────────────────
   Pulse rings
───────────────────────────────────────── */
function PulseRings({ active, color }) {
  if (!active) return null;
  return (
    <>
      <span className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{ backgroundColor: color }} />
      <span className="absolute inset-[-8px] rounded-full animate-ping opacity-20"
        style={{ backgroundColor: color, animationDelay: "150ms" }} />
      <span className="absolute inset-[-16px] rounded-full animate-ping opacity-10"
        style={{ backgroundColor: color, animationDelay: "300ms" }} />
    </>
  );
}

/* ─────────────────────────────────────────
   Sound-wave bars
───────────────────────────────────────── */
function SoundWave({ active, color }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4].map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full transition-all duration-300"
          style={{
            height: active ? `${h * 100}%` : "20%",
            backgroundColor: color,
            animationName: active ? "soundBar" : "none",
            animationDuration: "0.8s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationDelay: `${i * 0.1}s`,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SVG circular countdown ring
───────────────────────────────────────── */
function CircularProgress({ remaining, total, isWarning }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? remaining / total : 1;
  const strokeDashoffset = circumference * (1 - progress);
  const color = isWarning ? "#ef4444" : "#16a34a";

  return (
    <svg
      width="130"
      height="130"
      className="absolute"
      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}
    >
      <circle cx="65" cy="65" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle
        cx="65" cy="65" r={radius} fill="none"
        stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function StartInterview() {
  const context = useContext(InterviewDataContext);
  const vapiRef = useRef(null);
  const timerRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [speaking, setSpeaking] = useState(null); // "ai" | "user" | null
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);

  if (!context) return <p className="text-red-500">Context not found</p>;
  const { interviewInfo } = context;

  const durationStr = interviewInfo?.interviewData?.duration; // e.g. "5 Min"
  const userInitial = interviewInfo?.userName
    ? interviewInfo.userName.charAt(0).toUpperCase()
    : "?";

  const isWarning = callStarted && remaining > 0 && remaining <= 60;
  const progressPct = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 100;

  /* ── Stop interview (manual or auto) ── */
  const stopInterview = useCallback(() => {
    clearInterval(timerRef.current);
    vapiRef.current?.stop();
    setCallStarted(false);
    setSpeaking(null);
    setRemaining(0);
  }, []);

  /* ── Init Vapi once ── */
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

      vapiRef.current.on("call-start", () => {
        setCallStarted(true);
        setSpeaking("ai");
      });
      vapiRef.current.on("speech-start", () => setSpeaking("ai"));
      vapiRef.current.on("speech-end", () => setSpeaking("user"));
      vapiRef.current.on("call-end", () => {
        clearInterval(timerRef.current);
        setCallStarted(false);
        setSpeaking(null);
      });
      vapiRef.current.on("error", () => {
        clearInterval(timerRef.current);
        setSpeaking(null);
        setCallStarted(false);
      });
    }
  }, []);

  /* ── Countdown ticker — starts when callStarted flips true ── */
  useEffect(() => {
    if (!callStarted) return;

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          // Auto-end the call when time is up
          vapiRef.current?.stop();
          setCallStarted(false);
          setSpeaking(null);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [callStarted]);

  /* ── Start call ── */
  const startCall = async () => {
    if (callStarted) return;
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const secs = parseDurationToSeconds(durationStr);
    setTotalSeconds(secs);
    setRemaining(secs);

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

  const timedOut = !callStarted && remaining === 0 && totalSeconds > 0;

  const statusText = timedOut
    ? "⏰ Interview time is up!"
    : !callStarted
    ? "Click the mic to start your interview"
    : speaking === "ai"
    ? "AI Recruiter is speaking…"
    : "Your turn — we're listening";

  const previewTime = durationStr
    ? formatTime(parseDurationToSeconds(durationStr))
    : "00:00";

  return (
    <>
      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulseWarning {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .card-enter   { animation: fadeSlideUp 0.5s ease both; }
        .card-enter-2 { animation: fadeSlideUp 0.5s 0.1s ease both; }
        .shimmer-text {
          background: linear-gradient(90deg,#16a34a 0%,#4ade80 40%,#16a34a 60%,#15803d 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .warning-pulse { animation: pulseWarning 1s ease-in-out infinite; }
        .glass {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .dot-grid {
          background-image: radial-gradient(circle,#d1fae5 1px,transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="min-h-screen dot-grid bg-gray-50 flex flex-col items-center px-6 py-10">

        {/* ── Header ── */}
        <div className="w-full max-w-3xl mb-8 card-enter">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                AI Interview Session
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                {interviewInfo?.interviewData?.jobPosition ?? "Position"}
                {durationStr && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {durationStr}
                  </span>
                )}
              </p>
            </div>

            {/* Timer pill */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono font-semibold transition-all duration-300 ${
                !callStarted && !timedOut
                  ? "bg-gray-100 text-gray-500"
                  : timedOut
                  ? "bg-red-100 text-red-600 ring-2 ring-red-300"
                  : isWarning
                  ? "bg-red-100 text-red-600 ring-2 ring-red-300 warning-pulse"
                  : "bg-green-100 text-green-700 ring-2 ring-green-300"
              }`}
            >
              {callStarted && (
                <Radio
                  size={14}
                  className={`animate-pulse ${isWarning ? "text-red-500" : "text-green-500"}`}
                />
              )}
              <Timer size={14} />
              <span>{callStarted ? formatTime(remaining) : previewTime}</span>
            </div>
          </div>

          {/* Duration progress bar */}
          <div className={`mt-4 h-2 rounded-full bg-gray-200 overflow-hidden transition-opacity duration-500 ${callStarted || timedOut ? "opacity-100" : "opacity-30"}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                isWarning || timedOut
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-green-400 to-emerald-600"
              }`}
              style={{ width: `${timedOut ? 0 : progressPct}%` }}
            />
          </div>

          {/* Below bar labels */}
          {(callStarted || timedOut) && (
            <div className="flex justify-between text-xs mt-1 text-gray-400 font-mono">
              <span>0:00</span>
              <span className={isWarning ? "text-red-500 font-semibold warning-pulse" : ""}>
                {timedOut
                  ? "Time's up!"
                  : isWarning
                  ? `⚠ ${formatTime(remaining)} left`
                  : `${formatTime(remaining)} remaining`}
              </span>
              <span>{durationStr ?? ""}</span>
            </div>
          )}
        </div>

        {/* ── Speaker cards ── */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* AI card */}
          <div className={`card-enter glass rounded-2xl p-8 flex flex-col items-center gap-4 border-2 transition-all duration-500 ${
            speaking === "ai"
              ? "border-green-400 shadow-[0_0_32px_4px_rgba(74,222,128,0.25)] scale-[1.02]"
              : "border-gray-200 shadow-md"
          }`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <PulseRings active={speaking === "ai"} color="#4ade80" />
              <div className={`relative z-10 rounded-full overflow-hidden w-20 h-20 ring-4 transition-all duration-300 ${speaking === "ai" ? "ring-green-400" : "ring-gray-200"}`}>
                <Image src="/interview-ai.png" alt="AI Recruiter" width={80} height={80} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-gray-800 text-lg">AI Recruiter</h2>
              <p className="text-xs text-gray-400 mt-0.5">Powered by apna-ai</p>
            </div>
            <div className="h-6 flex items-center">
              <SoundWave active={speaking === "ai"} color="#16a34a" />
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${speaking === "ai" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              {speaking === "ai" ? "● Speaking" : "Standby"}
            </span>
          </div>

          {/* User card */}
          <div className={`card-enter-2 glass rounded-2xl p-8 flex flex-col items-center gap-4 border-2 transition-all duration-500 ${
            speaking === "user"
              ? "border-blue-400 shadow-[0_0_32px_4px_rgba(96,165,250,0.25)] scale-[1.02]"
              : "border-gray-200 shadow-md"
          }`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <PulseRings active={speaking === "user"} color="#60a5fa" />

              {/* Circular countdown ring — only visible during call */}
              {callStarted && (
                <CircularProgress
                  remaining={remaining}
                  total={totalSeconds}
                  isWarning={isWarning}
                />
              )}

              <div className={`relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 transition-all duration-300 ${speaking === "user" ? "ring-blue-400" : "ring-gray-200"}`}>
                {userInitial}
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-gray-800 text-lg">{interviewInfo?.userName ?? "You"}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Candidate</p>
            </div>
            <div className="h-6 flex items-center">
              <SoundWave active={speaking === "user"} color="#3b82f6" />
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${speaking === "user" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
              {speaking === "user" ? "● Listening" : "Standby"}
            </span>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="card-enter flex flex-col items-center gap-4">
          <div className="flex items-center gap-5">
            <button
              onClick={startCall}
              disabled={callStarted}
              className={`relative group h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg focus:outline-none ${
                callStarted
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-br from-green-500 to-emerald-600 hover:scale-110 hover:shadow-green-300 hover:shadow-xl active:scale-95"
              }`}
            >
              {!callStarted && (
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
              )}
              {callStarted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
            </button>

            <AlertConfirmation stopInterview={stopInterview}>
              <button
                className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg focus:outline-none ${
                  callStarted
                    ? "bg-gradient-to-br from-red-500 to-rose-600 hover:scale-110 hover:shadow-red-300 hover:shadow-xl active:scale-95"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
              >
                <Phone size={24} className="text-white" />
              </button>
            </AlertConfirmation>
          </div>

          <p className={`text-sm font-medium transition-all duration-500 ${
            timedOut
              ? "text-red-500 font-semibold"
              : callStarted && speaking === "ai"
              ? "shimmer-text"
              : callStarted && speaking === "user"
              ? "text-blue-600"
              : "text-gray-400"
          }`}>
            {statusText}
          </p>
        </div>
      </div>
    </>
  );
}
