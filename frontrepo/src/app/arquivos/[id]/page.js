"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api, { fetchWithApiKey } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ArquivoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [arquivo, setArquivo] = useState(null);
  const [projeto, setProjeto] = useState(null);
  const [professorNome, setProfessorNome] = useState(null);
  const [alunoNomes, setAlunoNomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetchWithApiKey(`${api.getApiUrl()}/selectarquivos/${id}`);
        // resp.data is the arquivo object according to our new endpoint
        setArquivo(resp.data || null);
        // load projeto and related info if available
        if (resp.data && resp.data.projeto_id) {
          try {
            const projResp = await fetchWithApiKey(`${api.getApiUrl()}/selectprojetos/${resp.data.projeto_id}`);
            const p = projResp && projResp.data ? projResp.data : null;
            setProjeto(p || null);

            // resolve alunos participantes from projeto (nome_autores or matricula_alunos)
            try {
              if (p && p.nome_autores && typeof p.nome_autores === 'string' && p.nome_autores.trim() !== '') {
                const nomes = p.nome_autores.split(',').map(s => s.trim()).filter(Boolean);
                setAlunoNomes(nomes);
              } else if (p && p.matricula_alunos) {
                const alunoIds = String(p.matricula_alunos).split(',').map(x => x.trim()).filter(Boolean);
                if (alunoIds.length > 0) {
                  const alunosResp = await fetchWithApiKey(`${api.getApiUrl()}/selectaluno`);
                  const alunosData = alunosResp && alunosResp.data ? alunosResp.data : [];
                  const nomes = alunoIds.map(idTok => {
                    const found = alunosData.find(a => String(a.id) === String(idTok) || String(a.matricula_aluno || a.matricula) === String(idTok));
                    return found ? (found.nome_aluno || found.nome) : `Aluno ${idTok}`;
                  });
                  setAlunoNomes(nomes);
                }
              }
            } catch (e) {
              // ignore aluno load errors
            }
          } catch (e) {
            // ignore projeto load errors
          }
        }
      } catch (e) {
        console.error('Erro ao carregar arquivo:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // fetch text file content when arquivo is loaded and is text
  useEffect(() => {
    let mounted = true;
    const loadContent = async () => {
      if (!arquivo) return;
      if (!isTextFile(arquivo.caminho_arquivo, arquivo.tipo_mime || arquivo.mimetype)) return;
      try {
        const url = previewLink(arquivo.caminho_arquivo);
        const res = await fetch(url);
        const txt = await res.text();
        if (!mounted) return;
        setFileContent(txt);
      } catch (err) {
        if (!mounted) return;
        setFileContent('Erro ao carregar conteúdo do arquivo.');
      }
    };
    setFileContent(null);
    loadContent();
    return () => { mounted = false; };
  }, [arquivo]);

  // resolve professor who uploaded the file (prefer arquivo.usuario_id, fallback to projeto.orientador)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!arquivo) return;
      const apiKey = api.getApiKey();
      try {
        if (arquivo.usuario_id) {
          try {
            const profResp = await fetchWithApiKey(`${api.getApiUrl()}/selectprofessor/${arquivo.usuario_id}?api_key=${apiKey}`);
            const profData = profResp && profResp.data ? profResp.data : null;
            const nome = profData && (profData.nome_professor || profData.nome) ? (profData.nome_professor || profData.nome) : null;
            if (mounted) setProfessorNome(nome || String(arquivo.usuario_id));
            return;
          } catch (e) {
            // ignore and fallback to projeto
          }
        }

        if (projeto && projeto.orientador) {
          try {
            const profResp = await fetchWithApiKey(`${api.getApiUrl()}/selectprofessor/${projeto.orientador}?api_key=${apiKey}`);
            const profData = profResp && profResp.data ? profResp.data : null;
            const nome = profData && (profData.nome_professor || profData.nome) ? (profData.nome_professor || profData.nome) : null;
            if (mounted) setProfessorNome(nome || String(projeto.orientador));
          } catch (e) {
            if (mounted) setProfessorNome(projeto.orientador || null);
          }
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [arquivo, projeto]);

  const downloadLink = (caminho) => {
    if (!caminho) return '#';
    const parts = caminho.split('/');
    const filename = parts[parts.length - 1];
    return `${api.getApiUrl()}/downloadarquivo/${encodeURIComponent(filename)}`;
  };

  const previewLink = (caminho) => {
    if (!caminho) return '#';
    const parts = caminho.split('/');
    const filename = parts[parts.length - 1];
    return `${api.getApiUrl()}/previewarquivo/${encodeURIComponent(filename)}`;
  };

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    // If bytes is already a human readable string (contains letters), return as-is
    if (typeof bytes === 'string' && /[a-zA-Z]/.test(bytes)) return bytes;
    const b = Number(bytes);
    if (isNaN(b)) return String(bytes || '—');
    const units = ['B','KB','MB','GB','TB'];
    let i = 0; let val = b;
    while (val >= 1024 && i < units.length-1) { val /= 1024; i++; }
    return `${val.toFixed( i===0 ? 0 : 2 )} ${units[i]}`;
  };

  const formatarNomeArquivo = (nome, fallback = 'Arquivo do projeto') => {
    if (!nome) return fallback;
    let texto = String(nome).replace(/\+/g, ' ');
    const decoded = [];
    for (let i = 0; i < 3; i++) {
      try {
        const next = decodeURIComponent(texto);
        if (next === texto) break;
        decoded.push(next);
        texto = next;
      } catch {
        break;
      }
    }
    const nomeLimpo = (decoded[decoded.length - 1] || texto || '').trim();
    if (!nomeLimpo || nomeLimpo === 'Arquivo' || nomeLimpo === 'arquivo') return fallback;
    return nomeLimpo;
  };

  const isImage = (name) => /\.(png|jpe?g|gif|bmp|webp)$/i.test(name || '');
  const isOfficeDocument = (name, mime) => {
    const lowerName = String(name || '').toLowerCase();
    const lowerMime = String(mime || '').toLowerCase();
    return /\.(doc|docx|xls|xlsx)$/i.test(lowerName) ||
      ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(lowerMime);
  };
  const isPDF = (name) => /\.pdf$/i.test(name || '');
  const isTextFile = (name, mime) => {
    if (mime && /^text\//.test(String(mime))) return true;
    return /\.(txt|md|csv|json|xml)$/i.test(name || '');
  };

  const [fileContent, setFileContent] = useState(null);
  const [resumoExpanded, setResumoExpanded] = useState(false);
  const [pdfViewable, setPdfViewable] = useState(null); // null=checking, true/false
  const [docPreviewUrl, setDocPreviewUrl] = useState(null);

  // Check if PDF can be previewed (try a fetch to verify availability/CORS)
  useEffect(() => {
    let mounted = true;
    const checkPdf = async () => {
      if (!arquivo || !isPDF(arquivo.caminho_arquivo)) { setPdfViewable(null); return; }
      setPdfViewable(null);
      try {
        const url = previewLink(arquivo.caminho_arquivo);
        const res = await fetch(url, { method: 'GET', cache: 'no-cache' });
        if (!mounted) return;
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.toLowerCase().includes('pdf')) setPdfViewable(true);
        else setPdfViewable(false);
      } catch (err) {
        if (!mounted) return;
        setPdfViewable(false);
      }
    };
    checkPdf();
    return () => { mounted = false; };
  }, [arquivo]);

  useEffect(() => {
    if (!arquivo || !isOfficeDocument(arquivo.caminho_arquivo, arquivo.tipo_mime || arquivo.mimetype)) {
      setDocPreviewUrl(null);
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      const url = previewLink(arquivo.caminho_arquivo);
      const absoluteUrl = new URL(url, window.location.origin).toString();
      const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;
      setDocPreviewUrl(viewerUrl);
    } catch {
      setDocPreviewUrl(null);
    }
  }, [arquivo]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="w-full max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div>⏳ Carregando...</div>
        ) : !arquivo ? (
          <div>Arquivo não encontrado. <button onClick={() => router.back()} className="text-blue-600">Voltar</button></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: preview */}
            <div className="lg:col-span-2 bg-white rounded shadow p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-full sm:w-48 flex-shrink-0">
                  {isImage(arquivo.caminho_arquivo) ? (
                    <img src={previewLink(arquivo.caminho_arquivo)} alt={arquivo.nome_arquivo} className="w-full sm:w-48 h-48 object-cover rounded" />
                  ) : isPDF(arquivo.caminho_arquivo) ? (
                    <div className="w-full sm:w-48 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">PDF</div>
                  ) : (
                    <div className="w-full sm:w-48 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">Arquivo</div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">{formatarNomeArquivo(arquivo.nome_arquivo, projeto?.nome_projeto ? `Arquivo do projeto - ${projeto.nome_projeto}` : 'Arquivo do projeto')}</h1>
                  <div className="mt-3 text-sm text-gray-600 space-y-2">
                    {arquivo.resumo && (
                      <div>
                        <strong>Resumo:</strong>
                        <div className={`mt-1 text-gray-700 text-justify ${resumoExpanded ? '' : 'max-h-20 overflow-hidden'}`}>
                          <p>{arquivo.resumo}</p>
                        </div>
                        {String(arquivo.resumo).length > 280 && (
                          <button onClick={() => setResumoExpanded(!resumoExpanded)} className="mt-1 text-xs text-blue-600">{resumoExpanded ? 'Mostrar menos' : 'Mostrar mais'}</button>
                        )}
                      </div>
                    )}
                    {arquivo.nome_projeto && (
                      <p><strong>Nome do projeto:</strong> {arquivo.nome_projeto}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Conteúdo</h2>
                {isPDF(arquivo.caminho_arquivo) ? (
                  pdfViewable === null ? (
                    <div className="p-6 rounded border bg-yellow-50 text-yellow-800">Verificando pré-visualização do PDF...</div>
                  ) : pdfViewable === true ? (
                    <iframe title="PDF preview" src={previewLink(arquivo.caminho_arquivo)} className="w-full h-[650px] rounded border" />
                  ) : (
                    <div className="p-6 rounded border bg-gray-50 text-gray-600">Pré-visualização do PDF não está disponível neste navegador/servidor. Use o botão de download para obter o arquivo.</div>
                  )
                ) : isOfficeDocument(arquivo.caminho_arquivo, arquivo.tipo_mime || arquivo.mimetype) ? (
                  docPreviewUrl ? (
                    <iframe title="Documento preview" src={docPreviewUrl} className="w-full h-[650px] rounded border" />
                  ) : (
                    <div className="p-6 rounded border bg-gray-50 text-gray-600">Pré-visualização do documento não está disponível neste navegador/servidor. Use o botão de download para abrir o arquivo.</div>
                  )
                ) : isImage(arquivo.caminho_arquivo) ? (
                  <img src={previewLink(arquivo.caminho_arquivo)} alt={arquivo.nome_arquivo} className="w-full rounded border" />
                ) : isTextFile(arquivo.caminho_arquivo, arquivo.tipo_mime || arquivo.mimetype) ? (
                  <div className="p-4 rounded border bg-gray-50">
                    {fileContent === null ? (
                      <div className="text-gray-500">Carregando conteúdo...</div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{fileContent}</pre>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded border bg-gray-50 text-gray-600">Pré-visualização não disponível para este tipo de arquivo. Use o botão de download para obter o arquivo.</div>
                )}
              </div>
            </div>

            {/* Right: metadata + actions */}
            <aside className="bg-white rounded shadow p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-sm text-gray-500">Detalhes do arquivo</h3>
                <div className="mt-2 text-sm text-gray-800 space-y-1">
                  <div><strong>Nome:</strong> {formatarNomeArquivo(arquivo.nome_arquivo, projeto?.nome_projeto ? `Arquivo do projeto - ${projeto.nome_projeto}` : 'Arquivo do projeto') || '—'}</div>
                  <div><strong>Enviado por:</strong> {professorNome || arquivo.usuario || arquivo.usuario_id || '—'}</div>
                  <div><strong>Data:</strong> {arquivo.created_at ? new Date(arquivo.created_at).toLocaleString('pt-BR') : '—'}</div>
                  <div><strong>Tamanho:</strong> {formatBytes(arquivo.tamanho_arquivo || arquivo.tamanho || arquivo.size || arquivo.size_bytes || arquivo.bytes)}</div>
                  <div><strong>Alunos participantes:</strong> {alunoNomes && alunoNomes.length > 0 ? alunoNomes.join(', ') : '—'}</div>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-sm text-gray-500">Ações</h3>
                <div className="mt-3 flex flex-col gap-3">
                  <a href={downloadLink(arquivo.caminho_arquivo)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold">⤓ Baixar</a>
                </div>
              </div>

            
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
