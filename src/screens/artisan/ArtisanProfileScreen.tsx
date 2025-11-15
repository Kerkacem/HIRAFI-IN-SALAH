import React from 'react';

const ArtisanProfileScreen: React.FC = () => {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-brand-on-surface">ملفي كحرفي</h1>
            <p className="text-gray-600">
                مستقبلاً تقدر تعدل هنا اسمك، نوع الحرفة، صور أعمالك، والأحياء اللي تخدم فيها.
            </p>
            <p className="text-gray-500 text-sm">
                الآن التسجيل الأولي يتم عبر التواصل مع إدارة التطبيق.
            </p>
        </div>
    );
};

export default ArtisanProfileScreen;
