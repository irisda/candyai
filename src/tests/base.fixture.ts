import {
  expect as baseExpect,
  test as baseTest,
  Locator,
} from "@playwright/test";
import * as OS from "node:os";

import "dotenv/config";

type BaseWorkerFixture = {
  isSlow: boolean;
};

export const test = baseTest.extend<{}, BaseWorkerFixture>({
  isSlow: [
    async ({}, use: (r: boolean) => Promise<void>, testInfo): Promise<void> => {
      await use(testInfo.config.workers / OS.cpus().length >= 0.5);
    },
    { scope: "worker" },
  ],
});

export const expect = baseExpect.extend({
  async toRoughlyEqual(actual: number, expected: number, error: number = 0) {
    const assertionName = "toRoughlyEqual";
    let pass = true;
    let matcherResult: { expected: number; actual: number };
    try {
      const calculatedError = Math.abs((actual - expected) / expected);
      baseExpect(calculatedError).toBeLessThanOrEqual(error);
      matcherResult = { expected, actual };
    } catch (e) {
      matcherResult = e.matcherResult;
      pass = false;
    }
    let message: () => string;
    if (pass) {
      message = (): string => {
        return (
          this.utils.matcherHint(assertionName, undefined, undefined, {
            isNot: this.isNot,
          }) +
          "\n\n" +
          `Received error: ${matcherResult.actual}\n` +
          `Expected error: ${matcherResult.expected}\n` +
          `Expected: ${this.isNot ? "not" : ""}${this.utils.printExpected(matcherResult.expected)}\n` +
          (matcherResult
            ? `Received: ${this.utils.printReceived(matcherResult.actual)}`
            : "")
        );
      };
    } else {
      message = (): string => {
        return (
          this.utils.matcherHint(assertionName, undefined, undefined, {
            isNot: this.isNot,
          }) +
          "\n\n" +
          `Received error: ${matcherResult.actual}\n` +
          `Expected error: ${matcherResult.expected}\n` +
          `Expected: ${this.utils.printExpected(matcherResult.expected)}\n` +
          `Received: ${this.utils.printReceived(matcherResult.actual)}`
        );
      };
    }

    return {
      message,
      pass,
      name: assertionName,
      expected: matcherResult ? matcherResult.expected : expected,
      actual: matcherResult ? matcherResult.actual : actual,
    };
  },
  async toBeRequired(locator: Locator) {
    const assertionName = "toBeRequired";
    let pass = true;
    let matcherResult: { expected: unknown; actual: unknown };
    try {
      await locator.focus();
      await locator.blur();
      await baseExpect(locator).toHaveClass(/ng-invalid/);
      matcherResult = {
        expected: "to have class /ng-invalied/",
        actual: "to have class /ng-invalied/",
      };
    } catch (e) {
      matcherResult = e.matcherResult;
      pass = false;
    }
    let message: () => string;
    if (pass) {
      message = (): string => {
        return (
          this.utils.matcherHint(assertionName, undefined, undefined, {
            isNot: this.isNot,
          }) +
          "\n\n" +
          `Received class: ${matcherResult.actual}\n` +
          `Expected class: ${matcherResult.expected}\n` +
          `Expected: ${this.isNot ? "not" : ""}${this.utils.printExpected(matcherResult.expected)}\n` +
          (matcherResult
            ? `Received: ${this.utils.printReceived(matcherResult.actual)}`
            : "")
        );
      };
    } else {
      message = (): string => {
        return (
          this.utils.matcherHint(assertionName, undefined, undefined, {
            isNot: this.isNot,
          }) +
          "\n\n" +
          `Received error: ${matcherResult.actual}\n` +
          `Expected error: ${matcherResult.expected}\n` +
          `Expected: ${this.utils.printExpected(matcherResult.expected)}\n` +
          `Received: ${this.utils.printReceived(matcherResult.actual)}`
        );
      };
    }

    return {
      message,
      pass,
      name: assertionName,
      expected: matcherResult ? matcherResult.expected : "",
      actual: matcherResult ? matcherResult.actual : "",
    };
  },
});
