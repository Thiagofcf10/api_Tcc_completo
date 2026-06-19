"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api, { fetchWithApiKey } from '@/lib/api';

export default function ProjetoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [projeto, setProjeto] = useState(null);
  const [arquivos, setArquivos] = useState([]);
  const [custos, setCustos] = useState([]);
  const [orientadorNome, setOrientadorNome] = useState(null);
  const [alunoNomes, setAlunoNomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewArquivo, setPreviewArquivo] = useState(null);

  const isPDF = (caminho) => /\.pdf$/i.test(caminho || '');

  const selectPreviewArquivo = (arquivo) => {
    if (!arquivo || !isPDF(arquivo.caminho_arquivo)) return;
    setPreviewArquivo(arquivo);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const apiKey = api.getApiKey();
        // fetch single projeto by id
        const projResp = await fetchWithApiKey(`${api.getApiUrl()}/selectprojetos/${id}`);
        const p = projResp && projResp.data ? projResp.data : null;
        setProjeto(p || null);

        // Fetch orientador name (if it's an id)
        try {
          if (p && p.orientador) {
            const profResp = await fetchWithApiKey(`${api.getApiUrl()}/selectprofessor/${p.orientador}?api_key=${apiKey}`);
            const profData = profResp && profResp.data ? profResp.data : null;
            const nomeProf = profData && (profData.nome_professor || profData.nome) ? (profData.nome_professor || profData.nome) : null;
            setOrientadorNome(nomeProf || null);
          }
        } catch (pf) {
          // ignore
        }

        // Prefer explicit author names if stored, otherwise resolve aluno names from matricula_alunos (comma-separated IDs)
        try {
          if (p && p.nome_autores && typeof p.nome_autores === 'string' && p.nome_autores.trim() !== '') {
            const nomes = p.nome_autores.split(',').map(s => s.trim()).filter(Boolean);
            setAlunoNomes(nomes);
          } else if (p && p.matricula_alunos) {
            const alunoIds = String(p.matricula_alunos).split(',').map(x => x.trim()).filter(Boolean).map(x => parseInt(x));
            if (alunoIds.length > 0) {
              const alunosResp = await fetchWithApiKey(`${api.getApiUrl()}/selectaluno?api_key=${apiKey}`);
              const alunosData = alunosResp && alunosResp.data ? alunosResp.data : [];
              const nomes = alunoIds.map(idNum => {
                const found = alunosData.find(a => Number(a.id) === Number(idNum));
                return found ? found.nome_aluno : `Aluno ${idNum}`;
              });
              setAlunoNomes(nomes);
            }
          }
        } catch (pa) {
          // ignore
        }

        const arquivosResp = await fetchWithApiKey(`${api.getApiUrl()}/selectarquivos?projeto_id=${id}`);
        setArquivos(arquivosResp.data || []);

        // load custos for this projeto (backend supports projeto_id query)
        try {
          const custosResp = await fetchWithApiKey(`${api.getApiUrl()}/selectcustos?projeto_id=${id}`);
          const rows = custosResp.data || [];
          setCustos(rows);
        } catch (e) {
          // ignore custos load errors
          setCustos([]);
        }
      } catch (e) {
        console.error('Erro ao carregar projeto:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function downloadLink(caminho) {
    if (!caminho) return '#';
    const parts = caminho.split('/');
    const filename = parts[parts.length - 1];
    return `${api.getApiUrl()}/downloadarquivo/${encodeURIComponent(filename)}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-8">
        {loading ? (
          <div>⏳ Carregando...</div>
        ) : !projeto ? (
          <div>Projeto não encontrado. <button onClick={() => router.push('/projetos')} className="text-blue-600">Voltar</button></div>
        ) : (
          <div className="space-y-6">
              <div className="bg-white rounded shadow p-6">
                <h1 className="text-2xl text-black font-bold">{projeto.nome_projeto}</h1>
                <p className="text-sm text-gray-700 mt-2">
                  {arquivos && arquivos.length > 0 && arquivos[0].resumo ? (
                    <span>{arquivos[0].resumo}</span>
                  ) : (
                    <span className="text-gray-600">Resumo não disponível.</span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-3"><strong>Orientador:</strong> {orientadorNome || projeto.orientador}</p>
                <p className="text-sm text-gray-600"><strong>Coorientador:</strong> {projeto.coorientador}</p>
                <p className="text-sm text-gray-600"><strong>Alunos:</strong> {alunoNomes && alunoNomes.length > 0 ? alunoNomes.join(', ') : (projeto.matricula_alunos || '—')}</p>
              </div>

            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg text-black font-semibold mb-3">Arquivos do projeto</h2>
              {arquivos.length === 0 ? (
                  <p className="text-gray-500">Nenhum arquivo encontrado.</p>
                ) : (
                  <>
                    {previewArquivo && (
                      <div className="mb-4 bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Pré-visualização PDF</div>
                            <div className="text-sm text-gray-600">{previewArquivo.nome_arquivo}</div>
                          </div>
                          <button onClick={() => setPreviewArquivo(null)} className="text-sm text-blue-600 hover:underline">Fechar visualização</button>
                        </div>
                        <div className="h-[650px] rounded border overflow-hidden">
                          <iframe src={downloadLink(previewArquivo.caminho_arquivo)} className="w-full h-full" title="PDF preview" />
                        </div>
                      </div>
                    )}
                    <ul className="space-y-3">
                      {arquivos.map(a => (
                        <li key={a.id} className="flex flex-col lg:flex-row lg:items-center justify-between bg-gray-50 border border-gray-100 rounded p-3 gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{a.nome_arquivo || 'Arquivo'}</div>
                            {a.resumo && <div className="text-xs text-gray-600 mt-1">{a.resumo}</div>}
                            <div className="text-xs text-gray-500 mt-2">Enviado em: {a.created_at ? new Date(a.created_at).toLocaleString('pt-BR') : '—'}</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            {isPDF(a.caminho_arquivo) && (
                              <button onClick={() => selectPreviewArquivo(a)} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-sky-600 text-white hover:bg-sky-700">📄 Pré-visualizar PDF</button>
                            )}
                            <a className="inline-flex items-center gap-2 px-3 py-2 rounded border border-sky-600 text-sky-600 hover:bg-sky-50" href={`/arquivos/${a.id}`}>🔎 Ver</a>
                            <a className="inline-flex items-center gap-2 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700" href={downloadLink(a.caminho_arquivo)} target="_blank" rel="noreferrer">⤓ Baixar</a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
            </div>

            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg text-black  font-semibold mb-3">Custos do projeto</h2>
              {custos.length === 0 ? (
                <p className="text-gray-500">Nenhum custo registrado para este projeto.</p>
              ) : (
                <div className="space-y-4">
                  {custos.map((c, idx) => {
                    // Parse equipamentos e insumos
                    const equipamentos = (c.equipamento || '')
                      .split('\n')
                      .map(line => line.trim())
                      .filter(line => line.length > 0);
                    
                    const insumos = (c.insumos || '')
                      .split('\n')
                      .map(line => line.trim())
                      .filter(line => line.length > 0);
                    
                    const custos_equipamento = Number(c.custos_equipamento || 0);
                    const custos_insumos = Number(c.custos_insumos || 0);
                    const total = custos_equipamento + custos_insumos;
                    
                    return (
                      <div key={c.id} className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition">
                        {/* Cabeçalho */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-semibold text-gray-900">Custo #{idx + 1}</div>
                            <div className="text-xs text-gray-500 mt-1">Total: <span className="font-semibold text-gray-900">R$ {total.toFixed(2)}</span></div>
                          </div>
                        </div>
                        
                        {/* Grid 2 colunas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Equipamentos */}
                          <div className="bg-white rounded border border-blue-100 p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">🔧</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Equipamentos</div>
                                <div className="text-xs text-gray-500">{equipamentos.length} item{equipamentos.length !== 1 ? 's' : ''}</div>
                              </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              {equipamentos.length > 0 ? (
                                equipamentos.map((item, i) => (
                                  <div key={i} className="text-gray-700">• {item.replace(/\s*-\s*R\$.*$/, '').trim()}</div>
                                ))
                              ) : (
                                <div className="text-gray-400">Nenhum equipamento</div>
                              )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-blue-50">
                              <div className="text-sm font-semibold text-blue-600">R$ {custos_equipamento.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          {/* Insumos */}
                          <div className="bg-white rounded border border-green-100 p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">📦</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Insumos</div>
                                <div className="text-xs text-gray-500">{insumos.length} item{insumos.length !== 1 ? 's' : ''}</div>
                              </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              {insumos.length > 0 ? (
                                insumos.map((item, i) => (
                                  <div key={i} className="text-gray-700">• {item.replace(/\s*-\s*R\$.*$/, '').trim()}</div>
                                ))
                              ) : (
                                <div className="text-gray-400">Nenhum insumo</div>
                              )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-green-50">
                              <div className="text-sm font-semibold text-green-600">R$ {custos_insumos.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Resumo Total */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-700 font-semibold">Resumo Total do Projeto</div>
                        <div className="text-xs text-gray-600 mt-1">{custos.length} custo{custos.length !== 1 ? 's' : ''} registrado{custos.length !== 1 ? 's' : ''}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total gasto</div>
                        <div className="text-2xl font-bold text-indigo-600">R$ {custos.reduce((acc, c) => acc + (Number(c.custos_equipamento || 0) + Number(c.custos_insumos || 0)), 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
