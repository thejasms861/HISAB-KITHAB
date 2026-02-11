import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        shop_name: '',
        owner_name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        const phoneRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!phoneRegex.test(formData.phone)) {
            errors.phone = "Please enter a valid 10-digit mobile number.";
        }
        if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        try {
            await api.post('/accounts/signup/', formData);
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Handle Field Errors (e.g. { email: ["Invalid"], phone: ["Taken"] })
                const errorData = err.response.data;
                const errorMessages = Object.keys(errorData).map(key => {
                    const msgs = Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key];
                    return `${key.toUpperCase()}: ${msgs}`;
                }).join('\n');
                setError(errorMessages || 'Registration failed. Please check your inputs.');
            } else {
                setError('Network Error. Please check if backend is running.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-brand-card rounded-3xl shadow-2xl p-8 border border-white/5">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center mb-6">
                        <img src="/hk-logo.png" alt="HisabKitab Logo" className="w-20 h-20 object-contain drop-shadow-2xl mb-4" />
                        <h1 className="text-3xl font-bold text-brand-orange">HisabKitab</h1>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-brand-muted bg-clip-text text-transparent">
                        Setup Shop
                    </h2>
                    <p className="mt-2 text-brand-muted">
                        Start your digital ledger journey
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-brand-muted mb-1 uppercase tracking-wider">Shop Name</label>
                                <input
                                    name="shop_name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                    placeholder="My Store"
                                    value={formData.shop_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-brand-muted mb-1 uppercase tracking-wider">Owner Name</label>
                                <input
                                    name="owner_name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                    placeholder="John Doe"
                                    value={formData.owner_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-brand-muted mb-1 uppercase tracking-wider">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="shop@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-brand-muted mb-1 uppercase tracking-wider">Phone</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-brand-muted mb-1 uppercase tracking-wider">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl shadow-lg shadow-brand-orange/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-brand-muted text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-orange hover:text-brand-orange-hover font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
