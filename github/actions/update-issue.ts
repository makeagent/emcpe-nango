import type { NangoAction, GithubIssue, GithubUpdateIssueInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubUpdateIssueInput): Promise<GithubIssue> {
    try {
        const { owner, repo, issue_number, title, body, state, assignees, labels } = input;

        // Validate required fields
        if (!owner || !repo || !issue_number) {
            throw new Error('Repository owner, name, and issue number are required');
        }

        // Prepare the request payload with only the fields that are provided
        const payload: Record<string, any> = {};

        // Add optional fields if they exist
        if (title !== undefined) payload['title'] = title;
        if (body !== undefined) payload['body'] = body;
        if (state !== undefined) payload['state'] = state;
        if (assignees !== undefined) payload['assignees'] = assignees;
        if (labels !== undefined) payload['labels'] = labels;

        // Update the issue
        const response = await nango.proxy({
            method: 'PATCH',
            endpoint: `/repos/${owner}/${repo}/issues/${issue_number}`,
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
        console.error('Error updating issue:', error);
        throw new Error(`Failed to update issue: ${error.message}`);
    }
}
