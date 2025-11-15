
import React from 'react';
import { UserRole } from '../types';
import { IconShoppingCart, IconBuild } from '../constants';

interface RoleSelectionScreenProps {
    onRoleSelected: (role: UserRole) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onRoleSelected }) => {
    return (
        <div className="flex flex-col h-screen bg-brand-background p-6 text-center">
            <main className="flex-grow flex flex-col justify-center items-center">
                <div className="bg-brand-primary/10 p-4 rounded-full mb-4">
                    <IconBuild className="w-12 h-12 text-brand-primary" />
                </div>
                <h1 className="text-4xl font-extrabold text-brand-primary">
                    حرفي عين صالح
                </h1>
                <p className="mt-4 max-w-md text-brand-on-surface text-opacity-80">
                    تطبيق بسيط يربط بين أصحاب الحرف والعائلات في عين صالح اللي تحتاج خدمة في الدار.
                </p>
            </main>

            <footer className="flex-shrink-0 pb-4">
                <p className="text-md font-semibold mb-4">
                    اختار كيف تحب تستعمل التطبيق:
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => onRoleSelected(UserRole.CLIENT)}
                        className="w-full h-16 flex items-center justify-center px-4 py-2 text-lg font-bold text-brand-on-primary bg-brand-primary rounded-2xl shadow-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
                    >
                        <IconShoppingCart className="w-6 h-6 me-3" />
                        <span>أنا زبون / عائلة</span>
                    </button>
                    <button
                        onClick={() => onRoleSelected(UserRole.ARTISAN)}
                        className="w-full h-16 flex items-center justify-center px-4 py-2 text-lg font-bold text-brand-primary bg-brand-surface border-2 border-brand-primary rounded-2xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                    >
                        <IconBuild className="w-6 h-6 me-3" />
                        <span>أنا حرفي</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default RoleSelectionScreen;
