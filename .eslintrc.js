module.exports = {
  overrides: [
    {
      env: {
        browser: true,
        es2021: true,
        node: true,
      },
      files: ['*.js'],
      extends: ['airbnb-base', 'prettier'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.js', '.prettier.config.js', '.stylelintrc.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
