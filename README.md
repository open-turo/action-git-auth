# open-turo/action-git-auth@v1

[![Coverage Status](https://coveralls.io/repos/github/open-turo/action-git-auth/badge.svg?branch=main)](https://coveralls.io/github/open-turo/action-git-auth?branch=main)

This [GitHub Action](https://docs.github.com/en/actions) provides a way to
configure credentials for any utility that uses the git command, or any utility
that uses the git command as a subprocess, or any utility that uses the git
configuration file in its authentication and cloning.

-   [Usage](#usage)
    -   [Basic](#basic)
    -   [Inputs](#inputs)
-   [Development](#development)
    -   [Contributing](#contributing)
    -   [Testing](#testing)
    -   [Packaging](#packaging)
    -   [Releasing](#releasing)

## Usage

This section describes how to use this GitHub Action.

### Basic

```yaml
name: ci
on:
    push:
    pull_request:

jobs:
    checkout:
        runs-on: ubuntu-latest
        steps:
            - name: Authorize
              uses: open-turo/action-git-auth@v2
              with:
                  github-personal-access-token:
                      ${{ secrets.PERSONAL_ACCESS_TOKEN }}
            - name: Checkout
              uses: actions/checkout@v2
```

### Inputs

The following inputs are available:

-   `github-personal-access-token` (required) - The GitHub access token to use
    for authentication.
-   `prefix` (optional) - The prefix to use for the URL path rewrite. This will
    often be an organization name if you wish to limit which repositories are
    accessible.
-   `server` (optional) - The GitHub server to use. This is useful if you are
    running this action against a GitHub Enterprise instance.

## Development

This section describes how to develop the project.

### Contributing

_TODO: Write this section._

-   Open an issue
-   Create pull request
-   Ensure tests pass
-   Ensure code is rebased onto latest
-   Ensure dist/ is packaged

### Testing

In order to run tests for local development, first run `npm install` to download
dependencies, and then run `npm test` to run the test suite. This library uses
`jest` for its test suite.

### Packaging

In order for GitHub Actions to use this library, it must be packaged into the
`dist/` directory. As part of any pull request which changes the library, this
should be run.

**Run prepare**:

```bash
npm run prepare  # Generate the dist/ files
git add dist/  # Add the dist/ files to the commit
```

### Releasing

Releases are created according to the [Semantic Versioning](https://semver.org/)
process. We also use the
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) messages
to determine what the release version is.

Once a PR has been merged, the repository maintainer is responsible for creating
a new release, as well as moving the floating release tag to the new commit.
