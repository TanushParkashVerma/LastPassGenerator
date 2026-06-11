export interface PasswordRuleOptions {
  // Optional flags for each password rule when validating the generated string.
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  length?: number;
}

export function hasUppercase(password: string) {
  // Return true if the password contains at least one uppercase letter.
  return /[A-Z]/.test(password);
}

export function hasLowercase(password: string) {
  // Return true if the password contains at least one lowercase letter.
  return /[a-z]/.test(password);
}

export function hasNumbers(password: string) {
  // Return true if the password contains at least one numeric digit.
  return /[0-9]/.test(password);
}

export function hasSymbols(password: string) {
  // Return true if the password contains at least one symbol character.
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
}

export function hasLength(password: string, expectedLength: number) {
  // Return true if the password length matches the expected length.
  return password.length === expectedLength;
}

export function validatePassword(password: string, options: PasswordRuleOptions) {
  // Collect validation results based on the provided options.
  const checks: Array<{ rule: string; valid: boolean }> = [];

  if (options.uppercase !== undefined) {
    // Validate uppercase presence only when the option is explicitly provided.
    checks.push({ rule: 'uppercase', valid: hasUppercase(password) === options.uppercase });
  }

  if (options.lowercase !== undefined) {
    // Validate lowercase presence only when the option is explicitly provided.
    checks.push({ rule: 'lowercase', valid: hasLowercase(password) === options.lowercase });
  }

  if (options.numbers !== undefined) {
    // Validate numeric digit presence only when the option is explicitly provided.
    checks.push({ rule: 'numbers', valid: hasNumbers(password) === options.numbers });
  }

  if (options.symbols !== undefined) {
    // Validate symbol presence only when the option is explicitly provided.
    checks.push({ rule: 'symbols', valid: hasSymbols(password) === options.symbols });
  }

  if (options.length !== undefined) {
    // Validate exact password length only when the option is explicitly provided.
    checks.push({ rule: 'length', valid: hasLength(password, options.length) });
  }

  // Return true only if every requested validation check passes.
  return checks.every((check) => check.valid);
}
