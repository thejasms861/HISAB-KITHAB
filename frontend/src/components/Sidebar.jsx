import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: FileText, label: 'Reports', path: '/reports' },
    ];

    return (
        <div className="bg-brand-dark text-white w-64 min-h-screen flex flex-col transition-all duration-300 border-r border-brand-border">
            <div className="p-6 border-b border-brand-border flex items-center space-x-3">
                <img src="/hk-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    HisabKitab
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 ${isActive
                                ? 'bg-zinc-800 text-brand-orange border border-zinc-700'
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-brand-border">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-brand-text-secondary p-3 rounded-2xl w-full hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
