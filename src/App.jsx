import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Solicitudes from './pages/solicitudes/Solicitudes';
import NuevaSolicitud from './pages/solicitudes/NuevaSolicitud';
import Layout from './components/layout/Layout';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* IMPORTANTE: Rutas específicas ANTES de las generales */}
        <Route
          path="/solicitudes/nueva"
          element={
            <ProtectedRoute>
              <NuevaSolicitud />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/solicitudes"
          element={
            <ProtectedRoute>
              <Solicitudes />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/empresas"
          element={
            <ProtectedRoute>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Empresas</h2>
                <p className="text-gray-600 mt-2">Módulo en desarrollo</p>
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
