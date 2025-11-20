import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectQuiz, answerQuestion } from "@/store/quizSlice";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface QuizQuestionProps {
  questionIndex: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ questionIndex }) => {
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const question = quiz.data?.questions?.[questionIndex];
  const selectedOption = quiz.answers[question?.question_id] ?? null;
  const options = ["A", "B", "C", "D"];

  if (!question) return null;

  return (
    <div>
      <div className="flex flex-row justify-between items-center  h-1/2">
        <h1 className="text-2xl font-bold mb-4">Ancient Indian History MCQ</h1>
        <span className="text-sm text-gray-600 rounded-sm px-3 py-1 border shadow">
          <span className="font-bold">{questionIndex + 1} </span>/{" "}
          {quiz.data?.questions_count}
        </span>
      </div>
      <section className="bg-white rounded-md shadow p-6 mb-4">
        {question.comprehension && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex items-center gap-2 mb-4 cursor-pointer">
                <Button
                  variant="outline"
                  className="mb-4 bg-[#177A9C] text-white"
                >
                  <Image
                    src="/ArticleNyTimes.svg"
                    alt="Read"
                    width={20}
                    height={18}
                  />
                  Read Comprehension
                  <Image src="/arrowleft.svg" alt="Read" width={7} height={5} />
                </Button>
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-xl text-primary">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold">
                  Comprehensive Paragraph
                  <hr className="my-2" />
                </AlertDialogTitle>

                <AlertDialogDescription className="text-gray-800 whitespace-pre-line text-base leading-relaxed">
                  {question.comprehension}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#1C3141] text-white">
                  Minimize
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <h2 className="text-lg font-semibold mb-2">
          {question.number}. {question.question}
        </h2>
        

        {question.image && (
          <img
            src={question.image}
            alt="question"
            className="mb-2 rounded"
            style={{ maxWidth: 300 }}
          />
        )}
        <form className="space-y-2">
          {question.options.map((opt: any, index:any) => (
            <label
              key={opt.id}
              className="flex items-center justify-between gap-2 p-2 border rounded cursor-pointer"
            >
              <span>
                {options[index]}. {opt.option}
              </span>
              <input
                className="accent-black"
                type="radio"
                name={`option-${question.question_id}`}
                checked={selectedOption === opt.id}
                onChange={() =>
                  dispatch(
                    answerQuestion({
                      questionId: question.question_id,
                      optionId: opt.id,
                    })
                  )
                }
              />
            </label>
          ))}
        </form>
      </section>
    </div>
  );
};

export default QuizQuestion;
