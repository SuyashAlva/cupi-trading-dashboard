import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev-only-secret-change-me";
const TTL = "12h";

export interface SessionUser {
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_RE.test(email.trim());
}

export function issueToken(email: string): string {
  return jwt.sign({ email: email.trim().toLowerCase() } satisfies SessionUser, SECRET, {
    expiresIn: TTL,
  });
}

export function verifyToken(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET) as SessionUser;
    return { email: payload.email };
  } catch {
    return null;
  }
}
