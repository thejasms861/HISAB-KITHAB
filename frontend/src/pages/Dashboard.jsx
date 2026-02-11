import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { getDashboardStats, getRecentTransactions } from '../api/dashboard';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('weekly');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, transactionsData] = await Promise.all([
                    getDashboardStats(timeRange),
                    getRecentTransactions()
                ]);
                setStats(statsData);
                setRecentTransactions(transactionsData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const pieData = stats ? [
        { name: 'Credit', value: stats.total_credit },
        { name: 'Debit', value: stats.total_debit },
    ] : [];

    const COLORS = ['#ef4444', '#10b981', '#71717a']; // Red (Udhar given), Green (payment received), Gray (cash sale)

    // Use real chart data from backend or fallback to empty array
    const barData = stats?.chart_data || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-brand-text">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Customers"
                    value={stats?.total_customers || 0}
                    icon={Users}
                    color="bg-brand-orange"
                />
                <StatsCard
                    title="Net Balance"
                    value={`₹${(stats?.total_credit - stats?.total_debit)?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    color="bg-indigo-600"
                />
                <StatsCard
                    title="Total Udhar given"
                    value={`₹${stats?.total_credit?.toLocaleString() || 0}`}
                    icon={TrendingDown}
                    color="bg-red-500"
                />
                <StatsCard
                    title="Total payment received"
                    value={`₹${stats?.total_debit?.toLocaleString() || 0}`}
                    icon={TrendingUp}
                    color="bg-green-600"
                />
            </div>

            {/* Charts & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Cash Flow Chart */}
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Cash Flow Trends</h3>
                        <div className="bg-zinc-950 p-1 rounded-lg flex space-x-1">
                            <button
                                onClick={() => setTimeRange('weekly')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === 'weekly'
                                    ? 'bg-zinc-800 text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setTimeRange('monthly')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === 'monthly'
                                    ? 'bg-zinc-800 text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
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

                {/* Credit vs Debit Pie Chart */}
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Credit vs Debit Distribution</h3>
                    <div className="h-80 flex items-center justify-center">
                        {stats?.total_credit === 0 && stats?.total_debit === 0 ? (
                            <p className="text-gray-400">No data available</p>
                        ) : (
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
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-sm text-gray-600">Udhar given</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm text-zinc-400">payment received</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <button className="text-brand-orange hover:text-brand-orange-hover text-sm font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-950/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold mr-3">
                                                    {tx.customer_name ? tx.customer_name[0] : 'U'}
                                                </div>
                                                <div className="text-sm font-medium text-white">{tx.customer_name || 'Unknown Customer'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.transaction_type === 'udhar'
                                                ? 'bg-red-500/10 text-red-500'
                                                : tx.transaction_type === 'udhar_vapis' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                {tx.transaction_type === 'udhar' ? 'Udhar given' : tx.transaction_type === 'udhar_vapis' ? 'payment received' : 'cash sale'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            <span className={tx.transaction_type === 'udhar' ? 'text-red-500' : tx.transaction_type === 'udhar_vapis' ? 'text-emerald-500' : 'text-zinc-400'}>
                                                ₹{parseFloat(String(tx.amount)).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-brand-text-secondary">Completed</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-brand-text-secondary">No recent transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex items-center space-x-4 hover:border-brand-orange/30 transition-all">
        <div className={`${color} p-4 rounded-xl text-white shadow-lg shadow-black/20`}>
            <Icon size={24} />
        </div>

        <div>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </div >
);

export default Dashboard;
