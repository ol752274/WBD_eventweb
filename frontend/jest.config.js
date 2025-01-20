module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  };
  