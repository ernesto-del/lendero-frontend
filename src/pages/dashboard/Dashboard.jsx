import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, Clock, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Solicitudes Activas',
      value: stats?.solicitudes_activas || 0,
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Pendientes',
      value: stats?.solicitudes_pendientes || 0,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Monto Total Facturado',
      value: `$${(stats?.monto_total_facturado || 0).toLocaleString('es-MX', {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'green',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen de tu actividad</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/solicitudes/nueva')}
            className="btn-primary text-left"
          >
            <FileText className="inline mr-2" size={20} />
            Nueva Solicitud
          </button>
          <button
            onClick={() => navigate('/solicitudes')}
            className="btn-secondary text-left"
          >
            <TrendingUp className="inline mr-2" size={20} />
            Ver Todas las Solicitudes
          </button>
        </div>
      </div>
    </div>
  );
}
