import { expect, test } from '@playwright/test'; // Import Playwright test runner and assertion helpers
import { PasswordGeneratorPage } from '../pages/PasswordGeneratorPage'; // Import the page object for the LastPass generator page
import { hasLowercase, hasNumbers, hasUppercase, hasSymbols, hasLength } from '../utils/passwordRules'; // Import helper functions for validating passwords

let pageObject: PasswordGeneratorPage; // Declare the shared page object variable

test.describe('LastPass online password generator', () => { // Group related tests for the password generator
  test.beforeEach(async ({ page }) => { // Run before every test in this suite
    pageObject = new PasswordGeneratorPage(page); // Create a new Page Object for the current Playwright page
    await pageObject.goto(); // Navigate to the LastPass password generator page
  });

  test('Password generator page loads successfully', async ({ page }) => { // Verify the page loaded correctly
    await expect(page).toHaveTitle(/Password Generator/i); // Assert the browser title contains "Password Generator"
    await expect(pageObject.generateButton).toBeVisible(); // Assert the generate button is visible
    await expect(pageObject.generatedPasswordInput).toBeVisible(); // Assert the generated password field is visible
  });

  test('A password is generated', async () => { // Verify a password can be generated
    await pageObject.generatePassword(); // Click the generate button
    const password = await pageObject.getGeneratedPassword(); // Read the generated password text
    expect(password.length).toBeGreaterThan(0); // Assert the generated password is not empty
  });

  test('Password length can be changed', async () => { // Verify the password length control works
    await pageObject.setLength(20); // Set the password length to 20
    await pageObject.generatePassword(); // Click the generate button again
    expect(await pageObject.getLengthValue()).toBe(20); // Assert the length field now shows 20
    expect(hasLength(await pageObject.getGeneratedPassword(), 20)).toBe(true); // Assert the generated password has length 20
  });

  test('Uppercase option works', async () => { // Verify uppercase-only generation works
    await pageObject.setUppercase(true); // Turn on uppercase characters
    await pageObject.setLowercase(false); // Turn off lowercase characters
    await pageObject.setNumbers(false); // Turn off numbers
    await pageObject.setSymbols(false); // Turn off symbols
    await pageObject.generatePassword(); // Generate the password with selected options

    const password = await pageObject.getGeneratedPassword(); // Read the generated password
    expect(hasUppercase(password)).toBe(true); // Assert the password contains uppercase letters
    expect(hasLowercase(password)).toBe(false); // Assert the password does not contain lowercase letters
  });

  test('Numbers option works', async () => { // Verify numbers can be included
    await pageObject.setUppercase(false); // Turn off uppercase characters
    await pageObject.setLowercase(true); // Turn on lowercase characters
    await pageObject.setNumbers(true); // Turn on numbers
    await pageObject.setSymbols(false); // Turn off symbols
    await pageObject.generatePassword(); // Generate a new password with these options

    const password = await pageObject.getGeneratedPassword(); // Read the generated password text
    expect(hasNumbers(password)).toBe(true); // Assert the password contains numbers
    expect(hasLowercase(password)).toBe(true); // Assert the password contains lowercase letters
  });

  test('Regenerate button creates a new password', async () => { // Verify generating again produces a different password
    await pageObject.generatePassword(); // Generate the first password
    const firstPassword = await pageObject.getGeneratedPassword(); // Save the first password
    await pageObject.generatePassword(); // Generate a second password
    const secondPassword = await pageObject.getGeneratedPassword(); // Save the second password

    expect(firstPassword).not.toBe(secondPassword); // Assert the two generated passwords are different
  });

  test('Copy password button shows confirmation', async () => { // Verify copy action triggers confirmation
    await pageObject.generatePassword(); // Generate a password first
    await pageObject.copyPassword(); // Click the copy password button
    await pageObject.waitForCopyConfirmation(); // Wait for the copy confirmation message to appear
  });
});
