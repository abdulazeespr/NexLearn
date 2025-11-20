import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectQuiz, setCurrentQuestion } from "@/store/quizSlice";
import Timer from "./Timer";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { submitAnswers } from "@/lib/api";

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
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const questions = quiz.data?.questions || [];

  const totalQuestions = quiz.data?.questions_count || questions.length;
  const answeredCount = Object.values(quiz.answers || {}).filter(
    (value) => value != null
  ).length;
  const markedForReviewCount = Object.values(quiz.status || {}).filter(
    (status) =>
      status === "marked_for_review" || status === "answered_and_marked_for_review"
  ).length;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmitTest = async () => {
    if (!auth?.accessToken || !quiz?.data?.questions) {
      setSubmitError("Unable to submit test. Please make sure you are logged in and the quiz is loaded.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const answersPayload = quiz.data.questions.map((q: any) => ({
        question_id: q.question_id,
        selected_option_id:
          quiz.answers && Object.prototype.hasOwnProperty.call(quiz.answers, q.question_id)
            ? quiz.answers[q.question_id]
            : null,
      }));

      const result = await submitAnswers(auth.accessToken, answersPayload);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("lastQuizResult", JSON.stringify(result));
      }

      router.push("/quiz/result");
    } catch (error) {
      setSubmitError("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="mt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full bg-[#1C3141] text-white">Submit Test</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-full">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-primary flex items-center justify-between text-lg border-b-1 border-black pb-3">

                Are you sure you want to submit the test?
                <AlertDialogCancel className="text-primary  border-none shadow-none">X</AlertDialogCancel> 
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="mt-4 space-y-3 text-sm text-primary">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#1C3141]">
                    <Image src="/clock.svg" alt="Clock" width={10} height={10} />
                  </span>
                  <span>Remaining Time:</span>
                </div>
                <span className="font-semibold">{formatTime(quiz.timer || 0)}</span>
              </div>

              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#F6B300]" >
                      <Image src="/question.svg" alt="Question" width={10} height={10} />
                    </span>
                  <span>Total Questions:</span>
                </div>
                <span className="font-semibold">
                  {totalQuestions.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#4CAF50]" >
                    <Image src="/question.svg" alt="Question" width={10} height={10} />
                  </span>
                  <span>Questions Answered:</span>
                </div>
                <span className="font-semibold">
                  {answeredCount.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#800080]" >
                    <Image src="/question.svg" alt="Question" width={10} height={10} />
                  </span>
                  <span>Marked for review:</span>
                </div>
                <span className="font-semibold">
                  {markedForReviewCount.toString().padStart(3, "0")}
                </span>
              </div>
            </div>

            <AlertDialogFooter className="mt-4">
              {submitError && (
                <p className="text-xs text-red-500 flex-1 text-left">{submitError}</p>
              )}
              <AlertDialogAction
                onClick={handleSubmitTest}
                className="bg-[#1C3141] text-white hover:bg-[#152533] disabled:opacity-60 w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default QuestionSheet;
