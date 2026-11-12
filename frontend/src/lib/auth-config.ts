/** Public URL of the Laravel app (still serves the dashboards and password reset). */
export const LARAVEL_PUBLIC_URL = (process.env.NEXT_PUBLIC_LARAVEL_URL ?? "http://localhost:8000").replace(/\/+$/, "");

/**
 * Where users go after a successful login / registration.
 *
 * TODO(revamp): decide the final destination once dashboards move to Next.js.
 * For now this hands over to Laravel's existing `/home` route, which (via CheckRole)
 * keeps admins in the admin area and sends customers to /customer/dashboard.
 */
export const AFTER_AUTH_URL = `${LARAVEL_PUBLIC_URL}/home`;

export const FORGOT_PASSWORD_URL = `${LARAVEL_PUBLIC_URL}/password/reset`;
