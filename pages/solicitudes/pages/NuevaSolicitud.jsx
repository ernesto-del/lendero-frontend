import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function NuevaSolicitud() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Catálogos
  const [empresas, setEmpresas] = useState([]);
  const [actividadesEconomicas, setActividadesEconomicas] = useState([]);
  const [usosCfdi, setUsosCfdi] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    empresa_emisor_id: '',
    actividad_economica_id: '',
    cliente_razon_social: '',
    cliente_rfc: '',
    cliente_direccion: '',
    cliente_codigo_postal: '',
    metodo_pago_id: '',
    forma_pago_id: '',
    uso_cfdi_id: '',
    notas: '',
  });

  // Conceptos (tabla)
  const [conceptos, setConceptos] = useState([
    {
      cantidad: 1,
      unidad_medida_id: '',
      clave_producto: '',
      descripcion: '',
      precio_unitario: 0,
      subtotal: 0,
      iva: 0,
      importe: 0,
    },
  ]);

  // Totales
  const [totales, setTotales] = useState({
    subtotal: 0,
    iva: 0,
    total: 0,
  });

  // ==================== CARGAR CATÁLOGOS ====================

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [
        empresasRes,
        usosCfdiRes,
        formasPagoRes,
        metodosPagoRes,
        unidadesMedidaRes,
      ] = await Promise.all([
        api.get('/empresas'),
        api.get('/catalogos/uso-cfdi'),
        api.get('/catalogos/forma-pago'),
        api.get('/catalogos/metodo-pago'),
        api.get('/catalogos/unidad-medida'),
      ]);

      setEmpresas(empresasRes.data.data || []);
      setUsosCfdi(usosCfdiRes.data.data || []);
      setFormasPago(formasPagoRes.data.data || []);
      setMetodosPago(metodosPagoRes.data.data || []);
      setUnidadesMedida(unidadesMedidaRes.data.data || []);
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      toast.error('Error al cargar catálogos');
    }
  };

  // ==================== CARGAR ACTIVIDADES ECONÓMICAS ====================

  const cargarActividadesEconomicas = async (empresaId) => {
    try {
      const res = await api.get(`/empresas/${empresaId}/actividades-economicas`);
      setActividadesEconomicas(res.data.data || []);
    } catch (error) {
      console.error('Error cargando actividades:', error);
      toast.error('Error al cargar actividades económicas');
    }
  };

  // ==================== HANDLERS ====================

  const handleEmpresaChange = (e) => {
    const empresaId = e.target.value;
    setFormData({ ...formData, empresa_emisor_id: empresaId, actividad_economica_id: '' });
    setActividadesEconomicas([]);
    
    if (empresaId) {
      cargarActividadesEconomicas(empresaId);
    }
  };

  const handleConceptoChange = (index, field, value) => {
    const nuevosConceptos = [...conceptos];
    nuevosConceptos[index][field] = value;

    // Calcular montos
    if (['cantidad', 'precio_unitario'].includes(field)) {
      const cantidad = parseFloat(nuevosConceptos[index].cantidad) || 0;
      const precioUnitario = parseFloat(nuevosConceptos[index].precio_unitario) || 0;
      
      nuevosConceptos[index].subtotal = cantidad * precioUnitario;
      nuevosConceptos[index].iva = nuevosConceptos[index].subtotal * 0.16;
      nuevosConceptos[index].importe = nuevosConceptos[index].subtotal + nuevosConceptos[index].iva;
    }

    setConceptos(nuevosConceptos);
    calcularTotales(nuevosConceptos);
  };

  const calcularTotales = (conceptosList) => {
    const subtotal = conceptosList.reduce((sum, c) => sum + (parseFloat(c.subtotal) || 0), 0);
    const iva = conceptosList.reduce((sum, c) => sum + (parseFloat(c.iva) || 0), 0);
    const total = subtotal + iva;

    setTotales({ subtotal, iva, total });
  };

  const agregarConcepto = () => {
    setConceptos([
      ...conceptos,
      {
        cantidad: 1,
        unidad_medida_id: '',
        clave_producto: '',
        descripcion: '',
        precio_unitario: 0,
        subtotal: 0,
        iva: 0,
        importe: 0,
      },
    ]);
  };

  const eliminarConcepto = (index) => {
    if (conceptos.length === 1) {
      toast.error('Debe haber al menos un concepto');
      return;
    }
    const nuevosConceptos = conceptos.filter((_, i) => i !== index);
    setConceptos(nuevosConceptos);
    calcularTotales(nuevosConceptos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.empresa_emisor_id) {
      toast.error('Selecciona una empresa emisora');
      return;
    }
    if (!formData.actividad_economica_id) {
      toast.error('Selecciona una actividad económica');
      return;
    }
    if (conceptos.length === 0) {
      toast.error('Agrega al menos un concepto');
      return;
    }

    // Mostrar modal de confirmación
    setShowConfirmModal(true);
  };

  const confirmarCreacion = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        conceptos,
        subtotal: totales.subtotal,
        iva: totales.iva,
        monto_total: totales.total,
      };

      await api.post('/solicitudes', payload);
      
      toast.success('Solicitud creada exitosamente');
      navigate('/solicitudes');
    } catch (error) {
      console.error('Error creando solicitud:', error);
      toast.error(error.response?.data?.error?.message || 'Error al crear solicitud');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud de Factura</h1>
        <p className="text-gray-600 mt-1">Completa el formulario para crear una nueva solicitud</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* EMPRESA EMISORA */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Empresa Emisora de Factura</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre / Razón Social *
              </label>
              <select
                value={formData.empresa_emisor_id}
                onChange={handleEmpresaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                required
              >
                <option value="">Seleccionar empresa...</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.razon_social}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFC
              </label>
              <input
                type="text"
                value={empresas.find(e => e.id === parseInt(formData.empresa_emisor_id))?.rfc || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actividad Económica *
              </label>
              <select
                value={formData.actividad_economica_id}
                onChange={(e) => setFormData({ ...formData, actividad_economica_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                required
                disabled={!formData.empresa_emisor_id}
              >
                <option value="">Seleccionar actividad...</option>
                {actividadesEconomicas.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.clave} - {act.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DATOS DEL CLIENTE */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón Social *
              </label>
              <input
                type="text"
                value={formData.cliente_razon_social}
                onChange={(e) => setFormData({ ...formData, cliente_razon_social: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFC *
              </label>
              <input
                type="text"
                value={formData.cliente_rfc}
                onChange={(e) => setFormData({ ...formData, cliente_rfc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                maxLength="13"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.cliente_direccion}
                onChange={(e) => setFormData({ ...formData, cliente_direccion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                value={formData.cliente_codigo_postal}
                onChange={(e) => setFormData({ ...formData, cliente_codigo_postal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                maxLength="5"
              />
            </div>
          </div>
        </div>

        {/* DATOS DE FACTURA */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Factura</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                value={formData.metodo_pago_id}
                onChange={(e) => setFormData({ ...formData, metodo_pago_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                required
              >
                <option value="">Seleccionar...</option>
                {metodosPago.map((metodo) => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.id} - {metodo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pago *
              </label>
              <select
                value={formData.forma_pago_id}
                onChange={(e) => setFormData({ ...formData, forma_pago_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                required
              >
                <option value="">Seleccionar...</option>
                {formasPago.map((forma) => (
                  <option key={forma.id} value={forma.id}>
                    {forma.id} - {forma.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uso del CFDI *
              </label>
              <select
                value={formData.uso_cfdi_id}
                onChange={(e) => setFormData({ ...formData, uso_cfdi_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
                required
              >
                <option value="">Seleccionar...</option>
                {usosCfdi.map((uso) => (
                  <option key={uso.id} value={uso.id}>
                    {uso.id} - {uso.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CONCEPTOS */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conceptos</h2>
            <button
              type="button"
              onClick={agregarConcepto}
              className="flex items-center gap-2 px-4 py-2 bg-lendero-mint text-white rounded-md hover:bg-opacity-90"
            >
              <Plus size={20} />
              Agregar Concepto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clave Producto</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">P. Unitario</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">IVA</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Importe</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conceptos.map((concepto, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={concepto.cantidad}
                        onChange={(e) => handleConceptoChange(index, 'cantidad', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={concepto.unidad_medida_id}
                        onChange={(e) => handleConceptoChange(index, 'unidad_medida_id', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Seleccionar...</option>
                        {unidadesMedida.map((unidad) => (
                          <option key={unidad.id} value={unidad.id}>
                            {unidad.id}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={concepto.clave_producto}
                        onChange={(e) => handleConceptoChange(index, 'clave_producto', e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={concepto.descripcion}
                        onChange={(e) => handleConceptoChange(index, 'descripcion', e.target.value)}
                        className="w-64 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={concepto.precio_unitario}
                        onChange={(e) => handleConceptoChange(index, 'precio_unitario', e.target.value)}
                        className="w-28 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      ${concepto.subtotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      ${concepto.iva.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      ${concepto.importe.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => eliminarConcepto(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTALES */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-end">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totales.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA (16%):</span>
                <span className="font-medium">${totales.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>TOTAL:</span>
                <span>${totales.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NOTAS */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales
          </label>
          <textarea
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lendero-mint focus:border-transparent"
            placeholder="Información adicional..."
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/solicitudes')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-lendero-mint text-white rounded-md hover:bg-opacity-90"
          >
            <Save size={20} />
            Crear Solicitud
          </button>
        </div>
      </form>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Creación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de crear esta solicitud de factura por un monto de{' '}
              <span className="font-bold">${totales.total.toFixed(2)}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCreacion}
                className="px-4 py-2 bg-lendero-mint text-white rounded-md hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
