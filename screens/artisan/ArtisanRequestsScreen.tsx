
import React from 'react';
import { ServiceRequest } from '../../types';
import { IconBuild } from '../../constants';
import ArtisanRequestCard from '../../components/ArtisanRequestCard';

interface ArtisanRequestsScreenProps {
    requests: ServiceRequest[];
    onView: () => void;
}

const ArtisanRequestsScreen: React.FC<ArtisanRequestsScreenProps> = ({ requests, onView }) => {
    
    React.useEffect(() => {
        // When the artisan views this screen, mark the requests as read
        onView();
    }, [onView]);
    
    if (requests.length === 0) {
        return (
            <div className="relative flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-6 overflow-hidden">
                <IconBuild className="absolute text-gray-200 opacity-50 w-48 h-48 -z-0" />
                <p className="text-gray-700 font-bold text-lg z-10">لا توجد طلبات جديدة حالياً.</p>
                <p className="text-gray-500 text-sm mt-1 z-10">ستصلك إشعارات هنا عند وجود طلبات تناسب مهارتك.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 pb-24">
            <h1 className="text-2xl font-bold text-brand-on-surface">طلبات واردة</h1>
            {requests.map((req) => (
                <ArtisanRequestCard key={req.id} request={req} />
            ))}
        </div>
    );
};

export default ArtisanRequestsScreen;
