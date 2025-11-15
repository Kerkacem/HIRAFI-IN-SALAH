import React from 'react';
import { Link } from 'react-router-dom';
import { Artisan } from '../types';
import { IconPhone, IconStar, IconCheckCircle } from './icons';

interface ArtisanCardProps {
    artisan: Artisan & { averageRating: number; reviewCount: number };
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <IconStar key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500 font-bold tabular-nums">{rating.toFixed(1)}</span>
        </div>
    );
};


const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan }) => {
    
    const handleCallClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent Link navigation
        e.preventDefault();
        window.location.href = `tel:${artisan.phone}`;
    };

    return (
        <Link to={`/artisans/${artisan.id}`} className="block w-full bg-brand-surface p-4 rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-brand-on-surface text-md">{artisan.name}</h3>
                      {artisan.verified && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              <IconCheckCircle className="w-3 h-3" />
                              <span>موثوق</span>
                          </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                        {artisan.skill} • {artisan.yearsOfExperience} سنوات خبرة
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        الحي: {artisan.neighborhood}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <StarRating rating={artisan.averageRating} />
                        <span className="text-xs text-gray-400">({artisan.reviewCount} مراجعات)</span>
                    </div>
                </div>
                <button
                    onClick={handleCallClick}
                    className="flex-shrink-0 w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-secondary transition-colors shadow-sm"
                    aria-label={`اتصال بـ ${artisan.name}`}
                >
                    <IconPhone className="h-5 w-5" />
                </button>
            </div>
        </Link>
    );
};

export default ArtisanCard;
