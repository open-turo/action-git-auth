# `open-turo/action-git-auth`

This [GitHub Action](https://docs.github.com/en/actions) provides a way to
configure credentials for any utility that uses the git command, or any utility
that uses the git command as a subprocess, or any utility that uses the git
configuration file in its authentication and cloning.

[![Coverage Status](https://coveralls.io/repos/github/open-turo/action-git-auth/badge.svg?branch=main)](https://coveralls.io/github/open-turo/action-git-auth?branch=main)

## Usage

```yaml
name: ci
on:
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
```

## Inputs

| parameter                    | description                                                                                                                                    | required | default |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| github-personal-access-token | A GitHub personal access token that has appropriate access in the consumer GitHub repository that will be used for authentication with GitHub. | `true`   |         |
| prefix                       | The prefix to use for the URL path rewrite. This will often be an organization name if you wish to limit which repositories are accessible.    | `false`  |         |
| server                       | The name of the GitHub server to use, if not using hosted. This is useful if you are running this action against a GitHub Enterprise instance. | `false`  |         |

## Runs

This action is an `node12` action.

## Development

This section describes how to develop the project.

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

## Get Help

Please review Issues, post new Issues against this repository as needed.

## Contributions

Please see [here](https://github.com/open-turo/contributions) for guidelines on
how to contribute to this project.
