module.exports = {
    root: true,
    extends: ["plugin:@typescript-eslint/recommended"],
    parser: "typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
    },
    env: {
        es6: true,
        node: true,
    },
    rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
    },
};