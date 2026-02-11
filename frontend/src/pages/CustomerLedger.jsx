import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ArrowUpRight, ArrowDownLeft, CheckCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getTransactions } from '../api/transactions';
import { getCustomers } from '../api/customers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CustomerLedger = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Fetch customer details (could be optimized with a specific getCustomer endpoint)
                const customers = await getCustomers();
                const foundCustomer = customers.find(c => c.id === Number(id));
                setCustomer(foundCustomer || null);

                // Fetch transactions for this customer
                const txData = await getTransactions({ customer: Number(id) });
                setTransactions(txData);
            } catch (error) {
                console.error("Failed to fetch ledger data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const calculateBalance = () => {
        let balance = 0;
        transactions.forEach(tx => {
            if (tx.transaction_type === 'udhar') {
                balance += Number(tx.amount);
            } else if (tx.transaction_type === 'udhar_vapis') {
                balance -= Number(tx.amount);
            }
            // Strict check: Nagad must NOT affect balance
        });
        return balance;
    };

    const handleWhatsAppReminder = () => {
        if (!customer) return;
        const balance = calculateBalance();
        // Sanitize phone: remove +91, spaces, hyphens to get raw digits
        let phone = customer.phone.replace(/[\s\-\+]/g, '');
        // Ensure it has 91 prefix for wa.me
        if (phone.length === 10) {
            phone = '91' + phone;
        } else if (phone.startsWith('91') && phone.length === 12) {
            // already good
        } else if (phone.startsWith('0')) {
            phone = '91' + phone.substring(1);
        }

        const message = `Hello ${customer.name}, your current pending balance is ₹${Math.abs(balance).toFixed(2)}. Please pay at your earliest convenience.`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleDownloadStatement = () => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(18);
            doc.text("HisabKitab Statement", 14, 22);

            doc.setFontSize(12);
            doc.text(`Customer: ${customer.name}`, 14, 32);
            doc.text(`Phone: ${customer.phone}`, 14, 38);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

            // Table
            const tableColumn = ["Date", "Type", "Note", "Amount"];
            const tableRows = [];

            transactions.forEach(tx => {
                const typeLabel = tx.transaction_type === 'udhar' ? 'Udhar given' :
                    tx.transaction_type === 'udhar_vapis' ? 'Payment received' : 'Cash sale';

                const amountPrefix = tx.transaction_type === 'udhar_vapis' ? '-' : '+';

                const transactionData = [
                    tx.date,
                    typeLabel,
                    tx.note || '-',
                    `${amountPrefix} ${Number(tx.amount).toFixed(2)}`
                ];
                tableRows.push(transactionData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 50,
                theme: 'grid',
                headStyles: { fillColor: [249, 115, 22] }, // Brand orange
                styles: { fontSize: 10 },
            });

            const balance = calculateBalance();
            const finalY = doc.lastAutoTable.finalY || 50;
            doc.setFontSize(12);
            doc.text(`Net Balance: ${balance >= 0 ? 'To Receive' : 'To Pay'} Rs. ${Math.abs(balance).toFixed(2)}`, 14, finalY + 10);

            doc.save(`Statement_${customer.name}.pdf`);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
    if (!customer) return <div className="p-10 text-center">Customer not found</div>;

    const balance = calculateBalance();

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/customers')} className="p-2 hover:bg-brand-card rounded-2xl transition-colors text-brand-text-secondary">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-brand-text">{customer.name}</h1>
                    <p className="text-brand-text-secondary">{customer.phone}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-sm text-brand-text-secondary">Current Balance</p>
                    <p className={`text-xl font-bold ${balance >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {balance >= 0 ? 'To Receive' : 'To Pay'}: ₹{Math.abs(balance).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-lg font-semibold text-brand-text">Transactions</h3>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleWhatsAppReminder}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-2xl transition-colors flex items-center justify-center cursor-pointer"
                            title="Send WhatsApp Reminder"
                        >
                            <FaWhatsapp size={20} />
                        </button>
                        <button
                            onClick={handleDownloadStatement}
                            className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-700 font-medium cursor-pointer">
                            <Download size={18} />
                            <span>Statement</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div key={tx.id} className="bg-zinc-900 mb-3 p-4 rounded-xl border border-zinc-800 flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-4">
                                    {/* Icon Box */}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.transaction_type === 'udhar' ? 'bg-red-500/10 text-red-500' :
                                        tx.transaction_type === 'udhar_vapis' ? 'bg-emerald-500/10 text-emerald-500' :
                                            'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {tx.transaction_type === 'udhar' ? <ArrowUpRight size={24} /> :
                                            tx.transaction_type === 'udhar_vapis' ? <ArrowDownLeft size={24} /> :
                                                <CheckCircle size={20} />}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <p className="text-brand-text font-medium text-base">
                                            {tx.transaction_type === 'udhar' ? 'Udhar Given' :
                                                tx.transaction_type === 'udhar_vapis' ? 'Payment Received' :
                                                    'Cash Sale'}
                                        </p>
                                        <p className="text-brand-text-secondary text-xs">
                                            {tx.date} • {tx.note || 'No description'}
                                        </p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${tx.transaction_type === 'udhar' ? 'text-red-500' :
                                        tx.transaction_type === 'udhar_vapis' ? 'text-emerald-500' :
                                            'text-brand-text-secondary'
                                        }`}>
                                        {tx.transaction_type === 'udhar' ? '+' :
                                            tx.transaction_type === 'udhar_vapis' ? '-' : ''}
                                        ₹{Number(tx.amount).toFixed(2)}
                                    </span>
                                    {tx.transaction_type === 'nagad' && (
                                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mt-1 bg-zinc-800 px-2 py-0.5 rounded-md inline-block">
                                            Paid
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-brand-text-secondary">No transactions found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerLedger;
