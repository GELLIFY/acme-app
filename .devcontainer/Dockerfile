FROM mcr.microsoft.com/devcontainers/javascript-node:22

ENV PNPM_HOME=/tmp/pnpm
RUN corepack enable
RUN corepack prepare pnpm@9.15.9 --activate

ENV BUN_INSTALL=/usr/local/bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"
RUN curl -fsSL https://bun.sh/install | bash
