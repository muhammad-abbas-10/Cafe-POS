import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Order from '@/pages/Order';
import Payment from '@/pages/Payment';
import History from '@/pages/History';
import Inventory from '@/pages/Inventory';
import Reports from '@/pages/Reports';
import MenuManagement from '@/pages/MenuManagement';
import StaffShift from '@/pages/StaffShift';
import Settings from '@/pages/Settings';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/order" replace /> : <Login />;
}

const MainApp = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Order />} />
        <Route path="/" element={<Order />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/history" element={<History />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock" element={<Navigate to="/inventory" replace />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/staff" element={<StaffShift />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Navigate to="/order" replace />} />
        <Route path="/checkout" element={<Navigate to="/payment" replace />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <MainApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
