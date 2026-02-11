import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboard';
import { Download } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('weekly');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats(timeRange);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [timeRange]);

    const COLORS = ['#ef4444', '#10b981', '#71717a'];
    const pieData = stats ? [
        { name: 'Udhar given', value: stats.total_credit },
        { name: 'payment received', value: stats.total_debit },
    ] : [];

    // Use real chart data from backend
    const barData = stats?.chart_data || [];

    const handleExportCSV = () => {
        if (!stats?.chart_data) return;

        const headers = ['Period', 'Udhar Given', 'Payment Received', 'Cash Sale'];
        const rows = stats.chart_data.map(item => [
            item.name,
            item.credit,
            item.debit,
            item.nagad
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reports_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Monthly Reports</h1>
                <div className="flex space-x-2">

                    <button
                        onClick={handleExportCSV}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Financial Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <p className="text-sm text-green-500 font-medium">Total Received (payment received)</p>
                        <p className="text-2xl font-bold text-green-500">₹{stats?.total_debit.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <p className="text-sm text-red-500 font-medium">Total Given (Udhar given)</p>
                        <p className="text-2xl font-bold text-red-500">₹{stats?.total_credit.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <p className="text-sm text-indigo-400 font-medium">Net Balance</p>
                        <p className={`text-2xl font-bold ${Number(stats?.net_balance) >= 0 ? 'text-indigo-400' : 'text-red-500'}`}>
                            ₹{stats?.net_balance.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Transaction Volume</h3>
                        <div className="bg-zinc-950 p-1 rounded-lg flex space-x-1">
                            <button
                                onClick={() => setTimeRange('weekly')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === 'weekly'
                                    ? 'bg-zinc-800 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setTimeRange('monthly')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === 'monthly'
                                    ? 'bg-zinc-800 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="name" tick={{ fill: '#a1a1aa' }} axisLine={{ stroke: '#27272a' }} />
                                <YAxis tick={{ fill: '#a1a1aa' }} axisLine={{ stroke: '#27272a' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="debit" fill="#10b981" name="payment received" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="credit" fill="#ef4444" name="Udhar given" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="nagad" fill="#3f3f46" name="cash sale" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm text-zinc-400">Udhar given</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm text-zinc-400">payment received</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
