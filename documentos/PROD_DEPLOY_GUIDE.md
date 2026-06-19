# Guia de Deploy (produção) — Docker Compose

Este passo-a-passo mostra como levantar a stack de produção usando `docker-compose.prod.yml` gerado no repositório.

1) Pré-requisitos da VPS
- Docker e Docker Compose (v2) instalados
- Porta 80/443 liberadas no firewall
- (Recomendado) Domínio apontando para o IP da VPS

2) Arquivos importantes
- `docker-compose.prod.yml` na raiz
- `documentos/nginx.prod.conf` — configuração do Nginx reverse-proxy
- `.env` — variáveis de ambiente sensíveis (senha do MySQL, etc.)

3) Criar/editar `.env`
- Copie o `.env.example` e preencha todas as variáveis necessárias.
- Exemplo mínimo:
```
MYSQL_ROOT_PASSWORD=uma_senha_forte
MYSQL_DATABASE=ifpa
MYSQL_USER=ifpa
MYSQL_PASSWORD=senha_db
BACKEND_PORT=3333
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=
```

4) Certificados TLS (opcional, recomendado)
- Para obter certificados com `certbot` e `nginx` é comum usar uma configuração temporária em que Nginx roda diretamente na VPS (ou em container) e o certbot realiza validação HTTP.
- Uma alternativa é usar a imagem `nginx` com `certbot` em outro container ou usar `nginx-proxy` + `acme-companion`.

5) Subir a stack
```bash
# na raiz do projeto
docker compose -f docker-compose.prod.yml up --build -d
```

6) Verificar
- `docker compose -f docker-compose.prod.yml ps`
- `docker compose -f docker-compose.prod.yml logs -f backend`
- Acesse `http://<SEU_DOMINIO>` e verifique se o frontend responde.
- Teste um endpoint público: `curl -H "x-api-key: <API_KEY>" http://<SEU_DOMINIO>/api/selectprojetos_destaques`

7) Atualizações
- Para atualizar a imagem do backend/frontend: `docker compose -f docker-compose.prod.yml pull` (se usar images remotas) ou `docker compose -f docker-compose.prod.yml up -d --build` para rebuild.

8) Observações
- O `nginx` aqui foi configurado para proxy reverso; ajuste `server_name` em `documentos/nginx.prod.conf` para seu domínio.
- Os certificados foram deixados fora do escopo: na produção, monte `/etc/letsencrypt` no container `nginx` ou use um container específico para gerenciar os certificados.

Se quiser, eu posso gerar um `docker-compose.override.yml` com volumes e exemplos de mount points para backups e logs, e também um pequeno script `deploy.sh` para automatizar o `git pull && docker compose up -d --build`.
