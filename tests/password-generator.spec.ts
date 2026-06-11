import { expect, test } from '@playwright/test';
import { PasswordGeneratorPage } from '../pages/PasswordGeneratorPage';
import { hasLowercase, hasNumbers, hasUppercase, hasSymbols, hasLength } from '../utils/passwordRules';

let pageObject: PasswordGeneratorPage;

test.describe('LastPass online password generator', () => {
  test.beforeEach(async ({ page }) => {
    pageObject = new PasswordGeneratorPage(page);
    await pageObject.goto();
  });

  test('Password generator page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Password Generator/i);
    await expect(pageObject.generateButton).toBeVisible();
    await expect(pageObject.generatedPasswordInput).toBeVisible();
  });

  test('A password is generated', async () => {
    await pageObject.generatePassword();
    const password = await pageObject.getGeneratedPassword();
    expect(password.length).toBeGreaterThan(0);
  });

  test('Password length can be changed', async () => {
    await pageObject.setLength(20);
    await pageObject.generatePassword();
    expect(await pageObject.getLengthValue()).toBe(20);
    expect(hasLength(await pageObject.getGeneratedPassword(), 20)).toBe(true);
  });

  test('Uppercase option works', async () => {
    await pageObject.setUppercase(true);
    await pageObject.setLowercase(false);
    await pageObject.setNumbers(false);
    await pageObject.setSymbols(false);
    await pageObject.generatePassword();

    const password = await pageObject.getGeneratedPassword();
    expect(hasUppercase(password)).toBe(true);
    expect(hasLowercase(password)).toBe(false);
  });

  test('Numbers option works', async () => {
    await pageObject.setUppercase(false);
    await pageObject.setLowercase(true);
    await pageObject.setNumbers(true);
    await pageObject.setSymbols(false);
    await pageObject.generatePassword();

    const password = await pageObject.getGeneratedPassword();
    expect(hasNumbers(password)).toBe(true);
    expect(hasLowercase(password)).toBe(true);
  });

  test('Regenerate button creates a new password', async () => {
    await pageObject.generatePassword();
    const firstPassword = await pageObject.getGeneratedPassword();
    await pageObject.generatePassword();
    const secondPassword = await pageObject.getGeneratedPassword();

    expect(firstPassword).not.toBe(secondPassword);
  });

  test('Copy password button shows confirmation', async () => {
    await pageObject.generatePassword();
    await pageObject.copyPassword();
    await pageObject.waitForCopyConfirmation();
  });
});
