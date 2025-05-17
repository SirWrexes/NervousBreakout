import js from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

export default defineConfig(
  /** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
  [
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname
        }
      }
    },
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
      plugins: { js },
      extends: ['js/recommended']
    },
    {
      files: ['**/*.json'],
      plugins: { json },
      language: 'json/jsonc',
      extends: ['json/recommended']
    },
    {
      files: ['**/*.md'],
      plugins: { markdown },
      language: 'markdown/gfm',
      extends: ['markdown/recommended']
    },
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,

    {
      rules: {}
    },

    // Keep last to avoid any conflicts
    prettier,
    {
      rules: {
        'prettier/prettier': [
          'off',
          {
            endOfLine: 'auto'
          }
        ]
      }
    }
  ]
)
