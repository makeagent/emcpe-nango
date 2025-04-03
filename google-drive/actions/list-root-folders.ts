import type { NangoAction, GoogleDriveFolderList } from '../../models';

/**
 * Lists folders at the root level of Google Drive.
 * 
 * @param nango - The Nango SDK instance
 * @param input - Optional parameters for the API request
 * @returns A list of root folders and a nextPageToken if more results are available
 */
export default async function runAction(nango: NangoAction, input: any = {}): Promise<GoogleDriveFolderList> {
  try {
    // Build the query to get only folders at the root level
    const query = "mimeType='application/vnd.google-apps.folder' and 'root' in parents";
    
    // Set up the API request parameters
    const params: Record<string, string | number> = {
      q: query,
      fields: 'files(id,name,mimeType,webViewLink,modifiedTime,createdTime,parents),nextPageToken',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    };
    
    // Add optional parameters if provided
    if (input.pageSize) {
      params['pageSize'] = input.pageSize;
    } else {
      params['pageSize'] = 100; // Default page size
    }
    
    if (input.pageToken) {
      params['pageToken'] = input.pageToken;
    }
    
    if (input.orderBy) {
      params['orderBy'] = input.orderBy;
    } else {
      params['orderBy'] = 'name'; // Default ordering by name
    }
    
    // Make the API request
    const response = await nango.get({
      endpoint: 'drive/v3/files',
      params,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      throw new Error(`Failed to list root folders: Status Code ${response.status}`);
    }
    
    // Format and return the response
    return {
      folders: response.data.files || [],
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error listing Google Drive root folders:', error);
    throw error;
  }
}
