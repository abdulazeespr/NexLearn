import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectQuiz, setCurrentQuestion } from "@/store/quizSlice";
import Timer from "./Timer";

const statusColors: Record<string, string> = {
  not_visited: "bg-gray-300 text-black",
  attended: "bg-[#4CAF50] text-white",
  not_attended: "bg-[#EE3535] text-white",
  marked_for_review: "bg-[#800080] text-white",
  answered_and_marked_for_review:
    "bg-[#4CAF50] text-white border-[#800080] border-2",
};

const QuestionSheet: React.FC = () => {
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const questions = quiz.data?.questions || [];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-2 font-normal">
        <div>Question No. Sheet:</div>
        <div>
          <Timer/>
        </div>
        </div>
      <div className="grid grid-cols-10 gap-2">
        {questions.map((q: any, idx: number) => {
          const status = quiz.status[q.question_id] || "not_visited";
          const isCurrent = quiz.currentQuestion === idx;
          return (
            <button
              key={q.question_id}
              className={`rounded w-8 h-8 flex items-center justify-center border text-xs font-bold transition-all ${
                statusColors[status] || "bg-gray-200"
              } ${isCurrent ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => dispatch(setCurrentQuestion(idx))}
            >
              {q.number}
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 inline-block rounded"></span>
          Attended
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#EE3535] inline-block rounded"></span>Not
          Attended
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-purple-500 inline-block rounded"></span>
          Marked For Review
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-indigo-500 inline-block rounded"></span>
          Answered and Marked For Review
        </div>
      </div>
    </div>
  );
};

export default QuestionSheet;
