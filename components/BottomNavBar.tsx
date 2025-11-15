
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconHome, IconList, IconBuild, IconPerson } from '../constants';
import { UserRole } from '../types';

interface BottomNavBarProps {
    role: UserRole;
    badgeCount?: number;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ role, badgeCount = 0 }) => {
    const location = useLocation();

    const navItems = [
        { path: '/home', label: 'الرئيسية', icon: IconHome },
        { path: '/requests', label: role === UserRole.CLIENT ? 'طلباتي' : 'الواردة', icon: IconList },
        ...(role === UserRole.CLIENT ? [{ path: '/artisans', label: 'الحرفيون', icon: IconBuild }] : []),
        { path: '/profile', label: 'حسابي', icon: IconPerson },
    ];


    return (
        <nav className="fixed bottom-0 right-0 left-0 bg-brand-surface border-t border-gray-200 shadow-lg">
            <div className="flex justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 text-center transition-colors duration-200 ${
                                isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
                            }`}
                        >
                            <item.icon className={`h-6 w-6 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
                            <span className="text-xs font-medium">{item.label}</span>
                             {item.path === '/requests' && role === UserRole.ARTISAN && badgeCount > 0 && (
                                <span className="absolute top-1 right-1/2 translate-x-6 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                    {badgeCount}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavBar;
