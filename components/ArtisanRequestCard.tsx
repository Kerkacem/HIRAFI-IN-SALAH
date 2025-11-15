
import React from 'react';
import { ServiceRequest } from '../types';

interface ArtisanRequestCardProps {
    request: ServiceRequest;
}

const ArtisanRequestCard: React.FC<ArtisanRequestCardProps> = ({ request }) => {
    // In a real app, these would trigger API calls or state updates
    const handleAccept = () => console.log("Accepted request:", request.id);
    const handleReject = () => console.log("Rejected request:", request.id);

    return (
        <div className="bg-brand-surface p-4 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-brand-on-surface">{request.categoryName}</h3>
                <span className="text-xs text-gray-400">
                    {new Date(parseInt(request.id)).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600"><strong>الحي:</strong> {request.neighborhood}</p>
                <p className="text-sm text-gray-600"><strong>الوقت المفضّل:</strong> {request.preferredTime}</p>
            </div>
            <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                {request.description}
            </p>
            <div className="mt-4 flex gap-3">
                <button
                    onClick={handleAccept}
                    className="flex-1 bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-secondary transition-colors transform active:scale-95"
                >
                    قبول
                </button>
                <button
                    onClick={handleReject}
                    className="flex-1 bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors transform active:scale-95"
                >
                    رفض
                </button>
            </div>
        </div>
    );
};

export default ArtisanRequestCard;
