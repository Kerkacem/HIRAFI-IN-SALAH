import React from 'react';
import { Artisan } from '../../types';
import ArtisanCard from '../../components/ArtisanCard';

interface ArtisansListScreenProps {
    artisans: (Artisan & { averageRating: number; reviewCount: number })[];
}

const ArtisansListScreen: React.FC<ArtisansListScreenProps> = ({ artisans }) => {
    
    return (
        <div className="p-4 space-y-3 pb-24">
            <h1 className="text-2xl font-bold text-brand-on-surface mb-2">قائمة الحرفيين</h1>
            {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
        </div>
    );
};

export default ArtisansListScreen;
