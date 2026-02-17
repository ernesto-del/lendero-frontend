import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/solicitudes', icon: FileText, label: 'Solicitudes' },
    { path: '/empresas', icon: Building2, label: 'Empresas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo y Marca */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="LENDERO" 
                className="h-10"
              />
              <div>
                <p className="header-brand text-lendero-mint font-semibold" style={{ fontSize: '11px', lineHeight: '1' }}>
                  Confirming
                </p>
                <p className="text-xs text-gray-500" style={{ fontSize: '9px', marginTop: '2px' }}>
                  Plataforma de Gestión Fiscal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.nombre_completo}</p>
              <p className="text-xs text-gray-500">
                {user?.roles?.[0]?.nombre || 'Usuario'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out z-20`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-lendero-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => 
                  isActive ? { backgroundColor: '#FFFFFF' } : {}
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Footer en Sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              LENDERO CAPITAL
            </p>
            <p className="text-xs text-gray-500 text-center">
              SAPI DE CV
            </p>
            <p className="text-xs text-lendero-mint text-center mt-1">
              info@lenderocapital.com
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
