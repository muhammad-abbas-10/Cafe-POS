import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Order from '@/pages/Order';
import Payment from '@/pages/Payment';
import Kitchen from '@/pages/Kitchen';
import History from '@/pages/History';
import Inventory from '@/pages/Inventory';
import Reports from '@/pages/Reports';
import MenuManagement from '@/pages/MenuManagement';
import StaffShift from '@/pages/StaffShift';
import Promotions from '@/pages/Promotions';
import Settings from '@/pages/Settings';

const MainApp = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Order />} />
        <Route path="/" element={<Order />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/history" element={<History />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock" element={<Navigate to="/inventory" replace />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/staff" element={<StaffShift />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/offers" element={<Navigate to="/promotions" replace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Navigate to="/order" replace />} />
        <Route path="/checkout" element={<Navigate to="/payment" replace />} />
        <Route path="/login" element={<Navigate to="/order" replace />} />
        <Route path="/register" element={<Navigate to="/order" replace />} />
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