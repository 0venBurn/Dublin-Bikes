module.exports = {
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: '*.html',
      options: {
        tabWidth: 4,
      },
    },
    {
      files: '*.js',
      options: {
        printWidth: 100,
        singleQuote: true,
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        proseWrap: 'never',
        tabWidth: 4,
      },
    },
  ],
};
