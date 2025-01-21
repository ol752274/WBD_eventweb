module.exports = {
  testEnvironment: "jsdom", // Simulates a browser-like environment for React components
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Transforms JavaScript and JSX files using Babel
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"], // Recognized file extensions
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Adds custom matchers for testing DOM elements
  moduleNameMapper: {
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy", // Mocks CSS imports
  },
  moduleDirectories: ["node_modules", "src"], // Allows importing modules directly from 'src' without relative paths
  collectCoverage: true, // Enables code coverage collection
  collectCoverageFrom: ["src/**/*.{js,jsx}"], // Specifies files for which to collect coverage
  coverageReporters: ["text", "lcov"], // Specifies the format of the coverage report
};
