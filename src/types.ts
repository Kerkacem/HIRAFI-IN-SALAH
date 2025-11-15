export enum UserRole {
    CLIENT = 'CLIENT',
    ARTISAN = 'ARTISAN',
}

export interface ServiceCategory {
    id: string;
    name: string;
}

export interface Review {
    id: string;
    artisanId: string;
    clientName: string;
    rating: number; // 1-5
    comment: string;
    date: string; // ISO string
}

export interface Artisan {
    id: string;
    name: string;
    skill: string;
    yearsOfExperience: number;
    neighborhood: string;
    phone: string;
    verified?: boolean;
    bio?: string;
}

export enum RequestStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Done = 'Done',
}

export interface ServiceRequest {
    id: string;
    categoryName: string;
    neighborhood: string;
    description: string;
    preferredTime: string;
    status: RequestStatus;
    viewedByArtisans: string[];
    reviewId?: string;
    ai_tags?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
