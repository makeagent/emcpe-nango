import type { NangoAction, GithubIssue, GithubCreateIssueInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubCreateIssueInput): Promise<GithubIssue> {
    try {
        const { owner, repo, title, body, assignees, labels } = input;

        // Validate required fields
        if (!owner || !repo || !title) {
            throw new Error('Repository owner, name, and issue title are required');
        }

        // Prepare the request payload
        const payload: Record<string, any> = {
            title
        };

        // Add optional fields if they exist
        if (body !== undefined) payload['body'] = body;
        if (assignees !== undefined) payload['assignees'] = assignees;
        if (labels !== undefined) payload['labels'] = labels;

        // Create the issue
        const response = await nango.proxy({
            method: 'POST',
            endpoint: `/repos/${owner}/${repo}/issues`,
            data: payload
        });

        const issue = response.data;

        // Transform the response to match our model
        return {
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
        };
    } catch (error: any) {
        console.error('Error creating issue:', error);
        throw new Error(`Failed to create issue: ${error.message}`);
    }
}
