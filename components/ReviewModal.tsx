
import React, { useState } from 'react';
import { IconStar } from '../constants';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-center mb-2">أضف تقييمك</h2>
                <p className="text-sm text-gray-500 text-center mb-4">
                    كيف كانت تجربتك مع الحرفي؟
                </p>

                <div className="flex justify-center gap-2 my-4">
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                             <IconStar
                                key={starValue}
                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                    starValue <= (hoverRating || rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{ fill: starValue <= (hoverRating || rating) ? 'currentColor' : 'none' }}
                            />
                        );
                    })}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition mt-2"
                    placeholder="أضف تعليقاً (اختياري)"
                />
                
                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className="w-full h-12 text-md font-bold text-white bg-brand-primary rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
                    >
                        إرسال التقييم
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full h-12 text-md font-bold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
