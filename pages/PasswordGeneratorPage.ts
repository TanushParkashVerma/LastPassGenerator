import { expect, Locator, Page } from '@playwright/test';

export class PasswordGeneratorPage {
  readonly page: Page;
  readonly url = 'https://www.lastpass.com/features/password-generator#generatorTool';
  readonly generatedPasswordInput: Locator;
  readonly lengthInput: Locator;
  readonly uppercaseCheckbox: Locator;
  readonly lowercaseCheckbox: Locator;
  readonly numbersCheckbox: Locator;
  readonly symbolsCheckbox: Locator;
  readonly uppercaseLabel: Locator;
  readonly lowercaseLabel: Locator;
  readonly numbersLabel: Locator;
  readonly symbolsLabel: Locator;
  readonly generateButton: Locator;
  readonly copyPasswordButton: Locator;
  readonly copyConfirmationMessage: Locator;
  readonly dismissBannerButton: Locator;
  readonly acceptCookiesButton: Locator;

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
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.generatedPasswordInput.waitFor({ state: 'visible', timeout: 60000 });
    await this.safeCloseOverlay();
  }

  async safeCloseOverlay() {
    if (await this.acceptCookiesButton.count()) {
      await this.acceptCookiesButton.click();
    }

    if (await this.dismissBannerButton.count()) {
      await this.dismissBannerButton.click();
    }
  }

  async generatePassword() {
    await this.generateButton.click();
    await expect(this.generatedPasswordInput).not.toHaveValue('');
  }

  async copyPassword() {
    await this.copyPasswordButton.click();
  }

  async getGeneratedPassword() {
    return (await this.generatedPasswordInput.inputValue()).trim();
  }

  async setLength(length: number) {
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

    await expect(this.lengthInput).toHaveValue(length.toString());
  }

  async getLengthValue() {
    const value = await this.lengthInput.inputValue();
    return Number(value);
  }

  private async setCheckboxState(checkbox: Locator, label: Locator, checked: boolean) {
    if (await checkbox.isChecked() !== checked) {
      await label.click();
      await expect(checkbox).toHaveJSProperty('checked', checked);
    }
  }

  async setUppercase(enabled: boolean) {
    await this.setCheckboxState(this.uppercaseCheckbox, this.uppercaseLabel, enabled);
  }

  async setLowercase(enabled: boolean) {
    await this.setCheckboxState(this.lowercaseCheckbox, this.lowercaseLabel, enabled);
  }

  async setNumbers(enabled: boolean) {
    await this.setCheckboxState(this.numbersCheckbox, this.numbersLabel, enabled);
  }

  async setSymbols(enabled: boolean) {
    await this.setCheckboxState(this.symbolsCheckbox, this.symbolsLabel, enabled);
  }

  async waitForCopyConfirmation() {
    await expect(this.copyConfirmationMessage).toBeVisible({ timeout: 5000 });
  }
}
