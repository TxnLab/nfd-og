import path from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'

// Import directory polyfill for Node.js versions < 20.11.0
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Traditional config with Next.js and Prettier
  ...compat.config({
    extends: ['next', 'prettier'],
    plugins: ['import-x', '@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    rules: {
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  }),
  // Extra ignores for better performance
  {
    ignores: ['**/node_modules/*', '**/dist/*', '**/coverage/*', '.next/**'],
  },
]

export default eslintConfig
