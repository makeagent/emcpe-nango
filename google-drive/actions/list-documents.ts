import type { NangoAction, ListDocumentsInput, GoogleDriveDocumentList } from '../../models';

/**
 * Lists documents in Google Drive with optional filtering by folder ID and document type.
 * 
 * @param nango - The Nango SDK instance
 * @param input - Optional parameters for filtering documents
 * @returns A list of documents and a nextPageToken if more results are available
 */
export default async function runAction(nango: NangoAction, input: ListDocumentsInput = {}): Promise<GoogleDriveDocumentList> {
  try {
    // Build the query based on input parameters
    let query = "mimeType != 'application/vnd.google-apps.folder'"; // Exclude folders
    
    // If a specific folder ID is provided, filter by that folder
    if (input.folderId) {
      query += ` and '${input.folderId}' in parents`;
    } else {
      query += " and 'root' in parents"; // Default to root folder if no folder ID is specified
    }
    
    // If a specific MIME type is provided, filter by that type
    if (input.mimeType) {
      query += ` and mimeType = '${input.mimeType}'`;
    }
    
    // Set up the API request parameters
    const params: Record<string, string | number> = {
      q: query,
      fields: 'files(id,name,mimeType,webViewLink,modifiedTime,createdTime,parents,size),nextPageToken',
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
      params['orderBy'] = 'modifiedTime desc'; // Default ordering
    }
    
    // Make the API request
    const response = await nango.get({
      endpoint: 'drive/v3/files',
      params,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      throw new Error(`Failed to list documents: Status Code ${response.status}`);
    }
    
    // Format and return the response
    return {
      documents: response.data.files || [],
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error listing Google Drive documents:', error);
    throw error;
  }
}
