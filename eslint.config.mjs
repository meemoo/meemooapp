import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    // Same scope as the old jshint config: src/ only
    ignores: [
      'build/',
      'libs/',
      'node_modules/',
      'test/',
      'src/nodes/webgl-sphere.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        _: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        Backbone: 'readonly',
        yepnope: 'readonly',
        Iframework: 'writable',
        Mousetrap: 'readonly',
        Parser: 'readonly', // libs/js-expression-eval
        TowTruck: 'readonly',
        muzzley: 'readonly',
      },
    },
    rules: {
      // Allow shims like `var AudioContext = window.AudioContext || ...`
      'no-redeclare': ['error', {builtinGlobals: false}],
      // Pre-existing issues that jshint's defaults didn't flag: surface them
      // as warnings rather than failing `npm test`.
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'no-prototype-builtins': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-assignment': 'warn',
      'preserve-caught-error': 'warn',
    },
  },
  {
    files: ['src/**/*-worker.js'],
    languageOptions: {globals: globals.worker},
  },
  {
    files: ['*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {globals: globals.node},
  },
];
