import { test as baseTest } from "@playwright/test";
import { CandyAIPage } from "../pages/candyai.page";

type TestFixtures = {
  candyAIPage: CandyAIPage;
  isSlow: boolean;
};

export const test = baseTest.extend<TestFixtures>({
  candyAIPage: async ({ page }, use) => {
    const candyAIPage = new CandyAIPage(page);
    await use(candyAIPage);
  },

  isSlow: [
    async ({}, use) => {
      const shouldBeSlow = process.env.CI === "true";
      await use(shouldBeSlow);
    },
    { option: true },
  ],
});

export { expect } from "@playwright/test";
