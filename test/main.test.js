import { beforeEach, describe, expect, it, vi } from "vitest"

import { getServer, run } from "../src/main.js"

vi.mock("@actions/core", () => ({
    debug: vi.fn(),
    getInput: vi.fn(),
    info: vi.fn(),
    isDebug: vi.fn(),
    saveState: vi.fn(),
    setFailed: vi.fn(),
}))

vi.mock("@actions/exec", () => ({
    exec: vi.fn(),
}))

vi.mock("@actions/github", () => ({
    context: {
        serverUrl: "https://github.com",
    },
}))

import * as core from "@actions/core"
import * as exec from "@actions/exec"

describe("main", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("run", () => {
        it("configures git auth with token", async () => {
            core.getInput.mockImplementation((name) => {
                if (name === "github-token") return "test-token"
                if (name === "server") return "github.com"
                if (name === "prefix") return ""
                return ""
            })
            core.isDebug.mockReturnValue(false)
            exec.exec.mockResolvedValue(0)

            await run()

            expect(core.getInput).toHaveBeenCalledWith("github-token", {
                required: true,
            })
            expect(core.saveState).toHaveBeenCalledWith(
                "git_config_section",
                expect.stringContaining(
                    "url.https://x-access-token:test-token@github.com/",
                ),
            )
            expect(core.info).toHaveBeenCalledWith(
                expect.stringContaining("Rewriting"),
            )
            expect(exec.exec).toHaveBeenCalledTimes(2)
            expect(exec.exec).toHaveBeenCalledWith(
                "git",
                [
                    "config",
                    "--global",
                    "--replace-all",
                    expect.any(String),
                    "https://github.com/",
                ],
                { silent: true },
            )
            expect(exec.exec).toHaveBeenCalledWith(
                "git",
                [
                    "config",
                    "--global",
                    "--add",
                    expect.any(String),
                    "git@github.com:",
                ],
                { silent: true },
            )
        })

        it("strips leading slashes from prefix", async () => {
            core.getInput.mockImplementation((name) => {
                if (name === "github-token") return "test-token"
                if (name === "server") return "github.com"
                if (name === "prefix") return "///org"
                return ""
            })
            core.isDebug.mockReturnValue(false)
            exec.exec.mockResolvedValue(0)

            await run()

            expect(exec.exec).toHaveBeenCalledWith(
                "git",
                [
                    "config",
                    "--global",
                    "--replace-all",
                    expect.any(String),
                    "https://github.com/org",
                ],
                { silent: true },
            )
        })

        it("does not silence git when debug is enabled", async () => {
            core.getInput.mockImplementation((name) => {
                if (name === "github-token") return "test-token"
                if (name === "server") return "github.com"
                if (name === "prefix") return ""
                return ""
            })
            core.isDebug.mockReturnValue(true)
            exec.exec.mockResolvedValue(0)

            await run()

            expect(exec.exec).toHaveBeenCalledWith("git", expect.any(Array), {})
        })
    })

    describe("getServer", () => {
        it("returns server input when provided", () => {
            core.getInput.mockImplementation((name) => {
                if (name === "server") return "custom.server.com"
                return ""
            })

            const result = getServer()

            expect(result).toBe("custom.server.com")
        })

        it("strips trailing slash from server", () => {
            core.getInput.mockImplementation((name) => {
                if (name === "server") return "custom.server.com/"
                return ""
            })

            const result = getServer()

            expect(result).toBe("custom.server.com")
        })

        it("falls back to github context serverUrl", () => {
            core.getInput.mockReturnValue("")

            const result = getServer()

            expect(result).toBe("github.com")
        })

        it("handles missing github context gracefully", async () => {
            // Temporarily override the mock to simulate missing context
            const githubModule = await import("@actions/github")
            const originalContext = githubModule.context
            githubModule.context = undefined

            core.getInput.mockImplementation((name) => {
                if (name === "server") return "fallback.com"
                return ""
            })

            const result = getServer()

            expect(result).toBe("fallback.com")

            // Restore
            githubModule.context = originalContext
        })

        it("handles missing serverUrl in github context", async () => {
            const githubModule = await import("@actions/github")
            const originalContext = githubModule.context
            githubModule.context = {}

            core.getInput.mockImplementation((name) => {
                if (name === "server") return "fallback.com"
                return ""
            })

            const result = getServer()

            expect(result).toBe("fallback.com")

            // Restore
            githubModule.context = originalContext
        })
    })
})
