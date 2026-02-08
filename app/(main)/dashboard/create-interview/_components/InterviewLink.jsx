"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  Plus,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function InterviewLink({ interviewId, formData }) {
  const url =
    process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interviewId;

  const GetInterviewUrl = () => {
    return url;
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link Copied");
  };

  return (
    <div className="flex items-center justify-center flex-col mt-10">

      {/* ✅ CHECK ICON */}
      {/* <Image
        src="/check.png"
        alt="check"
        width={50}
        height={50}
      /> */}

      {/* ✅ HEADING */}
      <h2 className="font-bold text-lg mt-4">
        Your AI Interview is Ready!
      </h2>

      <p className="mt-3 text-gray-500 text-center">
        Share this link with your candidates to start the interview process
      </p>

      {/* ✅ INTERVIEW LINK CARD */}
      <div className="w-full max-w-3xl p-7 mt-6 rounded-lg bg-white shadow">

        <div className="flex justify-between items-center">
          <h2 className="font-bold">Interview Link</h2>

          <span className="p-1 px-2 text-primary bg-blue-50 rounded-md text-sm">
            Valid for 30 Days
          </span>
        </div>

        <div className="mt-3 flex gap-3 items-center">
          <Input
            defaultValue={GetInterviewUrl()}
            disabled={true}
          />
          <Button
  onClick={onCopyLink}
  className="bg-primary hover:bg-red-700 text-white"
>
  <Copy className="w-4 h-4 mr-2" />
  Copy Link
</Button>

        </div>

        <hr className="my-5" />

        {/* ✅ META INFO */}
        <div className="flex gap-7">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <Clock className="w-4 h-4" />
            30 Min
          </h2>

          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <List className="w-4 h-4" />
            {formData?.questions?.length || 10} Questions
          </h2>
        </div>
      </div>

      {/* ✅ SHARE VIA */}
      <div className="w-full max-w-3xl mt-6">
        <h2 className="font-bold">Share Via</h2>

        <div className="flex gap-7 mt-2 justify-around">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>

          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Whatsapp
          </Button>
        </div>
      </div>

      {/* ✅ FOOTER ACTIONS */}
      <div className="flex w-full max-w-3xl gap-5 justify-between mt-6">

        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* <Link href="/dashboard/create-interview">
          <Button>
            <Plus className="bg-red-600 hover:bg-red-700 text-white" />
            + Create New Interview
          </Button>
        </Link> */}
      </div>

    </div>
  );
}

export default InterviewLink;
