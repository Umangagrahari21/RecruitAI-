import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const QuestionList = ({ formData }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState(null);

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

      console.log("API RAW RESPONSE:", result.data);
      console.log("AI CONTENT:", result.data.content);

      setQuestionList((result.data.content)?.interviewQuestions);

    } catch (error) {
      console.error("API ERROR:", error);
      toast("Server error, try again!");
    } finally {
      setLoading(false);
    }
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

      {questionList?.length > 0 && (
        <div>
          {questionList.map((item, index) => (
            <div key={index} className="p-3 border-gray-300">
              <h2 className="font-medium">{item.question}</h2>
              <h2>Type:{item?.Type}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
