import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      setAuth(response.data.user, response.data.token);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lendero-gray via-gray-700 to-lendero-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo y Marca */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="LENDERO" 
            className="h-24 mx-auto mb-3"
          />
          <p className="header-brand text-lendero-mint" style={{ fontSize: '14px' }}>
            Confirming
          </p>
          <p className="text-gray-300 text-sm mt-2">Plataforma de Gestión Fiscal</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-lendero-gray mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
              style={{ backgroundColor: '#FFFFFF', color: 'white' }}
            >
              {loading ? (
                'Iniciando sesión...'
              ) : (
                <>
                  <LogIn size={20} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Usuarios de prueba:
            </p>
            <p className="text-xs text-gray-500 mt-2">
              maria@fiscalcorp.com / password123 (Corporativo)
              <br />
              juan@miempresa.com / password123 (Administrador)
            </p>
          </div>
        </div>

        <p className="text-center text-gray-300 text-sm mt-6">
          © 2025 LENDERO CAPITAL SAPI DE CV. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
