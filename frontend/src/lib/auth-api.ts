// Thin client for Laravel's existing web auth routes (POST /login, POST /register).
// Nothing in Laravel changes: same controllers, validation, CSRF, session and remember-me.
// Requests go through the /backend proxy (next.config.ts) so cookies stay first-party.

const BASE = "/backend";

export type FieldErrors = Record<string, string>;

export type AuthResult =
  | { ok: true }
  | { ok: false; status: number; message: string; errors: FieldErrors };

export type LoginInput = { email: string; password: string; remember: boolean };

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  address: string;
};

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Ask Laravel (Sanctum) to issue the XSRF-TOKEN cookie. */
async function ensureCsrfCookie(force = false) {
  if (!force && readCookie("XSRF-TOKEN")) return;
  await fetch(`${BASE}/sanctum/csrf-cookie`, { credentials: "include" });
}

async function postJson(path: string, body: unknown): Promise<Response> {
  const send = () =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      credentials: "include",
      // Laravel answers a successful login with a 302 to the role dashboard.
      // We don't follow it here; the redirect itself means "authenticated".
      redirect: "manual",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": readCookie("XSRF-TOKEN") ?? "",
      },
      body: JSON.stringify(body),
    });

  await ensureCsrfCookie();
  let res = await send();
  if (res.status === 419) {
    // CSRF token expired/rotated — refresh once and retry.
    await ensureCsrfCookie(true);
    res = await send();
  }
  return res;
}

async function toResult(res: Response): Promise<AuthResult> {
  if (res.type === "opaqueredirect" || res.ok) return { ok: true };

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    errors?: Record<string, string[] | string>;
  };
  const errors: FieldErrors = {};
  for (const [key, value] of Object.entries(data.errors ?? {})) {
    errors[key] = Array.isArray(value) ? value[0] : String(value);
  }

  let message = data.message ?? "Something went wrong. Please try again.";
  if (res.status === 419) message = "Your session expired. Please try again.";
  if (res.status >= 500) message = "The server had a problem. Please try again in a moment.";
  return { ok: false, status: res.status, message, errors };
}

const networkError: AuthResult = {
  ok: false,
  status: 0,
  message: "We couldn't reach the server. Check your connection and try again.",
  errors: {},
};

export async function login(input: LoginInput): Promise<AuthResult> {
  try {
    return await toResult(await postJson("/login", input));
  } catch {
    return networkError;
  }
}

/** Laravel's existing POST /logout (invalidates the session; answers with a redirect). */
export async function logout(): Promise<void> {
  try {
    await postJson("/logout", {});
  } catch {
    /* already logged out or offline — the UI treats the user as a guest either way */
  }
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  try {
    return await toResult(await postJson("/register", input));
  } catch {
    return networkError;
  }
}
