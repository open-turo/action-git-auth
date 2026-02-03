import { describe, expect, it } from "vitest"

import * as rules from "../src/rules.js"

const TOKEN = "example-token"
const SERVER = "example.com"

describe("run", () => {
    it("works with just a token", () => {
        const config = rules.make(TOKEN)
        expect(config).toEqual({
            auth_rule: `url.https://x-access-token:${TOKEN}@github.com/.insteadof`,
            auth_url: `https://x-access-token:${TOKEN}@github.com/`,
            https_url: "https://github.com/",
            section: `url.https://x-access-token:${TOKEN}@github.com/`,
            ssh_url: "git@github.com:",
        })
    })

    it("works with token and server", () => {
        const config = rules.make(TOKEN, SERVER)
        expect(config).toEqual({
            auth_rule: `url.https://x-access-token:${TOKEN}@${SERVER}/.insteadof`,
            auth_url: `https://x-access-token:${TOKEN}@${SERVER}/`,
            https_url: `https://${SERVER}/`,
            section: `url.https://x-access-token:${TOKEN}@${SERVER}/`,
            ssh_url: `git@${SERVER}:`,
        })
    })

    it("works with token and server and a prefix", () => {
        const PREFIX = "org"
        const config = rules.make(TOKEN, SERVER, PREFIX)
        expect(config).toEqual({
            auth_rule: `url.https://x-access-token:${TOKEN}@${SERVER}/${PREFIX}.insteadof`,
            auth_url: `https://x-access-token:${TOKEN}@${SERVER}/${PREFIX}`,
            https_url: `https://${SERVER}/${PREFIX}`,
            section: `url.https://x-access-token:${TOKEN}@${SERVER}/${PREFIX}`,
            ssh_url: `git@${SERVER}:${PREFIX}`,
        })
    })
})
