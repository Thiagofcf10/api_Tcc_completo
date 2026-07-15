# Exemplos Práticos de Requisições - API IFPA Repositório

## 📌 Índice
- [Autenticação](#autenticação)
- [Gestão de Usuários](#gestão-de-usuários)
- [Gestão de Projetos](#gestão-de-projetos)
- [Upload de Arquivos](#upload-de-arquivos)
- [Registros e Atas](#registros-e-atas)
- [Relatórios](#relatórios)
- [Tratamento de Erros](#tratamento-de-erros)

---

## 🔐 Autenticação

### 1. Login

**Requisição:**
```http
POST /login HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json

{
  "email": "joao@aluno.ifpa.edu.br",
  "password": "senha_segura_123"
}
```

**Resposta Sucesso (200):**
```json
{
  "message": "OTP enviado para seu email",
  "requiresOtp": true,
  "email": "joao@aluno.ifpa.edu.br"
}
```

**Resposta Erro - Email não encontrado (401):**
```json
{
  "error": "Usuário não encontrado"
}
```

**Resposta Erro - Usuário inativo (403):**
```json
{
  "error": "Usuário inativo"
}
```

**Resposta Erro - Senha incorreta (401):**
```json
{
  "error": "Senha incorreta"
}
```

---

### 2. Verificar OTP

**Requisição:**
```http
POST /verify-otp HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json

{
  "email": "joao@aluno.ifpa.edu.br",
  "code": "123456"
}
```

**Resposta Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZV91c3VhcmlvIjoiam9hbyIsImVtYWlsIjoiam9hb0BhbHVuby5pZnBhLmVkdS5iciIsInJvbGUiOiJhbHVubyIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA0MTUzNjAwfQ.abc123xyz",
  "user": {
    "id": 1,
    "email": "joao@aluno.ifpa.edu.br",
    "role": "aluno",
    "nome_usuario": "joao"
  }
}
```

**Resposta Erro - OTP expirado (401):**
```json
{
  "error": "OTP expirado",
  "details": "O código de verificação perdeu validade. Solicite um novo."
}
```

**Resposta Erro - OTP inválido (401):**
```json
{
  "error": "OTP inválido"
}
```

**Resposta Erro - Muitas tentativas (429):**
```json
{
  "error": "Muitas tentativas falhas. Aguarde 15 minutos.",
  "retryAfter": 900
}
```

---

### 3. Reenviar OTP

**Requisição:**
```http
POST /send-otp HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json

{
  "email": "joao@aluno.ifpa.edu.br"
}
```

**Resposta Sucesso (200):**
```json
{
  "message": "Novo código de verificação enviado para joao@aluno.ifpa.edu.br",
  "expiresIn": 600
}
```

---

### 4. Logout

**Requisição:**
```http
POST /logout HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### 5. Verificar Token

**Requisição:**
```http
GET /verify HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "joao@aluno.ifpa.edu.br",
    "role": "aluno",
    "expiresIn": 82400
  }
}
```

**Resposta Erro - Token expirado (401):**
```json
{
  "error": "Token expirado"
}
```

---

## 👥 Gestão de Usuários

### 1. Registrar Novo Usuário

**Requisição:**
```http
POST /register HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json

{
  "email": "novo_aluno@aluno.ifpa.edu.br",
  "password": "Senha@Forte123",
  "nome_usuario": "novo_aluno",
  "tipo": "aluno"
}
```

**Resposta Sucesso (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 42,
    "email": "novo_aluno@aluno.ifpa.edu.br",
    "nome_usuario": "novo_aluno",
    "role": null
  },
  "message": "Usuário criado com sucesso. Complete seu perfil."
}
```

**Resposta Erro - Email já cadastrado (409):**
```json
{
  "error": "Email já cadastrado. Faça login ou use outro email."
}
```

---

### 2. Criar Perfil de Aluno

**Requisição:**
```http
POST /insert-aluno HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nome_aluno": "João Santos Silva",
  "matricula_aluno": "20200000001",
  "id_curso": 1,
  "usuario_id": 42,
  "telefone": "(91) 98765-4321"
}
```

**Resposta Sucesso (201):**
```json
{
  "message": "Aluno criado com sucesso",
  "id": 15
}
```

**Resposta Erro - Matrícula inválida (400):**
```json
{
  "error": "Matrícula do aluno deve ter exatamente 11 caracteres"
}
```

**Resposta Erro - Matrícula duplicada (409):**
```json
{
  "error": "Matrícula já cadastrada para outro aluno"
}
```

---

### 3. Criar Perfil de Professor

**Requisição:**
```http
POST /insert-professor HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nome_professor": "Prof. Dr. Carlos Alberto",
  "matricula_professor": "202100001",
  "codigo_matricula": "PROF_CODE_2024",
  "id_area": 2,
  "usuario_id": 43,
  "telefone": "(91) 99876-5432"
}
```

**Resposta Sucesso (201):**
```json
{
  "message": "Professor criado com sucesso",
  "id": 8
}
```

**Resposta Erro - Código de matrícula inválido (400):**
```json
{
  "error": "Código de matrícula inválido ou expirado"
}
```

---

### 4. Listar Alunos

**Requisição:**
```http
GET /selectaluno?limit=10&offset=0 HTTP/1.1
Host: api.ifpa.edu.br
x-api-key: sua-chave-api-aqui
```

**Resposta Sucesso (200):**
```json
{
  "total": 150,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "nome_aluno": "João Santos Silva",
      "matricula_aluno": "20200000001",
      "id_curso": 1,
      "usuario_id": 1,
      "telefone": "(91) 98765-4321",
      "created_at": "2024-01-10T08:30:00Z"
    },
    {
      "id": 2,
      "nome_aluno": "Maria Oliveira Costa",
      "matricula_aluno": "20200000002",
      "id_curso": 1,
      "usuario_id": 2,
      "telefone": "(91) 98765-4322",
      "created_at": "2024-01-10T09:15:00Z"
    }
  ]
}
```

---

### 5. Obter Aluno por ID

**Requisição:**
```http
GET /selectaluno/1 HTTP/1.1
Host: api.ifpa.edu.br
x-api-key: sua-chave-api-aqui
```

**Resposta Sucesso (200):**
```json
{
  "id": 1,
  "nome_aluno": "João Santos Silva",
  "matricula_aluno": "20200000001",
  "id_curso": 1,
  "usuario_id": 1,
  "telefone": "(91) 98765-4321",
  "created_at": "2024-01-10T08:30:00Z"
}
```

---

## 📚 Gestão de Projetos

### 1. Criar Novo Projeto

**Requisição:**
```http
POST /insert-projeto HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nome_projeto": "Sistema de Gestão de Projetos Integrador",
  "orientador": 5,
  "coorientador": "Prof. Ana Silva",
  "matricula_alunos": "20200000001,20200000002,20200000003",
  "nome_autores": "João Santos; Maria Oliveira; Pedro Silva",
  "tipo_projeto": "Integrador"
}
```

**Resposta Sucesso (201):**
```json
{
  "message": "Projeto criado com sucesso",
  "id": 42
}
```

---

### 2. Listar Projetos

**Requisição:**
```http
GET /selectprojeto?limit=20&offset=0 HTTP/1.1
Host: api.ifpa.edu.br
x-api-key: sua-chave-api-aqui
```

**Resposta Sucesso (200):**
```json
{
  "total": 85,
  "limit": 20,
  "offset": 0,
  "data": [
    {
      "id": 42,
      "nome_projeto": "Sistema de Gestão de Projetos",
      "orientador": 5,
      "coorientador": "Prof. Ana Silva",
      "tipo_projeto": "Integrador",
      "published": true,
      "published_at": "2024-03-15T10:00:00Z",
      "destaque": true,
      "created_at": "2024-01-10T08:30:00Z",
      "num_registros": 5,
      "custo_total": 2500.00
    }
  ]
}
```

---

### 3. Obter Projeto Completo (com detalhes)

**Requisição:**
```http
GET /selectprojeto/42 HTTP/1.1
Host: api.ifpa.edu.br
x-api-key: sua-chave-api-aqui
```

**Resposta Sucesso (200):**
```json
{
  "id": 42,
  "nome_projeto": "Sistema de Gestão de Projetos",
  "orientador": {
    "id": 5,
    "nome_professor": "Prof. Dr. Carlos Alberto",
    "email": "carlos@ifpa.edu.br"
  },
  "coorientador": "Prof. Ana Silva",
  "alunos": [
    {
      "id": 1,
      "nome_aluno": "João Santos Silva",
      "matricula": "20200000001",
      "email": "joao@aluno.ifpa.edu.br"
    }
  ],
  "tipo_projeto": "Integrador",
  "published": true,
  "destaque": true,
  "arquivos": [
    {
      "id": 1,
      "nome_arquivo": "proposta_projeto.pdf",
      "caminho": "/uploads/proposta_projeto-1704067200000.pdf",
      "tipo": "application/pdf",
      "tamanho": 2048000,
      "created_at": "2024-01-10T08:30:00Z"
    }
  ],
  "custos": [
    {
      "id": 1,
      "descricao": "Servidor AWS",
      "valor": 150.00,
      "quantidade": 1,
      "subtotal": 150.00,
      "data_criacao": "2024-01-15T14:00:00Z"
    }
  ],
  "custos_total": 2500.00,
  "registros": [
    {
      "id": 1,
      "data_reuniao": "2024-01-15",
      "titulo_reuniao": "Primeira reunião",
      "lista_participantes": "João, Maria, Prof. Carlos",
      "duracao_reuniao": "02:30:00"
    }
  ],
  "num_registros": 5,
  "created_at": "2024-01-10T08:30:00Z",
  "updated_at": "2024-06-20T15:45:00Z"
}
```

---

### 4. Atualizar Projeto

**Requisição:**
```http
PUT /update-projeto/42 HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nome_projeto": "Sistema de Gestão de Projetos v2.0",
  "orientador": 5,
  "published": true,
  "destaque": false
}
```

**Resposta Sucesso (200):**
```json
{
  "message": "Projeto atualizado com sucesso",
  "id": 42
}
```

---

### 5. Deletar Projeto

**Requisição:**
```http
DELETE /delete-projeto/42 HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```json
{
  "message": "Projeto deletado com sucesso"
}
```

---

## 📁 Upload de Arquivos

### 1. Upload Único

**Requisição:**
```http
POST /insert-arquivo HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

------WebKitFormBoundary
Content-Disposition: form-data; name="arquivo"; filename="proposta.pdf"
Content-Type: application/pdf

[Conteúdo binário do PDF]
------WebKitFormBoundary
Content-Disposition: form-data; name="id_projeto"

42
------WebKitFormBoundary--
```

**Resposta Sucesso (201):**
```json
{
  "message": "Arquivo criado com sucesso",
  "id": 156,
  "arquivo": {
    "id": 156,
    "nome_arquivo": "proposta.pdf",
    "caminho": "/uploads/proposta-1704067200000-123456789.pdf",
    "tipo": "application/pdf",
    "tamanho": 2048000,
    "id_projeto": 42,
    "created_at": "2024-06-20T15:45:00Z"
  }
}
```

**Resposta Erro - Tipo não permitido (400):**
```json
{
  "error": "Tipo de arquivo não permitido: application/x-msdownload. Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, WEBP"
}
```

**Resposta Erro - Arquivo muito grande (413):**
```json
{
  "error": "Arquivo muito grande. Máximo permitido: 50 MB"
}
```

---

### 2. Upload Múltiplo

**Requisição (cURL):**
```bash
curl -X POST http://api.ifpa.edu.br/insert-arquivo \
  -H "Authorization: Bearer eyJ..." \
  -F "arquivo=@proposta.pdf" \
  -F "arquivo=@relatorio.docx" \
  -F "id_projeto=42"
```

**Resposta Sucesso (201):**
```json
{
  "message": "2 arquivos criados com sucesso",
  "arquivos": [
    {
      "id": 156,
      "nome_arquivo": "proposta.pdf",
      "caminho": "/uploads/proposta-1704067200000.pdf"
    },
    {
      "id": 157,
      "nome_arquivo": "relatorio.docx",
      "caminho": "/uploads/relatorio-1704067200100.docx"
    }
  ]
}
```

---

### 3. Listar Arquivos de um Projeto

**Requisição:**
```http
GET /selectarquivos?id_projeto=42&limit=10&offset=0 HTTP/1.1
Host: api.ifpa.edu.br
x-api-key: sua-chave-api-aqui
```

**Resposta Sucesso (200):**
```json
{
  "total": 5,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "id": 156,
      "id_projeto": 42,
      "nome_arquivo": "proposta.pdf",
      "caminho": "/uploads/proposta-1704067200000.pdf",
      "tipo": "application/pdf",
      "tamanho": 2048000,
      "created_at": "2024-06-20T15:45:00Z"
    },
    {
      "id": 157,
      "id_projeto": 42,
      "nome_arquivo": "relatorio.docx",
      "caminho": "/uploads/relatorio-1704067200100.docx",
      "tipo": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "tamanho": 512000,
      "created_at": "2024-06-20T16:00:00Z"
    }
  ]
}
```

---

## 📋 Registros e Atas

### 1. Criar Novo Registro (Ata)

**Requisição:**
```http
POST /insert-registro HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "id_projeto": 42,
  "data_reuniao": "2024-06-20",
  "titulo_reuniao": "Reunião de Planejamento Sprint 3",
  "lista_participantes": "João Santos, Maria Oliveira, Prof. Carlos, Prof. Ana",
  "duracao_reuniao": "02:30:00",
  "relatorio": "Discutimos sobre a implementação do módulo de autenticação. Definimos prazos e responsáveis. João fica responsável pelo backend e Maria pelo frontend. Próxima reunião em 27/06."
}
```

**Resposta Sucesso (201):**
```json
{
  "message": "Registro criado com sucesso",
  "id": 78
}
```

---

### 2. Listar Registros de um Projeto

**Requisição:**
```http
GET /selectregistros?id_projeto=42&limit=10 HTTP/1.1
Host: api.ifpa.edu.br
x-api-key: sua-chave-api-aqui
```

**Resposta Sucesso (200):**
```json
{
  "total": 5,
  "limit": 10,
  "data": [
    {
      "id": 78,
      "id_projeto": 42,
      "data_reuniao": "2024-06-20",
      "titulo_reuniao": "Reunião de Planejamento Sprint 3",
      "lista_participantes": "João Santos, Maria Oliveira, Prof. Carlos, Prof. Ana",
      "duracao_reuniao": "02:30:00",
      "relatorio": "Discutimos sobre a implementação do módulo de autenticação...",
      "relatorio_edit_allowed": 1,
      "relatorio_edit_deadline": "2024-06-25T23:59:59Z",
      "created_at": "2024-06-20T15:45:00Z"
    }
  ]
}
```

---

### 3. Aluno Atualiza Relatório

**Requisição:**
```http
PUT /update-relatorio/78 HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "relatorio": "Concluí a implementação da autenticação JWT conforme planejado. Testes unitários foram criados e todos passam. Próximo passo: integração com frontend."
}
```

**Resposta Sucesso (200):**
```json
{
  "message": "Relatório atualizado com sucesso",
  "id": 78
}
```

**Resposta Erro - Prazo expirado (403):**
```json
{
  "error": "Prazo para edição do relatório expirou"
}
```

---

### 4. Atualizar Registro Completo (Professor)

**Requisição:**
```http
PUT /update-registro/78 HTTP/1.1
Host: api.ifpa.edu.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "titulo_reuniao": "Reunião de Planejamento Sprint 3 - REVISADO",
  "lista_participantes": "João Santos, Maria Oliveira, Prof. Carlos",
  "duracao_reuniao": "03:00:00",
  "relatorio": "Novo conteúdo do relatório...",
  "relatorio_edit_allowed": 1,
  "relatorio_edit_deadline": "2024-06-27T23:59:59Z"
}
```

**Resposta Sucesso (200):**
```json
{
  "message": "Registro atualizado com sucesso",
  "id": 78
}
```

---

### 5. Deletar Registro

**Requisição:**
```http
DELETE /delete-registro/78 HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```json
{
  "message": "Registro deletado com sucesso"
}
```

---

## 📊 Relatórios

### 1. Obter Relatório Completo de Projeto

**Requisição:**
```http
GET /relatorio/42 HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```json
{
  "id": 42,
  "nome_projeto": "Sistema de Gestão de Projetos Integrador",
  "tipo_projeto": "Integrador",
  "published": true,
  "published_at": "2024-03-15T10:00:00Z",
  "destaque": true,
  "orientador": {
    "id": 5,
    "nome_professor": "Prof. Dr. Carlos Alberto",
    "email": "carlos@ifpa.edu.br",
    "matricula": "202100001",
    "telefone": "(91) 99876-5432"
  },
  "coorientador": "Prof. Ana Silva",
  "alunos": [
    {
      "id": 1,
      "nome_aluno": "João Santos Silva",
      "matricula": "20200000001",
      "email": "joao@aluno.ifpa.edu.br",
      "telefone": "(91) 98765-4321"
    },
    {
      "id": 2,
      "nome_aluno": "Maria Oliveira Costa",
      "matricula": "20200000002",
      "email": "maria@aluno.ifpa.edu.br",
      "telefone": "(91) 98765-4322"
    }
  ],
  "resumo_executivo": {
    "data_inicio": "2024-01-10",
    "data_conclusao": null,
    "status": "em_desenvolvimento",
    "dias_decorridos": 162,
    "numero_reunioes": 8,
    "ultimo_registro": "2024-06-20T15:45:00Z"
  },
  "arquivos": [
    {
      "id": 156,
      "nome_arquivo": "proposta.pdf",
      "caminho": "/uploads/proposta-1704067200000.pdf",
      "tipo": "application/pdf",
      "tamanho": 2048000,
      "created_at": "2024-01-10T08:30:00Z"
    },
    {
      "id": 157,
      "nome_arquivo": "relatorio.docx",
      "caminho": "/uploads/relatorio-1704067200100.docx",
      "tipo": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "tamanho": 512000,
      "created_at": "2024-01-15T14:00:00Z"
    }
  ],
  "numero_arquivos": 2,
  "tamanho_total_arquivos": 2560000,
  "custos": [
    {
      "id": 1,
      "descricao": "Servidor AWS (3 meses)",
      "valor": 450.00,
      "quantidade": 3,
      "subtotal": 1350.00,
      "data_criacao": "2024-01-15T14:00:00Z"
    },
    {
      "id": 2,
      "descricao": "Banco de Dados RDS",
      "valor": 350.00,
      "quantidade": 1,
      "subtotal": 350.00,
      "data_criacao": "2024-02-01T10:30:00Z"
    },
    {
      "id": 3,
      "descricao": "Certificado SSL",
      "valor": 200.00,
      "quantidade": 1,
      "subtotal": 200.00,
      "data_criacao": "2024-02-15T09:00:00Z"
    }
  ],
  "custos_total": 1900.00,
  "registros": [
    {
      "id": 78,
      "data_reuniao": "2024-06-20",
      "titulo_reuniao": "Reunião de Planejamento Sprint 3",
      "lista_participantes": "João Santos, Maria Oliveira, Prof. Carlos, Prof. Ana",
      "duracao_reuniao": "02:30:00",
      "relatorio": "Discutimos sobre a implementação do módulo..."
    },
    {
      "id": 77,
      "data_reuniao": "2024-06-13",
      "titulo_reuniao": "Reunião de Planejamento Sprint 2",
      "lista_participantes": "João Santos, Maria Oliveira, Prof. Carlos",
      "duracao_reuniao": "02:00:00",
      "relatorio": "Sprint 2 foi bem sucedido. Todos os tasks foram completados..."
    }
  ],
  "numero_registros": 8,
  "created_at": "2024-01-10T08:30:00Z",
  "updated_at": "2024-06-20T15:45:00Z"
}
```

---

### 2. Listar Todos os Relatórios

**Requisição:**
```http
GET /relatorios?published=1&limit=20&offset=0 HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```json
{
  "total": 42,
  "limit": 20,
  "offset": 0,
  "relatorios": [
    {
      "id": 42,
      "nome_projeto": "Sistema de Gestão de Projetos Integrador",
      "orientador": "Prof. Dr. Carlos Alberto",
      "alunos": 3,
      "custos_total": 1900.00,
      "numero_registros": 8,
      "numero_arquivos": 2,
      "published": true,
      "destaque": true,
      "created_at": "2024-01-10",
      "updated_at": "2024-06-20"
    },
    {
      "id": 41,
      "nome_projeto": "App de Gerenciamento de Tarefas",
      "orientador": "Prof. Dra. Ana Silva",
      "alunos": 2,
      "custos_total": 800.00,
      "numero_registros": 5,
      "numero_arquivos": 3,
      "published": true,
      "destaque": false,
      "created_at": "2024-01-15",
      "updated_at": "2024-06-18"
    }
  ]
}
```

---

### 3. Exportar Relatório em PDF

**Requisição:**
```http
GET /relatorio/42?formato=pdf HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="projeto_42_relatorio.pdf"

[Arquivo PDF binário]
```

---

### 4. Exportar Relatório em Excel

**Requisição:**
```http
GET /relatorio/42?formato=excel HTTP/1.1
Host: api.ifpa.edu.br
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta Sucesso (200):**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="projeto_42_relatorio.xlsx"

[Arquivo XLSX binário]
```

---

## ⚠️ Tratamento de Erros

### Códigos HTTP Utilizados

| Código | Significado | Exemplo |
|--------|------------|---------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **204** | No Content | Sucesso sem conteúdo |
| **400** | Bad Request | Dados inválidos |
| **401** | Unauthorized | Token inválido/expirado |
| **403** | Forbidden | Sem permissão |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Duplicação de dados |
| **413** | Payload Too Large | Arquivo muito grande |
| **429** | Too Many Requests | Rate limit excedido |
| **500** | Server Error | Erro no servidor |

---

### Erros Comuns

**1. Token Inválido**
```json
{
  "error": "Token inválido",
  "code": "AUTH_INVALID_TOKEN"
}
```

**2. Campo Obrigatório**
```json
{
  "error": "Campo obrigatório faltando",
  "details": "Campo 'nome_projeto' é obrigatório"
}
```

**3. Validação FK (Foreign Key)**
```json
{
  "error": "Referência inválida",
  "details": "Curso com ID 999 não existe"
}
```

**4. Erro no Banco de Dados**
```json
{
  "error": "Erro ao processar requisição",
  "details": "Erro no banco de dados: DEFINER inválido"
}
```

---

## 🔗 URLs Base por Ambiente

```
Desenvolvimento: http://localhost:3000/api
Staging: https://staging-api.ifpa.edu.br
Produção: https://api.ifpa.edu.br
```

---

## 📝 Headers Padrão

```
Content-Type: application/json
Authorization: Bearer [token-jwt]
x-api-key: [sua-chave-api] (para rotas públicas)
Accept: application/json
```

---

**Última atualização:** 2024-06-26  
**Versão da API:** 1.0.0
