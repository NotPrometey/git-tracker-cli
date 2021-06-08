# git-tracker-cli

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NotPrometey/git-tracker-cli/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/git-tracker-cli.svg?style=flat&color=blue)](https://www.npmjs.com/package/git-tracker-cli) 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/NotPrometey/git-tracker-cli/issues)
[![PRs Welcome](https://img.shields.io/badge/git-time_tracker-brightgreen.svg)](https://github.com/NotPrometey/git-tracker-cli/issues)

The library that gives a rough estimation of the time spent on implementation based on the history of commits.

## Install

```bash
$ npm install --global git-tracker-cli
```

## CLI

```bash
$ git-tracker-cli --help

  Usage: git-tracker-cli [OPTION]...

  Mandatory arguments to long options are mandatory for short options too.

   --path=<.>             Current directory by default
   --since=<1.days>       The last day by default
   --author=<author>      Current user by default
   --first-hour=<9>       9 by default

    --help     display this help and exit
    --version  output version information and exit
```

## Example

```bash
$ git-tracker-cli --since=2.days
07/10/2019[git-tracker-cli]:
  an hour             chore<package>: add information
  3 hours             fix<args>: first hour
  a few seconds       chore: version bump
  2 hours             fix<args>: first hour type
  a few seconds       chore: version bump
  6 hours             Total

08/10/2019[git-tracker-cli]:
  29 minutes          fix: .gitignore
  3 hours             feat: add app components
  2 hours             feat: add help libs
  2 minutes           chore: version bump
  8 minutes           fix: code style
  a few seconds       chore: version bump
  2 hours             feat: add loader component
  12 minutes          fix<package>: add files
  a few seconds       chore: version bump
  8 hours             Total
```

## Contributing
   
### Issues

We are using [GitHub Issues](https://github.com/NotPrometey/git-tracker-cli/issues) for our bugs. Before filing a new task, try to make sure your problem doesn’t already exist.

### New feature proposals

We're open to accepting new feature requests for `git-tracker-cli`.
