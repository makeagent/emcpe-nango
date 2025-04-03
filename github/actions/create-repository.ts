import type { NangoAction, GithubRepository, GithubCreateRepositoryInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubCreateRepositoryInput): Promise<GithubRepository> {
    try {
        const { name, description, private: isPrivate, has_issues, has_projects, has_wiki, auto_init, gitignore_template, license_template } = input;

        // Validate required fields
        if (!name) {
            throw new Error('Repository name is required');
        }

        // Prepare the request payload
        const payload: Record<string, any> = {
            name,
            private: isPrivate !== undefined ? isPrivate : false
        };

        // Add optional fields if they exist
        if (description !== undefined) payload['description'] = description;
        if (has_issues !== undefined) payload['has_issues'] = has_issues;
        if (has_projects !== undefined) payload['has_projects'] = has_projects;
        if (has_wiki !== undefined) payload['has_wiki'] = has_wiki;
        if (auto_init !== undefined) payload['auto_init'] = auto_init;
        if (gitignore_template !== undefined) payload['gitignore_template'] = gitignore_template;
        if (license_template !== undefined) payload['license_template'] = license_template;

        // Create the repository
        const response = await nango.proxy({
            method: 'POST',
            endpoint: '/user/repos',
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
        console.error('Error creating repository:', error);
        throw new Error(`Failed to create repository: ${error.message}`);
    }
}
