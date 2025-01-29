# Workflows and Deployment

## Table of Contents

1. [Overview](#overview)
2. [Workflow Architecture](#workflow-architecture)
3. [Actions and CI/CD Steps](#actions-and-cicd-steps)
4. [Cloud Environments](#cloud-environments)
5. [Code Repository Structure](#code-repository-structure)

---

## Overview

This documentation provides an in-depth explanation of the workflows, deployment strategies, and CI/CD pipeline used in the ACME App project. It leverages **GitHub Actions** for managing infrastructure and application code, and for deploying environments across multiple cloud providers (Vercel, Azure, AWS, and GCP).

The diagram below illustrates the end-to-end process:

![Workflow Diagram](/docs/ops-workflow.png)

---

## Workflow Architecture

The architecture combines **GitOps** and **CloudOps** principles:

- **GitOps** focuses on managing versioned application and infrastructure code in the repository.
- **CloudOps** handles the cloud environments for different stages of development.

### High-Level Workflow:

1. **Code Changes** trigger GitHub Actions workflows.
2. Actions execute formatting, linting, type-checking, and build tasks.
3. Successful changes are deployed to cloud environments.
4. Different branches (feature, develop, main) map to **Preview**, **Staging**, and **Production** environments, respectively.

The diagram below summarizes the complete workflow:

![Workflow Diagram](/docs/ops-full.png)

---

## Actions and CI/CD Steps

GitHub Actions execute the following steps as part of the CI/CD pipeline:

1. **CI**:
   - Ensures code adheres to the project's formatting rules.
   - Static analysis for code quality and catching errors
   - Ensures correctness of TypeScript and other typed files
2. **Deploy Preview**:
   - Creates or update a DB branch
   - Apply migrations and seed the DB
   - Builds, and deploys the project to an ephemeral environment
3. **Deploy Staging**:
   - Creates or update a DB branch
   - Apply migrations and seed the DB
   - Builds, and deploys the project to the environment
4. **Deploy Production**:
   - Apply migrations to the DB
   - Builds and deployes the project to production
5. **Cleanup Preview**:
   - Close DB branch
   - Cleanup resources of the deployment environment

### Branch to Environment Mapping

| Branch      | Environment | Pipeline Trigger  |
| ----------- | ----------- | ----------------- |
| `feature/*` | Preview     | Pull Request      |
| `develop`   | Staging     | Push to `develop` |
| `main`      | Production  | Push to `main`    |

> **Note:** The specific provider is configurable, and the workflow pipeline can target any desired environment.

---

## Cloud Environments

The **CloudOps** section defines three environments for the ACME App:

| Environment    | Trigger Source | Cloud Provider Support  |
| -------------- | -------------- | ----------------------- |
| **Preview**    | Pull Requests  | Vercel, Azure, AWS, GCP |
| **Staging**    | Develop Branch | Vercel, Azure, AWS, GCP |
| **Production** | Main Branch    | Vercel, Azure, AWS, GCP |

### Environment Stages

- **Preview**: Deployments for PRs and short-term branches.
- **Staging**: Integration testing environment for `develop`.
- **Production**: Deployment to `main` for release-ready applications.

### Deployment Options

ACME App supports deployment to the following cloud providers:

1. **Vercel**: Ideal for front-end applications (Next.js).
2. **Azure**: Robust deployments for enterprise applications.
3. **AWS**: Scalable deployments using AWS infrastructure.
4. **GCP**: Google Cloud for custom cloud environments.

Deployment selection depends on pipeline configuration within GitHub Actions.

### Customizable Cloud Provider Pipeline

The cloud provider can be chosen explicitly to trigger the desired CI/CD pipeline:

```yaml
# Example Workflow Snippet
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        if: ${{ inputs.provider == 'aws' }}
        run: |
          aws deploy ...
      - name: Deploy to Azure
        if: ${{ inputs.provider == 'azure' }}
        run: |
          az webapp deploy ...
```

---

## Code Repository Structure

The repository follows a clean structure for code and infrastructure:

```
acme-app/
├── src/                 # Application source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages (Next.js)
│   ├── services/       # API and service integrations
│   └── utils/          # Utility functions
│
├── infra/              # Infrastructure-as-Code (IaC) scripts
│   ├── pulumi/         # Pulumi configurations
│   └── terraform/      # Optional Terraform scripts
│
├── .github/            # GitHub Actions workflows
│   └── workflows/      # CI/CD pipeline definitions
│
├── package.json        # Project dependencies and scripts
└── README.md           # Documentation
```

---

## Conclusion

This documentation outlines the workflows, deployment options, and environment configurations for ACME App. The CI/CD pipeline uses GitHub Actions to deploy seamlessly to multiple cloud providers. For further customization, specific configurations can be adjusted in the repository's `.github/workflows/` directory.
