import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import CustomerLedger from './pages/CustomerLedger';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/customers/:id/ledger" element={<CustomerLedger />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/reports" element={<Reports />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
