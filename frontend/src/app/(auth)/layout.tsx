import type { ReactNode } from "react";
import AuthPage from "@/components/auth/AuthPage";
import "@/components/auth/auth.css";

/**
 * /login and /register share this layout. AuthPage stays mounted across both routes, so
 * switching between them plays the animated transformation instead of a page reload.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AuthPage />
    </>
  );
}
