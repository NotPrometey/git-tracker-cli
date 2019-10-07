workflow "lint, publish" {
  on = [
    "push"
    "pull_request"
  ]
  resolves = [
    "lint",
    "publish",
  ]
}

action "install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "lint" {
  needs = "install"
  uses = "actions/npm@master"
  args = "run eslint"
}

action "publish" {
  needs = ["lint"]
  uses = "./"
  secrets = [
    "GITHUB_TOKEN",
    "NPM_AUTH_TOKEN",
  ]
}
