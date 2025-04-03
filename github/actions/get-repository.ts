import type { NangoAction, GithubRepository, GithubRepositoryInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubRepositoryInput): Promise<GithubRepository> {
    try {
        const { owner, repo } = input;

        // Validate required fields
        if (!owner || !repo) {
            throw new Error('Repository owner and name are required');
        }

        // Fetch the repository
        const response = await nango.proxy({
            method: 'GET',
            endpoint: `/repos/${owner}/${repo}`
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
        console.error('Error fetching repository:', error);
        throw new Error(`Failed to fetch repository: ${error.message}`);
    }
}
