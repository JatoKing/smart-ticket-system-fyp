// Client-side checks mirror Laravel's rules (the server still validates everything).

const REQUIRED: Record<string, string> = {
  name: "Please enter your full name.",
  email: "Please enter your email address.",
  password: "Please enter your password.",
  password_confirmation: "Please confirm your password.",
  phone_number: "Please enter your phone number.",
  address: "Please enter your address.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFields(
  values: Record<string, string>,
  rules: { minPassword?: number; confirm?: boolean } = {},
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [name, raw] of Object.entries(values)) {
    const value = raw.trim();
    if (!value) {
      errors[name] = REQUIRED[name] ?? "This field is required.";
    } else if (name === "email" && !EMAIL.test(value)) {
      errors[name] = "Please enter a valid email address.";
    }
  }
  if (rules.minPassword && values.password && values.password.length < rules.minPassword) {
    errors.password = `Use at least ${rules.minPassword} characters.`;
  }
  if (rules.confirm && values.password_confirmation && values.password !== values.password_confirmation) {
    errors.password_confirmation = "Passwords do not match.";
  }
  return errors;
}
