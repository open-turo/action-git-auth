import { describe, it, expect } from "vitest"
import * as rules from "./rules.js"

const TOKEN = "example-token"
const SERVER = "example.com"

describe("run", () => {
    it("works with just a token", () => {
        const conf = rules.make(TOKEN)
        expect(conf).toEqual({
            auth_rule: `url.https://x-access-token:${TOKEN}@github.com/.insteadof`,
            auth_url: `https://x-access-token:${TOKEN}@github.com/`,
            https_url: "https://github.com/",
            section: `url.https://x-access-token:${TOKEN}@github.com/`,
            ssh_url: "git@github.com:",
        })
    })

    it("works with token and server", () => {
        const conf = rules.make(TOKEN, SERVER)
        expect(conf).toEqual({
            auth_rule: `url.https://x-access-token:${TOKEN}@${SERVER}/.insteadof`,
            auth_url: `https://x-access-token:${TOKEN}@${SERVER}/`,
            https_url: `https://${SERVER}/`,
            section: `url.https://x-access-token:${TOKEN}@${SERVER}/`,
            ssh_url: `git@${SERVER}:`,
        })
    })

    it("works with token and server and a prefix", () => {
        const PREFIX = "org"
        const conf = rules.make(TOKEN, SERVER, PREFIX)
        expect(conf).toEqual({
            auth_rule: `url.https://x-access-token:${TOKEN}@${SERVER}/${PREFIX}.insteadof`,
            auth_url: `https://x-access-token:${TOKEN}@${SERVER}/${PREFIX}`,
            https_url: `https://${SERVER}/${PREFIX}`,
            section: `url.https://x-access-token:${TOKEN}@${SERVER}/${PREFIX}`,
            ssh_url: `git@${SERVER}:${PREFIX}`,
        })
    })
})
