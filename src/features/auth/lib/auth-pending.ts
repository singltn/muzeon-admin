const EMAIL_KEY = "auth_pending_email";
const CHALLENGE_KEY = "auth_pending_challenge";

export const authPending = {
  set(email: string, challengeId: string) {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.setItem(EMAIL_KEY, email);
    sessionStorage.setItem(CHALLENGE_KEY, challengeId);
  },
  getEmail(): string | null {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage.getItem(EMAIL_KEY);
  },
  getChallenge(): string | null {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage.getItem(CHALLENGE_KEY);
  },
  clear() {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.removeItem(EMAIL_KEY);
    sessionStorage.removeItem(CHALLENGE_KEY);
  },
};
