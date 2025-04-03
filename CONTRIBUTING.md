# Contributing to EasyMCPeasy Integrations

Thank you for your interest in contributing! This project provides the Nango integrations that power the EasyMCPeasy service, designed for use within Model Context Protocol (MCP) servers.

## Getting Started

1.  Fork the repository on GitHub.
2.  Clone your fork locally:
    ```bash
    git clone https://github.com/YOUR-USERNAME/EasyMCPeasy.git
    cd EasyMCPeasy
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  **Set up Nango:** **Crucially, you need your own Nango instance or account for development and testing.** Follow the [Nango documentation](https://docs.nango.dev/getting-started/introduction) for setup.
5.  Set up your environment variables:
    ```bash
    cp .env.example .env
    # Edit .env with your Nango secret keys
    ```

## Development Workflow

1.  Create a new branch: `git checkout -b feature/your-feature-name`
2.  **Modify `nango.yaml`:** Define or update the integration configuration.
3.  **Generate Files:** Run `nango generate`. This updates `models.ts` and scaffolds necessary files. Remember, `models.ts` is auto-generated from `nango.yaml`.
4.  **Implement Logic:** Write your TypeScript action/sync code in the appropriate files.
5.  **Test:** Use Nango tools like `nango dryrun` against your Nango instance.
6.  Commit your changes with a descriptive message.
7.  Push your branch to your fork.
8.  Open a pull request.

## Focus Areas

Contributions should primarily focus on:

-   **Adding New Integrations:** Expanding the range of services the MCP server can interact with.
-   **Improving Existing Integrations:** Enhancing reliability, adding features relevant to MCP use cases (e.g., specific data fetching patterns), or fixing bugs related to tool execution/resource fetching.
-   **Bug Fixes:** Addressing issues encountered when using these integrations within an MCP server.

## Submitting Issues

Please use the provided issue templates:

-   **Bug Report:** For reporting problems with existing integrations, especially related to MCP tool execution or resource fetching.
-   **Feature Request:** Primarily for requesting new integrations or significant enhancements to existing ones relevant to MCP.

## Submitting Pull Requests

-   Follow the development workflow above.
-   Use the Pull Request template.
-   **Crucially, if adding a new integration, include clear, step-by-step instructions in the PR description on how another developer can obtain the necessary API credentials (OAuth Client ID/Secret, API Keys, etc.) for the provider.** This often involves linking to the provider's developer portal and outlining the setup process.
-   Ensure your code adheres to the project's style (run `npm run format` and `npm run lint`).
-   Confirm your changes work correctly by testing against your Nango instance.

## Code Style

-   Use TypeScript.
-   Follow existing code patterns.
-   Use Prettier for formatting (`npm run format`).
-   Use ESLint for linting (`npm run lint`).

Thank you for helping make MCP interactions easier via EasyMCPeasy!
