export interface PasswordRuleOptions {
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  length?: number;
}

export function hasUppercase(password: string) {
  return /[A-Z]/.test(password);
}

export function hasLowercase(password: string) {
  return /[a-z]/.test(password);
}

export function hasNumbers(password: string) {
  return /[0-9]/.test(password);
}

export function hasSymbols(password: string) {
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
}

export function hasLength(password: string, expectedLength: number) {
  return password.length === expectedLength;
}

export function validatePassword(password: string, options: PasswordRuleOptions) {
  const checks: Array<{ rule: string; valid: boolean }> = [];

  if (options.uppercase !== undefined) {
    checks.push({ rule: 'uppercase', valid: hasUppercase(password) === options.uppercase });
  }

  if (options.lowercase !== undefined) {
    checks.push({ rule: 'lowercase', valid: hasLowercase(password) === options.lowercase });
  }

  if (options.numbers !== undefined) {
    checks.push({ rule: 'numbers', valid: hasNumbers(password) === options.numbers });
  }

  if (options.symbols !== undefined) {
    checks.push({ rule: 'symbols', valid: hasSymbols(password) === options.symbols });
  }

  if (options.length !== undefined) {
    checks.push({ rule: 'length', valid: hasLength(password, options.length) });
  }

  return checks.every((check) => check.valid);
}
