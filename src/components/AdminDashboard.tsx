import React, { useState, useEffect } from 'react';
import { 
  Home, 
  LogOut, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { authService } from '../services/authService';
import { propertyService, Property } from '../services/propertyService';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: Property['status'], notes?: string) => {
    try {
      await propertyService.updatePropertyStatus(id, status, notes);
      await loadProperties();
      setShowModal(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta propriedade?')) {
      try {
        await propertyService.deleteProperty(id);
        await loadProperties();
      } catch (error) {
        console.error('Erro ao deletar propriedade:', error);
      }
    }
  };

  const getStatusColor = (status: Property['status']) => {
    const colors = {
      novo: 'bg-blue-100 text-blue-800',
      em_analise: 'bg-yellow-100 text-yellow-800',
      proposta_enviada: 'bg-purple-100 text-purple-800',
      vendido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: Property['status']) => {
    const labels = {
      novo: 'Novo',
      em_analise: 'Em Análise',
      proposta_enviada: 'Proposta Enviada',
      vendido: 'Vendido',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  const filteredProperties = properties.filter(property => {
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesSearch = property.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: properties.length,
    novos: properties.filter(p => p.status === 'novo').length,
    emAnalise: properties.filter(p => p.status === 'em_analise').length,
    vendidos: properties.filter(p => p.status === 'vendido').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Nuimóvel Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-purple-600 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Imóveis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Novos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.novos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emAnalise}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vendidos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="novo">Novo</option>
                <option value="em_analise">Em Análise</option>
                <option value="proposta_enviada">Proposta Enviada</option>
                <option value="vendido">Vendido</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-green-500 text-white rounded-lg hover:from-purple-700 hover:to-green-600 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Imóveis Cadastrados ({filteredProperties.length})
            </h3>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum imóvel encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proprietário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Estimado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.fullName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {property.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {property.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {property.propertyType}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.address}
                          </div>
                          <div className="text-sm text-gray-500">
                            Continuar morando: {property.stayAsTenant === 'sim' ? 'Sim' : 'Não'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {property.estimatedValue}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                          {getStatusLabel(property.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {property.createdAt?.toDate().toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => property.id && handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalhes do Imóvel
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-sm text-gray-900">{selectedProperty.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedProperty.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-sm text-gray-900">{selectedProperty.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <p className="text-sm text-gray-900">{selectedProperty.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <p className="text-sm text-gray-900">{selectedProperty.propertyType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor Estimado</label>
                  <p className="text-sm text-gray-900">{selectedProperty.estimatedValue}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Continuar Morando</label>
                  <p className="text-sm text-gray-900">{selectedProperty.stayAsTenant === 'sim' ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Atual</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProperty.status)}`}>
                    {getStatusLabel(selectedProperty.status)}
                  </span>
                </div>
                {selectedProperty.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observações</label>
                    <p className="text-sm text-gray-900">{selectedProperty.notes}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atualizar Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => selectedProperty.id && handleStatusUpdate(selectedProperty.id, 'em_analise')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200"
                  >
                    Em Análise
                  </button>
                  <button
                    onClick={() => selectedProperty.id && handleStatusUpdate(selectedProperty.id, 'proposta_enviada')}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200"
                  >
                    Proposta Enviada
                  </button>
                  <button
                    onClick={() => selectedProperty.id && handleStatusUpdate(selectedProperty.id, 'vendido')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
                  >
                    Vendido
                  </button>
                  <button
                    onClick={() => selectedProperty.id && handleStatusUpdate(selectedProperty.id, 'cancelado')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
                  >
                    Cancelado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};