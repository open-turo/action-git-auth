import { afterEach, describe, expect, it } from "vitest"

import { gitConfigList, INPUT_TOKEN_ENV_VAR_NAME, runIndex } from "./testutil"

// These need to be sync'd in remove.test.js
const TOKEN = "example-token"
const SERVER = "example.com"

describe("run", () => {
    afterEach(() => {
        delete process.env[INPUT_TOKEN_ENV_VAR_NAME]
        delete process.env["INPUT_SERVER"]
    })

    it("errors with no token", async () => {
        await expect(runIndex()).rejects.toThrow(/^Command failed/)
    })

    it("works when we have a token", () => {
        process.env[INPUT_TOKEN_ENV_VAR_NAME] = TOKEN
        process.env["INPUT_SERVER"] = SERVER
        return runIndex().then((proc) => {
            expect(proc.stderr.toString()).toBe("")
            expect(proc.stdout.toString()).toMatch(
                /::debug::Saving 'git_config_section' state/,
            )
        })
    })

    it("only creates the save state rules we want", async () => {
        // Set up the rules first since we can't depend on test order
        process.env[INPUT_TOKEN_ENV_VAR_NAME] = TOKEN
        process.env["INPUT_SERVER"] = SERVER
        await runIndex()
        const output = await gitConfigList()
        const rule = `^url.https://x-access-token:${TOKEN}@${SERVER}/.instead[oO]f`
        let lines = output.filter((line) =>
            line.match(new RegExp(`${rule}=.*`)),
        )
        expect(lines.length).toEqual(2)
        lines = output.filter((line) =>
            line.match(new RegExp(`${rule}=git@${SERVER}:`)),
        )
        expect(lines.length).toEqual(1)
        lines = output.filter((line) =>
            line.match(new RegExp(`${rule}=https://${SERVER}/`)),
        )
        expect(lines.length).toEqual(1)
    })
})
