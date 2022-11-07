module.exports = {
  extends: ['taro/react', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort', 'import'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': ['error', 'disable-absolute-first'],
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
  overrides: [
    // override "simple-import-sort" config
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              [
                // Packages `react` related packages come first.
                '^react',
                '^@?\\w',
                // Internal packages.
                '^(@|components)(/.*|$)',
                // Side effect imports.
                '^\\u0000',
                // Parent imports. Put `..` last.
                '^\\.\\.(?!/?$)',
                '^\\.\\./?$',
                // Other relative imports. Put same-folder imports and `.` last.
                '^\\./(?=.*/)(?!/?$)',
                '^\\.(?!/?$)',
                '^\\./?$',
              ],
              // Style imports.
              ['^.+\\.?(sc|sa|c)ss$'],
            ],
          },
        ],
      },
    },
  ],
};
