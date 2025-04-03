import type { NangoAction, GithubDeleteRepositoryOutput, GithubRepositoryInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GithubRepositoryInput): Promise<GithubDeleteRepositoryOutput> {
    try {
        const { owner, repo } = input;

        // Validate required fields
        if (!owner || !repo) {
            throw new Error('Repository owner and name are required');
        }

        // Delete the repository
        await nango.proxy({
            method: 'DELETE',
            endpoint: `/repos/${owner}/${repo}`
        });

        // GitHub returns 204 No Content on successful deletion
        return {
            success: true,
            message: `Repository ${owner}/${repo} was successfully deleted`
        };
    } catch (error: any) {
        console.error('Error deleting repository:', error);
        return {
            success: false,
            message: `Failed to delete repository: ${error.message}`
        };
    }
}
