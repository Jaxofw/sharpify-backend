import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  [
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      plugins: { js },
      extends: ['js/recommended', importPlugin.flatConfigs.recommended],
    },
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      languageOptions: { globals: globals.browser },
      rules: {
        'no-unused-vars': 'off',
        'import/no-dynamic-require': 'warn',
        'import/no-nodejs-modules': 'warn',
        'import/no-unresolved': 'off',
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            pathGroups: [
              {
                pattern: 'react',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@/**',
                group: 'internal',
                position: 'before',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            'newlines-between': 'always',
          },
        ],
      },
    },
    tseslint.configs.recommended,
  ],
  {
    ignores: ['build/**'],
  },
)
