module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn',
    'linebreak-style': 'off',
    'comma-dangle': ['error', 'never'],
    'object-shorthand': ['warn', 'methods'],
    'class-methods-use-this': 'off',
    'dot-notation': 'off',
    'no-underscore-dangle': 'allow'
  }
};
