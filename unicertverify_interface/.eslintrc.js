module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'plugin:react/recommended',
     
      'prettier', 
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    ignorePatterns: ['src/sdk'],
    plugins: ['react', '@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-use-before-define': 'off', 
      '@typescript-eslint/no-unused-expressions': ['warn', { allowShortCircuit: true }], 
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', 
      'react/require-default-props': 'off', 
      'react/jsx-props-no-spreading': 'off', 
      'import/no-extraneous-dependencies': 'off', 
      'import/prefer-default-export': 'off',
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      
      'no-console': 'off',
      'no-alert': 'off',
      
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
    },
    settings: {
      'import/resolver': {
       
        typescript: {},
      },
    },
  }
  