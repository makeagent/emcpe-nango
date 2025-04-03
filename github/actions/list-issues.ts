import type { NangoAction, GithubIssueList, GithubIssuesInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubIssuesInput): Promise<GithubIssueList> {
    try {
        const { owner, repo, state, sort, direction, per_page, page } = input;

        // Validate required fields
        if (!owner || !repo) {
            throw new Error('Repository owner and name are required');
        }

        // Prepare query parameters
        const params: Record<string, any> = {};
        if (state) params['state'] = state;
        if (sort) params['sort'] = sort;
        if (direction) params['direction'] = direction;
        if (per_page) params['per_page'] = per_page;
        if (page) params['page'] = page;

        // Fetch issues for the repository
        const response = await nango.proxy({
            method: 'GET',
            endpoint: `/repos/${owner}/${repo}/issues`,
            params
        });

        // Transform the response to match our model
        const issues = response.data.map((issue: any) => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            state: issue.state,
            locked: issue.locked,
            body: issue.body || '',
            user: {
                id: issue.user.id,
                login: issue.user.login,
                avatar_url: issue.user.avatar_url,
                html_url: issue.user.html_url
            },
            labels: issue.labels.map((label: any) => ({
                id: label.id,
                name: label.name,
                color: label.color,
                description: label.description || ''
            })),
            assignees: issue.assignees.map((assignee: any) => ({
                id: assignee.id,
                login: assignee.login,
                avatar_url: assignee.avatar_url,
                html_url: assignee.html_url
            })),
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            closed_at: issue.closed_at || '',
            comments: issue.comments,
            html_url: issue.html_url
        }));

        return { issues };
    } catch (error: any) {
        console.error('Error fetching issues:', error);
        throw new Error(`Failed to fetch issues: ${error.message}`);
    }
}
