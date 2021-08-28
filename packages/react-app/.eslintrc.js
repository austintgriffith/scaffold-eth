module.exports = {
  env: {
    browser: true,
  },
  // airbnb disabled after upgrade to cra 4 due to errors in our code
  extends: [/*"airbnb"*/ "plugin:prettier/recommended"],
  plugins: [
    /*"babel"*/
  ],
  rules: {
    "prettier/prettier": "warn",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
    "import/prefer-default-export": "off",
    "prefer-destructuring": "off",
    "prefer-template": "off",
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "no-console": "off",
    "jsx-a11y/accessible-emoji": ["off"],
    "jsx-a11y/click-events-have-key-events": ["off"],
    "jsx-a11y/no-static-element-interactions": ["off"],
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": "off",
    "no-plusplus": "off",
  },
};
