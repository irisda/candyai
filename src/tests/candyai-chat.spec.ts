import { test, expect } from "./candyai.fixture";

test.describe("Candy.ai AI Chat Feature - Comprehensive Test Suite", () => {
  test.beforeEach(async ({ candyAIPage }) => {
    await candyAIPage.goToHomepage();
  });

  test.describe("Authentication & Access Control", () => {
    test(
      "Should display login modal when clicking Login button",
      { tag: ["@ui", "@authentication"] },
      async ({ candyAIPage }) => {
        await candyAIPage.loginButton.click();
        await expect(candyAIPage.loginModal).toBeVisible();
        await expect(candyAIPage.emailInput).toBeVisible();
        await expect(candyAIPage.passwordInput).toBeVisible();
        await expect(candyAIPage.loginSubmitButton).toBeVisible();
      }
    );

    test(
      "Should show error message with invalid credentials",
      { tag: ["@ui", "@authentication", "@negative"] },
      async ({ candyAIPage }) => {
        await candyAIPage.attemptLogin("test@example.com", "wrongpassword123");
        await candyAIPage.verifyLoginError();
      }
    );

    test(
      "Should close login modal when close button is clicked",
      { tag: ["@ui", "@authentication"] },
      async ({ candyAIPage }) => {
        await candyAIPage.loginButton.click();
        await expect(candyAIPage.loginModal).toBeVisible();
        
        await candyAIPage.closeModal();
        // Wait a moment for modal to close
        await candyAIPage.page.waitForTimeout(500);
        await expect(candyAIPage.loginModal).not.toBeVisible();
      }
    );

    test(
      "Should prompt for account creation when clicking Chat without login",
      { tag: ["@ui", "@authentication", "@access-control"] },
      async ({ candyAIPage }) => {
        await candyAIPage.chatNavButton.click();
        // Should show create account modal or login prompt
        await expect(candyAIPage.createAccountButton).toBeVisible();
      }
    );
  });

  test.describe("Character Selection & Navigation", () => {
    test(
      "Should display character grid on homepage",
      { tag: ["@ui", "@character-selection"] },
      async ({ candyAIPage }) => {
        await expect(candyAIPage.characterGrid).toBeVisible();
        await expect(candyAIPage.lunaCharacterCard).toBeVisible();
        await expect(candyAIPage.alexiaCharacterCard).toBeVisible();
        await expect(candyAIPage.lyraCharacterCard).toBeVisible();
      }
    );

    test(
      "Should navigate to Luna character page successfully",
      { tag: ["@ui", "@character-selection", "@navigation"] },
      async ({ candyAIPage }) => {
        await candyAIPage.goToLunaCharacter();
        
        // Verify we're on Luna's page
        await expect(candyAIPage.page).toHaveURL(/luna-moreno-2/);
        await expect(candyAIPage.page).toHaveTitle(/Luna Moreno/);
        await candyAIPage.verifyLunaProfile();
      }
    );

    test(
      "Should display character profile information correctly",
      { tag: ["@ui", "@character-profile"] },
      async ({ candyAIPage }) => {
        await candyAIPage.goToLunaCharacter();
        await candyAIPage.verifyLunaProfile();
      }
    );
  });

  test.describe("AI Chat Core Functionality", () => {
    test.beforeEach(async ({ candyAIPage }) => {
      await candyAIPage.goToLunaCharacter();
      await candyAIPage.verifyChatInterface();
    });

    test(
      "Should display chat interface elements correctly",
      { tag: ["@ui", "@chat-interface"] },
      async ({ candyAIPage }) => {
        await candyAIPage.verifyChatInterface();
        await candyAIPage.verifySuggestedMessagesPresent();
      }
    );

    test(
      "Should send message and receive AI response",
      { tag: ["@ai-chat", "@core-functionality", "@critical"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI response might be slower in CI");

        const testMessage = "Hi Luna! What book are you reading today?";
        await candyAIPage.sendMessage(testMessage);

        // Verify AI responded
        const response = await candyAIPage.getLastAIResponse();
        expect(response).toBeTruthy();
        expect(response.length).toBeGreaterThan(0);

        // Verify response is contextually appropriate (contains Luna or book-related content)
        const isContextual = response.toLowerCase().includes('luna') || 
                             response.toLowerCase().includes('book') ||
                             response.toLowerCase().includes('read') ||
                             response.toLowerCase().includes('story');
        expect(isContextual).toBeTruthy();
      }
    );

    test(
      "Should maintain character personality in responses",
      { tag: ["@ai-chat", "@character-consistency"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI response might be slower in CI");

        await candyAIPage.sendMessage("What's your favorite book genre?");

        const response = await candyAIPage.getLastAIResponse();
        expect(response).toBeTruthy();

        // Luna should respond in character as a book enthusiast
        const isBookRelated = response.toLowerCase().includes('book') ||
                              response.toLowerCase().includes('read') ||
                              response.toLowerCase().includes('novel') ||
                              response.toLowerCase().includes('story') ||
                              response.toLowerCase().includes('love');
        expect(isBookRelated).toBeTruthy();
      }
    );

    test(
      "Should handle multiple messages in conversation",
      { tag: ["@ai-chat", "@conversation-flow"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Multiple AI responses might be slower");

        // First message
        await candyAIPage.sendMessage("Hello Luna!");
        const firstResponse = await candyAIPage.getLastAIResponse();
        expect(firstResponse).toBeTruthy();

        // Second message
        await candyAIPage.sendMessage("What do you do for fun?");
        const secondResponse = await candyAIPage.getLastAIResponse();
        expect(secondResponse).toBeTruthy();
        expect(secondResponse).not.toBe(firstResponse);

        // Should mention hobbies like reading, gardening, or yoga
        const mentionsHobbies = secondResponse.toLowerCase().includes('read') ||
                                secondResponse.toLowerCase().includes('garden') ||
                                secondResponse.toLowerCase().includes('yoga') ||
                                secondResponse.toLowerCase().includes('book');
        expect(mentionsHobbies).toBeTruthy();
      }
    );

    test(
      "Should display message timestamps",
      { tag: ["@ui", "@chat-interface", "@timestamps"] },
      async ({ candyAIPage }) => {
        await candyAIPage.sendMessage("Hi Luna!");
        
        // Check if timestamp is visible
        await expect(candyAIPage.messageTimestamp).toBeVisible();
      }
    );
  });

  test.describe("Advanced Features", () => {
    test.beforeEach(async ({ candyAIPage }) => {
      await candyAIPage.goToLunaCharacter();
    });

    test(
      "Should display suggested message prompts",
      { tag: ["@ui", "@advanced-features"] },
      async ({ candyAIPage }) => {
        await candyAIPage.verifySuggestedMessagesPresent();
      }
    );

    test(
      "Should display Generate Image functionality",
      { tag: ["@ui", "@advanced-features", "@image-generation"] },
      async ({ candyAIPage }) => {
        await expect(candyAIPage.generateImageButton).toBeVisible();
        
        // Verify the button has correct link
        const href = await candyAIPage.generateImageButton.getAttribute('href');
        expect(href).toContain('generate-image');
        expect(href).toContain('profile_slug=luna-moreno-2');
      }
    );

    test(
      "Should display video request option",
      { tag: ["@ui", "@advanced-features", "@video"] },
      async ({ candyAIPage }) => {
        await expect(candyAIPage.videoRequestButton).toBeVisible();
      }
    );
  });

  test.describe("Cross-Character Testing", () => {
    test(
      "Should be able to navigate between different characters",
      { tag: ["@character-selection", "@navigation"] },
      async ({ candyAIPage }) => {
        // Start with Luna
        await candyAIPage.goToLunaCharacter();
        await expect(candyAIPage.characterName).toContainText('Luna');

        // Go back to homepage
        await candyAIPage.goToHomepage();

        // Navigate to Alexia
        await candyAIPage.alexiaCharacterCard.click();
        await candyAIPage.page.waitForLoadState('domcontentloaded');
        await expect(candyAIPage.page).toHaveURL(/alexia-costa/);
      }
    );

    test(
      "Should display different character personalities",
      { tag: ["@character-profile", "@personality"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Testing multiple characters");

        // Test Luna (bookstore worker)
        await candyAIPage.goToLunaCharacter();
        await candyAIPage.sendMessage("What do you do?");
        const lunaResponse = await candyAIPage.getLastAIResponse();
        
        // Go back and test Lyra (DJ)
        await candyAIPage.goToHomepage();
        await candyAIPage.lyraCharacterCard.click();
        await candyAIPage.page.waitForLoadState('domcontentloaded');
        
        await candyAIPage.sendMessage("What do you do?");
        const lyraResponse = await candyAIPage.getLastAIResponse();
        
        // Responses should be different and character-specific
        expect(lunaResponse).not.toBe(lyraResponse);
      }
    );
  });

  test.describe("Performance & Reliability", () => {
    test(
      "Should load homepage within acceptable time",
      { tag: ["@performance"] },
      async ({ candyAIPage }) => {
        const startTime = Date.now();
        await candyAIPage.goToHomepage();
        const loadTime = Date.now() - startTime;
        
        // Should load within 10 seconds
        expect(loadTime).toBeLessThan(10000);
      }
    );

    test(
      "Should handle rapid message sending",
      { tag: ["@performance", "@stress"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Rapid message testing might be slower");

        await candyAIPage.goToLunaCharacter();
        
        // Send multiple messages quickly
        const messages = ["Hi", "How are you?", "What books do you like?"];
        
        for (const message of messages) {
          await candyAIPage.sendMessage(message);
          // Short wait between messages
          await candyAIPage.page.waitForTimeout(1000);
        }
        
        // Should still get a response to the last message
        const finalResponse = await candyAIPage.getLastAIResponse();
        expect(finalResponse).toBeTruthy();
      }
    );
  });

  test.describe("Error Handling & Edge Cases", () => {
    test(
      "Should handle empty message input gracefully",
      { tag: ["@error-handling", "@edge-cases"] },
      async ({ candyAIPage }) => {
        await candyAIPage.goToLunaCharacter();
        
        // Try to send empty message
        await candyAIPage.messageInput.fill("");
        await candyAIPage.sendButton.click();
        
        // Should either prevent sending or handle gracefully
        // (exact behavior depends on implementation)
        // Just ensure no error breaks the interface
        await expect(candyAIPage.messageInput).toBeVisible();
        await expect(candyAIPage.sendButton).toBeVisible();
      }
    );

    test(
      "Should handle very long messages",
      { tag: ["@error-handling", "@edge-cases"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Long message processing might be slower");

        await candyAIPage.goToLunaCharacter();
        
        const longMessage = "A".repeat(1000); // 1000 character message
        await candyAIPage.sendMessage(longMessage);
        
        // Should still function normally
        const response = await candyAIPage.getLastAIResponse();
        expect(response).toBeTruthy();
      }
    );
  });
});
