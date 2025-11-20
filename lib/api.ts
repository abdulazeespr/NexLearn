import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type QuizAnswerPayload = {
  question_id: number;
  selected_option_id: number | null;
};

export type SubmitAnswersResponse = {
  success: boolean;
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: any[];
};

export async function sendOtp(
  mobile: string
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("mobile", mobile);

  const response = await api.post("/auth/send-otp", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}



export async function verifyOtp(
  mobile: string,
  otp: string
): Promise<{
  success: boolean;
  login?: boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}> {
  const formData = new FormData();
  formData.append("mobile", mobile);
  formData.append("otp", otp);

  const response = await api.post("/auth/verify-otp", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function createProfile(data: {
  mobile: string;
  name: string;
  email: string;
  qualification: string;
  profile_image: File | null;
}): Promise<{
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  message?: string;
  user?: any;
}> {
  const formData = new FormData();
  formData.append("mobile", data.mobile);
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("qualification", data.qualification);
  if (data.profile_image) {
    formData.append("profile_image", data.profile_image);
  }

  const response = await api.post("/auth/create-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Fetch quiz questions (GET /question/list)
export async function getQuizQuestions(token: string): Promise<{
  success: boolean;
  questions_count: number;
  total_marks: number;
  total_time: number;
  time_for_each_question: number;
  mark_per_each_answer: number;
  instruction: string;
  questions: any[];
}> {
  const response = await api.get("/question/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function submitAnswers(
  token: string,
  answers: QuizAnswerPayload[]
): Promise<SubmitAnswersResponse> {
  const formData = new FormData();
  formData.append("answers", JSON.stringify(answers));

  const response = await api.post("/answers/submit", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}