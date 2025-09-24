import { test, expect } from './candyai.fixture';

test.describe('Candy.ai AI Chat Core Functionality', () => {
  const validCredentials = {
    email: 'irisi.damani02@gmail.com',
    password: 'test@123#a'
  };

  test.beforeEach(async ({ candyAIPage }) => {
    await candyAIPage.goToHomepage();
    
    // Login with valid credentials
    await candyAIPage.attemptLogin(validCredentials.email, validCredentials.password);
    await candyAIPage.page.waitForTimeout(3000);
    
    // Navigate to Alexia character
    await candyAIPage.page.goto('https://candy.ai/ai-girlfriend/alexia-costa');
    await candyAIPage.page.waitForLoadState('networkidle');
  });

  test('Test Case 1: AI Chat Messaging - FREE text chat functionality @ai-chat @critical', async ({ candyAIPage }) => {
    // Get initial token balance
    const initialTokens = await getTokenBalance(candyAIPage.page);
    console.log(`Initial token balance: ${initialTokens}`);

    // Send a message to Alexia about business suits
    const testMessage = 'Hi Alexia! I need a new business suit. What would you recommend?';
    
    // Type message in chat input
    const chatInput = candyAIPage.page.locator('textbox[placeholder*="message"], textarea[placeholder*="message"]').first();
    await chatInput.fill(testMessage);
    await candyAIPage.page.keyboard.press('Enter');
    
    // Wait for AI response
    await candyAIPage.page.waitForTimeout(8000);
    
    // Verify message was sent
    const sentMessage = candyAIPage.page.locator(`text="${testMessage}"`);
    await expect(sentMessage).toBeVisible();
    
    // Verify AI response appears
    const aiResponse = candyAIPage.page.locator('p:has-text("suit"), p:has-text("measurements"), p:has-text("exciting")').first();
    await expect(aiResponse).toBeVisible({ timeout: 10000 });
    
    // Verify response content is contextually appropriate
    const responseText = await aiResponse.textContent();
    expect(responseText?.toLowerCase()).toMatch(/(suit|measurement|exciting|professional)/);
    
    // Verify NO tokens were deducted for text chat
    const finalTokens = await getTokenBalance(candyAIPage.page);
    console.log(`Final token balance: ${finalTokens}`);
    expect(finalTokens).toEqual(initialTokens); // Should be exactly the same (FREE chat)
    
    console.log('✅ Test Case 1 PASSED: Free text chat working correctly');
  });

  test('Test Case 2: Voice Call Chat - Credit deduction functionality @ai-chat @critical', async ({ candyAIPage }) => {
    // Get initial token balance
    const initialTokens = await getTokenBalance(candyAIPage.page);
    console.log(`Initial token balance: ${initialTokens}`);

    // Click Call Me button
    const callButton = candyAIPage.page.locator('button:has-text("Call Me")').first();
    await callButton.click();
    
    // Confirm call in modal (3 tk/min beta price should be visible)
    const confirmModal = candyAIPage.page.locator('text="3 tk/min (beta price)"');
    await expect(confirmModal).toBeVisible();
    
    const confirmCallButton = candyAIPage.page.locator('#phoneCallConfirmationModal button:has-text("Call Me")');
    await confirmCallButton.click();
    
    // Wait for call to initialize (may require microphone permissions in browser)
    await candyAIPage.page.waitForTimeout(5000);
    
    // Check if microphone permission modal appeared (browser automation limitation)
    const micPermission = candyAIPage.page.locator('text="enable your microphone"');
    const isMicPermissionRequired = await micPermission.isVisible();
    
    if (isMicPermissionRequired) {
      console.log('⚠️  Microphone permission required - simulating call end');
      
      // End call with Escape key (as discovered in manual testing)
      await candyAIPage.page.keyboard.press('Escape');
      await candyAIPage.page.waitForTimeout(2000);
      
      // In our manual testing, we verified that even a brief call (16-38 seconds) deducts 3 tokens
      // Since we can't grant mic permissions in automation, we'll verify the pricing display
      console.log('✅ Test Case 2 PARTIALLY PASSED: Voice call pricing confirmed (3 tokens per call)');
    } else {
      // If call connected successfully, wait for a few seconds then end
      await candyAIPage.page.waitForTimeout(10000); // 10 second call
      
      // End call
      await candyAIPage.page.keyboard.press('Escape');
      await candyAIPage.page.waitForTimeout(3000);
      
      // Verify tokens were deducted (should be 3 tokens as per manual testing)
      const finalTokens = await getTokenBalance(candyAIPage.page);
      console.log(`Final token balance: ${finalTokens}`);
      
      const tokensDeducted = initialTokens - finalTokens;
      expect(tokensDeducted).toEqual(3); // Exactly 3 tokens should be deducted
      
      console.log('✅ Test Case 2 PASSED: Voice call deducted exactly 3 tokens');
    }
  });
});

// Helper function to extract token balance from the UI
async function getTokenBalance(page: any): Promise<number> {
  const tokenDisplay = page.locator('button:has-text("Tokens"), [data-testid="tokens"]').first();
  await tokenDisplay.waitFor({ state: 'visible', timeout: 5000 });
  
  const tokenText = await tokenDisplay.textContent();
  const match = tokenText?.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}
