# `open-turo/action-git-auth`

<!-- prettier-ignore-start -->
<!-- action-docs-description -->
## Description

This [GitHub Action](https://docs.github.com/en/actions) provides a way to configure credentials for any utility that uses the git command, or any utility that uses the git command as a subprocess, or any utility that uses the git configuration file in its authentication and cloning.
<!-- action-docs-description -->
<!-- prettier-ignore-end -->

Authenticates using URL patterns that match https://_server_/_prefix_\*. If no
matching URL exists, the action will not use the authentication credentials
presented via the `github-personal-access-token` input.

See
[here](https://portal2portal.blogspot.com/2021/09/today-i-learned-more-about-git-config.html)
for some additional background on git config as it relates to the problem this
action is solving, and
[here](https://git-scm.com/docs/git-config#Documentation/git-config.txt-urlltbasegtinsteadOf)
for general reference on git config from the official git documentation.

[![Release](https://img.shields.io/github/v/release/open-turo/action-git-auth)](https://github.com/open-turo/action-git-auth/releases/)
[![Tests pass/fail](https://img.shields.io/github/workflow/status/open-turo/action-git-auth/CI)](https://github.com/open-turo/action-git-auth/actions/)
[![License](https://img.shields.io/github/license/open-turo/action-git-auth)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/dwyl/esta/issues)
![CI](https://github.com/open-turo/action-git-auth/actions/workflows/release.yaml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/open-turo/action-git-auth/badge.svg?branch=main)](https://coveralls.io/github/open-turo/action-git-auth?branch=main)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.2-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Join us!](https://img.shields.io/badge/Turo-Join%20us%21-593CFB.svg)](https://turo.com/jobs)

## Usage

### Authenticate using default URL of https:///\*

```yaml
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

### Authenticate using server specific URL of https://githubenterprise.examplecompany.com/*

```yaml
jobs:
    checkout:
        runs-on: ubuntu-latest
        steps:
            - name: Authorize
              uses: open-turo/action-git-auth@v2
              with:
                  server: githubenterprise.examplecompany.com
                  github-personal-access-token:
                      ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

### Authenticate using server and prefix specific URL of https://git.example.com/github-org\*

```yaml
jobs:
    checkout:
        runs-on: ubuntu-latest
        steps:
            - name: Authorize
              uses: open-turo/action-git-auth@v2
              with:
                  server: git.example.com
                  prefix: github-org
                  github-personal-access-token:
                      ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

<!-- prettier-ignore-start -->
<!-- action-docs-inputs -->
## Inputs

| parameter | description | required | default |
| --- | --- | --- | --- |
| github-personal-access-token | A GitHub personal access token that has appropriate access in the consumer GitHub repository that will be used for authentication with GitHub. | `true` |  |
| prefix | The prefix to use for the URL path rewrite. This will often be an organization name if you wish to limit which repositories are accessible. | `false` |  |
| server | The name of the GitHub server to use, if not using hosted. This is useful if you are running this action against a GitHub Enterprise instance. | `false` |  |
<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

<!-- action-docs-outputs -->

<!-- action-docs-runs -->
## Runs

This action is a `node20` action.
<!-- action-docs-runs -->
<!-- prettier-ignore-end -->

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
