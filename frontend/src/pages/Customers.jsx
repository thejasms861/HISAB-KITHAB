import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Phone, MapPin } from 'lucide-react';
import { getCustomers, createCustomer, deleteCustomer } from '../api/customers';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
    const [fieldError, setFieldError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // Validation
        const phoneRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
        if (!phoneRegex.test(newCustomer.phone)) {
            setFieldError("Please enter a valid 10-digit mobile number.");
            return;
        }
        setFieldError('');

        try {
            const created = await createCustomer(newCustomer);
            setCustomers([...customers, created]);
            setIsModalOpen(false);
            setNewCustomer({ name: '', phone: '', address: '' });
            setFieldError('');
        } catch (error) {
            console.error("Failed to create customer", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                setCustomers(customers.filter(c => c.id !== id));
            } catch (error) {
                console.error("Failed to delete customer", error);
            }
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Customers</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
                <input
                    type="text"
                    placeholder="Search customers by name or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white bg-zinc-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6 hover:border-zinc-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white font-bold">
                                    {customer.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{customer.name}</h3>
                                    <p className="text-xs text-zinc-400">Added {new Date(customer.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                className="text-zinc-500 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-zinc-300">
                                <Phone size={16} className="text-zinc-500" />
                                <span className="text-sm">{customer.phone}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-zinc-300">
                                <MapPin size={16} className="text-zinc-500" />
                                <span className="text-sm truncate">{customer.address || "No address"}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between">
                            <button
                                onClick={() => navigate(`/customers/${customer.id}/ledger`)}
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                            >
                                View Ledger
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-10 text-zinc-500">
                    No customers found. Add your first customer!
                </div>
            )}

            {/* Add Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 max-w-md w-full p-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Customer</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white"
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white"
                                    value={newCustomer.phone}
                                    onChange={e => {
                                        setNewCustomer({ ...newCustomer, phone: e.target.value });
                                        if (fieldError) setFieldError('');
                                    }}
                                />
                                {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Address</label>
                                <textarea
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white"
                                    value={newCustomer.address}
                                    onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
