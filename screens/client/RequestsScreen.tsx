
import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, Review } from '../../types';
import { IconList } from '../../constants';
import ReviewModal from '../../components/ReviewModal';

interface RequestsScreenProps {
    requests: ServiceRequest[];
    onUpdateRequestStatus: (requestId: string, status: RequestStatus) => void;
    onAddReview: (review: Review, requestId: string) => void;
}

const statusTextMap: Record<RequestStatus, string> = {
    [RequestStatus.Pending]: "قيد المعالجة",
    [RequestStatus.InProgress]: "قيد التنفيذ",
    [RequestStatus.Done]: "مكتمل",
};

const statusColorMap: Record<RequestStatus, string> = {
    [RequestStatus.Pending]: "text-brand-primary",
    [RequestStatus.InProgress]: "text-yellow-600",
    [RequestStatus.Done]: "text-green-600",
};

const RequestsScreen: React.FC<RequestsScreenProps> = ({ requests, onUpdateRequestStatus, onAddReview }) => {
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

    const handleOpenReviewModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setReviewModalOpen(true);
    };
    
    const handleReviewSubmit = (rating: number, comment: string) => {
        if (!selectedRequest) return;

        // In a real app, artisanId would be stored on the request.
        // For demo purposes, we'll find a matching artisan.
        // This is a simplification and might not be accurate.
        const artisanId = "1"; // Simplified for demo.

        const newReview: Review = {
            id: `r${Date.now()}`,
            artisanId: artisanId, 
            clientName: "أنا", // In a real app, this would be the logged-in user's name
            rating,
            comment,
            date: new Date().toISOString()
        };
        onAddReview(newReview, selectedRequest.id);
        setReviewModalOpen(false);
        setSelectedRequest(null);
    };

    if (requests.length === 0) {
        return (
            <div className="relative flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-6 overflow-hidden">
                <IconList className="absolute text-gray-200 opacity-50 w-48 h-48 -z-0" />
                <p className="text-gray-700 font-bold text-lg z-10">مازال ما عندك حتى طلب.</p>
                <p className="text-gray-500 text-sm mt-1 z-10">يمكنك البدء من زر "طلب خدمة جديدة" في الشاشة الرئيسية.</p>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 space-y-4 pb-24">
                <h1 className="text-2xl font-bold text-brand-on-surface">طلباتي</h1>
                {requests.slice().reverse().map((req) => (
                    <div key={req.id} className="bg-brand-surface p-4 rounded-xl shadow-md">
                        <h3 className="font-bold text-brand-on-surface">{req.categoryName}</h3>
                        <p className="text-sm text-gray-600 mt-1">الحي: {req.neighborhood}</p>
                        <p className="text-sm text-gray-600">الوقت المفضّل: {req.preferredTime}</p>
                        <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-md">{req.description}</p>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className={`text-xs font-bold ${statusColorMap[req.status]}`}>
                                الحالة: {statusTextMap[req.status]}
                            </span>
                            <div>
                                {req.status !== RequestStatus.Done && (
                                    <button
                                        onClick={() => onUpdateRequestStatus(req.id, RequestStatus.Done)}
                                        className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors"
                                    >
                                        ✓ إشارة كمكتمل
                                    </button>
                                )}
                                {req.status === RequestStatus.Done && !req.reviewId && (
                                     <button
                                        onClick={() => handleOpenReviewModal(req)}
                                        className="text-xs font-semibold bg-brand-primary text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-colors"
                                    >
                                        ⭐ أضف تقييم
                                    </button>
                                )}
                                {req.status === RequestStatus.Done && req.reviewId && (
                                     <span className="text-xs font-semibold text-gray-400">
                                        تم التقييم
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedRequest && (
                 <ReviewModal 
                    isOpen={isReviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    onSubmit={handleReviewSubmit}
                 />
            )}
        </>
    );
};

export default RequestsScreen;
