import React from 'react';
import { Review } from '../types';
import { IconStar } from './icons';

interface ReviewCardProps {
    review: Review;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <IconStar key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
        </div>
    );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="bg-brand-surface p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                        {review.clientName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-sm">{review.clientName}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
        </div>
    );
};

export default ReviewCard;
