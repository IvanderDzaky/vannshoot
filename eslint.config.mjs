/* eslint-disable import/no-anonymous-default-export */
import nextConfig from 'eslint-config-next';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['src/components/ui/**/*', 'generated/prisma/*'],
  },
  ...nextConfig,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: true,
          endOfLine: 'auto',
        },
      ],
      indent: ['error', 2, { SwitchCase: 1 }],
    },
  },
  prettierPlugin,
];
