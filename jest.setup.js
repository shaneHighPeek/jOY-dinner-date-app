// jest.setup.js
// This file runs before each test file

// Mock the Expo winter runtime that causes issues in Jest
jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });

// Mock Expo modules that aren't needed for unit tests
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
  expoConfig: {},
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
