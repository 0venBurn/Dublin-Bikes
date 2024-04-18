/** @type {import('cz-git').UserConfig} */
module.exports = {
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
  },
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      subject: 'Write a short, imperative tense description of the change:\n',
      body: 'Provide a longer description of the change (optional). Use "|" to break new line:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    types: [
      {
        value: 'feat',
        name: 'feat:     Introduces a new feature.',
        emoji: ':sparkles:',
      },
      {
        value: 'fix',
        name: 'fix:      Resolves an identified issue or bug.',
        emoji: ':lady_beetle:',
      },
      {
        value: 'docs',
        name: 'docs:     Updates or adds to the documentation.',
        emoji: ':books:',
      },
      {
        value: 'refactor',
        name: 'refactor: Reorganises or improves existing code without changing its external behavior.',
        emoji: ':hammer:',
      },
      {
        value: 'chore',
        name: 'chore:    Maintenance tasks unrelated to the production code (e.g., setup, config).',
        emoji: ':gear:',
      },
    ],
    useEmoji: false,
    emojiAlign: 'left',
    useAI: false,
    themeColorCode: '38;5;012',
    upperCaseSubject: true,
    allowBreakingChanges: [],
    breaklineNumber: 72,
    breaklineChar: '|',
    confirmColorize: true,
    maxSubjectLength: 50,
    skipQuestions: ['scope', 'breaking', 'footer', 'footerPrefix'],
    markBreakingChangeMode: false,
  },
};
