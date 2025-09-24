import { test, expect } from "./candyai.fixture";

test.describe("Candy.ai AI Chat - Conversation Scenarios", () => {
  test.beforeEach(async ({ candyAIPage }) => {
    await candyAIPage.goToHomepage();
    await candyAIPage.goToLunaCharacter();
  });

  test.describe("Book-Related Conversations (Luna Character)", () => {
    test(
      "Should discuss favorite books and genres",
      { tag: ["@ai-chat", "@conversation", "@books"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("What's your favorite book genre?");
        const genreResponse = await candyAIPage.getLastAIResponse();
        
        // Should mention genres like romance, novels, etc.
        const mentionsGenres = genreResponse.toLowerCase().includes('romance') ||
                              genreResponse.toLowerCase().includes('novel') ||
                              genreResponse.toLowerCase().includes('fiction') ||
                              genreResponse.toLowerCase().includes('love') ||
                              genreResponse.toLowerCase().includes('story');
        expect(mentionsGenres).toBeTruthy();
      }
    );

    test(
      "Should respond to book recommendations request",
      { tag: ["@ai-chat", "@conversation", "@recommendations"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("Can you recommend a good book to read?");
        const recommendationResponse = await candyAIPage.getLastAIResponse();
        
        expect(recommendationResponse).toBeTruthy();
        expect(recommendationResponse.length).toBeGreaterThan(20); // Should be a substantial response
        
        // Should contain book-related keywords
        const isBookRecommendation = recommendationResponse.toLowerCase().includes('book') ||
                                    recommendationResponse.toLowerCase().includes('read') ||
                                    recommendationResponse.toLowerCase().includes('recommend') ||
                                    recommendationResponse.toLowerCase().includes('story');
        expect(isBookRecommendation).toBeTruthy();
      }
    );

    test(
      "Should discuss bookstore work experiences",
      { tag: ["@ai-chat", "@conversation", "@work"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("Tell me about working at the bookstore");
        const workResponse = await candyAIPage.getLastAIResponse();
        
        // Should mention bookstore-related activities
        const mentionsBookstore = workResponse.toLowerCase().includes('bookstore') ||
                                  workResponse.toLowerCase().includes('work') ||
                                  workResponse.toLowerCase().includes('customers') ||
                                  workResponse.toLowerCase().includes('books') ||
                                  workResponse.toLowerCase().includes('shop');
        expect(mentionsBookstore).toBeTruthy();
      }
    );

    test(
      "Should discuss book club gatherings",
      { tag: ["@ai-chat", "@conversation", "@social"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("Tell me about your book gatherings");
        const gatheringResponse = await candyAIPage.getLastAIResponse();
        
        // Should mention social aspects of book discussions
        const mentionsSocialAspects = gatheringResponse.toLowerCase().includes('gather') ||
                                     gatheringResponse.toLowerCase().includes('discuss') ||
                                     gatheringResponse.toLowerCase().includes('meeting') ||
                                     gatheringResponse.toLowerCase().includes('club') ||
                                     gatheringResponse.toLowerCase().includes('people');
        expect(mentionsSocialAspects).toBeTruthy();
      }
    );
  });

  test.describe("Personal Interest Conversations", () => {
    test(
      "Should discuss gardening hobby",
      { tag: ["@ai-chat", "@conversation", "@hobbies"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("I heard you enjoy gardening. Tell me about it!");
        const gardeningResponse = await candyAIPage.getLastAIResponse();
        
        const mentionsGardening = gardeningResponse.toLowerCase().includes('garden') ||
                                 gardeningResponse.toLowerCase().includes('plant') ||
                                 gardeningResponse.toLowerCase().includes('grow') ||
                                 gardeningResponse.toLowerCase().includes('flower') ||
                                 gardeningResponse.toLowerCase().includes('nature');
        expect(mentionsGardening).toBeTruthy();
      }
    );

    test(
      "Should discuss yoga practice",
      { tag: ["@ai-chat", "@conversation", "@wellness"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("Do you practice yoga? What's your favorite pose?");
        const yogaResponse = await candyAIPage.getLastAIResponse();
        
        const mentionsYoga = yogaResponse.toLowerCase().includes('yoga') ||
                            yogaResponse.toLowerCase().includes('pose') ||
                            yogaResponse.toLowerCase().includes('meditation') ||
                            yogaResponse.toLowerCase().includes('relax') ||
                            yogaResponse.toLowerCase().includes('stretch');
        expect(mentionsYoga).toBeTruthy();
      }
    );

    test(
      "Should maintain enthusiastic personality",
      { tag: ["@ai-chat", "@personality", "@enthusiasm"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "AI conversation testing");

        await candyAIPage.sendMessage("How are you feeling today?");
        const moodResponse = await candyAIPage.getLastAIResponse();
        
        // Should reflect enthusiastic/optimist personality
        const showsEnthusiasm = moodResponse.toLowerCase().includes('great') ||
                               moodResponse.toLowerCase().includes('wonderful') ||
                               moodResponse.toLowerCase().includes('excited') ||
                               moodResponse.toLowerCase().includes('happy') ||
                               moodResponse.toLowerCase().includes('amazing') ||
                               moodResponse.includes('!');
        expect(showsEnthusiasm).toBeTruthy();
      }
    );
  });

  test.describe("Conversation Flow & Context", () => {
    test(
      "Should remember conversation context across messages",
      { tag: ["@ai-chat", "@context", "@memory"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Context testing requires multiple AI responses");

        // First, establish context
        await candyAIPage.sendMessage("I love reading science fiction novels");
        const firstResponse = await candyAIPage.getLastAIResponse();
        expect(firstResponse).toBeTruthy();

        // Follow up that should reference the previous context
        await candyAIPage.sendMessage("What do you think about that genre?");
        const contextResponse = await candyAIPage.getLastAIResponse();
        
        // Should reference science fiction or show understanding of context
        const showsContext = contextResponse.toLowerCase().includes('science fiction') ||
                             contextResponse.toLowerCase().includes('sci-fi') ||
                             contextResponse.toLowerCase().includes('that genre') ||
                             contextResponse.toLowerCase().includes('those books');
        expect(showsContext).toBeTruthy();
      }
    );

    test(
      "Should handle topic transitions naturally",
      { tag: ["@ai-chat", "@conversation-flow"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Topic transition testing");

        // Start with books
        await candyAIPage.sendMessage("What's your favorite book?");
        await candyAIPage.page.waitForTimeout(2000);

        // Transition to hobbies
        await candyAIPage.sendMessage("Besides reading, what else do you enjoy doing?");
        const transitionResponse = await candyAIPage.getLastAIResponse();
        
        // Should mention other hobbies like gardening, yoga
        const mentionsOtherHobbies = transitionResponse.toLowerCase().includes('garden') ||
                                    transitionResponse.toLowerCase().includes('yoga') ||
                                    transitionResponse.toLowerCase().includes('hobby') ||
                                    transitionResponse.toLowerCase().includes('enjoy');
        expect(mentionsOtherHobbies).toBeTruthy();
      }
    );

    test(
      "Should handle questions about personal details consistently",
      { tag: ["@ai-chat", "@consistency", "@personal-details"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Consistency testing across responses");

        await candyAIPage.sendMessage("How old are you?");
        const ageResponse = await candyAIPage.getLastAIResponse();
        
        // Should mention being 23 or reference age appropriately
        const mentionsAge = ageResponse.includes('23') ||
                           ageResponse.toLowerCase().includes('twenty') ||
                           ageResponse.toLowerCase().includes('young') ||
                           ageResponse.toLowerCase().includes('age');
        expect(mentionsAge).toBeTruthy();

        // Ask about ethnicity/background
        await candyAIPage.sendMessage("Where are you from?");
        const backgroundResponse = await candyAIPage.getLastAIResponse();
        
        // Should reference Venezuelan background or Latino culture
        const mentionsBackground = backgroundResponse.toLowerCase().includes('venezuela') ||
                                  backgroundResponse.toLowerCase().includes('latin') ||
                                  backgroundResponse.toLowerCase().includes('south america') ||
                                  backgroundResponse.toLowerCase().includes('from');
        expect(mentionsBackground).toBeTruthy();
      }
    );
  });

  test.describe("Emotional Intelligence & Engagement", () => {
    test(
      "Should respond empathetically to user emotions",
      { tag: ["@ai-chat", "@emotional-intelligence"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Emotional response testing");

        await candyAIPage.sendMessage("I've been feeling stressed lately");
        const empathyResponse = await candyAIPage.getLastAIResponse();
        
        // Should show understanding and offer support
        const showsEmpathy = empathyResponse.toLowerCase().includes('sorry') ||
                            empathyResponse.toLowerCase().includes('understand') ||
                            empathyResponse.toLowerCase().includes('help') ||
                            empathyResponse.toLowerCase().includes('here') ||
                            empathyResponse.toLowerCase().includes('feel better');
        expect(showsEmpathy).toBeTruthy();
      }
    );

    test(
      "Should engage with user's interests",
      { tag: ["@ai-chat", "@engagement"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Engagement testing");

        await candyAIPage.sendMessage("I just finished a really good mystery novel!");
        const engagementResponse = await candyAIPage.getLastAIResponse();
        
        // Should show interest and ask follow-up questions
        const showsEngagement = engagementResponse.includes('?') ||
                               engagementResponse.toLowerCase().includes('tell me') ||
                               engagementResponse.toLowerCase().includes('which') ||
                               engagementResponse.toLowerCase().includes('what') ||
                               engagementResponse.toLowerCase().includes('how');
        expect(showsEngagement).toBeTruthy();
      }
    );

    test(
      "Should maintain positive and optimistic tone",
      { tag: ["@ai-chat", "@personality", "@positivity"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Tone analysis testing");

        const messages = [
          "How's your day going?",
          "What makes you happy?",
          "Tell me something exciting!"
        ];

        for (const message of messages) {
          await candyAIPage.sendMessage(message);
          const response = await candyAIPage.getLastAIResponse();
          
          // Should contain positive language
          const isPositive = response.toLowerCase().includes('great') ||
                            response.toLowerCase().includes('wonderful') ||
                            response.toLowerCase().includes('love') ||
                            response.toLowerCase().includes('enjoy') ||
                            response.toLowerCase().includes('happy') ||
                            response.toLowerCase().includes('excited') ||
                            response.includes('!');
          expect(isPositive).toBeTruthy();
          
          // Small delay between messages
          await candyAIPage.page.waitForTimeout(1000);
        }
      }
    );
  });

  test.describe("Language & Communication Quality", () => {
    test(
      "Should use proper grammar and spelling",
      { tag: ["@ai-chat", "@language-quality"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Language quality testing");

        await candyAIPage.sendMessage("Tell me about your favorite reading spot");
        const response = await candyAIPage.getLastAIResponse();
        
        // Basic checks for coherent response
        expect(response.length).toBeGreaterThan(10);
        expect(response.trim()).not.toBe("");
        
        // Should start with capital letter
        expect(response.charAt(0)).toMatch(/[A-Z]/);
        
        // Should not contain obvious errors (this is basic, more sophisticated checks could be added)
        expect(response).not.toContain('undefined');
        expect(response).not.toContain('null');
        expect(response).not.toContain('[object');
      }
    );

    test(
      "Should maintain conversational flow with natural responses",
      { tag: ["@ai-chat", "@conversation-flow", "@natural-language"] },
      async ({ candyAIPage, isSlow }) => {
        test.slow(isSlow, "Natural conversation testing");

        // Test with casual greeting
        await candyAIPage.sendMessage("Hey Luna! How's it going?");
        const casualResponse = await candyAIPage.getLastAIResponse();
        
        // Should respond in kind with casual, friendly tone
        const isCasualFriendly = casualResponse.toLowerCase().includes('hey') ||
                                casualResponse.toLowerCase().includes('hi') ||
                                casualResponse.toLowerCase().includes('hello') ||
                                casualResponse.toLowerCase().includes('good') ||
                                casualResponse.toLowerCase().includes('great');
        expect(isCasualFriendly).toBeTruthy();

        // Test with more formal question
        await candyAIPage.sendMessage("Could you please tell me about your professional interests?");
        const formalResponse = await candyAIPage.getLastAIResponse();
        
        // Should adapt to more formal tone while maintaining personality
        expect(formalResponse).toBeTruthy();
        expect(formalResponse.length).toBeGreaterThan(20);
      }
    );
  });
});
