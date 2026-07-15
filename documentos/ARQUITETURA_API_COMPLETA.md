# Arquitetura Completa da API - IFPA Repositório de Projetos

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Fluxos Principais](#fluxos-principais)
5. [Modelo de Dados](#modelo-de-dados)
6. [Autenticação e Segurança](#autenticação-e-segurança)
7. [Gestão de Arquivos](#gestão-de-arquivos)
8. [Sistema de Registros](#sistema-de-registros)
9. [Relatórios de Projetos](#relatórios-de-projetos)
10. [Tratamento de Erros](#tratamento-de-erros)

---

## 🎯 Visão Geral

O sistema é uma API REST completa desenvolvida em **Node.js + Express** que gerencia um repositório de projetos acadêmicos da IFPA. A API permite:

- 👥 **Gestão de usuários** (alunos e professores)
- 📚 **Cadastro e gerenciamento de projetos**
- 📁 **Upload e armazenamento de arquivos**
- 🔐 **Autenticação com OTP (One-Time Password)**
- 📋 **Criação de registros de reuniões**
- 📊 **Geração de relatórios de projetos**
- 💰 **Gestão de custos de projetos**

---

## 🛠️ Stack Tecnológico

### Dependências Principais

| Biblioteca | Versão | Função |
|-----------|---------|---------|
| **Express** | 5.1.0 | Framework web para criar rotas e middlewares HTTP |
| **MySQL2** | 3.14.1 | Driver para conexão e queries no MySQL |
| **JWT (jsonwebtoken)** | 9.0.2 | Geração e validação de tokens de autenticação |
| **bcryptjs** | 3.0.3 | Hash seguro de senhas |
| **Multer** | 1.4.5-lts.1 | Middleware para upload de arquivos |
| **Nodemailer** | 6.9.4 | Envio de emails (OTP e notificações) |
| **CORS** | 2.8.5 | Gerenciamento de requisições cross-origin |
| **dotenv** | 16.5.0 | Carregamento de variáveis de ambiente |
| **Nodemon** | 3.1.10 | Auto-reload em desenvolvimento |
| **Jest** | 29.6.1 | Framework de testes automatizados |

### Funcionamento das Bibliotecas Principais

#### 1. **Express.js**
```
Express é o framework core da aplicação.
- Recebe requisições HTTP
- Roteia para controllers apropriados
- Aplica middlewares (CORS, autenticação, validação)
- Retorna respostas formatadas em JSON
```

#### 2. **MySQL2/Promise**
```
Conexão pooled com banco de dados MySQL
- Executa queries SQL
- Usa promises para operações assíncronas
- Mantém múltiplas conexões ativas
- Previne SQL Injection com prepared statements
```

#### 3. **JWT (JSON Web Tokens)**
```
Sistema de autenticação stateless
- Geração: token = sign({userId, role}, SECRET, {expiresIn: '24h'})
- Validação: verifica assinatura e expiração
- Armazenado no cliente (navegador)
- Enviado em cada requisição no header Authorization
```

#### 4. **bcryptjs**
```
Hash e comparação de senhas
- Hash: bcrypt.hash(senha, 10) → armazenar no DB
- Validação: bcrypt.compare(senha_entrada, hash_db)
- Impede armazenamento em texto plano
- Resistente a ataques de força bruta
```

#### 5. **Multer**
```
Processamento de upload de arquivos
- Intercepta multipart/form-data
- Salva em disco: /uploads/[nome]-[timestamp].[ext]
- Valida tipo MIME e tamanho
- Gera nomes únicos para evitar conflitos
```

#### 6. **Nodemailer**
```
Envio de emails transacionais
- Configurável via SMTP (Gmail, SendGrid, etc)
- Envio de OTP codes para autenticação
- Reset de senhas
- Notificações de eventos
```

#### 7. **CORS**
```
Controle de origem nas requisições
- Whitelist de domínios permitidos
- Configurável via env: FRONTEND_ORIGINS
- Permite credentials: true
- Headers de segurança adicionais
```

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Frontend Next.js)               │
│  - React components                                              │
│  - AuthProvider (context)                                        │
│  - API client (lib/api.js)                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST
                           │ (fetch com Authorization header)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NGINX (Reverse Proxy)                        │
│  - nginx.prod.conf                                               │
│  - SSL/TLS termination                                           │
│  - Balanceamento de requisições                                  │
│  - Cache de assets estáticos                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API (Express.js)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               1. CAMADA DE ROTAS (router.js)             │  │
│  │  - POST   /login, /register, /send-otp, /verify-otp     │  │
│  │  - GET    /selectaluno, /selectprofessor, etc            │  │
│  │  - POST   /insert*, /delete*, /update*                  │  │
│  │  - GET    /relatorio, /relatorios, /projeto, etc         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           2. MIDDLEWARES (segurança & processamento)     │  │
│  │  - CORS: validação de origem                             │  │
│  │  - authenticateToken: JWT validation                     │  │
│  │  - apiKeyAuth: verificação de API key                    │  │
│  │  - upload: multer para arquivos                          │  │
│  │  - validacao: regras de negócio                          │  │
│  │  - paginacao: limite e offset                            │  │
│  │  - publicAccess: rotas sem autenticação                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         3. CAMADA DE CONTROLLERS (controles/)            │  │
│  │  - CT_auth.js: login, register, verify, refresh-role    │  │
│  │  - CT_otp.js: send-otp, verify-otp, resend              │  │
│  │  - CT_select.js: buscar dados (GET)                     │  │
│  │  - CT_insert.js: criar registros (POST)                 │  │
│  │  - CT_update.js: atualizar registros (PUT)              │  │
│  │  - CT_delete.js: deletar registros (DELETE)             │  │
│  │  - CT_usuario_projeto.js: relações usuário-projeto      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            4. CAMADA DE MODELOS (modelos/)              │  │
│  │  - usuarios.js: operações em usuarios                    │  │
│  │  - alunos.js: CRUD de alunos                             │  │
│  │  - professores.js: CRUD de professores                   │  │
│  │  - projetos.js: CRUD de projetos                         │  │
│  │  - registros.js: CRUD de registros/atas                 │  │
│  │  - arquivos.js: gerenciamento de arquivos                │  │
│  │  - cursos.js, turmas.js, areas_academicas.js, etc        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          5. CAMADA DE AUTENTICAÇÃO (auth/)              │  │
│  │  - Geração de JWT                                        │  │
│  │  - Validação de tokens                                   │  │
│  │  - Renovação de tokens                                   │  │
│  │  - Verificação de roles (aluno/professor/admin)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          6. CAMADA DE VALIDAÇÃO (validar/)              │  │
│  │  - Regras de negócio                                     │  │
│  │  - Validação de entrada                                  │  │
│  │  - Sanitização de dados                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS MySQL                          │
│                                                                  │
│  Tabelas Principais:                                             │
│  ├─ usuarios (id, email, password, nome_usuario, ativo)         │
│  ├─ alunos (id, nome, matricula, id_curso, usuario_id)         │
│  ├─ professores (id, nome, matricula, id_area, usuario_id)     │
│  ├─ projetos (id, nome, orientador, descrição, published)      │
│  ├─ registros (id, id_projeto, data, relatorio)                │
│  ├─ arquivos (id, id_projeto, nome, caminho, tipo)             │
│  ├─ custos (id, id_projeto, descricao, valor)                  │
│  ├─ cursos, turmas, areas_academicas, etc                      │
│  └─ otps (id, email, code, expires_at, used)                   │
└──────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE ARQUIVOS                          │
│  - /uploads: armazenamento de arquivos enviados                 │
│  - Nomes únicos: [nome]-[timestamp].[ext]                       │
│  - Limite: 50MB por arquivo                                     │
│  - Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, IMG             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxos Principais

### 1. FLUXO DE AUTENTICAÇÃO (Login + OTP)

```
┌─────────────────┐
│  Cliente        │
└────────┬────────┘
         │ POST /login { email, password }
         ▼
    ┌─────────────────────────────────────┐
    │ loginController (CT_auth.js)        │
    │ 1. Busca usuário no DB              │
    │ 2. bcrypt.compare(pwd, hash)        │
    │ 3. Se 2FA=true, gera OTP            │
    │ 4. Envia OTP via email (Nodemailer) │
    │ 5. Retorna: "OTP enviado"           │
    └──────────┬──────────────────────────┘
               │
         [Usuário recebe email com código]
         │
         │ POST /verify-otp { email, code }
         ▼
    ┌─────────────────────────────────────────┐
    │ verifyOtpController (CT_otp.js)         │
    │ 1. Busca OTP no DB                      │
    │ 2. Valida expiração                     │
    │ 3. Compara hash(code + salt) com DB     │
    │ 4. jwt.sign({userId, role}, SECRET)     │
    │ 5. Marca OTP como usado                 │
    │ 6. Retorna: { token, user }             │
    └──────────┬──────────────────────────────┘
               │
         ┌─────▼──────────────────┐
         │ Cliente armazena token │
         │ em localStorage/cookie │
         └────────────────────────┘
```

**Passo a passo técnico:**

1. **CT_auth.loginController**
   - Recebe: `{ email, password }`
   - Query: `SELECT * FROM usuarios WHERE email = ?`
   - Valida: `bcrypt.compare(password, user.password)`
   - Se válido, gera OTP: `Math.floor(100000 + Math.random() * 900000)`
   - Hash do OTP: `crypto.createHash('sha256').update(code + SALT).digest('hex')`
   - Insere no DB: `INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)`
   - Envia email com Nodemailer

2. **CT_otp.verifyOtpController**
   - Recebe: `{ email, code }`
   - Query: `SELECT * FROM otps WHERE email = ? AND used = 0 ORDER BY created_at DESC LIMIT 1`
   - Compara: `hash(code_entrada + SALT) === hash_db`
   - Se válido: `jwt.sign({ id: user.id, email, role }, SECRET, { expiresIn: '24h' })`
   - Retorna token para cliente

---

### 2. FLUXO DE REGISTRO (Novo Usuário)

```
┌──────────────────────────┐
│ Cliente (Frontend)       │
│ - Preenche form          │
│ - email, password, nome  │
│ - tipo (aluno/professor) │
└───────────┬──────────────┘
            │ POST /register
            ▼
    ┌──────────────────────────────────┐
    │ registerController (CT_auth.js)  │
    │ 1. Valida email único            │
    │ 2. bcrypt.hash(password, 10)     │
    │ 3. INSERT INTO usuarios          │
    │ 4. Gera JWT com role=null        │
    │ 5. Retorna token                 │
    └──────────┬───────────────────────┘
               │
               │ Cliente agora precisa completar perfil
               │ POST /insert-aluno ou /insert-professor
               │ { nome, matricula, id_curso/id_area, ... }
               ▼
        ┌──────────────────────────────┐
        │ inserirAluno/Professor       │
        │ 1. Valida dados              │
        │ 2. INSERT INTO alunos        │
        │    ou INSERT INTO professores│
        │ 3. Atualiza usuario_id       │
        │ 4. Retorna id criado         │
        └──────────┬───────────────────┘
                   │
              [Perfil completo]
              │
              │ POST /refresh-role { token }
              ▼
        ┌──────────────────────────────┐
        │ refreshRoleController        │
        │ 1. Decodifica token atual    │
        │ 2. Query: busca novo role    │
        │ 3. Gera novo JWT com role   │
        │ 4. Retorna novo token        │
        └──────────────────────────────┘
```

---

### 3. FLUXO DE UPLOAD DE ARQUIVO

```
┌────────────────────────┐
│ Cliente (Frontend)     │
│ - Seleciona arquivo    │
│ - Preenche metadados   │
└───────────┬────────────┘
            │ POST /insert-arquivo
            │ multipart/form-data
            │ arquivo + id_projeto
            ▼
    ┌─────────────────────────────────────┐
    │ Middleware: upload.js (Multer)      │
    │                                     │
    │ 1. Intercepta multipart/form-data   │
    │ 2. Valida MIME type                 │
    │    ✓ PDF, DOC, DOCX, XLS, XLSX      │
    │    ✓ JPG, PNG, GIF, WEBP            │
    │    ✗ EXE, ZIP, etc                  │
    │ 3. Valida tamanho (max 50MB)        │
    │ 4. Gera nome único:                 │
    │    [original]-[timestamp].[ext]     │
    │ 5. Salva em /uploads/               │
    │ 6. req.file = { filename, ... }     │
    └──────────┬──────────────────────────┘
               │
        ┌──────▼──────────────────────────┐
        │ CT_insert.inserirArquivo        │
        │                                 │
        │ 1. Recebe file info             │
        │ 2. INSERT INTO arquivos         │
        │    (id_projeto, nome_original,  │
        │     caminho, tipo_arquivo)      │
        │ 3. Retorna: { id, message }     │
        └──────┬───────────────────────────┘
               │
        ┌──────▼──────────────────────────┐
        │ Cliente recebe confirmação      │
        │ Arquivo disponível em /uploads/ │
        └────────────────────────────────┘

DETALHES DO MULTER (middlewares/upload.js):

destination: (req, file, cb) => {
  // Cria pasta se não existir
  if (!fs.existsSync(uploadDir)) 
    fs.mkdirSync(uploadDir, { recursive: true })
  cb(null, uploadDir) // /uploads/
}

filename: (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const ext = path.extname(file.originalname)
  const name = path.basename(file.originalname, ext)
  cb(null, name + '-' + uniqueSuffix + ext)
  // Resultado: documento-1704067200000-123456789.pdf
}

fileFilter: (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'
  ]
  
  if (allowedMimes.includes(file.mimetype)) 
    cb(null, true)
  else 
    cb(new Error('Tipo não permitido'), false)
}

limits: {
  fileSize: 50 * 1024 * 1024 // 50 MB
}
```

---

### 4. FLUXO DE CADASTRO DE USUÁRIO

```
┌─────────────────────────────┐
│ NOVO ALUNO                  │
└──────────────┬──────────────┘
               │ POST /insert-aluno
               │ {
               │   nome_aluno,
               │   matricula_aluno (11 dígitos),
               │   id_curso,
               │   usuario_id,
               │   telefone
               │ }
               ▼
    ┌─────────────────────────────────────┐
    │ CT_insert.inserirAluno              │
    │ 1. Valida matricula.length === 11   │
    │ 2. Verifica duplicação:             │
    │    SELECT id FROM alunos            │
    │    WHERE matricula_aluno = ?        │
    │ 3. Se duplicada → erro 409          │
    │ 4. INSERT INTO alunos               │
    │ 5. Retorna: { id, message }         │
    └──────────┬──────────────────────────┘
               │
    ┌──────────▼──────────────────────────┐
    │ NOVO PROFESSOR                      │
    │ POST /insert-professor              │
    │ {                                   │
    │   nome_professor,                   │
    │   matricula_professor,              │
    │   codigo_matricula (validado),      │
    │   id_area,                          │
    │   usuario_id,                       │
    │   telefone                          │
    │ }                                   │
    └──────────┬──────────────────────────┘
               │
    ┌──────────▼──────────────────────────┐
    │ CT_insert.inserirProfessor          │
    │ 1. Valida codigo_matricula:         │
    │    SELECT FROM codigo_matricula_pro │
    │    WHERE codigo = ? AND valido = 1  │
    │ 2. Verifica matricula única         │
    │ 3. INSERT INTO professores          │
    │ 4. Retorna id criado                │
    └─────────────────────────────────────┘

VALIDAÇÕES NO DB (modelos/alunos.js):

async inserirAluno(aluno) {
  const query = `
    INSERT INTO alunos 
    (nome_aluno, matricula_aluno, id_curso, usuario_id, telefone)
    VALUES (?, ?, ?, ?, ?)
  `
  const [result] = await connection.execute(query, [
    aluno.nome_aluno,
    aluno.matricula_aluno,
    aluno.id_curso,
    aluno.usuario_id,
    aluno.telefone
  ])
  return { insertId: result.insertId }
}

FOREIGN KEYS VALIDADAS:
- usuario_id → usuarios(id)
- id_curso → cursos(id)
- id_area → areas_academicas(id)

Se FK falhar → erro 1452 (referential integrity)
```

---

### 5. FLUXO DE CRIAÇÃO DE REGISTROS (Atas de Reunião)

```
┌────────────────────────────────┐
│ Professor cria registro        │
│ (ata de reunião do projeto)    │
└───────────────┬────────────────┘
                │ POST /insert-registro
                │ {
                │   id_projeto,
                │   data_reuniao,
                │   lista_participantes,
                │   duracao_reuniao,
                │   titulo_reuniao,
                │   relatorio
                │ }
                ▼
    ┌───────────────────────────────────┐
    │ CT_insert.inserirRegistro         │
    │ (com middleware authenticateToken)│
    │                                   │
    │ 1. Valida dados obrigatórios      │
    │ 2. INSERT INTO registros          │
    │    (id_projeto, data_reuniao,     │
    │     lista_participantes,          │
    │     duracao_reuniao,              │
    │     titulo_reuniao,               │
    │     relatorio)                    │
    │ 3. Retorna: { id, message }       │
    └───────────┬──────────────────────┘
                │
        ┌───────▼──────────────────────────┐
        │ Registro armazenado               │
        │ associado ao projeto              │
        └───────────────────────────────────┘

ESTRUTURA DA TABELA (DB.sql):

CREATE TABLE registros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_projeto INT NOT NULL,
  data_reuniao DATE,
  lista_participantes TEXT,
  duracao_reuniao TIME,
  titulo_reuniao VARCHAR(255),
  relatorio LONGTEXT,
  relatorio_edit_deadline DATETIME,
  relatorio_edit_allowed TINYINT(1),
  FOREIGN KEY (id_projeto) REFERENCES projetos(id)
)

ATUALIZAÇÃO DE RELATORIO (Fluxo de Edição):

Aluno pode editar relatorio se:
- relatorio_edit_allowed = 1
- CURRENT_TIMESTAMP <= relatorio_edit_deadline

PUT /update-relatorio/:id
{
  relatorio: "Novo conteúdo do relatorio"
}

CT_update.atualizarRelatorio:
UPDATE registros 
SET relatorio = ? 
WHERE id = ? 
  AND relatorio_edit_allowed = 1 
  AND NOW() <= relatorio_edit_deadline
```

---

### 6. FLUXO DE RELATÓRIOS DE PROJETOS

```
┌──────────────────────────────┐
│ Admin/Professor              │
│ Solicita relatório            │
└────────────┬─────────────────┘
             │ GET /relatorio/:id
             │ ou
             │ GET /relatorios (todos)
             ▼
    ┌────────────────────────────────────┐
    │ CT_select.getRelatorio(s)          │
    │ (com middleware authenticateToken) │
    │                                    │
    │ 1. Query múltiplas tabelas:        │
    │    SELECT p.*, COUNT(r.id) as      │
    │           num_registros,           │
    │           COUNT(c.id) as           │
    │           num_custos,              │
    │           SUM(c.valor) as          │
    │           custo_total              │
    │    FROM projetos p                 │
    │    LEFT JOIN registros r ON ...    │
    │    LEFT JOIN custos c ON ...       │
    │    WHERE p.id = ? (ou sem WHERE)   │
    │    GROUP BY p.id                   │
    │                                    │
    │ 2. Para cada projeto:              │
    │    - Busca professor (orientador)  │
    │    - Busca alunos (matriculas)     │
    │    - Busca arquivos anexados       │
    │    - Busca custos registrados      │
    │    - Busca registros (atas)        │
    │                                    │
    │ 3. Agrega dados em JSON estruturado│
    │                                    │
    │ 4. Retorna:                        │
    │    {                               │
    │      id, nome_projeto,             │
    │      orientador: { nome, email },  │
    │      alunos: [...],                │
    │      custo_total,                  │
    │      num_registros,                │
    │      arquivos: [...],              │
    │      status,                       │
    │      data_criacao                  │
    │    }                               │
    └────────────┬───────────────────────┘
                 │
    ┌────────────▼───────────────────────┐
    │ Cliente recebe JSON estruturado    │
    │ Pode:                              │
    │ - Exibir em tabela/dashboard       │
    │ - Exportar para PDF/Excel          │
    │ - Gerar gráficos de custos         │
    │ - Visualizar timeline de eventos   │
    └────────────────────────────────────┘

QUERY COMPLEXA (modelos/projetos.js):

const getRelatorioProjeto = async (projetoId) => {
  // 1. Dados principais do projeto
  const [projetos] = await connection.execute(`
    SELECT p.*, 
           pr.nome_professor as orientador_nome,
           pr.email as orientador_email,
           COUNT(DISTINCT r.id) as num_registros,
           COUNT(DISTINCT c.id) as num_custos,
           SUM(c.valor) as custo_total
    FROM projetos p
    LEFT JOIN professores pr ON p.orientador = pr.id
    LEFT JOIN registros r ON p.id = r.id_projeto
    LEFT JOIN custos c ON p.id = c.id_projeto
    WHERE p.id = ?
    GROUP BY p.id
  `, [projetoId])
  
  const projeto = projetos[0]
  
  // 2. Arquivos anexados
  const [arquivos] = await connection.execute(`
    SELECT id, nome_arquivo, caminho, tipo, created_at
    FROM arquivos
    WHERE id_projeto = ?
  `, [projetoId])
  
  // 3. Custos detalhados
  const [custos] = await connection.execute(`
    SELECT id, descricao, valor, data_criacao
    FROM custos
    WHERE id_projeto = ?
    ORDER BY data_criacao DESC
  `, [projetoId])
  
  // 4. Registros (atas)
  const [registros] = await connection.execute(`
    SELECT id, data_reuniao, titulo_reuniao, 
           lista_participantes, duracao_reuniao
    FROM registros
    WHERE id_projeto = ?
    ORDER BY data_reuniao DESC
  `, [projetoId])
  
  // 5. Retorna agregado
  return {
    ...projeto,
    arquivos,
    custos,
    registros
  }
}
```

---

## 📊 Modelo de Dados

### Diagrama ER (Entidade-Relacionamento)

```
USUARIOS
  ├─ PK: id
  ├─ email (UNIQUE)
  ├─ password (hashed)
  ├─ nome_usuario
  ├─ ativo (BOOLEAN)
  └─ created_at

     │1:1         │1:1
     ├──────► ALUNOS (usuario_id)
     │        ├─ PK: id
     │        ├─ FK: usuario_id
     │        ├─ FK: id_curso
     │        ├─ matricula_aluno (UNIQUE, 11 dígitos)
     │        └─ nome_aluno
     │
     └──────► PROFESSORES (usuario_id)
              ├─ PK: id
              ├─ FK: usuario_id
              ├─ FK: id_area
              ├─ matricula_professor (UNIQUE)
              ├─ codigo_matricula (FK)
              └─ nome_professor
              
                   ▲
                   │FK: id_area
                   │
              AREAS_ACADEMICAS
              ├─ PK: id
              ├─ codigo_area
              ├─ nome_area
              └─ descricao_area

PROFESSORES ──────────────────────► PROJETOS
     (FK: orientador)              ├─ PK: id
                                   ├─ FK: orientador (professor)
                                   ├─ nome_projeto
                                   ├─ coorientador
                                   ├─ tipo_projeto
                                   ├─ published (BOOLEAN)
                                   └─ destaque (BOOLEAN)
                                   
                                   │1:N
                                   ├──────────► REGISTROS (id_projeto)
                                   │           ├─ PK: id
                                   │           ├─ data_reuniao
                                   │           ├─ lista_participantes
                                   │           ├─ relatorio (LONGTEXT)
                                   │           └─ duracao_reuniao
                                   │
                                   ├──────────► ARQUIVOS (id_projeto)
                                   │           ├─ PK: id
                                   │           ├─ caminho (/uploads/...)
                                   │           ├─ nome_arquivo
                                   │           ├─ tipo_arquivo (MIME)
                                   │           └─ created_at
                                   │
                                   └──────────► CUSTOS (id_projeto)
                                               ├─ PK: id
                                               ├─ descricao
                                               ├─ valor (DECIMAL)
                                               └─ data_criacao

CURSOS
├─ PK: id
├─ nome_curso
├─ coordenador
├─ duracao
└─ descricao_curso
     │
     │ FK: id_curso
     └──────► TURMAS
              ├─ PK: id
              ├─ cod_turma
              ├─ turno
              └─ quantidade_alunos
              
CODIGO_MATRICULA_PRO
├─ PK: id
├─ codigo (UNIQUE, validação de professores)
└─ matricula_valida (BOOLEAN)

USUARIO_PROJETO (tabela de junção)
├─ PK: id
├─ FK: usuario_id
├─ FK: projeto_id
├─ role ('aluno', 'professor', 'admin')
└─ data_associacao

OTP (One-Time Passwords)
├─ PK: id
├─ email
├─ code (hashed)
├─ purpose ('login', 'reset', 'verify')
├─ expires_at (DATETIME)
├─ used (BOOLEAN)
└─ created_at
```

---

## 🔐 Autenticação e Segurança

### Fluxo de Token JWT

```
GERAÇÃO:
1. User faz login + verifica OTP
2. Server cria payload:
   {
     id: usuario.id,
     email: usuario.email,
     role: 'aluno' | 'professor' | 'admin'
   }
3. Server assina com SECRET:
   jwt.sign(payload, process.env.JWT_SECRET, {
     expiresIn: '24h'
   })
4. Retorna token em Authorization header

ARMAZENAMENTO (Cliente):
- localStorage.setItem('token', token)
- ou em cookie HttpOnly

USO EM REQUISIÇÕES:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

VALIDAÇÃO (Servidor):
middleware authenticateToken:
  1. Extrai token do header Authorization
  2. jwt.verify(token, SECRET)
  3. Se válido: req.user = decoded payload
  4. Se expirado/inválido: 401 Unauthorized
  5. Próximo middleware/controller

Ciclo de Vida:
┌─ Válido ─────────────► Usar token
│
├─ Próximo ao vencer (< 1h) ─────► POST /refresh-role
│                                  Gera novo token
│
└─ Expirado ────────────────────► Redireciona para login
```

### Proteção de Senhas

```
HASHING COM BCRYPTJS:

Geração:
const hash = await bcrypt.hash(senha, 10)
// salt rounds = 10

Verificação:
const valido = await bcrypt.compare(senhaEntrada, hashDb)

Exemplo:
senha original: "minha_senha_123"
hash armazenado: $2a$10$8e.....hC (salted + hashed)
comparação: bcrypt.compare("minha_senha_123", hash) → true/false

Segurança:
- Cada hash é único (mesmo input = hash diferente)
- Impede armazenamento em texto plano
- Resistente a rainbow tables
- Resistente a força bruta (salt + rounds)
```

### OTP (One-Time Password)

```
GERAÇÃO:
1. Código: Math.floor(100000 + Math.random() * 900000)
   → 6 dígitos aleatórios (100000-999999)

2. Hash: crypto.createHash('sha256')
         .update(code + OTP_HASH_SALT)
         .digest('hex')
   → Não armazena código em texto plano

3. Armazena:
   INSERT INTO otps (email, code_hash, expires_at, used)
   VALUES ('user@email.com', 'abc123...', NOW() + 10 MIN, 0)

4. Envia email com código

VALIDAÇÃO:
1. Usuário recebe: "123456"
2. Cliente envia: POST /verify-otp { email, code: "123456" }
3. Server calcula: hash("123456" + SALT)
4. Compara com DB
5. Se match: marca como used = 1, gera JWT
6. Se mismatch: erro 401

PROTEÇÃO:
- OTP_WINDOW_MINUTES: tempo válido (padrão 10 min)
- OTP_PER_EMAIL_WINDOW: máx requisições por email
- OTP_PER_IP_WINDOW: máx requisições por IP
- VERIFY_MAX_FAILED_ATTEMPTS: máx tentativas falhas
```

### CORS e Headers de Segurança

```
CORS CONFIGURAÇÃO:

app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.FRONTEND_ORIGINS.split(',')
    if (allowed.includes(origin)) 
      callback(null, true)
    else 
      callback(new Error('CORS denied'))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 204
}))

HEADERS ADICIONAIS:

Content-Security-Policy: frame-ancestors 'self' [frontend]
  → Previne clickjacking

X-Content-Type-Options: nosniff
  → Previne MIME type sniffing

X-Frame-Options: SAMEORIGIN
  → Controla embedding em iframe

Strict-Transport-Security: max-age=31536000
  → Força HTTPS (em produção)

WHITELIST CORS:

FRONTEND_ORIGINS=https://production.com,https://staging.com
ou
FRONTEND_ORIGIN=https://production.com
```

---

## 📁 Gestão de Arquivos

### Middleware Multer

```
UPLOAD PROCESS:

1. Cliente envia: POST /insert-arquivo
   multipart/form-data:
   - arquivo: [binary file]
   - id_projeto: 5

2. Multer intercepta e valida:
   ✓ Tipo MIME permitido?
   ✓ Tamanho < 50MB?
   ✓ Extensão permitida?

3. Se ok, salva em /uploads:
   documento-1704067200000-123456789.pdf

4. req.file disponível no controller:
   {
     filename: 'documento-1704067200000-123456789.pdf',
     path: '/uploads/documento-1704067200000-123456789.pdf',
     originalname: 'documento.pdf',
     mimetype: 'application/pdf',
     size: 102400
   }

5. Controller insere no DB:
   INSERT INTO arquivos (id_projeto, nome_arquivo, caminho, tipo)
   VALUES (5, 'documento.pdf', '/uploads/documento-1704067200000-123456789.pdf', 'application/pdf')

ARQUIVO DE CONFIGURAÇÃO (middlewares/upload.js):

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.webp']
  
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`Tipo não permitido: ${file.mimetype}`), false)
  }
}

TIPOS PERMITIDOS:
┌────────────────────────────────────────┐
│ Documentos      │ Imagens              │
├────────────────────────────────────────┤
│ .pdf            │ .jpg, .jpeg          │
│ .doc, .docx     │ .png                 │
│ .xls, .xlsx     │ .gif                 │
│ .txt            │ .webp                │
└────────────────────────────────────────┘

LIMITE: 50 MB por arquivo

SEGURANÇA:
- Nomes únicos com timestamp
- Validação dupla (MIME + extensão)
- Limite de tamanho
- Armazenamento fora do /uploads público em produção (Nginx serve)
```

---

## 📋 Sistema de Registros

```
REGISTRO = Ata de Reunião do Projeto

CAMPOS:
┌─ id (PK)
├─ id_projeto (FK → projetos)
├─ data_reuniao (DATE)
├─ titulo_reuniao (VARCHAR)
├─ lista_participantes (TEXT)
├─ duracao_reuniao (TIME)
├─ relatorio (LONGTEXT)
├─ relatorio_edit_deadline (DATETIME)
├─ relatorio_edit_allowed (BOOLEAN)
└─ created_at (TIMESTAMP)

FLUXO DE USO:

1. PROFESSOR cria registro:
   POST /insert-registro
   {
     id_projeto: 5,
     data_reuniao: '2024-01-15',
     titulo_reuniao: 'Primeira reunião de planejamento',
     lista_participantes: 'João, Maria, Prof. Carlos',
     duracao_reuniao: '02:30:00',
     relatorio: 'Discutimos escopo, tecnologia...'
   }

2. ALUNO visualiza registros:
   GET /selectregistros?id_projeto=5
   Retorna todos os registros associados

3. Se relatorio_edit_allowed = 1:
   ALUNO pode editar relatorio:
   PUT /update-relatorio/123
   {
     relatorio: 'Conteúdo atualizado pelo aluno...'
   }
   
   ⚠️ Válido apenas se:
   - relatorio_edit_allowed = 1
   - CURRENT_TIMESTAMP <= relatorio_edit_deadline

4. PROFESSOR atualiza:
   PUT /update-registro/123
   {
     relatorio: 'Nova versão do professor',
     relatorio_edit_deadline: '2024-02-15T23:59:59',
     relatorio_edit_allowed: 1
   }

QUERIES SQL:

Inserir:
INSERT INTO registros 
(id_projeto, data_reuniao, lista_participantes, 
 duracao_reuniao, titulo_reuniao, relatorio,
 relatorio_edit_deadline, relatorio_edit_allowed)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)

Buscar por projeto:
SELECT r.*, p.nome_projeto 
FROM registros r
LEFT JOIN projetos p ON r.id_projeto = p.id
WHERE r.id_projeto = ?
ORDER BY r.data_reuniao DESC

Atualizar relatorio (com validação):
UPDATE registros 
SET relatorio = ? 
WHERE id = ? 
  AND relatorio_edit_allowed = 1 
  AND NOW() <= relatorio_edit_deadline

Deletar:
DELETE FROM registros WHERE id = ? AND id_projeto = ?
```

---

## 📊 Relatórios de Projetos

```
RELATÓRIO = Agregação completa de um projeto

DADOS INCLUSOS:
┌─ Informações do Projeto
│  ├─ id, nome, tipo
│  ├─ orientador (professor)
│  ├─ coorientador (nome)
│  ├─ data de criação
│  ├─ status (published/draft)
│  └─ destaque (featured)
│
├─ Alunos Envolvidos
│  ├─ Nomes
│  ├─ Matrículas
│  ├─ Email
│  └─ Telefone
│
├─ Documentos
│  ├─ Arquivos anexados
│  ├─ Data de upload
│  ├─ Tipo (PDF, DOC, etc)
│  └─ Tamanho
│
├─ Custos
│  ├─ Descrição do custo
│  ├─ Valor unitário
│  ├─ Quantidade (se aplicável)
│  ├─ Subtotal
│  └─ TOTAL
│
├─ Registros (Atas)
│  ├─ Data da reunião
│  ├─ Participantes
│  ├─ Duração
│  ├─ Relatório
│  └─ Número de registros
│
└─ Estatísticas
   ├─ Tempo total de desenvolvimento
   ├─ Número de reuniões
   ├─ Investimento total
   └─ Data da última atualização

ENDPOINT:

GET /relatorio/:id
Query: ?formato=json|pdf|excel

Resposta JSON:
{
  "id": 5,
  "nome_projeto": "Sistema de Gestão Acadêmica",
  "orientador": {
    "id": 12,
    "nome": "Prof. Carlos Silva",
    "email": "carlos@ifpa.edu.br"
  },
  "alunos": [
    {
      "nome": "João Santos",
      "matricula": "20200000001",
      "email": "joao@aluno.ifpa.edu.br"
    }
  ],
  "custos_total": 2500.00,
  "custos": [
    {
      "descricao": "Hosting na AWS",
      "valor": 50.00,
      "data": "2024-01-10"
    }
  ],
  "arquivos": [
    {
      "nome": "TCC_Final.pdf",
      "tipo": "application/pdf",
      "tamanho": 2048000,
      "data_upload": "2024-01-15"
    }
  ],
  "registros": [
    {
      "data": "2024-01-05",
      "titulo": "Primeira reunião",
      "participantes": 3,
      "duracao": "02:30:00"
    }
  ],
  "num_registros": 10,
  "status": "published",
  "data_criacao": "2024-01-01T00:00:00Z",
  "data_ultima_atualizacao": "2024-06-15T14:30:00Z"
}

GERAÇÃO:

const getRelatorio = async (req, res) => {
  try {
    const projetoId = req.params.id
    const formato = req.query.formato || 'json'
    
    // 1. Agregação de dados
    const projeto = await projetos.getProjetoComDetalhe(projetoId)
    const alunos = await getAlunosProjeto(projetoId)
    const custos = await custos.getCustosProjeto(projetoId)
    const arquivos = await arquivos.getArquivosProjeto(projetoId)
    const registros = await registros.getRegistrosProjeto(projetoId)
    
    // 2. Construir relatório
    const relatorio = {
      ...projeto,
      alunos,
      custos_total: custos.reduce((sum, c) => sum + c.valor, 0),
      custos,
      arquivos,
      num_registros: registros.length,
      registros
    }
    
    // 3. Formatar resposta
    if (formato === 'json') {
      return res.json(relatorio)
    } else if (formato === 'pdf') {
      // PDFkit para gerar PDF
      return gerarPDF(relatorio, res)
    } else if (formato === 'excel') {
      // ExcelJS para gerar XLSX
      return gerarExcel(relatorio, res)
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
```

---

## ⚠️ Tratamento de Erros

```
HTTP STATUS CODES UTILIZADOS:

200 OK
  └─ Requisição bem-sucedida, retorna dados

201 Created
  └─ Recurso criado com sucesso (POST)

204 No Content
  └─ Sucesso mas sem conteúdo na resposta (DELETE)

400 Bad Request
  └─ Erro na validação de entrada
  └─ Campo obrigatório faltando
  └─ Formato inválido

401 Unauthorized
  └─ Token inválido ou expirado
  └─ Senha incorreta
  └─ OTP inválido

403 Forbidden
  └─ Usuário não tem permissão
  └─ Usuário inativo
  └─ Recurso restrito por role

404 Not Found
  └─ Recurso não encontrado
  └─ Rota não existe

409 Conflict
  └─ Email já cadastrado
  └─ Matrícula duplicada

429 Too Many Requests
  └─ Rate limit excedido (OTP)

500 Internal Server Error
  └─ Erro no servidor
  └─ Erro no banco de dados
  └─ Erro SMTP
  └─ Erro no processamento de arquivo

FORMATO DE ERRO:

{
  "error": "Descrição do erro",
  "details": "Informação técnica adicional (opcional)"
}

EXEMPLO - Matrícula Duplicada:

POST /insert-aluno
{
  "nome_aluno": "João",
  "matricula_aluno": "12345678901",
  "id_curso": 1
}

Resposta 409:
{
  "error": "Matrícula já cadastrada para outro aluno"
}

EXEMPLO - Token Expirado:

GET /selectprojetos

Resposta 401:
{
  "error": "Token expirado"
}

Cliente deve fazer login novamente

PROTEÇÃO CONTRA ERROS COMUNS:

1. DEFINER Error (Triggers/Views):
   if (msg.includes('DEFINER'))
     return {
       error: 'Erro no BD: objeto com DEFINER inválido',
       details: 'Verifique triggers/views e recrie com DEFINER correto'
     }

2. FK Constraint Violation (1452):
   if (err.code === 'ER_NO_REFERENCED_ROW')
     return {
       error: 'Referência inválida (ex: curso não existe)'
     }

3. Unique Constraint Violation (1062):
   if (err.code === 'ER_DUP_ENTRY')
     return {
       error: 'Valor já existe (ex: email, matrícula)'
     }

4. Multer File Errors:
   if (err instanceof multer.MulterError)
     if (err.code === 'FILE_TOO_LARGE')
       return { error: 'Arquivo muito grande (máx 50MB)' }
```

---

## 📚 Exemplo de Fluxo Completo: Criar Projeto e Upload

```
┌─ CLIENTE LOGIN ─────────────────┐
│ POST /login                      │
│ POST /verify-otp → JWT token    │
└────────────┬────────────────────┘
             │
    ┌────────▼──────────────────────────┐
    │ CRIA NOVO PROJETO                │
    │ POST /insert-projeto             │
    │ {                                │
    │   nome_projeto: "Meu TCC",       │
    │   orientador: 12,                │
    │   coorientador: "Prof. Ana",     │
    │   matricula_alunos: "20200000001"│
    │ }                                │
    │                                  │
    │ Header: Authorization: Bearer ... │
    │                                  │
    │ [authenticateToken middleware]   │
    │ [validacao middleware]           │
    │ CT_insert.inserirProjeto         │
    │                                  │
    │ INSERT INTO projetos (...)       │
    │ → Retorna: { id: 42, msg: ... }  │
    └────────────┬──────────────────────┘
                 │
    ┌────────────▼──────────────────────┐
    │ UPLOAD DOCUMENTAÇÃO              │
    │ POST /insert-arquivo             │
    │ multipart/form-data:             │
    │ - arquivo: proposta.pdf (2MB)    │
    │ - id_projeto: 42                 │
    │                                  │
    │ [upload middleware - Multer]     │
    │ Valida: MIME type ✓              │
    │ Valida: tamanho < 50MB ✓         │
    │ Salva em: /uploads/proposta-...  │
    │                                  │
    │ CT_insert.inserirArquivo         │
    │ INSERT INTO arquivos (...)       │
    │ → Retorna: { id: 1, msg: ... }   │
    └────────────┬──────────────────────┘
                 │
    ┌────────────▼──────────────────────┐
    │ REGISTRA PRIMEIRA REUNIÃO        │
    │ POST /insert-registro            │
    │ {                                │
    │   id_projeto: 42,                │
    │   data_reuniao: "2024-01-10",    │
    │   titulo: "Kickoff",             │
    │   lista_participantes: "3",      │
    │   duracao: "02:00:00",           │
    │   relatorio: "Discutimos..."     │
    │ }                                │
    │                                  │
    │ CT_insert.inserirRegistro        │
    │ INSERT INTO registros (...)      │
    │ → Retorna: { id: 7, msg: ... }   │
    └────────────┬──────────────────────┘
                 │
    ┌────────────▼──────────────────────┐
    │ ADICIONA CUSTOS                  │
    │ POST /insert-custo               │
    │ {                                │
    │   id_projeto: 42,                │
    │   descricao: "Servidor AWS",     │
    │   valor: 150.00,                 │
    │   quantidade: 1                  │
    │ }                                │
    │                                  │
    │ CT_insert.inserirCusto           │
    │ INSERT INTO custos (...)         │
    │ → Retorna: { id: 5, msg: ... }   │
    └────────────┬──────────────────────┘
                 │
    ┌────────────▼──────────────────────┐
    │ GERA RELATÓRIO                   │
    │ GET /relatorio/42                │
    │                                  │
    │ CT_select.getRelatorio           │
    │ Agregação:                       │
    │ - projeto info                   │
    │ - orientador + alunos            │
    │ - 1 arquivo anexado              │
    │ - 1 registro criado              │
    │ - 1 custo registrado             │
    │ - Total gasto: R$ 150,00         │
    │                                  │
    │ Retorna: { relatório completo }  │
    └────────────────────────────────────┘

ESTRUTURA DB APÓS FLUXO:

PROJETOS:
│ id │ nome_projeto    │ orientador │ ...
├────┼─────────────────┼────────────┤
│ 42 │ Meu TCC         │ 12         │ ...
└────┴─────────────────┴────────────┘

ARQUIVOS:
│ id │ id_projeto │ nome_arquivo │ caminho              │
├────┼────────────┼──────────────┼─────────────────────┤
│ 1  │ 42         │ proposta.pdf │ /uploads/proposta...│
└────┴────────────┴──────────────┴─────────────────────┘

REGISTROS:
│ id │ id_projeto │ data_reuniao │ titulo    │ relatorio
├────┼────────────┼──────────────┼───────────┼──────────
│ 7  │ 42         │ 2024-01-10   │ Kickoff   │ Discuss...
└────┴────────────┴──────────────┴───────────┴──────────

CUSTOS:
│ id │ id_projeto │ descricao      │ valor
├────┼────────────┼────────────────┼───────
│ 5  │ 42         │ Servidor AWS   │ 150.00
└────┴────────────┴────────────────┴───────
```

---

## 🔗 Referências Externas

- [Express.js](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [JWT Introduction](https://jwt.io/introduction)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Multer File Upload](https://expressjs.com/en/resources/middleware/multer.html)
- [Nodemailer](https://nodemailer.com/)
- [CORS Specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 📝 Documentação Complementar

Veja também:
- `DB.sql` - Schema completo do banco de dados
- `API_USAGE.md` - Exemplos de requisições
- `PROD_DEPLOY_GUIDE.md` - Deploy em produção
- `NGINX_CERTBOT_INSTRUCTIONS.md` - Configuração HTTPS

---

**Última atualização:** 2024-06-26  
**Versão da API:** 1.0.0
