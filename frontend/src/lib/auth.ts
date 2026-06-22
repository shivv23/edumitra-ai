const TOKEN_KEY = "edumitra_token";
const USER_KEY = "edumitra_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "parent" | "admin";
}

function fakeId() {
  return "user_" + Math.random().toString(36).slice(2, 10);
}

function fakeToken() {
  return "local_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function setCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `edumitra_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
}

function persistUser(user: AuthUser): string {
  const token = fakeToken();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setCookie(token);
  return token;
}

export async function signIn(email: string, _password: string): Promise<{ token: string; user: AuthUser }> {
  const existing = localStorage.getItem("edumitra_users");
  const users: Record<string, { email: string; name: string; role: string; id: string }> = existing ? JSON.parse(existing) : {};
  const key = email.toLowerCase().trim();
  const record = users[key];
  if (!record) throw new Error("No account found with this email. Please sign up first.");
  const user: AuthUser = { id: record.id, email: record.email, name: record.name, role: record.role as AuthUser["role"] };
  const token = persistUser(user);
  return { token, user };
}

export async function signUp(email: string, _password: string, name: string, role: string): Promise<{ token: string; user: AuthUser }> {
  const existing = localStorage.getItem("edumitra_users");
  const users: Record<string, { email: string; name: string; role: string; id: string }> = existing ? JSON.parse(existing) : {};
  const key = email.toLowerCase().trim();
  if (users[key]) throw new Error("Email already registered. Please sign in.");
  const id = fakeId();
  users[key] = { id, email: key, name: name.trim() || "Student", role: role || "student" };
  localStorage.setItem("edumitra_users", JSON.stringify(users));
  const user: AuthUser = { id, email: key, name: name.trim() || "Student", role: (role || "student") as AuthUser["role"] };
  const token = persistUser(user);
  return { token, user };
}

export function signOut() {
  clearSession();
  if (typeof document !== "undefined") {
    document.cookie = "edumitra_token=; path=/; max-age=0";
  }
  window.location.href = "/login";
}
