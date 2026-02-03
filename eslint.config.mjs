import openTuroTypescriptConfig from "@open-turo/eslint-config-typescript"

const config = openTuroTypescriptConfig({
    ignores: [
        "dist",
        "lib",
        "reports",
        "jest.config.ts",
        "coverage",
        "vitest.config.js",
    ],
    testFramework: "vitest",
    typescript: false,
})

// eslint-disable-next-line import/no-default-export
export default [
    ...config,
    {
        files: ["test/**/*.js", "*.config.mjs"],
        rules: {
            "n/no-unpublished-import": "off",
        },
    },
]
