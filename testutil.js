const path = require("path");

const core = require("@actions/core");
const exec = require("@actions/exec");

exports.INPUT_TOKEN_ENV_VAR_NAME = "INPUT_GITHUB-PERSONAL-ACCESS-TOKEN";

// Run the `git config --list` command and return the output as a list of lines
function gitConfigList() {
  let output = "";
  const options = {
    silent: true,
    listeners: {
      stdout: (data) => {
        output += data;
      },
      stderr: (data) => {
        output += data;
      },
    },
  };
  return exec
    .exec("git", ["config", "--global", "--list"], options)
    .then(() => {
      output = output.split("\n");
      return output;
    });
}
exports.gitConfigList = gitConfigList;

// runRemove executes the post/remove task in a subshell. This does modify the underlying
// host's git config but there's no other way to test it.
function runRemove() {
  const index = path.join(__dirname, "remove.js");
  let run = subprocess("node", [index]);
  if (process.env.RUNNER_DEBUG) {
    run = run.catch((err) => {
      console.error(err);
      throw err;
    });
  }
  return run;
}
exports.runRemove = runRemove;

// runIndex executes main action in a subshell. This does modify the underlying
// git config.
function runIndex() {
  const index = path.join(__dirname, "index.js");
  let run = subprocess("node", [index]);
  if (process.env.RUNNER_DEBUG) {
    run = run.catch((err) => {
      console.error(err);
      throw err;
    });
  }
  return run;
}
exports.runIndex = runIndex;

// Consistent subprocess calling with output regardless of error
function subprocess(cmd, args, opts = { silent: !core.isDebug() }) {
  let proc = {
    stdout: "",
    stderr: "",
    err: null,
    exitCode: 0,
  };

  // Always merge the passed environment on top of the process environment so
  // we don't lose execution context
  opts.env = opts.env || { ...process.env };

  // This lets us inspect the process output, otherwise an error is thrown and
  // it is lost
  opts.ignoreReturnCode =
    opts.ignoreReturnCode != undefined ? opts.ignoreReturnCode : true;

  return new Promise((resolve, reject) => {
    exec
      .getExecOutput(cmd, args, opts)
      .then((result) => {
        if (result.exitCode > 0) {
          let err = new Error(`Command failed: ${cmd}`);
          err.exitCode = result.exitCode;
          err.stdout = result.stdout;
          err.stderr = result.stderr;
          reject(err);
          return;
        }

        proc.exitCode = result.exitCode;
        proc.stdout = result.stdout;
        proc.stderr = result.stderr;
        resolve(proc);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
