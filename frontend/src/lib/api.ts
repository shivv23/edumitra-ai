let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
  if (typeof document !== "undefined") {
    if (token) {
      document.cookie = `edumitra_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      document.cookie = "edumitra_token=; path=/; max-age=0";
    }
  }
}

/* ── Mock / demo data ─────────────────────────────────────── */

export async function fetchDashboard() {
  return {
    overall_mastery: 72,
    topics_covered: 14,
    quizzes_taken: 23,
    streak: 5,
    wellness_status: "good",
    last_checkin: new Date().toISOString(),
  };
}

export async function fetchStudyPlan() {
  return {
    days: [
      { day: 1, title: "Quadratic Equations", focus: "Standard form & roots", estimated_minutes: 30, completed: true },
      { day: 2, title: "Quadratic Formula", focus: "Derivation & application", estimated_minutes: 35, completed: true },
      { day: 3, title: "Nature of Roots", focus: "Discriminant analysis", estimated_minutes: 25, completed: false },
      { day: 4, title: "Polynomials Review", focus: "Zeroes & coefficients", estimated_minutes: 30, completed: false },
      { day: 5, title: "Trigonometry Intro", focus: "Ratios & identities", estimated_minutes: 40, completed: false },
    ],
  };
}

export async function fetchQuiz(_topic?: string) {
  return {
    questions: [
      {
        question: "What is the solution set of x² - 5x + 6 = 0?",
        options: ["{2, 3}", "{-2, -3}", "{2, -3}", "{-2, 3}"],
        correctAnswer: 0,
        explanation: "The quadratic factors as (x-2)(x-3)=0, so x=2 or x=3.",
      },
      {
        question: "If the discriminant of a quadratic equation is zero, the roots are:",
        options: ["Real and distinct", "Real and equal", "Imaginary", "Cannot be determined"],
        correctAnswer: 1,
        explanation: "A discriminant of zero means both roots are equal (repeated root).",
      },
      {
        question: "What is the value of sin(90° - θ)?",
        options: ["sin θ", "cos θ", "tan θ", "cot θ"],
        correctAnswer: 1,
        explanation: "sin(90° - θ) = cos θ by the co-function identity.",
      },
    ],
  };
}

const CHAT_RESPONSES = [
  "Great question! Let's break it down step by step. Quadratic equations are polynomial equations of degree 2, written as ax² + bx + c = 0. The solutions can be found using the quadratic formula or by factoring. Would you like me to walk through an example?",
  "That's an interesting topic! In NCERT Class 10 Mathematics, the chapter on Quadratic Equations covers standard form, solving by factorization, completing the square, and the quadratic formula. The discriminant D = b² - 4ac tells us about the nature of roots.",
  "Let me explain with a simple example. Consider the equation x² - 3x + 2 = 0. We can factor it as (x-1)(x-2)=0, giving us roots x=1 and x=2. The sum of roots is 3 and the product is 2, matching the coefficients!",
  "According to your curriculum, the next topic is Polynomials. A polynomial p(x) of degree n has at most n zeroes. For a quadratic polynomial ax² + bx + c, the zeroes are given by the quadratic formula. The relationship between zeroes and coefficients is: sum = -b/a, product = c/a.",
];

export async function sendChatMessage(_message: string, _history?: { role: string; content: string }[]) {
  const response = CHAT_RESPONSES[Math.floor(Math.random() * CHAT_RESPONSES.length)];
  return { response, type: "text" };
}

export async function uploadNotes(_file: File) {
  return {
    analysis: "The uploaded document appears to contain notes on Quadratic Equations. Key concepts identified: standard form, discriminant, quadratic formula, nature of roots. The handwriting is clear and well-organized.",
    summary: "Quadratic Equations: ax² + bx + c = 0. Discriminant D = b² - 4ac. Roots are real and distinct when D > 0, real and equal when D = 0, imaginary when D < 0.",
  };
}

export async function wellnessCheckIn(sentiment: number, note?: string) {
  return {
    response: note
      ? "Thank you for sharing that. Take a deep breath — you're doing great. Remember, every small step counts. Would you like to try a breathing exercise or talk to someone?"
      : "Thanks for checking in! Your well-being matters. Keep up the positive energy!",
    risk_level: sentiment < 2 ? "low" : "none",
    crisis_detected: false,
  };
}

export async function fetchWellnessHistory() {
  const now = new Date();
  return {
    checkins: Array.from({ length: 7 }, (_, i) => ({
      sentiment_score: Math.floor(Math.random() * 3) + 2,
      created_at: new Date(now.getTime() - i * 86400000).toISOString(),
    })),
  };
}

export async function fetchProgress() {
  return {
    overall_mastery: 72,
    streak: 5,
    quizzes_taken: 23,
    topics_covered: 14,
    subjects: [
      { name: "Mathematics", mastery: 78, trend: "up" },
      { name: "Science", mastery: 65, trend: "up" },
      { name: "English", mastery: 82, trend: "stable" },
      { name: "Social Studies", mastery: 58, trend: "up" },
      { name: "Hindi", mastery: 70, trend: "stable" },
    ],
    recent_activity: [
      { action: "Completed Quiz", detail: "Quadratic Equations — scored 4/5", time: "2 hours ago" },
      { action: "Study Session", detail: "Polynomials — 25 minutes", time: "Yesterday" },
      { action: "Wellness Check-in", detail: "Feeling motivated 😊", time: "Yesterday" },
      { action: "Quiz Attempt", detail: "Trigonometry Basics — scored 3/5", time: "2 days ago" },
      { action: "Notes Uploaded", detail: "Chapter 4: Quadratic Equations", time: "3 days ago" },
    ],
  };
}

export async function fetchStudents() {
  return {
    total: 24,
    average_mastery: 68,
    need_attention: 3,
    quizzes_taken: 156,
    students: [
      { name: "Ananya Sharma", grade: "10", mastery: 92, status: "excellent" },
      { name: "Rahul Verma", grade: "10", mastery: 78, status: "on-track" },
      { name: "Priya Patel", grade: "9", mastery: 45, status: "needs-support" },
      { name: "Arjun Singh", grade: "10", mastery: 88, status: "on-track" },
      { name: "Kavita Reddy", grade: "9", mastery: 55, status: "needs-support" },
      { name: "Vikram Joshi", grade: "10", mastery: 71, status: "on-track" },
    ],
  };
}

export async function fetchChildProgress() {
  return {
    mastery: 72,
    subjects: [
      { name: "Mathematics", mastery: 78 },
      { name: "Science", mastery: 65 },
      { name: "English", mastery: 82 },
      { name: "Social Studies", mastery: 58 },
      { name: "Hindi", mastery: 70 },
    ],
    recent_alerts: [
      { type: "progress", message: "Completed 5-day learning streak!", time: "Today" },
      { type: "wellness", message: "Wellness check-in: feeling motivated", time: "Yesterday" },
      { type: "progress", message: "Quiz score improved by 15% in Mathematics", time: "2 days ago" },
    ],
  };
}

export async function fetchBurnoutRisk() {
  return {
    risk_level: "low",
    factors: ["Recent study streak is healthy", "Wellness check-ins regular", "Balanced subject coverage"],
  };
}

export async function sendAudioMessage(_audioBlob: Blob) {
  return {
    transcript: "What is the quadratic formula and how do I use it?",
    response: "The quadratic formula is x = [-b ± √(b² - 4ac)] / 2a. It solves any quadratic equation ax² + bx + c = 0. Let me walk through an example: for x² - 5x + 6 = 0, a=1, b=-5, c=6. Plugging in: x = [5 ± √(25 - 24)]/2 = [5 ± 1]/2, giving x=3 or x=2.",
  };
}
