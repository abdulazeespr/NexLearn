"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function QuizHome() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <p className="mt-2 text-sm text-gray-600">
          Read the instructions carefully before starting the quiz. You'll be presented with multiple-choice questions and a time limit may apply.
        </p>
        <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Make sure you have a stable internet connection.</li>
          <li>Do not refresh the page during the quiz.</li>
          <li>Each question may have a single correct answer.</li>
        </ul>
      </section>

      <div className="flex items-center gap-3">
        <Button onClick={() => router.push("/quiz/start")} className="">Start Quiz</Button>
      </div>
    </div>
  );
}
