import { APPS_SCRIPT_URL, SHEET_ID } from '../config';
import { Artisan, Review, ServiceRequest, RequestStatus } from '../types';

// Helper to parse CSV data into a JSON array of objects
const parseCSV = <T>(text: string): T[] => {
    const lines = text.trim().split(/\r\n|\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Handle commas inside quotes
        const entry: any = {};
        headers.forEach((header, i) => {
            const value = values[i]?.replace(/"/g, '').trim() || '';
            // Basic type conversion
            if (!isNaN(Number(value)) && value !== '') {
                entry[header] = Number(value);
            } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                entry[header] = value.toLowerCase() === 'true';
            } else if (header === 'viewedByArtisans' && value) {
                 entry[header] = value.split(',').map(s => s.trim());
            } else if (header === 'viewedByArtisans' && !value) {
                 entry[header] = [];
            }
            else {
                entry[header] = value;
            }
        });
        return entry as T;
    });
};

// Generic fetch function for any sheet
const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${sheetName}`);
    }
    const text = await response.text();
    return parseCSV<T>(text);
};


export const getArtisans = () => fetchSheetData<Artisan>('Artisans');
export const getReviews = () => fetchSheetData<Review>('Reviews');
export const getRequests = () => fetchSheetData<ServiceRequest>('ServiceRequests');

// Generic post function to Google Apps Script
const postToAction = async (action: string, payload: object) => {
    // FIX: Added 'as string' to prevent a TypeScript error when checking against the placeholder URL.
    // This happens because APPS_SCRIPT_URL is a const and its type is inferred as a specific string literal.
    if(!APPS_SCRIPT_URL || (APPS_SCRIPT_URL as string) === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        const errorMessage = "Google Apps Script URL is not configured in config.ts";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Using 'no-cors' is a "fire-and-forget" approach. We send the data but cannot read the response.
    // This is a common pattern for simple Google Apps Script web app integrations from the client-side
    // to avoid CORS complexities. The UI should use optimistic updates.
    await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            // Content-Type is intentionally omitted. For a 'no-cors' request with a string body,
            // the browser will default to 'text/plain', which is what our Apps Script expects.
            // Specifying 'application/json' is not allowed by the 'no-cors' mode.
        },
        body: JSON.stringify({ action, payload }),
    });
    
    // We optimistically assume the request succeeded. Error handling should be managed
    // via monitoring the Google Sheet or Apps Script logs.
};


export const addRequest = (request: ServiceRequest) => postToAction('addRequest', request);
export const addReview = (review: Review) => postToAction('addReview', review);

interface UpdateRequestPayload {
    requestId: string;
    status?: RequestStatus;
    reviewId?: string;
}
export const updateRequest = (payload: UpdateRequestPayload) => postToAction('updateRequest', payload);