import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/accounts/login/', { email, password });
            login(response.data.access, response.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
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
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-brand-muted">
                        Sign in to your digital khata
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-muted mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="shop@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-muted mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10 text-white placeholder-brand-muted focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl shadow-lg shadow-brand-orange/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-brand-muted text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-brand-orange hover:text-brand-orange-hover font-semibold">
                            Create Shop
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
