## Description

Please include a summary of the change and which issue is fixed. Explain the motivation, especially in the context of MCP usage.

Fixes # (issue)

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue, likely related to MCP tool execution/resource fetching)
- [ ] New integration (non-breaking change which adds a new provider)
- [ ] Enhancement (non-breaking change which improves an existing integration for MCP use)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

Describe the tests you ran using your Nango instance to verify your changes. Include:
- Nango `dryrun` commands used (if applicable)
- MCP tool calls or resource access methods used for testing (if applicable)
- Test environment details (Nango version, Node version)

## **IMPORTANT: New Integration Setup Instructions**

**If this PR adds a new provider integration, please provide steps here on how to obtain the necessary API credentials (OAuth Client ID/Secret, API Keys, etc.) from the provider.** Include links to their developer portal and specific setup pages.

```markdown
### [Provider Name] Credential Setup

1. Go to [Provider Developer Portal URL]
2. Navigate to '...'
3. Click 'Create New App' / 'Register Application'
4. Configure the following settings:
   - App Name: ...
   - Redirect URI(s): (Explain how to get this from Nango)
   - Scopes: [List required scopes]
5. Copy the generated Client ID and Client Secret.
```

## Checklist:

- [ ] My code follows the style guidelines (`npm run lint` passes)
- [ ] My code is formatted correctly (`npm run format` applied)
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to the documentation (README.md, etc.)
- [ ] My changes generate no new warnings
- [ ] I have tested my changes against my own Nango instance
- [ ] **If adding a new integration, I have included credential setup instructions above.**
