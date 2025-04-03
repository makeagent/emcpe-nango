---
name: Bug Report (MCP Integration Issue)
about: Report a problem with an integration when used in an MCP context
title: '[BUG] Provider/Action: Brief description'
labels: bug, mcp
assignees: ''
---

## Describe the bug
A clear and concise description of the problem encountered when using this Nango integration within an MCP server. Is it failing during tool execution, resource fetching, or something else?

## To Reproduce
Steps to reproduce the behavior within an MCP context:
1. MCP Server Setup: (Briefly describe relevant MCP server setup if applicable)
2. Nango Connection ID: `[connection-id]`
3. MCP Tool Call / Resource Access: (Provide the `use_mcp_tool` or `access_mcp_resource` call details)
   ```json
   // Example:
   // <use_mcp_tool>
   // <server_name>your-mcp-server</server_name>
   // <tool_name>google-mail/compose-draft</tool_name>
   // <arguments> { ... } </arguments>
   // </use_mcp_tool>
   ```
4. Observed Error/Behavior: (Describe what happened, include error messages from MCP server logs or Nango logs if possible)

## Expected behavior
A clear and concise description of what you expected to happen when calling the tool or accessing the resource.

## Environment
- Nango Version: [e.g., 0.57.6]
- Node.js Version (if running Nango locally): [e.g., 18.x]
- MCP Server Environment (if relevant): [e.g., Local, Deployed]
- Provider: [e.g., google-mail]
- Action/Sync Name: [e.g., compose-draft]

## Additional context
Add any other relevant context, logs, or screenshots here.
