import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectQuiz, answerQuestion } from "@/store/quizSlice";

interface QuizQuestionProps {
  questionIndex: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ questionIndex }) => {
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const question = quiz.data?.questions?.[questionIndex];
  const selectedOption = quiz.answers[question?.question_id] ?? null;

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
        <h2 className="text-lg font-semibold mb-2">
          {question.number}. {question.question}
        </h2>
        {question.comprehension && (
          <div className="mb-2 p-2 bg-blue-50 rounded">
            <span className="font-medium">Read Comprehension:</span>
            <p className="text-sm mt-1">{question.comprehension}</p>
          </div>
        )}
        {question.image && (
          <img
            src={question.image}
            alt="question"
            className="mb-2 rounded"
            style={{ maxWidth: 300 }}
          />
        )}
        <form className="space-y-2">
          {question.options.map((opt: any) => (
            <label
              key={opt.id}
              className="flex items-center justify-between gap-2 p-2 border rounded cursor-pointer"
            >
              <span>{opt.option}</span>
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
