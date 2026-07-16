function buildArquivoPayload(body = {}, file = null) {
  const source = body || {};
  const payload = {};

  if (source.projeto_id !== undefined) payload.projeto_id = source.projeto_id ?? null;
  if (source.id_meuprojeto !== undefined) payload.id_meuprojeto = source.id_meuprojeto ?? null;
  if (source.nome_projeto !== undefined) payload.nome_projeto = source.nome_projeto ?? null;
  if (source.resumo !== undefined) payload.resumo = source.resumo ?? '';

  if (file) {
    payload.caminho_arquivo = file.filename || null;
    payload.tipo_arquivo = file.mimetype || null;
    payload.tamanho_arquivo = file.size || 0;
  }

  const displayName = source.nome_arquivo ?? source.display_name ?? null;
  payload.nome_arquivo = displayName || (file ? file.originalname || null : null);

  return payload;
}

module.exports = { buildArquivoPayload };
