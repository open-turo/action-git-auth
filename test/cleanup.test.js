import { describe, it, expect, vi, beforeEach } from "vitest"
import { run } from "../src/cleanup.js"

vi.mock("@actions/core", () => ({
    getState: vi.fn(),
    info: vi.fn(),
    isDebug: vi.fn(),
    setFailed: vi.fn(),
}))

vi.mock("@actions/exec", () => ({
    exec: vi.fn(),
}))

import * as core from "@actions/core"
import * as exec from "@actions/exec"

describe("cleanup", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("run", () => {
        it("removes git config section when valid state exists", async () => {
            core.getState.mockReturnValue(
                "url.https://x-access-token:token@github.com/",
            )
            core.isDebug.mockReturnValue(false)
            exec.exec.mockResolvedValue(0)

            await run()

            expect(core.getState).toHaveBeenCalledWith("git_config_section")
            expect(core.info).toHaveBeenCalledWith("Removing URL rewrites")
            expect(exec.exec).toHaveBeenCalledWith(
                "git",
                [
                    "config",
                    "--global",
                    "--remove-section",
                    "url.https://x-access-token:token@github.com/",
                ],
                { silent: true },
            )
        })

        it("fails when state is missing or invalid", async () => {
            core.getState.mockReturnValue("")

            await run()

            expect(core.setFailed).toHaveBeenCalledWith(
                "No git_config_section state found",
            )
            expect(exec.exec).not.toHaveBeenCalled()
        })

        it("fails when state does not start with url.", async () => {
            core.getState.mockReturnValue("invalid-section")

            await run()

            expect(core.setFailed).toHaveBeenCalledWith(
                "No git_config_section state found",
            )
            expect(exec.exec).not.toHaveBeenCalled()
        })

        it("does not silence git when debug is enabled", async () => {
            core.getState.mockReturnValue(
                "url.https://x-access-token:token@github.com/",
            )
            core.isDebug.mockReturnValue(true)
            exec.exec.mockResolvedValue(0)

            await run()

            expect(exec.exec).toHaveBeenCalledWith("git", expect.any(Array), {
                silent: false,
            })
        })
    })
})
