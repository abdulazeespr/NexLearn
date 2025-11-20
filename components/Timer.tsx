import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { decrementTimer } from "@/store/quizSlice";

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

const Timer: React.FC = () => {
  const dispatch = useAppDispatch();
  const timer = useAppSelector((state) => 60);
  const started = useAppSelector((state) => state.quiz.started || false);

  useEffect(() => {
    if (!started || timer <= 0) return;
    const interval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, started, dispatch]);

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded shadow">
      <span className="font-semibold">Remaining Time:</span>
      <span className="text-2xl">{timer}</span>
      <span className="text-lg font-mono">{formatTime(timer)}</span>
    </div>
  );
};

export default Timer;
