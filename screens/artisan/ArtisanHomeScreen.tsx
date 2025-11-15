import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceRequest, Artisan } from '../../types';
import ArtisanRequestCard from '../../components/ArtisanRequestCard';
import { IconChevronRight } from '../../constants';
import ArtisanCard from '../../components/ArtisanCard';

interface ArtisanHomeScreenProps {
    requests: ServiceRequest[];
    artisans: (Artisan & { averageRating: number; reviewCount: number })[];
}

const ArtisanHomeScreen: React.FC<ArtisanHomeScreenProps> = ({ requests, artisans }) => {
    const navigate = useNavigate();
    const latestRequests = requests.slice(0, 3);

    return (
        <div className="p-4 space-y-6 pb-24">
            <div className="p-2">
                <h1 className="text-2xl font-bold text-brand-on-surface">مرحبا بك كحرفي 👨‍🔧</h1>
                <p className="mt-1 text-gray-600">
                    هذه هي أحدث الطلبات التي تناسب مهارتك.
                </p>
            </div>

            <div>
                <div className="flex justify-between items-center mb-3 px-2">
                    <h3 className="text-lg font-bold text-brand-on-surface">أحدث الطلبات الواردة</h3>
                    {requests.length > 3 && (
                         <button 
                            onClick={() => navigate('/requests')}
                            className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
                        >
                            <span>عرض الكل</span>
                            <IconChevronRight className="w-4 h-4 transform -rotate-180" />
                        </button>
                    )}
                </div>
                {latestRequests.length > 0 ? (
                    <div className="space-y-3">
                        {latestRequests.map((req) => (
                           <ArtisanRequestCard key={req.id} request={req} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-brand-surface rounded-2xl">
                        <p className="font-semibold text-gray-700">لا توجد طلبات جديدة حالياً.</p>
                        <p className="text-sm text-gray-500 mt-1">سيتم إعلامك عند وصول طلب جديد.</p>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-lg font-bold text-brand-on-surface mb-3 px-2">زملاؤك الحرفيون</h3>
                <div className="space-y-3">
                    {artisans.map((artisan) => (
                        <ArtisanCard key={artisan.id} artisan={artisan} />
                    ))}
                </div>
            </div>

             <p className="mt-6 text-xs text-center text-gray-500 bg-gray-100 p-3 rounded-lg mx-2">
                حالياً، يتم التنسيق عبر واتساب. قريباً سيتم تفعيل خاصية القبول والرفض من داخل التطبيق.
            </p>
        </div>
    );
};

export default ArtisanHomeScreen;