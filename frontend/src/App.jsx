import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// User Pages
import ServiceSelection from './pages/ServiceSelection';
import SlotSelection from './pages/SlotSelection';
import CustomerDetails from './pages/CustomerDetails';
import BookingSummary from './pages/BookingSummary';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import ServiceManagement from './pages/admin/ServiceManagement';
import BookingsManagement from './pages/admin/BookingsManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return admin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1a1a1a',        // Primary: Near Black
          colorLink: '#2563eb',           // Links: Blue for clarity
          colorSuccess: '#16a34a',        // Success: Green
          colorWarning: '#f59e0b',        // Warning: Amber
          colorError: '#dc2626',          // Error: Red
          colorInfo: '#0891b2',           // Info: Cyan
          colorText: '#0f172a',           // Text: Dark slate
          colorTextSecondary: '#64748b',  // Secondary: Slate gray
          colorBorder: '#e2e8f0',         // Borders: Light slate
          colorBgContainer: '#ffffff',    // Backgrounds: White
          borderRadius: 8,
        },
      }}
    >
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Navbar />
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<ServiceSelection />} />
                <Route path="/slot-selection" element={<SlotSelection />} />
                <Route path="/customer-details" element={<CustomerDetails />} />
                <Route path="/booking-summary" element={<BookingSummary />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/services" />} />
                <Route
                  path="/admin/services"
                  element={
                    <ProtectedRoute>
                      <ServiceManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute>
                      <BookingsManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
