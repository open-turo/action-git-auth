import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            exclude: ["**/*.test.js", "src/index.js", "src/remove.js"],
            include: ["src/**/*.js"],
            provider: "v8",
            reporter: ["text", "lcov", "html"],
        },
        fileParallelism: false,
        include: ["test/**/*.test.js"],
        sequence: {
            concurrent: false,
        },
    },
})
