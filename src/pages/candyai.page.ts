import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class CandyAIPage extends BasePage {
  // Header elements
  public readonly loginButton: Locator;
  public readonly createAccountButton: Locator;
  public readonly chatNavButton: Locator;

  // Login Modal elements
  public readonly loginModal: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginSubmitButton: Locator;
  public readonly loginErrorMessage: Locator;
  public readonly closeModalButton: Locator;

  // Character selection elements
  public readonly characterGrid: Locator;
  public readonly lunaCharacterCard: Locator;
  public readonly alexiaCharacterCard: Locator;
  public readonly lyraCharacterCard: Locator;

  // Chat interface elements
  public readonly messageInput: Locator;
  public readonly sendButton: Locator;
  public readonly chatMessages: Locator;
  public readonly lastAIMessage: Locator;
  public readonly aiResponseText: Locator;
  public readonly messageTimestamp: Locator;

  // Character profile elements
  public readonly characterName: Locator;
  public readonly characterAge: Locator;
  public readonly characterEthnicity: Locator;
  public readonly characterOccupation: Locator;
  public readonly characterPersonality: Locator;
  public readonly generateImageButton: Locator;

  // Pre-suggested messages
  public readonly suggestedMessages: Locator;
  public readonly videoRequestButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Header elements
    this.loginButton = page.getByText('Login');
    this.createAccountButton = page.getByText('Create Free Account');
    this.chatNavButton = page.locator('a').filter({ hasText: 'Chat' }).first();

    // Login Modal elements
    this.loginModal = page.locator('[role="dialog"]').first();
    this.emailInput = page.getByRole('textbox', { name: 'E-mail' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginSubmitButton = page.getByRole('button', { name: 'Sign in' });
    this.loginErrorMessage = page.locator('text=Your email or password is invalid');
    this.closeModalButton = page.locator('button').first(); // Close button

    // Character selection elements
    this.characterGrid = page.locator('[role="list"]').first();
    this.lunaCharacterCard = page.getByRole('link', { name: /Luna.*Luna works part-time/ });
    this.alexiaCharacterCard = page.getByRole('link', { name: /Alexia.*Alexia Costa creates custom suits/ });
    this.lyraCharacterCard = page.getByRole('link', { name: /Lyra.*Berlin-based techno DJ/ });

    // Chat interface elements
    this.messageInput = page.getByRole('textbox', { name: 'Write a message...' });
    this.sendButton = page.getByRole('button', { name: 'Ask' });
    this.chatMessages = page.locator('[data-testid="chat-messages"]').first();
    this.lastAIMessage = page.locator('p').first(); // AI response paragraph
    this.aiResponseText = page.locator('p').first();
    this.messageTimestamp = page.locator('text=/\\d+:\\d+[AP]M/');

    // Character profile elements
    this.characterName = page.locator('h1');
    this.characterAge = page.locator('text="23"');
    this.characterEthnicity = page.locator('text=Venezuelan');
    this.characterOccupation = page.locator('text=Bookstore worker');
    this.characterPersonality = page.locator('text=Enthusiast and Optimist');
    this.generateImageButton = page.getByRole('link', { name: 'Generate Image' });

    // Pre-suggested messages
    this.suggestedMessages = page.locator('text=/Show me\.\.\.|Send me\.\.\.|Can I see\.\.\./');
    this.videoRequestButton = page.locator('text=🎥 Send me a video of you');
  }

  /**
   * Navigate to Candy.ai homepage
   */
  async goToHomepage(): Promise<void> {
    await this.goto('https://candy.ai/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Attempt to login with provided credentials
   */
  async attemptLogin(email: string, password: string): Promise<void> {
    await this.loginButton.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  /**
   * Close any open modals
   */
  async closeModal(): Promise<void> {
    await this.closeModalButton.click();
  }

  /**
   * Navigate to Luna's character page
   */
  async goToLunaCharacter(): Promise<void> {
    await this.lunaCharacterCard.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Send a message in the chat
   */
  async sendMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
    await this.sendButton.click();
    // Wait a moment for the response
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get the text of the last AI response
   */
  async getLastAIResponse(): Promise<string> {
    await this.aiResponseText.waitFor({ state: 'visible' });
    return await this.aiResponseText.textContent() || '';
  }

  /**
   * Verify character profile information
   */
  async verifyLunaProfile(): Promise<void> {
    await expect(this.characterName).toContainText('Luna');
    await expect(this.characterAge).toBeVisible();
    await expect(this.characterEthnicity).toBeVisible();
    await expect(this.characterOccupation).toBeVisible();
    await expect(this.characterPersonality).toBeVisible();
  }

  /**
   * Verify chat interface elements are present
   */
  async verifyChatInterface(): Promise<void> {
    await expect(this.messageInput).toBeVisible();
    await expect(this.sendButton).toBeVisible();
    await expect(this.generateImageButton).toBeVisible();
  }

  /**
   * Verify AI response contains expected content
   */
  async verifyAIResponseContains(expectedText: string): Promise<void> {
    const response = await this.getLastAIResponse();
    expect(response.toLowerCase()).toContain(expectedText.toLowerCase());
  }

  /**
   * Verify suggested messages are present
   */
  async verifySuggestedMessagesPresent(): Promise<void> {
    await expect(this.suggestedMessages).toBeVisible();
    await expect(this.videoRequestButton).toBeVisible();
  }

  /**
   * Verify login error message is displayed
   */
  async verifyLoginError(): Promise<void> {
    await expect(this.loginErrorMessage).toBeVisible();
  }

  /**
   * Navigate to different character by name
   */
  async goToCharacter(characterName: string): Promise<void> {
    const characterSelector = this.page.getByRole('link', { name: new RegExp(characterName, 'i') });
    await characterSelector.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
