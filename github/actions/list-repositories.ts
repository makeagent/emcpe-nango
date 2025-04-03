import type { NangoAction, GithubRepositoryList } from '../../models';

export default async function runAction(nango: NangoAction, _input?: void): Promise<GithubRepositoryList> {
    try {
        // Fetch repositories for the authenticated user
        const response = await nango.proxy({
            method: 'GET',
            endpoint: '/user/repos',
            params: {
                sort: 'updated',  // Sort by last updated
                per_page: 100     // Get up to 100 repositories
            }
        });

        // Transform the response to match our model
        const repositories = response.data.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            html_url: repo.html_url,
            description: repo.description || '',
            fork: repo.fork,
            url: repo.url,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            git_url: repo.git_url,
            ssh_url: repo.ssh_url,
            clone_url: repo.clone_url,
            language: repo.language || '',
            default_branch: repo.default_branch,
            open_issues_count: repo.open_issues_count,
            topics: repo.topics || [],
            visibility: repo.visibility || (repo.private ? 'private' : 'public')
        }));

        return { repositories };
    } catch (error: any) {
        console.error('Error fetching repositories:', error);
        throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
}
