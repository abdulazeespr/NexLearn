import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getQuizQuestions } from "@/lib/api";
import { RootState } from "./store";

interface QuizState {
  loading: boolean;
  error: string | null;
  data: {
    questions_count?: number;
    total_marks?: number;
    total_time?: number;
    time_for_each_question?: number;
    mark_per_each_answer?: number;
    instruction?: string;
    questions?: any[];
  } | null;
  currentQuestion: number;
  answers: { [questionId: number]: number | null };
  status: { [questionId: number]: 'not_attended' | 'attended' | 'marked_for_review' | 'answered_and_marked_for_review' };
  timer: number;
  started: boolean;
}

const initialState: QuizState = {
  loading: false,
  error: null,
  data: null,
  currentQuestion: 0,
  answers: {},
  status: {},
  timer: 0,
  started: false,
};

export const fetchQuizQuestions = createAsyncThunk(
  "quiz/fetchQuizQuestions",
  async (token: string, { rejectWithValue }) => {
    try {
      const result = await getQuizQuestions(token);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch quiz questions");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.data = action.payload.data;
      state.currentQuestion = 0;
      state.answers = {};
      state.status = {};
      state.timer = action.payload.data?.total_time || 0;
      state.started = true;
    },
    answerQuestion(state, action) {
      const { questionId, optionId } = action.payload;
      state.answers[questionId] = optionId;
      state.status[questionId] = 'attended';
    },
    markForReview(state, action) {
      const qid = action.payload;
      if (state.answers[qid] != null) {
        state.status[qid] = 'answered_and_marked_for_review';
      } else {
        state.status[qid] = 'marked_for_review';
      }
    },
    setCurrentQuestion(state, action) {
      state.currentQuestion = action.payload;
    },
    decrementTimer(state) {
      if (state.timer > 0) state.timer -= 1;
    },
    resetQuiz(state) {
      state.data = null;
      state.currentQuestion = 0;
      state.answers = {};
      state.status = {};
      state.timer = 0;
      state.started = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setQuestions,
  answerQuestion,
  markForReview,
  setCurrentQuestion,
  decrementTimer,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;

export const selectQuiz = (state: RootState) => state.quiz;
