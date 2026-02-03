import * as core from "@actions/core"
import * as exec from "@actions/exec"
import * as github from "@actions/github"
import * as rules from "./rules.js"

// Authenticates by matching a URL of the form https://server/prefix*. If no matching URL is found, the provided
// GitHub personal access token will not be used.

// action main method
async function run() {
    // Grab our inputs
    const server = getServer()
    const token = core.getInput("github-token", { required: true })
    const prefix = core.getInput("prefix").replace(/^\/+/, "")
    const conf = rules.make(token, server, prefix)

    // Save the auth rule so we can remove it later
    core.debug("Saving 'git_config_section' state")
    core.saveState("git_config_section", conf.section)
    core.info(
        `Rewriting '${conf.https_url}' and '${conf.ssh_url}' to use token authentication`,
    )

    // Use git itself to update the configuration
    const silent = core.isDebug() ? {} : { silent: true }
    await exec.exec(
        "git",
        ["config", "--global", "--replace-all", conf.auth_rule, conf.https_url],
        silent,
    )
    await exec.exec(
        "git",
        ["config", "--global", "--add", conf.auth_rule, conf.ssh_url],
        silent,
    )
}

// getServer returns the server domain from the server input or GitHub context
function getServer() {
    const server = core.getInput("server")
    const serverUrl =
        github.context &&
        github.context.serverUrl &&
        github.context.serverUrl.replace(/^\/\/|^.*?:(\/\/)?/, "")
    return (server || serverUrl).replace(/\/$/, "")
}

run().catch((error) => core.setFailed(error.message))
