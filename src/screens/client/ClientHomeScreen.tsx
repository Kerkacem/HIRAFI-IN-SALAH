import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Artisan, ServiceCategory } from '../../types';
import ArtisanCard from '../../components/ArtisanCard';

interface ClientHomeScreenProps {
    categories: ServiceCategory[];
    artisans: (Artisan & { averageRating: number; reviewCount: number })[];
}

const ClientHomeScreen: React.FC<ClientHomeScreenProps> = ({ categories, artisans }) => {
    const navigate = useNavigate();

    const handleRequestServiceClick = () => {
        navigate('/request-service');
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <div className="bg-brand-primary text-brand-on-primary p-5 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold">تحتاج حرفي ثقة في عين صالح؟</h2>
                <p className="mt-2 text-sm opacity-90">
                    ضو خاسر، ماك مقطوع، سخان ولا الكليم… ابعث طلب من هنا ونعاونوك نوصلوك لأقرب حرفي مناسب.
                </p>
                <div className="text-left mt-4">
                    <button
                        onClick={handleRequestServiceClick}
                        className="bg-white text-brand-primary font-bold py-2 px-5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                        طلب خدمة جديدة
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-brand-on-surface mb-3">أكثر الخدمات طلباً</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 4).map((cat) => (
                        <button
                            key={cat.id}
                            onClick={handleRequestServiceClick}
                            className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-300"
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-brand-on-surface mb-3">حرفيون مقترحون</h3>
                <div className="space-y-3">
                    {artisans.slice(0, 5).map((artisan) => (
                        <ArtisanCard key={artisan.id} artisan={artisan} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientHomeScreen;
