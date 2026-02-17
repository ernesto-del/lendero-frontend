import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitudesService } from '../../services/solicitudesService';
import { Plus, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const ESTATUS_COLORS = {
  'PENDIENTE_AUTORIZACION': 'bg-yellow-100 text-yellow-800',
  'EN_REVISION': 'bg-blue-100 text-blue-800',
  'AUTORIZADA': 'bg-green-100 text-green-800',
  'PAGADA': 'bg-purple-100 text-purple-800',
  'CONFIRMADA': 'bg-indigo-100 text-indigo-800',
  'DISPERSADA': 'bg-emerald-100 text-emerald-800',
  'CANCELADA': 'bg-red-100 text-red-800',
};

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSolicitudes();
  }, [filtroEstatus]);

  const fetchSolicitudes = async () => {
    try {
      const params = {};
      if (filtroEstatus) params.estatus = filtroEstatus;
      
      const response = await solicitudesService.getAll(params);
      setSolicitudes(response.data.solicitudes);
    } catch (error) {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes</h1>
          <p className="text-gray-600 mt-2">Gestiona tus solicitudes de facturación</p>
        </div>
        <button
          onClick={() => navigate('/solicitudes/nueva')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Solicitud
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filtroEstatus}
            onChange={(e) => setFiltroEstatus(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">Todos los estatus</option>
            <option value="PENDIENTE_AUTORIZACION">Pendiente Autorización</option>
            <option value="AUTORIZADA">Autorizada</option>
            <option value="PAGADA">Pagada</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="DISPERSADA">Dispersada</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay solicitudes para mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Folio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Despacho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estatus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {solicitud.folio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {solicitud.empresa_despacho.razon_social}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${solicitud.monto_total.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ESTATUS_COLORS[solicitud.estatus] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {solicitud.estatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => navigate(`/solicitudes/${solicitud.id}`)}
                        className="text-primary hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
