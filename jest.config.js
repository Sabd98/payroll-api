module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/", "/migrations/", "/seeders/"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  globalSetup: "./tests/globalSetup.js",
  globalTeardown: "./tests/globalTeardown.js",
};
