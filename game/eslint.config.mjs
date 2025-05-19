import js from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import prettier from 'eslint-plugin-prettier/recommended'
import prettierrc from './.prettierrc.json' with { type: 'json' }

export default defineConfig(
  /** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
  [
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      plugins: { js },
      extends: ['js/recommended'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      files: ['**/*.json'],
      plugins: { json },
      language: 'json/jsonc',
      extends: ['json/recommended'],
    },
    {
      files: ['**/*.md'],
      plugins: { markdown },
      language: 'markdown/gfm',
      extends: ['markdown/recommended'],
    },
    tseslint
      .config(tseslint.configs.strictTypeChecked, {
        rules: {
          '@typescript-eslint/consistent-type-imports': [
            'error',
            {
              fixStyle: 'separate-type-imports',
              prefer: 'type-imports',
            },
          ],
          '@typescript-eslint/unified-signatures': 'off',
          '@typescript-eslint/no-unsafe-assignment': 'off',
          '@typescript-eslint/no-non-null-assertion': 'off',
          '@typescript-eslint/no-namespace': 'off',
        },
      })
      .map(conf => ({
        ...conf,
        files: ['**/*.ts'],
      })),
    stylistic.configs.customize({ jsx: false }),
    prettier,
    {
      name: 'Formatting',
      rules: {
        'prettier/prettier': [
          'warn',
          prettierrc,
          {
            usePrettierrc: true,
          },
        ],
      },
    },
    {
      name: 'Overrides',
      rules: {
        '@stylistic/indent': 'off', // Buggy with TypeScript, and Prettier handles it
        '@stylistic/array-element-newline': ['error', 'consistent'],
        '@stylistic/array-bracket-newline': ['error', { multiline: true }],
        '@stylistic/spaced-comment': ['error', 'always', { exceptions: ['='] }],
        '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      },
    },
  ]
)
