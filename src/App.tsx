import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PropertiesPage from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Management from './pages/Management';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import DebugPage from './pages/DebugPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import SavedProperties from './pages/dashboard/SavedProperties';
import Inquiries from './pages/dashboard/Inquiries';
import AdminDashboard from './pages/admin/AdminDashboard';
import CRM from './pages/admin/CRM';
import PropertyManagement from './pages/admin/PropertyManagement';
import CMS from './pages/admin/CMS';
import PropertyEditor from './pages/admin/PropertyEditor';
import Settings from './pages/admin/Settings';
import Marketing from './pages/admin/Marketing';
import Team from './pages/admin/Team';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    console.log('CannesImmo Luxe - Admin Orchestration v1.0.5 - Status: Settings Live');
    initialize();
  }, [initialize]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<PropertiesPage mode="sale" />} />
        <Route path="/rent" element={<PropertiesPage mode="rent" />} />
        <Route path="/buy/:slug" element={<PropertyDetail />} />
        <Route path="/rent/:slug" element={<PropertyDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/debug" element={<DebugPage />} />
        
        {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/dashboard/saved" element={<ProtectedRoute><SavedProperties /></ProtectedRoute>} />
        <Route path="/dashboard/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
        
        {/* Admin Console Routes (Restricted) */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/crm" element={<ProtectedRoute requireAdmin><CRM /></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute requireAdmin><PropertyManagement /></ProtectedRoute>} />
        <Route path="/admin/properties/new" element={<ProtectedRoute requireAdmin><PropertyEditor /></ProtectedRoute>} />
        <Route path="/admin/properties/edit/:id" element={<ProtectedRoute requireAdmin><PropertyEditor /></ProtectedRoute>} />
        <Route path="/admin/cms" element={<ProtectedRoute requireAdmin><CMS /></ProtectedRoute>} />
        <Route path="/admin/marketing" element={<ProtectedRoute requireAdmin><Marketing /></ProtectedRoute>} />
        <Route path="/admin/team" element={<ProtectedRoute requireAdmin><Team /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><Settings /></ProtectedRoute>} />
        
        <Route path="/management" element={<Management />} />
        <Route path="/areas" element={<Home />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
