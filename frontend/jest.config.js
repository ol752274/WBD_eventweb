module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  moduleDirectories: ["node_modules", "src"], 
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"], 
  coverageReporters: ["text", "lcov"], 
};
