"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
type QuizResult = {
  success: boolean;
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: any[];
};

export default function QuizResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.sessionStorage.getItem("lastQuizResult");
    if (!stored) {
      router.replace("/quiz");
      return;
    }

    try {
      const parsed: QuizResult = JSON.parse(stored);
      setResult(parsed);
    } catch (e) {
      router.replace("/quiz");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted text-primary">
        <p>Loading result...</p>
      </div>
    );
  }

  const totalQuestions = result.correct + result.wrong + result.not_attended;

  return (
    <div className="flex min-h-screen  justify-center bg-[#F4FCFF] px-4 text-primary">
      <Card className="w-full max-w-sm border-none   shadow-none bg-[#F4FCFF]">
        <CardHeader className=" text-center">
          <div className="rounded-3xl bg-gradient-to-r from-[#177A9C] to-[#1C3141] px-6 py-4 text-white shadow-md">
            <CardTitle className="text-sm font-medium text-white">
              Marks Obtained:
            </CardTitle>
            <div className="mt-1 text-4xl font-extrabold tracking-tight text-white">
              {result.score} / 100
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-[#DDA428] text-xs font-semibold text-white">
                <Image src="/question.svg" alt="Question" width={10} height={10} />
              </div>
              <span className="text-slate-600">Total Questions:</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">
              {totalQuestions.toString().padStart(3, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg  px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-[#4CAF50] text-xs font-semibold text-white">
                <Image src="/correct.svg" alt="Correct" width={10} height={10} />
              </div>
              <span className="text-slate-600">Correct Answers:</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">
              {result.correct.toString().padStart(3, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg  px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-[#EE3535] text-xs font-semibold text-white">
                <Image src="/wrong.svg" alt="Wrong" width={10} height={10} />
              </div>
              <span className="text-slate-600">Incorrect Answers:</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">
              {result.wrong.toString().padStart(3, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg  px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-[#5C5C5C] text-xs font-semibold text-white">
                <Image src="/question.svg" alt="Not Attended" width={10} height={10} />
              </div>
              <span className="text-slate-600">Not Attended Questions:</span>
            </div>
            <span className="font-semibold tabular-nums text-slate-900">
              {result.not_attended.toString().padStart(3, "0")}
            </span>
          </div>

          <div className="pt-2">
            <Button
              className="mt-2 h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-slate-800"
              onClick={() => router.push("/quiz")}
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
