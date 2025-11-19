"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function QuizStart() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-md shadow p-6">
        <h2 className="text-xl font-semibold">Quiz Started</h2>
        <p className="mt-2 text-sm text-gray-600">This is a placeholder for the quiz runtime. Implement questions and timer here.</p>
      </section>

      <div className="flex items-center gap-3 ">
        <Button onClick={() => router.push("/quiz")}>Back to Instructions</Button>
      </div>
    </div>
  );
}
