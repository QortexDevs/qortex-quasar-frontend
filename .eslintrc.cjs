module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022 // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
    'standard'
  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue'
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'multiline-ternary': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',

    'vue/require-default-prop': 'off',
    'vue/prop-name-casing': 'off',

    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: false,
      ignores: ['pre', 'textarea'],
      allowEmptyLines: false
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'beside',
      multiline: 'below'
    }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    'vue/html-indent': ['error', 2, {
      alignAttributesVertically: false
    }],
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        // 'OTHER_ATTR',
        ['ATTR_DYNAMIC', 'ATTR_STATIC'], 'ATTR_SHORTHAND_BOOL',
        'EVENTS',
        'CONTENT'
      ],
      alphabetical: true
    }],

    'prefer-promise-reject-errors': 'off',
    'import/order': ['warn', {
      'newlines-between': 'always', // Вертикальный отступ для групп
      pathGroups: [
        {
          pattern: '*.vue',
          patternOptions: { matchBase: true },
          group: 'external',
          position: 'before'
        },
        {
          pattern: '**assets/**',
          group: 'external',
          position: 'before'
        },
        {
          pattern: '**{src,stores,services,boot}/**',
          group: 'parent' // Можно было бы after external, но у нас есть относительные (parent/sibling) импорты, которые лень фиксить ¯\_(ツ)_/¯
        }
      ],
      // Типы, которые исключены из группировки в pathGroups
      // сбрасываем дефолтное ['builtin', 'external'], так как пути с алиасами распознаются как external и не группируются
      pathGroupsExcludedImportTypes: [],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    camelcase: 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
