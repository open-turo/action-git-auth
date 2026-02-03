import * as core from "@actions/core"
import * as exec from "@actions/exec"
import * as github from "@actions/github"

import * as rules from "./rules.js"

// Authenticates by matching a URL of the form https://server/prefix*. If no matching URL is found, the provided
// GitHub personal access token will not be used.

// getServer returns the server domain from the server input or GitHub context
export function getServer() {
    const server = core.getInput("server")
    const serverUrl =
        github.context &&
        github.context.serverUrl &&
        github.context.serverUrl.replace(/^\/\/|^.*?:(\/\/)?/, "")
    return (server || serverUrl).replace(/\/$/, "")
}

// action main method
export async function run() {
    // Grab our inputs
    const server = getServer()
    const token = core.getInput("github-token", { required: true })
    const prefix = core.getInput("prefix").replace(/^\/+/, "")
    const config = rules.make(token, server, prefix)

    // Save the auth rule so we can remove it later
    core.debug("Saving 'git_config_section' state")
    core.saveState("git_config_section", config.section)
    core.info(
        `Rewriting '${config.https_url}' and '${config.ssh_url}' to use token authentication`,
    )

    // Use git itself to update the configuration
    const silent = core.isDebug() ? {} : { silent: true }
    await exec.exec(
        "git",
        [
            "config",
            "--global",
            "--replace-all",
            config.auth_rule,
            config.https_url,
        ],
        silent,
    )
    await exec.exec(
        "git",
        ["config", "--global", "--add", config.auth_rule, config.ssh_url],
        silent,
    )
}
