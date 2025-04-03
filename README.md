# EasyMCPeasy - Nango Integrations

Welcome to EasyMCPeasy! This project provides the underlying [Nango](https://nango.dev) integrations that power the EasyMCPeasy service.

**EasyMCPeasy offers one unified Model Context Protocol (MCP) server endpoint to connect numerous authenticated providers.** Instead of managing multiple MCP servers for different services, you connect your accounts via [easymcpeasy.com](https://easymcpeasy.com) and use a single server URL in your MCP client.

This repository contains the source code for the individual Nango integrations that enable this functionality.

## Getting Started (End Users)

To use the EasyMCPeasy service:

1.  Go to [easymcpeasy.com](https://easymcpeasy.com).
2.  Log in or sign up.
3.  Navigate to the "Server Configuration" tab.
4.  Copy your unique MCP server URL and add it to your MCP client configuration.
5.  Connect the provider accounts you want to use (e.g., Google, Twitter).
6.  You can now use your MCP client to call tools and access resources from your connected providers via the single EasyMCPeasy server endpoint (e.g., `use_mcp_tool` with server name set to your unique URL).

## Getting Started (Developers & Contributors)

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Set up Nango:** You will need your own Nango instance or account to develop and test integrations. Refer to the [Nango documentation](https://docs.nango.dev/getting-started/introduction) for setup instructions.
4.  Copy the `.env.example` file to `.env` and add your Nango secret keys:
    ```bash
    cp .env.example .env
    ```

## Development Workflow

Developing or modifying integrations typically follows this workflow:

1.  **Modify `nango.yaml`:** Define or update the integration's configuration, including provider settings, OAuth scopes, actions, and syncs.
2.  **Generate Files:** Run `nango generate` to scaffold necessary files and update `models.ts` based on your `nango.yaml` configuration. **Note:** `models.ts` is auto-generated and should not be manually edited directly for model definitions derived from `nango.yaml`.
3.  **Implement Logic:** Write the TypeScript code for your actions or syncs in the generated files (usually within the provider-specific directory, e.g., `google-mail/actions/`).
4.  **Test:** Use Nango's testing tool: `nango dryrun [action-name] -e [environment] [connection-id]` with appropriate input parameters. Refer to Nango docs for testing syncs.

## Contributing to EasyMCPeasy Integrations

Contributions to the underlying Nango integrations are welcome! Please see `CONTRIBUTING.md` for detailed guidelines.

Key points for contributors:

-   You unfortunately require have your own Nango setup for testing.
-   Focus issues and PRs on improving integrations for use within an MCP context (tool execution, resource fetching).
-   When adding a new integration, provide clear instructions in your PR on how to obtain the necessary API credentials (OAuth client ID/secret, API keys, etc.).

## Structure

-   `nango.yaml`: Defines all integration configurations.
-   `models.ts`: Auto-generated TypeScript models based on `nango.yaml`.
-   `[provider-name]/`: Directory for each specific integration (e.g., `google-mail/`).
    -   `actions/`: Contains action implementations.
    -   `syncs/`: Contains sync implementations.
    -   `types.ts`: Contains provider-specific types not defined in `nango.yaml`.

## License

[MIT](LICENSE)
