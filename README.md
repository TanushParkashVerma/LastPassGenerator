# LastPass Password Generator Automation
This repository contains a reusable Playwright + TypeScript automation framework for testing the LastPass online password generator.

Target website:

```
https://www.lastpass.com/features/password-generator#generatorTool
```

## Overview
The goal of this project is to create automated UI tests for the LastPass online password generator using Playwright.

The framework is designed to be:

- Maintainable
- Extensible
- Reusable
- Easy to run locally
- Easy to debug in VS Code

The test suite covers more than five key features of the password generator.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- VS Code
- Playwright VS Code Extension

## Project Structure

```
LastPassGenerator
├── pages
│   └── PasswordGeneratorPage.ts
├── tests
│   └── password-generator.spec.ts
├── utils
│   └── passwordRules.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Folder and File Description

### `pages/PasswordGeneratorPage.ts`
This file contains the Page Object Model for the LastPass password generator page.

It includes reusable page actions such as:

- Navigating to the generator page
- Handling popups or overlays
- Reading the generated password
- Changing password length
- Clicking the generate button
- Clicking the copy button
- Toggling password options

Keeping page actions in one file makes the framework easier to maintain. If a selector changes, only the page object needs to be updated.

### `tests/password-generator.spec.ts`
This file contains the automated test cases.

The tests are kept clean and readable by calling reusable methods from the Page Object instead of directly writing selectors inside the test file.

### `utils/passwordRules.ts`
This file contains reusable password validation helper methods.

Examples:

- Validate password length
- Check whether a password contains uppercase letters
- Check whether a password contains numbers
- Check whether a password contains lowercase letters
- Check whether a password contains symbols

This keeps assertion logic reusable across multiple tests.

### `playwright.config.ts`
This file contains Playwright configuration, including:

- Test directory
- Browser configuration
- Reporter configuration
- Trace settings
- Retry settings
- Parallel execution settings

### `tsconfig.json`
This file contains TypeScript configuration for the project.

It helps VS Code and TypeScript understand the project files, Playwright types, and Node.js types.

## Covered Features
The automation suite covers the following password generator features:

1. Password generator page loads successfully
2. A password is generated
3. Password length can be changed
4. Uppercase option works
5. Numbers option works
6. Generate button creates a new password
7. Copy password button shows confirmation

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Visual Studio Code](https://code.visualstudio.com/)

## Installation & Setup

For detailed setup instructions, see the [Playwright VS Code documentation](https://playwright.dev/docs/getting-started-vscode).

1. **Clone and open the folder in VS Code**
   ```
   git clone https://github.com/TanushParkashVerma/LastPassGenerator.git
   cd LastPassGenerator
   code .
   ```

2. **Install the Extension**: Open the Extensions view in VS Code (Ctrl+Shift+X or Cmd+Shift+X) and search for "Playwright". [Install the official extension from Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

3. **Install Playwright**: Once the extension is installed, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and run the **Test: Install Playwright** command.

4. **Select Browsers**: Choose the browsers you want for your tests (e.g., Chromium, Firefox).

5. **Handle Override Prompts**: When prompted to override settings, select **N** since this cloned repo already has the necessary configuration.

6. **Open the Testing Sidebar**: Click the **Testing icon** in the VS Code Activity Bar to open the Test Explorer. Here you'll find your tests and the Playwright sidebar for managing projects, tools, and settings. If it doesn't show up, click the **Refresh icon** and you'll be able to Run the tests.

### View Playwright HTML report

```
npm run report
```

## Verified Test Results
The suite is passing locally in VS Code Test Explorer.


<img width="478" height="373" alt="image" src="https://github.com/user-attachments/assets/bfcbb586-606a-4c72-a80b-d38155410921" />

```

## Notes

- Stable selectors such as `getByRole`, `getByLabel`, and `getByText` are preferred where possible.
- The Page Object handles overlays and consent banners where needed.
- Utility functions are used to keep password validation reusable.
- Test logic is separated from page interaction logic.
- Since this is a live public website, selectors may need to be updated if the website changes.

## Submission By
## Author
Tanush Parkash Verma
