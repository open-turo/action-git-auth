import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        include: ["**/*.test.js"],
        exclude: ["node_modules/**"],
        fileParallelism: false,
        sequence: {
            concurrent: false,
        },
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            exclude: ["node_modules/", "testutil.js", "dist/", "coverage/"],
        },
    },
})
