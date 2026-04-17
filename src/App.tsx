import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PropertiesPage from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardHome from './pages/dashboard/DashboardHome';
import SavedProperties from './pages/dashboard/SavedProperties';
import Inquiries from './pages/dashboard/Inquiries';
import AdminDashboard from './pages/admin/AdminDashboard';
import CRM from './pages/admin/CRM';
import PropertyManagement from './pages/admin/PropertyManagement';
import CMS from './pages/admin/CMS';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
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
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/saved" element={<SavedProperties />} />
        <Route path="/dashboard/inquiries" element={<Inquiries />} />
        
        {/* Admin Console Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/crm" element={<CRM />} />
        <Route path="/admin/properties" element={<PropertyManagement />} />
        <Route path="/admin/cms" element={<CMS />} />
        
        {/* Placeholder routes for Phase 3 static pages */}
        <Route path="/management" element={<Home />} />
        <Route path="/areas" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
