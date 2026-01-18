"use client";

import { Video } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // correct import

const LatestInterviewList = () => {
  const [interviewList, setInterviewList] = useState([]);

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl p-3">
        Previously Created Interview
      </h2>

      {interviewList?.length === 0 && (
        <div className="p-5 flex flex-col gap-3 items-center bg-white mt-5 rounded-xl shadow">
          <Video className="h-10 w-10 text-primary" />
          <h2 className="text-gray-400">
            You don't have any interview!
          </h2>
          <Button>+ Create New Interview</Button>
        </div>
      )}
    </div>
  );
};

export default LatestInterviewList;
