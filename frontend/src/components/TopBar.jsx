import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const TopBar = () => {
    const { user } = useAuth();

    return (
        <header className="bg-brand-card border-b border-brand-border h-16 flex items-center justify-between px-6 shadow-sm">
            <h2 className="text-xl font-semibold text-brand-text">
                Welcome back, {user?.shop_name || 'Shop Owner'}
            </h2>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 pl-4 border-l border-brand-border">
                    <div className="w-8 h-8 bg-brand-border rounded-full flex items-center justify-center text-brand-orange">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-brand-text">{user?.owner_name || 'User'}</p>
                        <p className="text-xs text-brand-text-secondary">{user?.shop_name || 'Owner'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
