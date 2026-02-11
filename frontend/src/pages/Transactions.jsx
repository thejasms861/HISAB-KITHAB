import React, { useEffect, useState } from 'react';
import { Plus, Filter, ArrowUpRight, ArrowDownLeft, CheckCircle, Search } from 'lucide-react';
import { getTransactions, createTransaction } from '../api/transactions';
import { getCustomers } from '../api/customers';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCustomer, setFilterCustomer] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newTransaction, setNewTransaction] = useState({
        customer: '',
        amount: '',
        transaction_type: 'udhar',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        const initData = async () => {
            try {
                const [txData, custData] = await Promise.all([
                    getTransactions(),
                    getCustomers()
                ]);
                setTransactions(txData);
                setCustomers(custData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    useEffect(() => {
        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filterCustomer) params.customer = filterCustomer;
                if (filterType) params.transaction_type = filterType;
                if (filterDate) params.date = filterDate;

                const data = await getTransactions(params);
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch filtered transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFiltered();
    }, [filterCustomer, filterType, filterDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newTransaction,
                customer: Number(newTransaction.customer),
                transaction_type: newTransaction.transaction_type
            };
            const created = await createTransaction(payload);
            setTransactions([created, ...transactions]);
            setIsModalOpen(false);
            setNewTransaction({
                customer: '',
                amount: '',
                transaction_type: 'udhar',
                date: new Date().toISOString().split('T')[0],
                note: ''
            });
        } catch (error) {
            console.error("Failed to create transaction", error);
            alert("Failed to create transaction. Please check inputs.");
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center bg-brand-card p-4 rounded-xl border border-brand-border shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-brand-text">Transactions</h1>
                    <p className="text-sm text-brand-text-secondary">Manage all your shop activities</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-500/20"
                >
                    <Plus size={20} />
                    <span className="font-medium">New Entry</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2 text-brand-text-secondary">
                    <Filter size={18} />
                    <span className="font-medium text-sm">Filter:</span>
                </div>
                <select
                    className="bg-brand-dark border-brand-border border rounded-lg focus:ring-brand-orange focus:border-brand-orange py-2 pl-3 pr-10 text-brand-text text-sm"
                    value={filterCustomer}
                    onChange={(e) => setFilterCustomer(e.target.value ? Number(e.target.value) : '')}
                >
                    <option value="">All Customers</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="bg-brand-dark border-brand-border border rounded-lg focus:ring-brand-orange focus:border-brand-orange py-2 pl-3 pr-10 text-brand-text text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="udhar">Udhar given</option>
                    <option value="udhar_vapis">payment received</option>
                    <option value="nagad">cash sale</option>
                </select>

                <input
                    type="date"
                    className="bg-brand-dark border-brand-border border rounded-lg focus:ring-brand-orange focus:border-brand-orange py-2 px-3 text-brand-text text-sm"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Transactions Card List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center p-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div key={tx.id} className="bg-zinc-900 mb-3 p-4 rounded-xl border border-zinc-800 flex items-center justify-between shadow-sm hover:border-zinc-700 transition-colors">
                            <div className="flex items-center space-x-4">
                                {/* Icon Box */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.transaction_type === 'udhar' ? 'bg-red-500/10 text-red-500' :
                                    tx.transaction_type === 'udhar_vapis' ? 'bg-emerald-500/10 text-emerald-500' :
                                        'bg-zinc-800 text-zinc-400'
                                    }`}>
                                    {tx.transaction_type === 'udhar' && <ArrowUpRight size={24} />}
                                    {tx.transaction_type === 'udhar_vapis' && <ArrowDownLeft size={24} />}
                                    {tx.transaction_type === 'nagad' && <CheckCircle size={24} />}
                                </div>

                                {/* Details */}
                                <div>
                                    <h3 className="text-white font-semibold text-base">{tx.customer_name || 'Unknown Customer'}</h3>
                                    <p className="text-zinc-500 text-xs mt-1">{tx.date} • {tx.note || 'No notes'}</p>
                                </div>
                            </div>

                            {/* Amount & Status */}
                            <div className="text-right">
                                <p className={`text-lg font-bold ${tx.transaction_type === 'udhar' ? 'text-red-500' :
                                    tx.transaction_type === 'udhar_vapis' ? 'text-emerald-500' :
                                        'text-zinc-400'
                                    }`}>
                                    {tx.transaction_type === 'udhar_vapis' ? '-' : '+'} ₹{parseFloat(String(tx.amount)).toFixed(2)}
                                </p>
                                <p className="text-brand-text-secondary font-medium text-xs mt-1">
                                    {tx.transaction_type === 'udhar' ? 'Udhar given' :
                                        tx.transaction_type === 'udhar_vapis' ? 'payment received' :
                                            'cash sale'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-brand-card rounded-xl border border-brand-border">
                        <p className="text-brand-text-secondary">No transactions found matching your filters</p>
                    </div>
                )}
            </div>

            {/* New Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-brand-card rounded-2xl shadow-2xl border border-brand-border max-w-md w-full p-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-brand-text mb-6">Record New Entry</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-text-secondary mb-1">Customer</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange text-brand-text outline-none transition-all"
                                    value={newTransaction.customer}
                                    onChange={e => setNewTransaction({ ...newTransaction, customer: e.target.value })}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange text-brand-text outline-none transition-all"
                                        value={newTransaction.transaction_type}
                                        onChange={e => setNewTransaction({ ...newTransaction, transaction_type: e.target.value })}
                                    >
                                        <option value="udhar">Udhar given</option>
                                        <option value="udhar_vapis">payment received</option>
                                        <option value="nagad">cash sale</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-text-secondary">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="w-full pl-8 pr-4 py-3 bg-brand-dark border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange text-brand-text outline-none transition-all"
                                            value={newTransaction.amount}
                                            onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text-secondary mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange text-brand-text outline-none transition-all"
                                    value={newTransaction.date}
                                    onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-text-secondary mb-1">Note (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange text-brand-text outline-none transition-all"
                                    value={newTransaction.note}
                                    onChange={e => setNewTransaction({ ...newTransaction, note: e.target.value })}
                                    rows={2}
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-brand-text-secondary hover:bg-brand-dark rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
