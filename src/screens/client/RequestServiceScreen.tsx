import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ServiceCategory, ServiceRequest, RequestStatus } from '../../types';
import { WHATSAPP_NUMBER } from '../../constants';
import { IconChevronRight, IconRobot } from '../../components/icons';

interface RequestServiceScreenProps {
    categories: ServiceCategory[];
    onRequestCreated: (req: ServiceRequest) => Promise<void>;
}

const RequestServiceScreen: React.FC<RequestServiceScreenProps> = ({ categories, onRequestCreated }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [neighborhood, setNeighborhood] = useState('');
    const [description, setDescription] = useState('');
    const [preferredTime, setPreferredTime] = useState('أي وقت');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const times = ["الصباح", "بعد الظهر", "المساء", "أي وقت"];

    useEffect(() => {
        if (location.state?.aiDescription) {
            setDescription(location.state.aiDescription);
        }
    }, [location.state]);


    const openWhatsApp = (phone: string, message: string) => {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
    
    const generateTags = async (problemDescription: string): Promise<string> => {
        try {
            const response = await fetch('/.netlify/functions/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'generateTags',
                    payload: { description: problemDescription }
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from server:', errorData);
                throw new Error('Failed to generate tags');
            }
            const data = await response.json();
            return data.text ? data.text.trim() : "";
        } catch (error) {
            console.error("Error generating tags:", error);
            return ""; 
        }
    };


    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        const catName = selectedCategory?.name ?? "غير محدد";

        const ai_tags = await generateTags(description);

        const newRequest: ServiceRequest = {
            id: Date.now().toString(),
            categoryName: catName,
            neighborhood,
            description,
            preferredTime,
            status: RequestStatus.Pending,
            viewedByArtisans: [],
            ai_tags,
        };
        
        await onRequestCreated(newRequest);

        const msg = `
طلب خدمة جديد من تطبيق حرفي عين صالح:

النوع: ${catName}
الحي: ${neighborhood}
الوقت المفضّل: ${preferredTime}

تفاصيل المشكلة:
${description}
        `.trim();

        openWhatsApp(WHATSAPP_NUMBER, msg);
        setIsSubmitting(false);
        navigate('/requests');
    };

    const handleAiHelp = () => {
        navigate('/ai-chat', { state: { category: selectedCategory?.name, currentDescription: description } });
    };

    const isFormValid = selectedCategory && neighborhood.trim() !== '' && description.trim() !== '';

    return (
        <div className="p-6 h-full flex flex-col bg-brand-background">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-brand-on-surface">طلب خدمة جديدة</h1>
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <IconChevronRight className="w-6 h-6 text-gray-700 transform -rotate-180" />
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
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="description" className="font-semibold text-brand-on-surface text-sm">اشرح المشكلة باختصار</label>
                        <button onClick={handleAiHelp} className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full hover:bg-brand-primary/20 transition-colors">
                            <IconRobot className="w-4 h-4" />
                            <span>مساعدة من AI</span>
                        </button>
                    </div>
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
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-14 text-lg font-bold text-white bg-brand-primary rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all transform active:scale-95 flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                       "إرسال الطلب عبر واتساب"
                    )}
                </button>
            </footer>
        </div>
    );
};

export default RequestServiceScreen;
