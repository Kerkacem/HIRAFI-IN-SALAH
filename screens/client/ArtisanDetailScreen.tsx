import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Artisan, Review } from '../../types';
import { IconArrowLeft, IconPhone, IconStar, IconCheckCircle } from '../../constants';
import ReviewCard from '../../components/ReviewCard';

interface ArtisanDetailScreenProps {
    artisans: (Artisan & { averageRating: number; reviewCount: number })[];
    reviews: Review[];
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'lg' }> = ({ rating, size = 'sm' }) => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <IconStar key={i} className={`${starSize} ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
        </div>
    );
};

const ArtisanDetailScreen: React.FC<ArtisanDetailScreenProps> = ({ artisans, reviews }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const artisan = artisans.find(a => a.id === id);
    const artisanReviews = reviews.filter(r => r.artisanId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!artisan) {
        return (
            <div className="p-6 text-center">
                <p>الحرفي غير موجود.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-brand-primary font-semibold">الرجوع</button>
            </div>
        );
    }
    
    const handleCallClick = () => {
        window.location.href = `tel:${artisan.phone}`;
    };

    return (
        <div className="pb-24">
            <header className="p-4 flex items-center gap-4 bg-brand-surface border-b border-gray-200">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <IconArrowLeft className="w-6 h-6 text-gray-700 transform scale-x-[-1]" />
                </button>
                <h1 className="text-xl font-bold text-brand-on-surface">{artisan.name}</h1>
            </header>

            <div className="p-4">
                 <div className="bg-brand-surface p-4 rounded-2xl shadow-md">
                    <div className="flex justify-between items-start">
                         <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-2xl font-bold">{artisan.name}</h2>
                                {artisan.verified && (
                                    <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        <IconCheckCircle className="w-3 h-3" />
                                        <span>موثوق</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600">{artisan.skill} • {artisan.yearsOfExperience} سنوات خبرة</p>
                            <p className="text-sm text-gray-500 mt-1">الحي: {artisan.neighborhood}</p>
                            {artisan.bio && (
                                <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border">{artisan.bio}</p>
                            )}
                         </div>
                         <button
                            onClick={handleCallClick}
                            className="flex-shrink-0 w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-secondary transition-colors shadow-sm"
                            aria-label={`اتصال بـ ${artisan.name}`}
                        >
                            <IconPhone className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-end gap-3">
                         <StarRating rating={artisan.averageRating} size="lg" />
                         <div className="text-left">
                            <p className="font-bold text-3xl tabular-nums">{artisan.averageRating.toFixed(1)}</p>
                            <p className="text-xs text-gray-500 -mt-1">من {artisan.reviewCount} مراجعة</p>
                         </div>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold mb-3">المراجعات والتقييمات</h3>
                {artisanReviews.length > 0 ? (
                    <div className="space-y-3">
                        {artisanReviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-brand-surface rounded-2xl">
                        <p className="font-semibold text-gray-700">لا توجد مراجعات لهذا الحرفي بعد.</p>
                        <p className="text-sm text-gray-500 mt-1">كن أول من يضيف تقييماً!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtisanDetailScreen;