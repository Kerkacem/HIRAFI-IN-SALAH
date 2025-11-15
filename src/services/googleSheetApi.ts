import { APPS_SCRIPT_URL, SHEET_ID } from '../config';
import { Artisan, Review, ServiceRequest, RequestStatus } from '../types';

// Helper to parse CSV data into a JSON array of objects
const parseCSV = <T>(text: string): T[] => {
    // Replace "" with a placeholder, then split by newline
    const lines = text.replace(/""/g, '[Q]').trim().split(/\r\n|\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Handle commas inside quotes
        const entry: any = {};
        headers.forEach((header, i) => {
            let value = values[i]?.trim() || '';

            // Remove surrounding quotes if they exist
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            
            // Restore placeholder quotes
            value = value.replace(/\[Q\]/g, '"');

            // Basic type conversion
            if (!isNaN(Number(value)) && value !== '' && !header.toLowerCase().includes('phone')) {
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
    // Add a cache-busting parameter to prevent aggressive caching
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${new Date().getTime()}`;
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
    if(!APPS_SCRIPT_URL || (APPS_SCRIPT_URL as string).includes("PASTE_YOUR")) {
        const errorMessage = "Google Apps Script URL is not configured in config.ts";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action, payload }),
    });
};


export const addRequest = (request: ServiceRequest) => postToAction('addRequest', request);
export const addReview = (review: Review) => postToAction('addReview', review);

interface UpdateRequestPayload {
    requestId: string;
    status?: RequestStatus;
    reviewId?: string;
}
export const updateRequest = (payload: UpdateRequestPayload) => postToAction('updateRequest', payload);
