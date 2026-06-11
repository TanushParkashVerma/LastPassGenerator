import { expect, Locator, Page } from '@playwright/test'; // Import Playwright types and assertion helpers

export class PasswordGeneratorPage {
  readonly page: Page; // The Playwright page instance
  readonly url = 'https://www.lastpass.com/features/password-generator#generatorTool'; // URL of the LastPass password generator
  readonly generatedPasswordInput: Locator; // Locator for the generated password field
  readonly lengthInput: Locator; // Locator for the password length input field
  readonly uppercaseCheckbox: Locator; // Locator for the uppercase option checkbox input
  readonly lowercaseCheckbox: Locator; // Locator for the lowercase option checkbox input
  readonly numbersCheckbox: Locator; // Locator for the numbers option checkbox input
  readonly symbolsCheckbox: Locator; // Locator for the symbols option checkbox input
  readonly uppercaseLabel: Locator; // Locator for the uppercase checkbox label
  readonly lowercaseLabel: Locator; // Locator for the lowercase checkbox label
  readonly numbersLabel: Locator; // Locator for the numbers checkbox label
  readonly symbolsLabel: Locator; // Locator for the symbols checkbox label
  readonly generateButton: Locator; // Locator for the generate password button
  readonly copyPasswordButton: Locator; // Locator for the copy password button
  readonly copyConfirmationMessage: Locator; // Locator for the copy confirmation message
  readonly dismissBannerButton: Locator; // Locator for any dismiss banner or overlay close button
  readonly acceptCookiesButton: Locator; // Locator for the accept cookies button in an embedded frame

  constructor(page: Page) {
    this.page = page;
    this.generatedPasswordInput = page.locator('#GENERATED-PASSWORD');
    this.lengthInput = page.locator('#lp-pg-password-length');
    this.uppercaseCheckbox = page.locator('#lp-pg-uppercase');
    this.lowercaseCheckbox = page.locator('#lp-pg-lowercase');
    this.numbersCheckbox = page.locator('#lp-pg-numbers');
    this.symbolsCheckbox = page.locator('#lp-pg-symbols');
    this.uppercaseLabel = page.locator('label[for="lp-pg-uppercase"]');
    this.lowercaseLabel = page.locator('label[for="lp-pg-lowercase"]');
    this.numbersLabel = page.locator('label[for="lp-pg-numbers"]');
    this.symbolsLabel = page.locator('label[for="lp-pg-symbols"]');
    this.generateButton = page.locator('button.lp-pg-generated-password__icon-generate.lp-webbtn').first();
    this.copyPasswordButton = page.getByRole('button', { name: 'Copy password' });
    this.copyConfirmationMessage = page.getByText('Password copied!', { exact: true });
    this.dismissBannerButton = page.getByRole('button', { name: 'close' });
    this.acceptCookiesButton = page.frameLocator('#TRUSTARC').getByRole('button', { name: 'Accept All' });
  }

  async goto() {
    // Navigate to the password generator page and wait for the main field to appear.
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.generatedPasswordInput.waitFor({ state: 'visible', timeout: 60000 });
    await this.safeCloseOverlay();
  }

  async safeCloseOverlay() {
    // Accept cookies if the button exists.
    if (await this.acceptCookiesButton.count()) {
      await this.acceptCookiesButton.click();
    }

    // Dismiss any banner or overlay if present.
    if (await this.dismissBannerButton.count()) {
      await this.dismissBannerButton.click();
    }
  }

  async generatePassword() {
    // Click the generate button and verify a password value appears.
    await this.generateButton.click();
    await expect(this.generatedPasswordInput).not.toHaveValue('');
  }

  async copyPassword() {
    // Click the copy password button to copy the current value.
    await this.copyPasswordButton.click();
  }

  async getGeneratedPassword() {
    // Read the generated password value and trim whitespace.
    return (await this.generatedPasswordInput.inputValue()).trim();
  }

  async setLength(length: number) {
    // Use page script execution to set the length input directly and fire input/change events.
    await this.page.evaluate(
      ({ selector, value }: { selector: string; value: string }) => {
        const input = document.querySelector<HTMLInputElement>(selector);
        if (!input) return;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      { selector: '#lp-pg-password-length', value: length.toString() }
    );

    // Confirm that the length input was updated successfully.
    await expect(this.lengthInput).toHaveValue(length.toString());
  }

  async getLengthValue() {
    // Return the current numeric value of the length input.
    const value = await this.lengthInput.inputValue();
    return Number(value);
  }

  private async setCheckboxState(checkbox: Locator, label: Locator, checked: boolean) {
    // Toggle the checkbox only when its current state differs from the desired state.
    if (await checkbox.isChecked() !== checked) {
      await label.click();
      await expect(checkbox).toHaveJSProperty('checked', checked);
    }
  }

  async setUppercase(enabled: boolean) {
    // Enable or disable the uppercase option.
    await this.setCheckboxState(this.uppercaseCheckbox, this.uppercaseLabel, enabled);
  }

  async setLowercase(enabled: boolean) {
    // Enable or disable the lowercase option.
    await this.setCheckboxState(this.lowercaseCheckbox, this.lowercaseLabel, enabled);
  }

  async setNumbers(enabled: boolean) {
    // Enable or disable the numbers option.
    await this.setCheckboxState(this.numbersCheckbox, this.numbersLabel, enabled);
  }

  async setSymbols(enabled: boolean) {
    // Enable or disable the symbols option.
    await this.setCheckboxState(this.symbolsCheckbox, this.symbolsLabel, enabled);
  }

  async waitForCopyConfirmation() {
    // Wait for the confirmation message after copying the password.
    await expect(this.copyConfirmationMessage).toBeVisible({ timeout: 5000 });
  }
}
