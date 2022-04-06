module.exports = {
    parser: 'babel-eslint',
    extends: [
        '@ecomfe/eslint-config',
        '@ecomfe/eslint-config/react',
    ],
    'parserOptions': {
        'ecmaVersion': 2020,
    },
    plugins: [
        'react-hooks',
    ],
    rules: {
        'template-curly-spacing': 'off',
        // 'indent': 'off',
        'brace-style': [1, '1tbs'],
        'max-params': 0,
        'comma-dangle': [2, {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
        }],
        'jsx-quotes': ['error', 'prefer-double'],
        'react/jsx-no-bind': 0,
        'react/no-array-index-key': 0,
        'react-hooks/exhaustive-deps': 1,
        'react/jsx-curly-newline': [1],
        'react/jsx-indent': [1, 4, {indentLogicalExpressions: true}],
        'react/jsx-wrap-multilines': [1, {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'parens-new-line',
            logical: 'parens-new-line',
            prop: 'parens-new-line',
        }],
        'react/jsx-uses-react': 2,
    },
};
