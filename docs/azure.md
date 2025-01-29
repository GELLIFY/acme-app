# Azure Cloud

![alt text](/docs/image.png)

## Prerequisites

1. ✅ Azure Account with Subscription
2. ✅ Azure Static Web Apps
3. ✅ Update Github actions
4. ✅ (optional) Azure App Insights
5. 😌 That's it!

## Overview

The template is configured to offer the following environment workflow, that can be customized on a project base.

- **Production**: Changes to production branches are deployed into the production environment. Your custom domain points to this environment.

- **Pull requests**: Pull requests against your production branch deploy to a temporary environment that disappears after the pull request is closed. The URL for this environment includes the PR number as a suffix. For example, the preview location looks something like `<DEFAULT_HOST_NAME>-1.<LOCATION>.azurestaticapps.net`.

- **Branch**: You can optionally configure your site to deploy every change made to branches that aren't a production branch. This preview deployment is published at a stable URL that includes the branch name. For example, if the branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.

## Quickstart

### Azure Static Web Apps

[Create a static web app](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid#create-a-static-web-app). Follow the official documentation on how to create a static web app from the Azure portal.

1. Go to the Azure portal.
2. Select **Create a Resource**.
3. Search for **Static Web Apps**.
4. Select **Static Web Apps**.
5. Select **Create**.

In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

![Screenshot of the basics section in the Azure portal.](image-1.png)

After you **sign in with GitHub**, enter the repository information.

![Screenshot of repository details in the Azure portal.](image-2.png)

> Note
>
> If you don't see any repositories:
>
> - You may need to authorize Azure Static Web Apps in GitHub. Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**.
> - You may need to authorize Azure Static Web Apps in your Azure DevOps organization. You must be an owner of the organization to grant the permissions. Request third-party application access via OAuth. For more information, see Authorize access to REST APIs with OAuth 2.0.

In the _Build Details_ section, add configuration details specific to your preferred front-end framework.

1. Select Next.js from the Build Presets dropdown.
2. Keep the default value in the App location box.
3. Leave the Api location box empty.
4. Leave the Output location box empty.

Select **Review + create**.

### Update Github Actions

On Github you need to setup some secrets:

- AZURE_TOKEN
- AZURE_CLIENT_ID
- AZURE_TENANT_ID
- AZURE_SUBSCRIPTION_ID

Then you should update `deploy-preview.yml` and `deploy-production.yml` to deploy only on Azure Cloud. By default the template deploys to every supported cloud provider to showcase and test the different approches.

### (Optional) Azure App Insights

#### Create Azure App Insights

TODO

#### Installing packages

As per the official docs, you need to install `@vercel/otel` and `@opentelemetry/api`. To support Azure Monitor Application Insights, you also need to install `@azure/monitor-opentelemetry-exporter`.

Notes:

- The `@azure/monitor-opentelemetry-exporter` is in beta
- The `@vercel/otel` package relies on older versions of `@opentelemetry/api`, so you may need to control the versions by overriding or installing the relied-upon version.

In my case, I run the following command (versions may change later):

```sh
pnpm install @vercel/otel @opentelemetry/api@1.7.0 @azure/monitor-opentelemetry-exporter@next --save-exact
```

#### Instrumentation file

To set up OpenTelemetry in NextJS, you need to create an instrumentation.ts file at the root of your project. Here's how your `instrumentation.ts` file should look like:

```ts
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";
import { registerOTel } from "@vercel/otel";

export async function register() {
  let traceExporter: SpanExporter | undefined;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { AzureMonitorTraceExporter } = await import(
      "@azure/monitor-opentelemetry-exporter"
    );
    traceExporter = new AzureMonitorTraceExporter({
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    });
  }

  registerOTel({ serviceName: "your-project-name", traceExporter });
}
```

In this file, we're calling `registerOTel` which handles the setup of OpenTelemetry for NodeJS and specific elements for NextJS. Setting the traceExporter becomes the next important thing.

Remember to set the correct value for connectionString as copied from the Azure Portal.

While this works, there may be issues when you set it up on your end. When debugging locally it takes about 1-3 minutes to show up on Azure portal. To you `.env` or `.env.*` files add `OTEL_LOG_LEVEL=debug`, restart the app, open a page a couple of times (generates traces), then you will see logs.

#### Conclusion

With this setup, your NextJS application with AppRouter is now ready to export telemetry data to Azure Monitor Application Insights. Run your app and navigate across several pages for telemetry to be sent to Azure. Remember that it can take a few minutes for the data to show up on Azure Portal, usually two minutes.
