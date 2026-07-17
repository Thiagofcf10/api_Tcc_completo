'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import api, { fetchWithAuth, fetchWithApiKey } from '@/lib/api';
import Toast from '@/components/Toast';

export default function CustosPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [projetos, setProjetos] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [custos, setCustos] = useState([]);
  const [selectedProjetoId, setSelectedProjetoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_projeto: '',
    equipamentos: [{ name: '', price: '' }],
    insumos: [{ name: '', price: '' }]
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (user?.tipo !== 'professor') {
      router.push('/home');
      return;
    }
    loadProjetos();
  }, [token, user]);

  const loadProjetos = async () => {
    setLoading(true);
    try {
      const res = await fetchWithApiKey(`${api.getApiUrl()}/selectprojetos`);
      setProjetos(res.data || []);
    } catch (err) {
      setToast({ type: 'error', message: 'Erro ao carregar projetos' });
    } finally {
      setLoading(false);
    }
  };

  const loadCustos = async (projetoId) => {
    try {
      const res = await fetchWithApiKey(`${api.getApiUrl()}/selectcustos`);
      const filtrados = (res.data || []).filter(c => c.id_projeto === parseInt(projetoId));
      setCustos(filtrados);
    } catch (err) {
      setToast({ type: 'error', message: 'Erro ao carregar custos' });
    }
  };

  const handleSelectProjeto = (projetoId) => {
    setSelectedProjetoId(projetoId);
    loadCustos(projetoId);
  };

  const selectedProject = projetos.find(p => String(p.id) === String(selectedProjetoId));

  const updateEquipmentItem = (index, field, value) => {
    setFormData(prev => {
      const equipamentos = [...prev.equipamentos];
      equipamentos[index] = { ...equipamentos[index], [field]: value };
      return { ...prev, equipamentos };
    });
  };

  const addEquipmentItem = () => {
    setFormData(prev => ({
      ...prev,
      equipamentos: [...prev.equipamentos, { name: '', price: '' }]
    }));
  };

  const removeEquipmentItem = (index) => {
    setFormData(prev => ({
      ...prev,
      equipamentos: prev.equipamentos.filter((_, i) => i !== index)
    }));
  };

  const updateInsumoItem = (index, field, value) => {
    setFormData(prev => {
      const insumos = [...prev.insumos];
      insumos[index] = { ...insumos[index], [field]: value };
      return { ...prev, insumos };
    });
  };

  const addInsumoItem = () => {
    setFormData(prev => ({
      ...prev,
      insumos: [...prev.insumos, { name: '', price: '' }]
    }));
  };

  const removeInsumoItem = (index) => {
    setFormData(prev => ({
      ...prev,
      insumos: prev.insumos.filter((_, i) => i !== index)
    }));
  };

  const buildCustoPayload = () => {
    const equipamentos = formData.equipamentos.filter(item => item.name.trim() || item.price);
    const insumos = formData.insumos.filter(item => item.name.trim() || item.price);
    const equipamentoText = equipamentos.map(item => `${item.name.trim() || 'Equipamento'} - R$ ${Number(item.price || 0).toFixed(2)}`).join('\n');
    const insumosText = insumos.map(item => `${item.name.trim() || 'Insumo'} - R$ ${Number(item.price || 0).toFixed(2)}`).join('\n');
    const totalEquipamentos = equipamentos.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const totalInsumos = insumos.reduce((sum, item) => sum + Number(item.price || 0), 0);

    return {
      equipamento: equipamentoText,
      custos_equipamento: totalEquipamentos,
      insumos: insumosText,
      custos_insumos: totalInsumos
    };
  };

  const handleAddCusto = async () => {
    if (!selectedProjetoId) {
      setToast({ type: 'error', message: 'Selecione um projeto' });
      return;
    }

    try {
      await fetchWithAuth(`${api.getApiUrl()}/inserircusto`, {
        method: 'POST',
        body: JSON.stringify({
          id_projeto: parseInt(selectedProjetoId),
          ...buildCustoPayload()
        })
      });

      setToast({ type: 'success', message: 'Custo adicionado com sucesso' });
      setFormData({
        id_projeto: '',
        equipamentos: [{ name: '', price: '' }],
        insumos: [{ name: '', price: '' }]
      });
      setModalOpen(false);
      loadCustos(selectedProjetoId);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Erro ao adicionar custo' });
    }
  };

  const handleDeleteCusto = async (custoId) => {
    if (!window.confirm('Tem certeza que deseja deletar este custo?')) return;

    try {
      await fetchWithAuth(`${api.getApiUrl()}/deletecusto/${custoId}`, {
        method: 'DELETE'
      });

      setToast({ type: 'success', message: 'Custo deletado com sucesso' });
      loadCustos(selectedProjetoId);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Erro ao deletar custo' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      
      <main className="w-full max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">💰 Gerenciar Custos</h1>
        {selectedProject && (
          <div className="mb-4 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-900">Projeto selecionado</div>
            <div className="text-xl font-bold text-blue-800">{selectedProject.nome_projeto}</div>
            <div className="text-sm text-blue-700">Autores: {selectedProject.nome_autores}</div>
            <div className="text-sm text-blue-700">Tipo: {selectedProject.tipo_projeto}</div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl">⏳ Carregando...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seletor de Projeto */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-black text-lg font-semibold mb-3">Selecione um Projeto</h2>
              <div className="mb-3">
                <input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Pesquisar projeto por nome..." className="w-full placeholder-gray-400 px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {projetos.filter(p => !projectSearch || String(p.nome_projeto || '').toLowerCase().includes(projectSearch.toLowerCase())).map(projeto => (
                  <button
                    key={projeto.id}
                    onClick={() => handleSelectProjeto(projeto.id)}
                    className={`p-3 rounded-lg border-2 text-left transition ${
                      selectedProjetoId === String(projeto.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-black">{projeto.nome_projeto}</div>
                    <div className="text-xs text-gray-600">Autores: {projeto.nome_autores}</div>
                    <div className="text-xs text-gray-600">Tipo do projeto: {projeto.tipo_projeto}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProjetoId && (
              <>
                {/* Botão de adicionar */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
                  >
                    ➕ Adicionar Custo
                  </button>
                  <div className="text-sm text-gray-600">Selecione um projeto à esquerda para ver/gerenciar custos</div>
                </div>

                {/* Lista de Custos */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-gray-500 text-lg font-semibold mb-4">Custos do Projeto</h2>
                    {custos.length === 0 ? (
                      <p className="text-gray-500">Nenhum custo adicionado ainda.</p>
                    ) : (
                      <div className="space-y-4">
                        {custos.map((custo, idx) => {
                          // Parse equipamentos
                          const equipamentos = (custo.equipamento || '')
                            .split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0);
                          
                          // Parse insumos
                          const insumos = (custo.insumos || '')
                            .split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0);
                          
                          const totalEquip = Number(custo.custos_equipamento || 0);
                          const totalInsum = Number(custo.custos_insumos || 0);
                          const totalCusto = totalEquip + totalInsum;
                          
                          return (
                            <div key={custo.id} className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition">
                              {/* Cabeçalho */}
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="text-sm text-gray-500">Custo #{idx + 1}</div>
                                  <div className="text-xs text-gray-400 mt-1">Adicionado: {custo.created_at ? new Date(custo.created_at).toLocaleDateString('pt-BR') : '—'}</div>
                                </div>
                                <button 
                                  onClick={() => handleDeleteCusto(custo.id)} 
                                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                                >
                                  🗑️ Deletar
                                </button>
                              </div>
                              
                              {/* Grid 2 colunas */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Equipamentos */}
                                <div className="bg-white rounded border border-blue-100 p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">🔧</span>
                                    <div>
                                      <div className="text-sm font-semibold text-gray-900">Equipamentos</div>
                                      <div className="text-xs text-gray-500">{equipamentos.length} item{equipamentos.length !== 1 ? 's' : ''}</div>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    {equipamentos.length > 0 ? (
                                      equipamentos.map((item, i) => (
                                        <div key={i} className="text-xs text-gray-700 flex justify-between">
                                          <span>• {item.replace(/\s*-\s*R\$.*$/, '').trim()}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-gray-400">Nenhum equipamento</div>
                                    )}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-blue-50">
                                    <div className="text-sm font-semibold text-blue-600">R$ {totalEquip.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">Total equipamentos</div>
                                  </div>
                                </div>
                                
                                {/* Insumos */}
                                <div className="bg-white rounded border border-green-100 p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">📦</span>
                                    <div>
                                      <div className="text-sm font-semibold text-gray-900">Insumos</div>
                                      <div className="text-xs text-gray-500">{insumos.length} item{insumos.length !== 1 ? 's' : ''}</div>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    {insumos.length > 0 ? (
                                      insumos.map((item, i) => (
                                        <div key={i} className="text-xs text-gray-700 flex justify-between">
                                          <span>• {item.replace(/\s*-\s*R\$.*$/, '').trim()}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-gray-400">Nenhum insumo</div>
                                    )}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-green-50">
                                    <div className="text-sm font-semibold text-green-600">R$ {totalInsum.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">Total insumos</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Rodapé - Total */}
                              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded p-3 border border-blue-100">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-gray-600">Custo Total</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{equipamentos.length + insumos.length} itens</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">R$ {totalCusto.toFixed(2)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal de Adicionar Custo */}
        <Modal
          isOpen={modalOpen}
          title={<span className="text-black">Adicionar Custo</span>}
          onClose={() => setModalOpen(false)}
          confirmText="Adicionar"
          onConfirm={handleAddCusto}
          overlayClassName="fixed inset-0 z-40"
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.40)' }}
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-black font-medium">Equipamentos</label>
                <button type="button" onClick={addEquipmentItem} className="text-sm text-blue-700 hover:underline">+ Adicionar equipamento</button>
              </div>
              <div className="space-y-3">
                {formData.equipamentos.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <label className="block text-sm text-black font-medium mb-1">Item</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateEquipmentItem(index, 'name', e.target.value)}
                        placeholder="Ex: Notebook"
                        className="w-full placeholder-gray-400 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-5">
                      <label className="block text-sm text-black font-medium mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateEquipmentItem(index, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full placeholder-gray-400 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2 flex items-center mt-6">
                      {formData.equipamentos.length > 1 && (
                        <button type="button" onClick={() => removeEquipmentItem(index)} className="text-red-600 hover:text-red-800">Remover</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-black font-medium">Insumos</label>
                <button type="button" onClick={addInsumoItem} className="text-sm text-blue-700 hover:underline">+ Adicionar insumo</button>
              </div>
              <div className="space-y-3">
                {formData.insumos.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <label className="block text-sm text-black font-medium mb-1">Item</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateInsumoItem(index, 'name', e.target.value)}
                        placeholder="Ex: Parafuso"
                        className="w-full placeholder-gray-400 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-5">
                      <label className="block text-sm text-black font-medium mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateInsumoItem(index, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full placeholder-gray-400 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2 flex items-center mt-6">
                      {formData.insumos.length > 1 && (
                        <button type="button" onClick={() => removeInsumoItem(index)} className="text-red-600 hover:text-red-800">Remover</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
              <div className="text-sm font-semibold text-gray-900">Resumo do Custo</div>
              <div className="mt-2 text-sm text-gray-600">
                Total equipamentos: R$ {formData.equipamentos.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Total insumos: R$ {formData.insumos.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </Modal>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
