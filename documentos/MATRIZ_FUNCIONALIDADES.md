# 📊 Matriz de Funcionalidades - API IFPA Repositório

## Mapa Visual de Todas as Funcionalidades

Este documento fornece um mapa de referência rápida para localizar qualquer funcionalidade da API e entender onde ela é documentada.

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTENTICAÇÃO E SEGURANÇA                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1️⃣  LOGIN + OTP (Two-Factor Authentication)                    │
│    POST /login                                                  │
│    POST /verify-otp                                             │
│    ├─ Localização: EXEMPLOS_REQUISICOES.md → Autenticação      │
│    ├─ Fluxo: ARQUITETURA_API_COMPLETA.md → Fluxo Autenticação  │
│    ├─ Diagrama: DIAGRAMA_ARQUITETURA.md → Seq. Autenticação    │
│    ├─ Tecnologias: JWT, bcrypt, Nodemailer, Crypto             │
│    └─ Tempo de Resposta: ~200ms                                │
│                                                                 │
│ 2️⃣  REGISTRO DE NOVO USUÁRIO                                   │
│    POST /register                                               │
│    ├─ Localização: EXEMPLOS_REQUISICOES.md → Gestão Usuários  │
│    ├─ Fluxo: ARQUITETURA_API_COMPLETA.md → Fluxo Registro     │
│    ├─ Validação: Email único, senha forte                      │
│    └─ Retorna: Token JWT + Role null                           │
│                                                                 │
│ 3️⃣  GERENCIAMENTO DE TOKEN                                     │
│    GET /verify                                                  │
│    POST /refresh-role                                           │
│    POST /logout                                                 │
│    ├─ Duração: 24 horas                                         │
│    ├─ Renovação: Automática quando role muda                   │
│    └─ Armazenamento: localStorage/cookie                        │
│                                                                 │
│ 4️⃣  RECUPERAÇÃO DE SENHA                                       │
│    POST /request-password-reset                                 │
│    POST /reset-password                                         │
│    ├─ Fluxo: Email com OTP → Verificação → Nova senha          │
│    └─ Segurança: OTP válido por 10 minutos                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 GESTÃO DE USUÁRIOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    GESTÃO DE USUÁRIOS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🎓 ALUNOS                                                       │
│   ├─ POST /insert-aluno       Criar novo aluno                 │
│   │  └─ Exemplo: EXEMPLOS_REQUISICOES.md                       │
│   ├─ GET /selectaluno         Listar alunos (paginado)         │
│   ├─ GET /selectaluno/:id     Obter aluno específico           │
│   ├─ PUT /update-aluno/:id    Atualizar dados aluno            │
│   ├─ DELETE /delete-aluno/:id Deletar aluno                    │
│   │                                                             │
│   └─ Campos: nome, matricula (11 dígitos), id_curso,           │
│              usuario_id, telefone                              │
│   └─ Validação: Matrícula única, exactly 11 chars              │
│                                                                 │
│ 👨‍🏫 PROFESSORES                                                │
│   ├─ POST /insert-professor   Criar novo professor             │
│   ├─ GET /selectprofessor     Listar professores               │
│   ├─ GET /selectprofessor/:id Obter professor específico       │
│   ├─ PUT /update-professor    Atualizar dados professor        │
│   ├─ DELETE /delete-professor Deletar professor                │
│   │                                                             │
│   └─ Campos: nome, matricula, codigo_matricula (validado),     │
│              id_area, usuario_id, telefone                     │
│   └─ Validação: Código professor deve ser válido               │
│                                                                 │
│ 📍 ÁREAS ACADÊMICAS                                             │
│   ├─ GET /selectareas         Listar todas as áreas            │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                          │
│                                                                 │
│ 🎓 CURSOS                                                       │
│   ├─ GET /selectcursos        Listar cursos                    │
│   └─ Campos: nome, coordenador, duracao, descricao             │
│                                                                 │
│ 📚 TURMAS                                                       │
│   ├─ GET /selectturmas        Listar turmas                    │
│   └─ Relacionadas ao curso                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 GESTÃO DE PROJETOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    GESTÃO DE PROJETOS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ➕ CRIAR PROJETO                                               │
│   POST /insert-projeto                                          │
│   ├─ Exemplo: EXEMPLOS_REQUISICOES.md → Gestão Projetos       │
│   ├─ Campos: nome, orientador (FK), coorientador,             │
│   │           matriculas_alunos, tipo, nomes_autores           │
│   └─ Retorna: { id, message }                                 │
│                                                                 │
│ 📋 LISTAR PROJETOS                                             │
│   GET /selectprojeto                                            │
│   ├─ Paginação: ?limit=20&offset=0                            │
│   ├─ Filtros: ?published=1&destaque=1                         │
│   ├─ Retorna: Lista com resumo (sem detalhes completos)       │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 🔍 DETALHES DO PROJETO (COMPLETO)                             │
│   GET /selectprojeto/:id                                        │
│   ├─ Retorna: Projeto com todas as relações                   │
│   ├─ Inclui: Alunos, orientador, arquivos, custos,            │
│   │           registros, estatísticas                          │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ ✏️  ATUALIZAR PROJETO                                          │
│   PUT /update-projeto/:id                                       │
│   ├─ Campos atualizáveis: nome, orientador, published,        │
│   │                        destaque, coorientador              │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 🗑️  DELETAR PROJETO                                            │
│   DELETE /delete-projeto/:id                                    │
│   └─ Remove também: Arquivos, registros, custos relacionados  │
│                                                                 │
│ 👫 ASSOCIAÇÃO USUÁRIO-PROJETO                                 │
│   POST /insert-usuario-projeto                                  │
│   GET /selectusuario-projeto                                    │
│   ├─ Controllers: CT_usuario_projeto.js                       │
│   └─ Gerencia: quem é aluno/professor de qual projeto         │
│                                                                 │
│ 🔗 MEUS PROJETOS (Do usuário autenticado)                      │
│   GET /selectmeusprojetos                                       │
│   ├─ Params: ?tipo=professor|aluno                            │
│   ├─ Role-aware: Retorna projetos do usuário logado           │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 UPLOAD DE ARQUIVOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    UPLOAD DE ARQUIVOS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📤 UPLOAD SIMPLES                                              │
│   POST /insert-arquivo                                          │
│   ├─ Content-Type: multipart/form-data                         │
│   ├─ Arquivo max: 50 MB                                        │
│   ├─ Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX,            │
│   │                    TXT, JPG, PNG, GIF, WEBP               │
│   ├─ Middleware: Multer (middlewares/upload.js)               │
│   ├─ Armazenamento: /uploads/[nome]-[timestamp].[ext]        │
│   ├─ Exemplo: EXEMPLOS_REQUISICOES.md → Upload Arquivos      │
│   ├─ Documentação: ARQUITETURA_API_COMPLETA.md → Gestão       │
│   │                Arquivos e Multer                          │
│   └─ Retorna: { id, arquivo_info }                           │
│                                                                 │
│ 📤 UPLOAD MÚLTIPLO                                             │
│   POST /insert-arquivo (com múltiplos fields)                  │
│   ├─ Processa 1+ arquivos em uma requisição                   │
│   ├─ Validação individual de cada arquivo                     │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📂 LISTAR ARQUIVOS                                             │
│   GET /selectarquivos                                           │
│   ├─ Filtro: ?id_projeto=42                                   │
│   ├─ Paginação: ?limit=10&offset=0                            │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📄 OBTER ARQUIVO                                              │
│   GET /selectarquivos/:id                                       │
│   ├─ Metadados: nome, tipo, tamanho, data, caminho           │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ ⚙️  CONFIGURAÇÃO MULTER                                        │
│   ├─ Storage: Disco local em /uploads/                        │
│   ├─ Filename: unique timestamp + random ID                   │
│   ├─ Filefilter: MIME type + extensão validation              │
│   ├─ Limite: 50 * 1024 * 1024 bytes                          │
│   └─ Documentação: ARQUITETURA_API_COMPLETA.md                │
│                                                                 │
│ 🔐 SEGURANÇA                                                   │
│   ├─ Validação dupla: MIME + extensão                         │
│   ├─ Nomes únicos: evita sobrescrita                          │
│   ├─ Limite de tamanho: impede DoS                            │
│   └─ Tipos whitelist: impede execução                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 REGISTROS E ATAS DE REUNIÃO

```
┌─────────────────────────────────────────────────────────────────┐
│                 REGISTROS E ATAS DE REUNIÃO                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ➕ CRIAR REGISTRO                                              │
│   POST /insert-registro                                         │
│   ├─ Criado por: Professor/Orientador                         │
│   ├─ Campos: id_projeto, data_reuniao, titulo, lista_        │
│   │           participantes, duracao, relatorio               │
│   ├─ Exemplo: EXEMPLOS_REQUISICOES.md → Registros Atas       │
│   └─ Documentação: ARQUITETURA_API_COMPLETA.md               │
│                    → Sistema de Registros                     │
│                                                                 │
│ 📂 LISTAR REGISTROS                                            │
│   GET /selectregistros                                          │
│   ├─ Filtro: ?id_projeto=42                                   │
│   ├─ Retorna: Todos os registros de um projeto                │
│   ├─ Paginação: ?limit=10&offset=0                            │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📄 OBTER REGISTRO                                              │
│   GET /selectregistro/:id                                       │
│   ├─ Retorna: Registro único com todos os detalhes            │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ ✏️  ATUALIZAR REGISTRO (Professor)                             │
│   PUT /update-registro/:id                                      │
│   ├─ Pode modificar: Todos os campos                          │
│   ├─ Pode definir: Prazo de edição para alunos                │
│   ├─ Campo: relatorio_edit_deadline                           │
│   ├─ Campo: relatorio_edit_allowed (1=sim, 0=não)             │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📝 EDITAR RELATÓRIO (Aluno)                                    │
│   PUT /update-relatorio/:id                                     │
│   ├─ Permissão: Apenas se relatorio_edit_allowed = 1          │
│   ├─ Validação: NOW() <= relatorio_edit_deadline              │
│   ├─ Campo: relatorio (LONGTEXT)                              │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 🗑️  DELETAR REGISTRO                                           │
│   DELETE /delete-registro/:id                                   │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📊 ESTRUTURA DA TABELA                                         │
│   ├─ registros.id (PK)                                         │
│   ├─ registros.id_projeto (FK → projetos.id)                  │
│   ├─ registros.data_reuniao (DATE)                            │
│   ├─ registros.titulo_reuniao (VARCHAR)                       │
│   ├─ registros.lista_participantes (TEXT)                     │
│   ├─ registros.duracao_reuniao (TIME)                         │
│   ├─ registros.relatorio (LONGTEXT)                           │
│   ├─ registros.relatorio_edit_deadline (DATETIME)             │
│   ├─ registros.relatorio_edit_allowed (BOOLEAN)               │
│   └─ registros.created_at (TIMESTAMP)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💰 GESTÃO DE CUSTOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    GESTÃO DE CUSTOS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ➕ ADICIONAR CUSTO                                             │
│   POST /insert-custo                                            │
│   ├─ Campos: id_projeto, descricao, valor, quantidade         │
│   ├─ Exemplo: EXEMPLOS_REQUISICOES.md → Relatórios           │
│   └─ Documentação: ARQUITETURA_API_COMPLETA.md               │
│                                                                 │
│ 📂 LISTAR CUSTOS                                               │
│   GET /selectcustos                                             │
│   ├─ Filtro: ?id_projeto=42                                   │
│   ├─ Retorna: Todos os custos de um projeto                   │
│   └─ Paginação: ?limit=20&offset=0                            │
│                                                                 │
│ 📊 CUSTO TOTAL                                                 │
│   Agregação automática:                                         │
│   ├─ SUM(valor * quantidade) = TOTAL                          │
│   └─ Incluído em: /relatorio/:id                              │
│                                                                 │
│ ✏️  ATUALIZAR CUSTO                                            │
│   PUT /update-custo/:id                                         │
│   └─ Campos: descricao, valor, quantidade                     │
│                                                                 │
│ 🗑️  DELETAR CUSTO                                              │
│   DELETE /delete-custo/:id                                      │
│   └─ Remove apenas o custo, não afeta projeto                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 RELATÓRIOS DE PROJETOS

```
┌─────────────────────────────────────────────────────────────────┐
│                  RELATÓRIOS DE PROJETOS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📋 RELATÓRIO COMPLETO                                          │
│   GET /relatorio/:id                                            │
│   ├─ Retorna: Projeto com agregações completas                │
│   ├─ Inclui:                                                   │
│   │  ├─ Dados do projeto (nome, tipo, published, destaque)    │
│   │  ├─ Orientador (nome, email, telefone)                    │
│   │  ├─ Alunos (nomes, matrículas, emails)                    │
│   │  ├─ Arquivos (nomes, caminhos, tamanhos)                  │
│   │  ├─ Custos (descrição, valor, subtotal)                   │
│   │  ├─ Custo Total Agregado                                  │
│   │  ├─ Registros (atas de reuniões)                          │
│   │  ├─ Número de registros                                   │
│   │  ├─ Resumo executivo (datas, status)                      │
│   │  └─ Timestamps (criação, última atualização)              │
│   ├─ Exemplo: EXEMPLOS_REQUISICOES.md → Relatórios          │
│   └─ Documentação: ARQUITETURA_API_COMPLETA.md               │
│                    → Relatórios de Projetos                   │
│                                                                 │
│ 📋 LISTAR TODOS OS RELATÓRIOS                                 │
│   GET /relatorios                                               │
│   ├─ Filtros: ?published=1&destaque=1                        │
│   ├─ Paginação: ?limit=20&offset=0                            │
│   ├─ Retorna: Lista resumida (sem detalhes completos)        │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📥 EXPORTAR PARA PDF                                           │
│   GET /relatorio/:id?formato=pdf                               │
│   ├─ Retorna: Arquivo PDF pronto para download                │
│   ├─ Headers: Content-Type: application/pdf                   │
│   ├─ Filename: projeto_42_relatorio.pdf                       │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📥 EXPORTAR PARA EXCEL                                         │
│   GET /relatorio/:id?formato=excel                             │
│   ├─ Retorna: Arquivo XLSX (Excel)                            │
│   ├─ Headers: Content-Type: application/vnd.openxml...        │
│   ├─ Filename: projeto_42_relatorio.xlsx                      │
│   └─ Exemplo: EXEMPLOS_REQUISICOES.md                         │
│                                                                 │
│ 📊 ESTATÍSTICAS INCLUÍDAS                                      │
│   ├─ Data de início do projeto                                │
│   ├─ Dias decorridos desde criação                            │
│   ├─ Número de reuniões realizadas                            │
│   ├─ Data da última reunião                                   │
│   ├─ Total de arquivos anexados                               │
│   ├─ Tamanho total dos arquivos                               │
│   ├─ Investimento total (soma de custos)                      │
│   └─ Status do projeto (em_desenvolvimento/concluído)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 MIDDLEWARES UTILIZADOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARES UTILIZADOS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🔒 CORS (CORS Middleware)                                      │
│   ├─ Valida: Origin header                                     │
│   ├─ Whitelist: FRONTEND_ORIGINS (env)                         │
│   ├─ Permite: GET, POST, PUT, DELETE, OPTIONS                 │
│   ├─ Headers: Authorization, Content-Type, x-api-key          │
│   └─ Documentação: ARQUITETURA_API_COMPLETA.md               │
│                    → CORS e Headers                            │
│                                                                 │
│ 🔑 Authentication (authenticateToken)                          │
│   ├─ Extrai: Bearer token do header Authorization             │
│   ├─ Valida: JWT signature e expiração                        │
│   ├─ Decodifica: Payload em req.user                          │
│   └─ Documentação: autenticacao/auth.js                        │
│                                                                 │
│ 🔐 API Key Auth (apiKeyAuth)                                   │
│   ├─ Aceita: x-api-key header ou ?api_key=valor              │
│   ├─ Validação: Compara com ADMIN_API_KEY (env)               │
│   └─ Uso: Rotas GET públicas (select)                         │
│                                                                 │
│ 📤 Upload (Multer Middleware)                                  │
│   ├─ Intercepta: multipart/form-data                          │
│   ├─ Valida: MIME type e tamanho                              │
│   ├─ Salva: /uploads/[nome]-[timestamp].[ext]                │
│   ├─ Limpa: Arquivo não vai pro req.body                      │
│   └─ Documentação: middlewares/upload.js                       │
│                                                                 │
│ ✅ Validation (Validação de Entrada)                           │
│   ├─ Valida: Campos obrigatórios                              │
│   ├─ Valida: Tipos de dados                                   │
│   ├─ Valida: Tamanho mínimo/máximo                            │
│   ├─ Valida: Padrões (email, telefone)                        │
│   └─ Documentação: validar/validacao.js                        │
│                                                                 │
│ 📄 Pagination (Paginação)                                      │
│   ├─ Params: ?limit=10&offset=0                               │
│   ├─ Padrão: limit=10, offset=0                               │
│   ├─ Máximo: limit=100                                         │
│   └─ SQL: LIMIT ? OFFSET ?                                     │
│                                                                 │
│ 🌐 Public Access (publicAccess)                                │
│   ├─ Marca rotas: Acessíveis sem autenticação                 │
│   ├─ Exemplos: /login, /register, /send-otp                  │
│   └─ Controle: Lista de rotas públicas                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ BANCO DE DADOS

```
┌─────────────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS (MySQL)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📋 TABELAS PRINCIPAIS                                          │
│   ├─ usuarios (users)                                          │
│   ├─ alunos (students)                                         │
│   ├─ professores (teachers)                                    │
│   ├─ projetos (projects)                                       │
│   ├─ registros (meeting records)                               │
│   ├─ arquivos (files)                                          │
│   ├─ custos (costs)                                            │
│   ├─ cursos (courses)                                          │
│   ├─ turmas (classes)                                          │
│   ├─ areas_academicas (academic areas)                         │
│   ├─ usuario_projeto (user-project association)                │
│   ├─ codigo_matricula_pro (professor codes)                    │
│   └─ otps (one-time passwords)                                 │
│                                                                 │
│ 🔗 RELACIONAMENTOS PRINCIPAIS                                  │
│   ├─ usuarios → alunos (1:1)                                   │
│   ├─ usuarios → professores (1:1)                              │
│   ├─ professores → projetos (1:N) [orientador]                │
│   ├─ projetos → registros (1:N)                                │
│   ├─ projetos → arquivos (1:N)                                 │
│   ├─ projetos → custos (1:N)                                   │
│   ├─ cursos → alunos (1:N)                                     │
│   ├─ areas_academicas → professores (1:N)                      │
│   └─ código_matricula → professores (1:N)                      │
│                                                                 │
│ 📊 SCHEMA                                                       │
│   └─ Documentação: ARQUITETURA_API_COMPLETA.md               │
│                    → Modelo de Dados                          │
│   └─ SQL: backend2/src/DBmysql/DB.sql                         │
│                                                                 │
│ 💾 CONEXÃO                                                      │
│   ├─ Driver: MySQL2 com promises                              │
│   ├─ Pool: Múltiplas conexões ativas                          │
│   ├─ Arquivo: backend2/src/DBmysql/conectaraoDB.js           │
│   └─ Config: .env (MYSQL_HOST, USER, PASSWORD, DB)            │
│                                                                 │
│ 🛡️  SEGURANÇA DB                                               │
│   ├─ Prepared Statements: Previne SQL injection                │
│   ├─ Foreign Keys: Integridade referencial                     │
│   ├─ Unique Constraints: email, matricula                     │
│   ├─ Índices: Para performance                                 │
│   └─ Hash: Senhas com bcrypt                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 CAMADA DE ROTAS

```
┌─────────────────────────────────────────────────────────────────┐
│               CAMADA DE ROTAS (router.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🔐 ROTAS PÚBLICAS (sem autenticação)                           │
│   ├─ POST /login                Fazer login                    │
│   ├─ POST /register             Registrar novo usuário         │
│   ├─ POST /send-otp             Enviar OTP                     │
│   ├─ POST /verify-otp           Verificar OTP                  │
│   ├─ POST /request-password-reset Resetar senha               │
│   ├─ POST /reset-password       Confirmar novo password       │
│   ├─ GET /verify                Verificar token (qualquer um)  │
│   ├─ POST /logout               Logout                         │
│   ├─ POST /guest-token          Token para convidados         │
│   └─ POST /refresh-role         Atualizar role após profile   │
│                                                                 │
│ 🔑 ROTAS COM API KEY (x-api-key)                               │
│   ├─ GET /selectaluno           Listar alunos                 │
│   ├─ GET /selectaluno/:id       Obter aluno                   │
│   ├─ GET /selectprofessor       Listar professores            │
│   ├─ GET /selectprofessor/:id   Obter professor               │
│   ├─ GET /selectareas           Listar áreas                  │
│   ├─ GET /selectarquivos        Listar arquivos               │
│   ├─ GET /selectarquivos/:id    Obter arquivo                 │
│   ├─ GET /selectcursos          Listar cursos                 │
│   ├─ GET /selectcustos          Listar custos                 │
│   ├─ GET /selectmeusprojetos    Meus projetos                 │
│   ├─ GET /selectprojeto         Listar projetos               │
│   ├─ GET /selectprojeto/:id     Obter projeto                 │
│   ├─ GET /selectregistros       Listar registros              │
│   └─ GET /selectregistro/:id    Obter registro                │
│                                                                 │
│ 🔒 ROTAS COM AUTENTICAÇÃO JWT                                  │
│   ├─ POST /insert-aluno         Criar aluno                   │
│   ├─ POST /insert-professor     Criar professor               │
│   ├─ POST /insert-projeto       Criar projeto                 │
│   ├─ POST /insert-arquivo       Upload arquivo                │
│   ├─ POST /insert-registro      Criar registro                │
│   ├─ POST /insert-custo         Adicionar custo               │
│   ├─ PUT /update-aluno/:id      Atualizar aluno               │
│   ├─ PUT /update-professor/:id  Atualizar professor           │
│   ├─ PUT /update-projeto/:id    Atualizar projeto             │
│   ├─ PUT /update-registro/:id   Atualizar registro            │
│   ├─ PUT /update-relatorio/:id  Aluno edita relatório         │
│   ├─ PUT /update-custo/:id      Atualizar custo               │
│   ├─ DELETE /delete-aluno/:id   Deletar aluno                 │
│   ├─ DELETE /delete-projeto/:id Deletar projeto               │
│   ├─ DELETE /delete-registro/:id Deletar registro              │
│   ├─ DELETE /delete-arquivo/:id Deletar arquivo               │
│   ├─ DELETE /delete-custo/:id   Deletar custo                 │
│   ├─ GET /relatorio/:id         Relatório completo            │
│   └─ GET /relatorios            Todos os relatórios           │
│                                                                 │
│ 📝 ARQUIVO DE ROTAS                                             │
│   └─ backend2/src/router.js                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 TABELA DE REFERÊNCIA RÁPIDA

| Funcionalidade | Método | Endpoint | Auth | Localização Docs |
|---|---|---|---|---|
| Login | POST | /login | ❌ | EXEMPLOS → Auth |
| Verificar OTP | POST | /verify-otp | ❌ | EXEMPLOS → Auth |
| Registrar | POST | /register | ❌ | EXEMPLOS → Usuários |
| Criar Aluno | POST | /insert-aluno | 🔐 JWT | EXEMPLOS → Usuários |
| Listar Alunos | GET | /selectaluno | 🔑 API-Key | EXEMPLOS → Usuários |
| Criar Projeto | POST | /insert-projeto | 🔐 JWT | EXEMPLOS → Projetos |
| Listar Projetos | GET | /selectprojeto | 🔑 API-Key | EXEMPLOS → Projetos |
| Upload Arquivo | POST | /insert-arquivo | 🔐 JWT | EXEMPLOS → Upload |
| Criar Registro | POST | /insert-registro | 🔐 JWT | EXEMPLOS → Registros |
| Criar Custo | POST | /insert-custo | 🔐 JWT | EXEMPLOS → Custos |
| Relatório | GET | /relatorio/:id | 🔐 JWT | EXEMPLOS → Relatórios |
| Exportar PDF | GET | /relatorio/:id?fmt=pdf | 🔐 JWT | EXEMPLOS → Relatórios |
| Exportar Excel | GET | /relatorio/:id?fmt=excel | 🔐 JWT | EXEMPLOS → Relatórios |

---

## 🎯 Como Usar Este Documento

1. **Procure por funcionalidade** no índice acima
2. **Identifique a rota** e seu tipo de autenticação
3. **Consulte EXEMPLOS_REQUISICOES.md** para ver exemplo
4. **Leia ARQUITETURA_API_COMPLETA.md** para entender o fluxo
5. **Visualize DIAGRAMA_ARQUITETURA.md** para ver integração

---

**Última Atualização:** 2024-06-26  
**Versão:** 1.0.0
