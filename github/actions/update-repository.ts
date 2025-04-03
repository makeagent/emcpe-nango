import type { NangoAction, GithubRepository, GithubUpdateRepositoryInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubUpdateRepositoryInput): Promise<GithubRepository> {
    try {
        const { owner, repo, name, description, private: isPrivate, has_issues, has_projects, has_wiki, default_branch } = input;

        // Validate required fields
        if (!owner || !repo) {
            throw new Error('Repository owner and name are required');
        }

        // Prepare the request payload with only the fields that are provided
        const payload: Record<string, any> = {};

        // Add optional fields if they exist
        if (name !== undefined) payload['name'] = name;
        if (description !== undefined) payload['description'] = description;
        if (isPrivate !== undefined) payload['private'] = isPrivate;
        if (has_issues !== undefined) payload['has_issues'] = has_issues;
        if (has_projects !== undefined) payload['has_projects'] = has_projects;
        if (has_wiki !== undefined) payload['has_wiki'] = has_wiki;
        if (default_branch !== undefined) payload['default_branch'] = default_branch;

        // Update the repository
        const response = await nango.proxy({
            method: 'PATCH',
            endpoint: `/repos/${owner}/${repo}`,
            data: payload
        });

        const repoData = response.data;

        // Transform the response to match our model
        return {
            id: repoData.id,
            name: repoData.name,
            full_name: repoData.full_name,
            private: repoData.private,
            html_url: repoData.html_url,
            description: repoData.description || '',
            fork: repoData.fork,
            url: repoData.url,
            created_at: repoData.created_at,
            updated_at: repoData.updated_at,
            pushed_at: repoData.pushed_at,
            git_url: repoData.git_url,
            ssh_url: repoData.ssh_url,
            clone_url: repoData.clone_url,
            language: repoData.language || '',
            default_branch: repoData.default_branch,
            open_issues_count: repoData.open_issues_count,
            topics: repoData.topics || [],
            visibility: repoData.visibility || (repoData.private ? 'private' : 'public')
        };
    } catch (error: any) {
        console.error('Error updating repository:', error);
        throw new Error(`Failed to update repository: ${error.message}`);
    }
}
