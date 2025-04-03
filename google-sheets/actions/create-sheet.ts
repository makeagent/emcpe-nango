import type { NangoAction, GoogleSheetCreateOutput, GoogleSheetCreateInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GoogleSheetCreateInput): Promise<GoogleSheetCreateOutput> {
    const { title, sheets = [] } = input;

    // Validate required fields
    if (!title) {
        throw new Error("Spreadsheet title is required");
    }

    // Prepare the request payload
    const spreadsheet: any = {
        properties: {
            title
        }
    };

    // Add sheets if provided
    if (sheets && sheets.length > 0) {
        spreadsheet.sheets = sheets.map((sheet, index) => {
            const sheetData: any = {
                properties: {
                    title: sheet.title || `Sheet${index + 1}`,
                    sheetId: index
                }
            };

            // Add data to the sheet if provided
            if (sheet.data && sheet.data.rows && sheet.data.rows.length > 0) {
                const rows = sheet.data.rows.map(row => ({
                    values: row.cells.map(cell => ({
                        userEnteredValue: {
                            stringValue: cell.toString()
                        }
                    }))
                }));

                sheetData.data = [{
                    rowData: rows,
                    startRow: 0,
                    startColumn: 0
                }];
            }

            return sheetData;
        });
    }

    try {
        // Create the spreadsheet using the Sheets API
        const response = await nango.proxy({
            method: 'POST',
            endpoint: 'https://sheets.googleapis.com/v4/spreadsheets',
            data: spreadsheet,
            retries: 3
        });

        // Return the created spreadsheet details
        return {
            id: response.data.spreadsheetId,
            url: `https://docs.google.com/spreadsheets/d/${response.data.spreadsheetId}`,
            title: response.data.properties.title
        };
    } catch (error: any) {
        // Handle errors
        throw new Error(`Failed to create Google Sheet: ${error.message}`);
    }
}
