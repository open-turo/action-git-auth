import * as core from "@actions/core"
import * as exec from "@actions/exec"

export const INPUT_TOKEN_ENV_VAR_NAME = "INPUT_GITHUB-TOKEN"

// Run the `git config --list` command and return the output as a list of lines
export function gitConfigList() {
    let output = ""
    const options = {
        listeners: {
            stderr: (data) => {
                output += data
            },
            stdout: (data) => {
                output += data
            },
        },
        silent: true,
    }
    return exec
        .exec("git", ["config", "--global", "--list"], options)
        .then(() => {
            output = output.split("\n")
            return output
        })
}

// runIndex executes main action in a subshell. This does modify the underlying
// git config.
export function runIndex() {
    const indexJS = "src/index.js"
    let run = subprocess("node", [indexJS])
    if (process.env.RUNNER_DEBUG) {
        run = run.catch((error) => {
            console.error(error)
            throw error
        })
    }
    return run
}

// runRemove executes the post/remove task in a subshell. This does modify the underlying
// host's git config but there's no other way to test it.
export function runRemove() {
    const removeJS = "src/remove.js"
    let run = subprocess("node", [removeJS])
    if (process.env.RUNNER_DEBUG) {
        run = run.catch((error) => {
            console.error(error)
            throw error
        })
    }
    return run
}

// Consistent subprocess calling with output regardless of error
function subprocess(cmd, arguments_, options) {
    const resolvedOptions = options || { silent: !core.isDebug() }
    const proc = {
        err: undefined,
        exitCode: 0,
        stderr: "",
        stdout: "",
    }

    // Always merge the passed environment on top of the process environment so
    // we don't lose execution context
    resolvedOptions.env = resolvedOptions.env || { ...process.env }

    // This lets us inspect the process output, otherwise an error is thrown and
    // it is lost
    resolvedOptions.ignoreReturnCode =
        resolvedOptions.ignoreReturnCode === undefined
            ? true
            : resolvedOptions.ignoreReturnCode

    return new Promise((resolve, reject) => {
        exec.getExecOutput(cmd, arguments_, resolvedOptions)
            .then((result) => {
                if (result.exitCode > 0) {
                    let error = new Error(`Command failed: ${cmd}`)
                    error.exitCode = result.exitCode
                    error.stdout = result.stdout
                    error.stderr = result.stderr
                    reject(error)
                    return
                }

                proc.exitCode = result.exitCode
                proc.stdout = result.stdout
                proc.stderr = result.stderr
                resolve(proc)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
