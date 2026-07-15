# 📚 Documentação Técnica - API IFPA Repositório de Projetos

Bem-vindo à documentação completa da arquitetura, funcionalidades e uso da API IFPA Repositório de Projetos. Este conjunto de documentos foi criado para facilitar o entendimento de como o sistema funciona, quais ferramentas são utilizadas e como integrar-se com a API.

---

## 📖 Documentos Disponíveis

### 1. **ARQUITETURA_API_COMPLETA.md** ⭐ Comece por aqui
Documentação abrangente sobre a arquitetura do sistema, explicando:
- **Stack Tecnológico**: Todas as bibliotecas e suas funções
- **Arquitetura em Camadas**: Router → Middleware → Controller → Model → Database
- **Fluxos Principais**:
  - Autenticação com OTP
  - Registro de novos usuários
  - Upload de arquivos
  - Cadastro de alunos e professores
  - Criação de registros (atas de reunião)
  - Geração de relatórios
- **Modelo de Dados**: Diagrama ER com todas as tabelas
- **Segurança**: JWT, bcrypt, CORS, OTP
- **Sistema de Arquivos**: Multer e armazenamento
- **Tratamento de Erros**: HTTP status codes

**👉 Use este documento quando precisar entender:**
- Como a API funciona de ponta a ponta
- Qual é a função de cada biblioteca
- Fluxos completos de negócio
- Como os dados são armazenados

---

### 2. **DIAGRAMA_ARQUITETURA.md** 🎨 Visualização do Sistema
Diagramas visuais Mermaid e tabelas mostrando:
- **Diagrama Completo**: Todos os componentes interconectados
  - Cliente (Frontend Next.js)
  - NGINX (Reverse Proxy)
  - Backend (Express)
  - Database (MySQL)
  - Sistema de Arquivos
- **Matriz de Componentes**: Componentes e suas funções
- **Fluxo de Dados**: De requisição até resposta
- **Stack de Segurança**: Camadas de proteção
- **Integração de Bibliotecas**: Como as dependências trabalham juntas
- **Fluxo de Autenticação**: Sequência detalhada com JWT e OTP
- **Estrutura de Pastas**: Organização do código
- **Checklist de Componentes**: Todas as ferramentas utilizadas

**👉 Use este documento quando precisar:**
- Visualizar como os componentes interagem
- Entender o fluxo de uma requisição
- Ver uma visão geral do sistema
- Compreender a segurança do sistema

---

### 3. **EXEMPLOS_REQUISICOES.md** 💻 Prático e Implementação
Exemplos práticos de requisições HTTP com respostas reais:

#### Tópicos Inclusos:
1. **Autenticação**
   - Login com OTP
   - Verificação de OTP
   - Reenvio de código
   - Logout
   - Verificação de token

2. **Gestão de Usuários**
   - Registrar novo usuário
   - Criar perfil de aluno
   - Criar perfil de professor
   - Listar alunos
   - Obter aluno por ID

3. **Gestão de Projetos**
   - Criar novo projeto
   - Listar projetos
   - Obter projeto completo com detalhes
   - Atualizar projeto
   - Deletar projeto

4. **Upload de Arquivos**
   - Upload único
   - Upload múltiplo
   - Listar arquivos de um projeto

5. **Registros e Atas**
   - Criar novo registro
   - Listar registros
   - Aluno atualiza relatório
   - Professor atualiza registro
   - Deletar registro

6. **Relatórios**
   - Obter relatório completo
   - Listar todos os relatórios
   - Exportar em PDF
   - Exportar em Excel

7. **Tratamento de Erros**
   - Códigos HTTP
   - Erros comuns
   - Estrutura de respostas de erro

**👉 Use este documento quando precisar:**
- Fazer uma requisição real
- Entender o formato de requisição e resposta
- Copiar exemplos de código
- Debugar uma requisição
- Implementar uma integração

---

## 🚀 Quick Start (Começo Rápido)

### Para Desenvolvedores Iniciantes:
1. Comece lendo: **ARQUITETURA_API_COMPLETA.md** (seção "Visão Geral")
2. Visualize: **DIAGRAMA_ARQUITETURA.md** (entenda os componentes)
3. Implemente: **EXEMPLOS_REQUISICOES.md** (use exemplos reais)

### Para Arquitetos e Analistas:
1. Estude: **ARQUITETURA_API_COMPLETA.md** (arquitetura completa)
2. Visualize: **DIAGRAMA_ARQUITETURA.md** (diagramas detalhados)
3. Revise: **EXEMPLOS_REQUISICOES.md** (validar fluxos)

### Para Integradores/Clientes da API:
1. Comece: **EXEMPLOS_REQUISICOES.md** (ver como usar)
2. Consulte: **ARQUITETURA_API_COMPLETA.md** (entender limitações)
3. Reference: Seus tópicos específicos em cada documento

---

## 🔍 Localize um Tópico Específico

### Autenticação e Segurança
- Token JWT: `ARQUITETURA_API_COMPLETA.md` → Autenticação e Segurança
- OTP: `ARQUITETURA_API_COMPLETA.md` → Autenticação e Segurança
- Exemplo de login: `EXEMPLOS_REQUISICOES.md` → Autenticação
- Fluxo de autenticação: `DIAGRAMA_ARQUITETURA.md` → Fluxo de Autenticação

### Upload de Arquivos
- Como Multer funciona: `ARQUITETURA_API_COMPLETA.md` → Gestão de Arquivos
- Visualizar pipeline: `DIAGRAMA_ARQUITETURA.md` → Integração de Bibliotecas
- Fazer upload: `EXEMPLOS_REQUISICOES.md` → Upload de Arquivos

### Banco de Dados
- Estrutura: `ARQUITETURA_API_COMPLETA.md` → Modelo de Dados
- Relacionamentos: `ARQUITETURA_API_COMPLETA.md` → Diagrama ER
- Queries: `EXEMPLOS_REQUISICOES.md` → Gestão de Projetos

### Bibliotecas Utilizadas
- Express: `ARQUITETURA_API_COMPLETA.md` → Stack Tecnológico
- MySQL2: `ARQUITETURA_API_COMPLETA.md` → Stack Tecnológico
- JWT: `ARQUITETURA_API_COMPLETA.md` → Stack Tecnológico
- Multer: `ARQUITETURA_API_COMPLETA.md` → Gestão de Arquivos
- Nodemailer: `ARQUITETURA_API_COMPLETA.md` → Sistema de Autenticação
- Visualizar integração: `DIAGRAMA_ARQUITETURA.md` → Integração de Bibliotecas

### Fluxos de Negócio
- Login + OTP: `ARQUITETURA_API_COMPLETA.md` → Fluxos Principais
- Registro de usuário: `ARQUITETURA_API_COMPLETA.md` → Fluxos Principais
- Criar projeto: `EXEMPLOS_REQUISICOES.md` → Gestão de Projetos
- Upload de arquivo: `ARQUITETURA_API_COMPLETA.md` → Fluxos Principais
- Criar relatório: `EXEMPLOS_REQUISICOES.md` → Relatórios

---

## 📊 Matriz de Conteúdo

| Tópico | ARQUITETURA | DIAGRAMA | EXEMPLOS |
|--------|:-----------:|:--------:|:--------:|
| Visão Geral | ✅ | ✅ | - |
| Stack Tecnológico | ✅ | ✅ | - |
| Autenticação | ✅ | ✅ | ✅ |
| Segurança | ✅ | ✅ | - |
| Banco de Dados | ✅ | - | ✅ |
| Upload Arquivos | ✅ | ✅ | ✅ |
| Registros/Atas | ✅ | - | ✅ |
| Relatórios | ✅ | - | ✅ |
| Diagramas | - | ✅ | - |
| Exemplos Práticos | - | - | ✅ |
| Fluxos Completos | ✅ | ✅ | ✅ |

---

## 🛠️ Ferramentas Documentadas

### Backend
- **Express 5.1.0** - Framework HTTP
- **MySQL2 3.14.1** - Driver de banco de dados
- **jsonwebtoken 9.0.2** - Geração de tokens
- **bcryptjs 3.0.3** - Hash de senhas
- **Multer 1.4.5** - Upload de arquivos
- **Nodemailer 6.9.4** - Envio de emails
- **CORS 2.8.5** - Controle de origem
- **dotenv 16.5.0** - Variáveis de ambiente
- **Crypto** - Hashing de OTP

### Infraestrutura
- **NGINX** - Reverse proxy
- **Certbot** - SSL/TLS
- **Docker Compose** - Orquestração

### Testing
- **Jest 29.6.1** - Framework de testes

### Frontend
- **Next.js** - Framework React
- **React Context** - Estado global

---

## 🗂️ Estrutura de Pastas da API

```
backend2/
├── src/
│   ├── app.js                    # Configuração Express
│   ├── router.js                 # Rotas
│   ├── autenticacao/auth.js      # JWT/Auth
│   ├── controles/                # Controllers (lógica)
│   ├── modelos/                  # Models (dados)
│   ├── middlewares/              # Middlewares
│   ├── validar/                  # Validações
│   └── DBmysql/                  # Database
├── uploads/                      # Arquivos enviados
├── public/                       # Assets públicos
├── scripts/                      # Utilidades
└── package.json                  # Dependências
```

---

## 📞 Informações Importantes

### Portas Padrão
- **Frontend**: 3000
- **Backend**: 5000
- **MySQL**: 3306
- **NGINX**: 80, 443

### Variáveis de Ambiente Principais
```env
JWT_SECRET=sua_chave_secreta
MYSQL_HOST=localhost
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=repo_ifpa
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
FRONTEND_ORIGINS=http://localhost:3000
```

### Limites
- Tamanho máximo de arquivo: **50 MB**
- Duração do JWT: **24 horas**
- Duração do OTP: **10 minutos** (configurável)
- Máximo de tentativas de OTP: **5** (configurável)

---

## 🔐 Segurança em Resumo

1. **HTTPS**: Criptografia em trânsito (Certbot + Let's Encrypt)
2. **CORS**: Whitelist de origens permitidas
3. **JWT**: Autenticação stateless
4. **bcrypt**: Hashing seguro de senhas
5. **OTP**: Verificação em duas etapas
6. **SQL Injection Prevention**: Prepared statements
7. **Rate Limiting**: Proteção contra brute force
8. **Validação de Entrada**: Sanitização de dados
9. **RBAC**: Controle de acesso baseado em roles

---

## 📈 Métricas e Performance

### Querys Típicas
- **SELECT alunos**: ~50ms
- **INSERT projeto**: ~100ms
- **JOIN 5 tabelas**: ~150ms
- **Upload arquivo**: ~500ms (rede-dependente)

### Recomendações
- Use paginação em listas grandes (limit/offset)
- Cache de dados frequentemente consultados
- Índices no DB para campos de busca
- Compressão de respostas gzip

---

## 🐛 Troubleshooting

### Erro: "Token expirado"
→ Faça login novamente ou use refresh-role

### Erro: "CORS denied"
→ Verifique FRONTEND_ORIGINS em .env

### Erro: "Arquivo muito grande"
→ Máximo 50MB. Comprima ou divida o arquivo

### Erro: "Matricula duplicada"
→ Esta matrícula já está cadastrada

### Erro: "DEFINER inválido"
→ Recrie triggers/views no banco de dados

---

## 📚 Referências Externas

- [Express.js Documentation](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/)
- [MySQL2 GitHub](https://github.com/sidorares/node-mysql2)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Nodemailer](https://nodemailer.com/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [CORS Specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 📝 Changelog

### v1.0.0 (2024-06-26)
- ✅ Documentação inicial completa
- ✅ Três documentos criados: Arquitetura, Diagrama, Exemplos
- ✅ Cobertura de todos os fluxos principais
- ✅ Exemplos práticos de requisições
- ✅ Diagramas de arquitetura em Mermaid

---

## 👤 Autor e Contribuições

**Documentação Técnica Criada:** 2024-06-26  
**Versão da API:** 1.0.0  
**Última Atualização:** 2024-06-26

---

## 📋 Checklist de Leitura Recomendada

**Para entender TUDO:**
- [ ] Ler ARQUITETURA_API_COMPLETA.md (Visão Geral)
- [ ] Ler ARQUITETURA_API_COMPLETA.md (Stack Tecnológico)
- [ ] Estudar DIAGRAMA_ARQUITETURA.md (Diagrama Completo)
- [ ] Revisar DIAGRAMA_ARQUITETURA.md (Fluxo de Autenticação)
- [ ] Praticar EXEMPLOS_REQUISICOES.md (fazer requisições)

**Para implementar uma feature:**
- [ ] Identificar o tópico em EXEMPLOS_REQUISICOES.md
- [ ] Entender o fluxo em ARQUITETURA_API_COMPLETA.md
- [ ] Visualizar a integração em DIAGRAMA_ARQUITETURA.md
- [ ] Copiar exemplo e adaptar

**Para debugar um problema:**
- [ ] Procurar o tópico em EXEMPLOS_REQUISICOES.md
- [ ] Verificar formato de requisição/resposta
- [ ] Consultar ARQUITETURA_API_COMPLETA.md (Tratamento de Erros)
- [ ] Revisar DIAGRAMA_ARQUITETURA.md (fluxo de dados)

---

## 📞 Suporte

Caso tenha dúvidas:
1. **Procure no índice acima** - Localize seu tópico
2. **Consulte os exemplos** - Veja como é implementado
3. **Revise os diagramas** - Visualize o fluxo
4. **Entenda a arquitetura** - Leia a documentação completa

---

**🎉 Bem-vindo! Aproveite os documentos!**
