"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuizQuestions, selectQuiz } from "@/store/quizSlice";

export default function QuizHome() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const quiz = useAppSelector(selectQuiz);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.accessToken && !quiz.data) {
      dispatch(fetchQuizQuestions(auth.accessToken));
    }
  }, [auth.accessToken, dispatch, quiz.data]);

  const { instruction } = quiz.data || {};

  return (
    <div className="space-y-6 text-primary">
      <section className="  p-6 flex flex-col items-center">
        <h1 className="text-2xl text-primary font-bold items-center justify-center">
          Ancient Indian History MCQ
        </h1>
        <div className="grid grid-cols-3 bg-primary text-primary-foreground w-full max-w-[682px] max-h-[135px] rounded-sm">
          <div className="flex flex-col justify-between items-center p-4 ">
            <h2 className="text-xl font-semibold pb-2 ">Total MCQ’s:</h2>
            <p className="text-4xl">{quiz.data?.questions_count}</p>
          </div>
          <div className="flex flex-col justify-between items-center p-4 ">
            <h2 className="text-xl font-semibold pb-2">Total marks:</h2>
            <p className="text-4xl">{quiz.data?.total_marks}</p>
          </div>
          <div className="flex flex-col justify-between items-center p-4 ">
            <h2 className="text-xl font-semibold pb-2">Total time:</h2>
            <p className="text-4xl">{quiz.data?.total_time}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6">Instructions</h2>
        {quiz.loading && (
          <p className="text-sm text-gray-500">Loading quiz details...</p>
        )}
        {quiz.error && <p className="text-sm text-red-500">{quiz.error}</p>}
        <div className="flex items-center pl-20 w-full">
          {instruction ? (
            <div
              className="text-sm text-gray-700 w-full flex justify-center items-center"
              dangerouslySetInnerHTML={{ __html: instruction }}
            />
          ) : (
            <p className="text-sm text-gray-500">No instructions available.</p>
          )}
        </div>
      </section>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={() => router.push("/quiz/start")} className="">
          Start Test
        </Button>
      </div>
    </div>
  );
}
