import { Page, Route } from "@playwright/test";

export type GotoOptions = {
  referer?: string;
  timeout?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
};

export type Cookie = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
};

export abstract class BasePage {
  public readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  public async goto(
    url: string = "/",
    options: GotoOptions = { waitUntil: "load" },
  ): Promise<void> {
    await this.page.goto(url, options);
  }

  public async setCookies(cookies: Array<Cookie>): Promise<void> {
    await this.page.context().addCookies(cookies);
  }

  public url(): string {
    return this.page.url();
  }

  public async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
  }

  public async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => {
      sessionStorage.clear();
    });
  }

  public async clearAllCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  public async reload(): Promise<void> {
    await this.page.reload({ waitUntil: "load" });
  }

  public async close(): Promise<void> {
    await this.page.close();
    // Pass the key and value to the page.evaluate function
  }

  public async route(
    route: string | RegExp,
    fn: (route: Route) => Promise<void>,
  ): Promise<void> {
    await this.page.route(route, fn);
  }
}
