import type { NangoAction, LinkedInUserProfile } from '../../models';

export default async function runAction(
  nango: NangoAction,
  _input?: void
): Promise<LinkedInUserProfile> {
  // Fetch user profile via /v2/userinfo
  const response = await nango.get({
    endpoint: 'v2/userinfo',
    baseUrlOverride: 'https://api.linkedin.com',
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch LinkedIn profile: ${response.status}`);
  }

  return response.data;
}
