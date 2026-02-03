import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        include: ["test/**/*.test.js"],
        fileParallelism: false,
        sequence: {
            concurrent: false,
        },
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            include: ["src/**/*.js"],
            exclude: ["**/*.test.js", "src/index.js", "src/remove.js"],
        },
    },
})
