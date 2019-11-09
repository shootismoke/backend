const base = require('@amaurymartiny/eslintrc');

module.exports = {
  ...base,
  parserOptions: {
    project: './tsconfig.json'
  }
};
