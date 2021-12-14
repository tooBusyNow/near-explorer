module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js", "jest-date-mock"],
  testRegex: "(\\.|/)test\\.[jt]sx?$",
  transform: {
    "^.+\\.([jt]sx?)$": [
      "babel-jest",
      {
        plugins: ["inline-react-svg"],
        presets: [
          [
            "next/babel",
            {
              "styled-jsx": {
                "babel-test": true,
              },
            },
          ],
        ],
      },
    ],
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverage: false,
};
