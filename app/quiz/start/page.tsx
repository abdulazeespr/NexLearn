"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import QuizQuestion from "@/components/QuizQuestion";
import QuestionSheet from "@/components/QuestionSheet";
import Timer from "@/components/Timer";
import QuizControls from "@/components/QuizControls";
import { useAppSelector } from "@/store/hooks";

export default function QuizStart() {
  const router = useRouter();
  const quiz = useAppSelector((state) => state.quiz);
  const currentIdx = quiz.currentQuestion;

  return (
    <div className=" text-primary w-full h-full">
      <div className="flex flex-row flex-1 p-6 gap-6 m-2 justify-center">
        <div className="flex flex-col w-2/3 h-full">
          <QuizQuestion questionIndex={currentIdx} />
          <QuizControls />
        </div>
        <div className="flex flex-col w-1/3">
          <Timer />
          <QuestionSheet />
        </div>
      </div>
    </div>
  );
}
