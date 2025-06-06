import prettierrc from './.prettierrc.json' with { type: 'json' }
import js from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  /** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
  [
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
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      plugins: { js },
      extends: ['js/recommended'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {},
    },

    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    {
      rules: {
        'import-x/no-cycle': 'error',
        'import-x/namespace': 'off',
        'import-x/no-self-import': 'error',
        'import-x/no-useless-path-segments': [
          'error',
          { noUselessIndex: true },
        ],
      },
    },

    tseslint
      .config(tseslint.configs.strictTypeChecked, {
        rules: {
          'prefer-const': 'off',
          'no-unsafe-optional-chaining': 'off',
          '@typescript-eslint/consistent-type-imports': [
            'error',
            {
              fixStyle: 'separate-type-imports',
              prefer: 'type-imports',
            },
          ],
          '@typescript-eslint/no-dynamic-delete': 'off',
          '@typescript-eslint/no-empty-object-type': [
            'error',
            { allowInterfaces: 'always' },
          ],
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/no-invalid-void-type': [
            'error',
            { allowAsThisParameter: true },
          ],
          '@typescript-eslint/no-namespace': 'off',
          '@typescript-eslint/no-non-null-assertion': 'off',
          '@typescript-eslint/no-unsafe-assignment': 'off',
          '@typescript-eslint/no-unused-vars': [
            'error',
            {
              args: 'all',
              argsIgnorePattern: '^_',
              caughtErrors: 'all',
              caughtErrorsIgnorePattern: '^_',
              destructuredArrayIgnorePattern: '^_',
              varsIgnorePattern: '^_',
              ignoreRestSiblings: true,
            },
          ],
          '@typescript-eslint/only-throw-error': 'off',
          '@typescript-eslint/restrict-template-expressions': [
            'error',
            {
              allowBoolean: true,
              allowNumber: true,
            },
          ],
          '@typescript-eslint/unified-signatures': 'off',
        },
      })
      .map(conf => ({
        ...conf,
        files: ['**/*.ts'],
      })),

    stylistic.configs.customize({ jsx: false }),
    {
      rules: {
        '@stylistic/array-bracket-newline': ['error', { multiline: true }],
        '@stylistic/array-element-newline': ['error', 'consistent'],
        '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        '@stylistic/indent': 'off', // Buggy with TypeScript, and Prettier handles it
      },
    },

    prettier,
    {
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
  ]
)
