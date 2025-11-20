import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectQuiz,
  setCurrentQuestion,
  markForReview,
} from "@/store/quizSlice";
import { Button } from "@/components/ui/button";

const QuizControls: React.FC = () => {
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const currentIdx = quiz.currentQuestion;
  const questions = quiz.data?.questions || [];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === questions.length - 1;
  const currentQ = questions[currentIdx];

  return (
    <div className="flex gap-3 mt-4 w-full h-1/2">
      <Button
        className="bg-[#800080] w-1/3"
        variant="default"
        onClick={() => dispatch(markForReview(currentQ?.question_id))}
        disabled={!currentQ}
      >
        Mark for review
      </Button>
      <Button
        className="bg-[#CECECE] w-1/3"
        variant="secondary"
        disabled={isFirst}
        onClick={() => dispatch(setCurrentQuestion(currentIdx - 1))}
      >
        Previous
      </Button>

      <Button
        className=" w-1/3"
        variant="default"
        disabled={isLast}
        onClick={() => dispatch(setCurrentQuestion(currentIdx + 1))}
      >
        Next
      </Button>
    </div>
  );
};

export default QuizControls;
