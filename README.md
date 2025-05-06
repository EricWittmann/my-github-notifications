# My GitHub Notifications
A custom web application providing a user interface to the GitHub notifications
system.  Looks and works similarly to the standard GitHub UI, except it allows
you to filter by notification type.

## Prerequisites
1. You must have node.js installed (recommend version 20+)
2. You must have a GitHub personal access token (see below)

### GitHub Personal Access Token
You will first need to create a **GitHub Personal Access Token** by going here:

https://github.com/settings/tokens

You must create a (classic) style token and then export it as an environment
variable before running the application.

## Getting Started
After cloning this repository, simply do this:

```
npm install
export GITHUB_TOKEN="ghp_123451234512345"
npm dev
```

