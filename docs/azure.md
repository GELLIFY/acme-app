# Azure Cloud

![alt text](/docs/image.png)

### Prerequisites

1. ✅ Azure Account with Subscription
2. ✅ Azure Static Web Apps service
3. 😌 That's it!

### Quickstart

- **Production**: Changes to production branches are deployed into the production environment. Your custom domain points to this environment.

- **Pull requests**: Pull requests against your production branch deploy to a temporary environment that disappears after the pull request is closed. The URL for this environment includes the PR number as a suffix. For example, the preview location looks something like `<DEFAULT_HOST_NAME>-1.<LOCATION>.azurestaticapps.net`.

- **Branch**: You can optionally configure your site to deploy every change made to branches that aren't a production branch. This preview deployment is published at a stable URL that includes the branch name. For example, if the branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.
