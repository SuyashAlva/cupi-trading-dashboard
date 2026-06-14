import type { Quote } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface Session {
  token: string;
  user: { email: string };
}

export async function login(email: string): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Login failed");
  return data;
}

export async function fetchStocks(): Promise<{ symbols: string[]; quotes: Quote[] }> {
  const res = await fetch(`${API_BASE}/api/stocks`);
  if (!res.ok) throw new Error("Could not load instruments");
  return res.json();
}
