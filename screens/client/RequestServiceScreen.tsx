
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCategory, ServiceRequest, RequestStatus } from '../../types';
import { WHATSAPP_NUMBER, IconChevronRight } from '../../constants';

interface RequestServiceScreenProps {
    categories: ServiceCategory[];
    onRequestCreated: (req: ServiceRequest) => void;
}

const RequestServiceScreen: React.FC<RequestServiceScreenProps> = ({ categories, onRequestCreated }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [neighborhood, setNeighborhood] = useState('');
    const [description, setDescription] = useState('');
    const [preferredTime, setPreferredTime] = useState('أي وقت');
    const times = ["الصباح", "بعد الظهر", "المساء", "أي وقت"];

    const openWhatsApp = (phone: string, message: string) => {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleSubmit = () => {
        const catName = selectedCategory?.name ?? "غير محدد";
        const newRequest: ServiceRequest = {
            id: Date.now().toString(),
            categoryName: catName,
            neighborhood,
            description,
            preferredTime,
            status: RequestStatus.Pending,
            viewedByArtisans: [],
        };
        
        onRequestCreated(newRequest);

        const msg = `
طلب خدمة جديد من تطبيق حرفي عين صالح:

النوع: ${catName}
الحي: ${neighborhood}
الوقت المفضّل: ${preferredTime}

تفاصيل المشكلة:
${description}
        `.trim();

        openWhatsApp(WHATSAPP_NUMBER, msg);
        navigate('/requests');
    };

    const isFormValid = selectedCategory && neighborhood.trim() !== '' && description.trim() !== '';

    return (
        <div className="p-6 h-full flex flex-col bg-brand-background">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-brand-on-surface">طلب خدمة جديدة</h1>
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <IconChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </header>
            
            <main className="flex-grow space-y-5 overflow-y-auto pr-2 -mr-2">
                <div>
                    <label className="font-semibold text-brand-on-surface text-sm block mb-2">اختار نوع الخدمة:</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all duration-200 ${
                                    selectedCategory?.id === cat.id
                                        ? 'bg-brand-primary text-white border-brand-primary scale-105'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-brand-primary'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="neighborhood" className="font-semibold text-brand-on-surface text-sm block mb-2">الحي / المنطقة</label>
                    <input
                        id="neighborhood"
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        placeholder="مثال: حي الزاوية"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="font-semibold text-brand-on-surface text-sm block mb-2">اشرح المشكلة باختصار</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        placeholder="مثال: السخان لا يعمل، مقبس كهربائي محروق..."
                    />
                </div>

                <div>
                    <label className="font-semibold text-brand-on-surface text-sm block mb-2">الوقت المفضّل:</label>
                    <div className="flex flex-wrap gap-2">
                        {times.map((t) => (
                            <button
                                key={t}
                                onClick={() => setPreferredTime(t)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all duration-200 ${
                                    preferredTime === t
                                        ? 'bg-brand-primary text-white border-brand-primary scale-105'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-brand-primary'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="mt-6 flex-shrink-0">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="w-full h-14 text-lg font-bold text-white bg-brand-primary rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all transform active:scale-95"
                >
                    إرسال الطلب عبر واتساب
                </button>
            </footer>
        </div>
    );
};

export default RequestServiceScreen;
