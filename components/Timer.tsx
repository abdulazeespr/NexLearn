import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { decrementTimer, selectQuiz } from "@/store/quizSlice";
import Image from "next/image";

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

const Timer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { timer, started } = useAppSelector(selectQuiz);

  useEffect(() => {
    if (!started || timer <= 0) return;
    const interval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, started, dispatch]);

  return (
    <div className="flex items-center gap-2 p-2 bg-white ">
      <span className="font-normal">Remaining Time:</span>
      <span className="text-lg font-mono bg-[#1C3141] font-normal text-white rounded px-2 py-1 flex items-center gap-2">
        <Image src="/clock.svg" alt="Clock" width={15} height={15} />
        {formatTime(timer)}
        </span>
    </div>
  );
};

export default Timer;
