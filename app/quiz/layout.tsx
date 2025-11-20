import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
          <Image src="/logo.svg" alt="NexLearn Logo" width={150} height={50} />
        </div>
        <Button className="absolute top-4 right-5 bg-[#177A9C]">Logout</Button>
      </header>
      <main className="w-full h-full">{children}</main>
    </div>
  );
}
