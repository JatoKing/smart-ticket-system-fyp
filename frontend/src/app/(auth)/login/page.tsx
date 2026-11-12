import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log In" };

// The UI is rendered by the shared (auth) layout; this route only sets the mode via its URL.
export default function LoginPage() {
  return null;
}
