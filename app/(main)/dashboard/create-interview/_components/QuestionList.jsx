import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2Icon,Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/services/SupabaseClient";
import {v4 as uuidv4} from 'uuid';
import QuestionListContainer from "./QuestionListContainer";
import { useUser } from "@/app/provider";


const QuestionList = ({ formData,onCreateLink }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState(null);
  const {user}=useUser();
  const [saveLoading,setSaveLoading]=useState(false);

  useEffect(() => {
    if (formData) {
      generateQuestionList();
    }
  }, [formData]);

  useEffect(() => {
    if (questionList) {
      console.log("QUESTION LIST STATE:", questionList);
    }
  }, [questionList]);

  const generateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      // console.log("API RAW RESPONSE:", result.data);
      // console.log("AI CONTENT:", result.data.content);

      console.log("API DATA:", result.data);
console.log("INTERVIEW QUESTIONS:", result.data.interviewQuestions);


      // setQuestionList((result.data.content)?.interviewQuestions);
      // setQuestionList(result.data.interviewQuestions);
      const questions = result.data?.interviewQuestions ?? [];
      setQuestionList(questions);


    } catch (error) {
      console.error("API ERROR:", error);
      toast("Server error, try again!");
    } finally {
      setLoading(false);
    }
  };
  const onFinish = async () => {
    setSaveLoading(true)
  const interview_id = uuidv4();

  const { data, error } = await supabase
    .from('interview') 
    .insert([
      {
        ...formData,
        questionList: questionList,
        userEmail: user?.email,
        interview_id: interview_id
      }
    ])
    .select();

  if (error) {
    console.error("❌ Supabase Insert Error:", error);
    toast("Failed to save interview");
    return;
  }

  console.log("✅ Saved successfully:", data);
  toast("Interview saved successfully!");
  setSaveLoading(false);

  onCreateLink(interview_id)
};


  return (
    <div className="mt-5">
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-3 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-semibold">Generating Interview Questions</h2>
            <p className="text-sm text-primary">
              Our AI is crafting personalized questions
            </p>
          </div>
        </div>
      )}

      {/* {questionList?.length > 0 && (
        <div>
          {questionList.map((item, index) => (
            <div key={index} className="p-3 border-gray-300">
              <h2 className="font-medium">{item.question}</h2>
              <h2>Type: {item?.type}</h2>

            </div>
          ))}
        </div>
      )} */}
      {questionList?.length > 0 && (
  <div className="space-y-4">
    <QuestionListContainer questionList={questionList}/>
  </div>
)}
<div className="flex justify-end mt-10">
  <button
  onClick={onFinish}
  disabled={saveLoading}
  className="
    px-8 py-3
    rounded-xl
    bg-primary
    text-white font-semibold
    shadow-md
    transition-all duration-300
    hover:bg-primary/90
    hover:shadow-xl hover:-translate-y-1
    active:scale-95
    focus:outline-none focus:ring-4 focus:ring-primary/30
    disabled:opacity-60 disabled:cursor-not-allowed
    flex items-center gap-2
  "
>
  {saveLoading && <Loader2 className="animate-spin" size={18} />}
  Create Interview Link & Finish
</button>

</div>


    </div>
  );
};

export default QuestionList;
