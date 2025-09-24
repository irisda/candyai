# Candy.ai AI Chat Test Suite

Simple automated testing for Candy.ai AI Chat functionality with two focused test cases.

## 📋 Test Cases

### Test Case 1: Chat Messaging
- Validates AI text chat functionality
- Confirms no credit deduction for text messages (FREE)
- Tests AI response quality and character consistency

## 🏗️ Test Architecture

### Files Structure
```
src/
├── pages/
│   ├── base.page.ts                     # Base page class
│   └── candyai.page.ts                  # Page Object Model for Candy.ai
├── tests/
│   ├── candyai.fixture.ts               # Test fixtures and setup
│   └── candyai-core-functionality.spec.ts # Two focused test cases
```

### Key Components

#### `CandyAIPage` - Page Object Model
- Encapsulates all UI interactions and element selectors
- Provides reusable methods for common actions
- Handles character navigation and chat functionality
- Includes verification methods for assertions

#### Test Fixtures
- Provides consistent test setup and teardown
- Configures browser settings optimized for AI chat testing
- Handles slow test scenarios with appropriate timeouts

## 🚀 Running the Tests

### Prerequisites
Make sure you have Playwright installed and configured:
```bash
npm install
npx playwright install
```

### Test Execution Commands

```bash
# Run the chat messaging test
npx playwright test candyai-core-functionality

# Run with specific tags
npx playwright test --grep "@ai-chat"

# Run in headed mode (visible browser)
npx playwright test candyai-core-functionality --headed

# Run with debug mode
npx playwright test candyai-core-functionality --debug
```

## 🎯 Test Scenarios Based on Manual Testing

The automated tests were created based on comprehensive manual testing that revealed:

### ✅ Validated Features
1. **AI Chat Messaging (Test Case 1)**: FREE text chat confirmed - No token deduction for basic conversations
2. **Voice Call Functionality (Test Case 2)**: Voice calls work with accurate 3-token deduction per call
3. **Credit System Accuracy**: All pricing displays match actual deductions exactly  
4. **UI/UX Excellence**: Confirmation modals, real-time feedback, transparent cost display
5. **Character Consistency**: Alexia maintains her tailor persona across interactions

### 📊 Key Manual Test Results
- **Login Authentication**: ✅ Successfully logged in with valid credentials (irisi.damani02@gmail.com)
- **AI Chat Messaging**: ✅ FREE text chat - Alexia responded contextually about business suits (0 tokens deducted)
- **Voice Call Functionality**: ✅ Voice call worked - 16-38 seconds call cost exactly 3 tokens (beta pricing)
- **Credit System**: ✅ Accurate and transparent - 310.8 → 307.8 tokens after voice call
- **UI/UX**: ✅ Confirmation modals prevent accidental charges, clear cost display

## 🔧 Configuration

### Environment Variables
The tests can be configured with environment variables in your `.env` file:
```env
BASE_URL='https://candy.ai'
```

### Playwright Configuration
Tests are configured to run with:
- Slower execution (200ms delay) for reliable AI interactions
- Extended timeout (120s) for AI response processing
- Chromium browser for consistent results
- Retry logic for CI environments

## 📈 Test Reporting

Tests generate comprehensive reports including:
- Pass/fail status for each test scenario
- Execution times and performance metrics
- Screenshots on failures
- Detailed logs of AI interactions

## 🎭 Character-Specific Testing

### Alexia Costa (Primary Test Character)
- **Profile**: 23-year-old American tailor & suit designer
- **Personality**: Confident, observant, flirty
- **Specialty**: Custom suits, professional measurements
- **Test Focus**: Business conversations, voice call interactions

---

*This test suite demonstrates how manual testing insights can be transformed into comprehensive, maintainable automated tests that provide ongoing value for AI chat functionality validation.*
