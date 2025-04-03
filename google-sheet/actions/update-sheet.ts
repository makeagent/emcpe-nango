import type { NangoAction, GoogleSheetUpdateOutput, GoogleSheetUpdateInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GoogleSheetUpdateInput): Promise<GoogleSheetUpdateOutput> {
    const { spreadsheetId, updates } = input;

    // Validate required fields
    if (!spreadsheetId) {
        throw new Error("Spreadsheet ID is required");
    }
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
        throw new Error("At least one update is required");
    }

    // Track overall update statistics
    let totalUpdatedRows = 0;
    let totalUpdatedColumns = 0;
    let totalUpdatedCells = 0;
    const updatedRanges: string[] = [];

    // Process each update
    for (const update of updates) {
        try {
            // First, get sheet information if needed
            let sheetId = update.sheetId;
            const range = update.range;
            
            // If sheetName is provided but not sheetId, we need to get the sheetId
            if (!sheetId && update.sheetName) {
                const sheetsResponse = await nango.proxy({
                    method: 'GET',
                    endpoint: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
                    retries: 3
                });
                
                const sheets = sheetsResponse.data.sheets || [];
                const targetSheet = sheets.find((s: any) => 
                    s.properties.title === update.sheetName
                );
                
                if (!targetSheet) {
                    throw new Error(`Sheet with name '${update.sheetName}' not found`);
                }
                
                sheetId = targetSheet.properties.sheetId;
            }

            // Prepare the data for update
            const rows = update.data.rows.map(row => ({
                values: row.cells.map(cell => ({
                    userEnteredValue: {
                        stringValue: cell.toString()
                    }
                }))
            }));

            // Determine the update method and parameters
            if (range) {
                // Use the values.update method with A1 notation range
                const valuesResponse = await nango.proxy({
                    method: 'PUT',
                    endpoint: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
                    params: {
                        valueInputOption: 'USER_ENTERED'
                    },
                    data: {
                        values: update.data.rows.map(row => row.cells)
                    },
                    retries: 3
                });

                // Update statistics
                updatedRanges.push(valuesResponse.data.updatedRange);
                totalUpdatedRows += valuesResponse.data.updatedRows || 0;
                totalUpdatedColumns += valuesResponse.data.updatedColumns || 0;
                totalUpdatedCells += valuesResponse.data.updatedCells || 0;
            } else {
                // Use the updateCells method with startRow and startColumn
                const startRow = update.startRow || 0;
                const startColumn = update.startColumn || 0;
                
                // We don't need the response data for batchUpdate
                await nango.proxy({
                    method: 'POST',
                    endpoint: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
                    data: {
                        requests: [
                            {
                                updateCells: {
                                    start: {
                                        sheetId: sheetId,
                                        rowIndex: startRow,
                                        columnIndex: startColumn
                                    },
                                    rows: rows,
                                    fields: 'userEnteredValue'
                                }
                            }
                        ]
                    },
                    retries: 3
                });

                // For batchUpdate, we need to calculate the updated range
                const numRows = update.data.rows.length;
                const numCols = update.data.rows.length > 0 ? 
                    Math.max(...update.data.rows.map(row => row.cells.length)) : 0;
                
                // Convert to A1 notation for consistency in response
                const colToA1 = (col: number): string => {
                    let a1 = '';
                    while (col >= 0) {
                        a1 = String.fromCharCode((col % 26) + 65) + a1;
                        col = Math.floor(col / 26) - 1;
                    }
                    return a1;
                };
                
                const sheetName = update.sheetName || `Sheet${sheetId}`;
                const rangeA1 = `${sheetName}!${colToA1(startColumn)}${startRow + 1}:${colToA1(startColumn + numCols - 1)}${startRow + numRows}`;
                
                updatedRanges.push(rangeA1);
                totalUpdatedRows += numRows;
                totalUpdatedColumns += numCols;
                totalUpdatedCells += numRows * numCols;
            }
        } catch (error: any) {
            throw new Error(`Failed to update sheet: ${error.message}`);
        }
    }

    // Return the update results
    return {
        spreadsheetId,
        updatedRange: updatedRanges.join(', '),
        updatedRows: totalUpdatedRows,
        updatedColumns: totalUpdatedColumns,
        updatedCells: totalUpdatedCells
    };
}
