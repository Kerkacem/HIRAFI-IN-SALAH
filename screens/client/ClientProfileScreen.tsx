
import React from 'react';
import { WHATSAPP_NUMBER, IconWhatsApp } from '../../constants';

const ClientProfileScreen: React.FC = () => {

    const handleWhatsAppContact = () => {
        const message = "سلام، حاب نستفسر أكثر حول خدمة تطبيق حرفي عين صالح.";
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="p-6 flex flex-col h-full">
            <div className="flex-grow">
                <h1 className="text-2xl font-bold text-brand-on-surface">حسابي</h1>
                <p className="mt-3 text-gray-600">
                    هنا مستقبلاً تقدر تشوف بيانات حسابك، تغير اللغة، تشوف نشاطك…
                </p>
            </div>
            <div className="flex-shrink-0">
                <button
                    onClick={handleWhatsAppContact}
                    className="w-full h-14 flex items-center justify-center gap-3 text-lg font-bold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-colors"
                >
                    <IconWhatsApp className="w-6 h-6" />
                    <span>تواصل مع فريق التطبيق</span>
                </button>
            </div>
        </div>
    );
};

export default ClientProfileScreen;
