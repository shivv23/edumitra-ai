const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function upload<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail || "Upload failed");
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => upload<T>(path, formData),
};

export async function fetchStudyPlan() {
  return api.get<{
    days: { day: number; title: string; focus: string; estimated_minutes: number; completed: boolean }[];
  }>("/api/study/plan");
}

export async function fetchQuiz(topic?: string) {
  return api.post<{
    questions: { question: string; options: string[]; correctAnswer: number; explanation: string }[];
  }>("/api/study/quiz", { topic });
}

export async function sendChatMessage(message: string, history?: { role: string; content: string }[]) {
  return api.post<{ response: string; type?: string }>("/api/study/query", { message, history });
}

export async function uploadNotes(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api.upload<{ analysis: string; summary: string }>("/api/upload/notes", fd);
}

export async function wellnessCheckIn(sentiment: number, note?: string) {
  return api.post<{ response: string; risk_level: string; crisis_detected: boolean }>("/api/wellness/checkin", {
    sentiment_score: sentiment,
    note,
  });
}

export async function fetchWellnessHistory() {
  return api.get<{ checkins: { sentiment_score: number; created_at: string }[] }>("/api/wellness/history");
}

export async function fetchProgress() {
  return api.get<{
    overall_mastery: number;
    subjects: { name: string; mastery: number; trend: string }[];
    recent_activity: { action: string; detail: string; time: string }[];
    streak: number;
    quizzes_taken: number;
    topics_covered: number;
  }>("/api/progress");
}

export async function fetchStudents() {
  return api.get<{
    total: number;
    average_mastery: number;
    need_attention: number;
    quizzes_taken: number;
    students: { name: string; grade: string; mastery: number; status: string }[];
  }>("/api/teacher/students");
}

export async function fetchChildProgress() {
  return api.get<{
    mastery: number;
    subjects: { name: string; mastery: number }[];
    recent_alerts: { type: string; message: string; time: string }[];
  }>("/api/parent/child-progress");
}

export async function fetchBurnoutRisk() {
  return api.get<{ risk_level: string; factors: string[] }>("/api/progress/burnout-risk");
}

export async function sendAudioMessage(audioBlob: Blob) {
  const fd = new FormData();
  fd.append("audio", audioBlob, "recording.webm");
  return api.upload<{ transcript: string; response: string }>("/api/study/voice", fd);
}

export async function fetchDashboard() {
  return api.get<{
    overall_mastery: number;
    topics_covered: number;
    quizzes_taken: number;
    streak: number;
    wellness_status: string;
    last_checkin?: string;
  }>("/api/dashboard");
}
