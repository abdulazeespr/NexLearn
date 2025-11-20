"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/store/authSlice";
import { Button } from "@/components/ui/button";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
          <Image src="/logo.svg" alt="NexLearn Logo" width={150} height={50} />
        </div>
        <Button
          className="absolute top-4 right-5 bg-[#177A9C]"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </header>
      <main className="w-full h-full">{children}</main>
    </div>
  );
}
