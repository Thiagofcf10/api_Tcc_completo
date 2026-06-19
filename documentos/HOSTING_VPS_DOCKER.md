# Guia Rápido de Hospedagem em VPS com Docker (IFPA Projetos)

Este guia explica os passos mínimos e recomendações para publicar a aplicação (MySQL + Backend Node.js + Frontend Next.js + Nginx) em uma VPS usando Docker Compose.

Pré-requisitos na VPS
- Usuário com acesso SSH e permissões sudo
- Docker e Docker Compose instalados (Compose V2 recomendado)
- (Opcional) Um domínio apontando para a VPS

1) Preparação do servidor
- Atualize o sistema e instale Docker + Compose (exemplo para Debian/Ubuntu):

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# instalar plugin docker compose (se necessário)
sudo apt install -y docker-compose-plugin
```

2) Copiar o código e preparar variáveis
- Clone o repositório em `/opt/ifpa-projetos` ou similar:

```bash
sudo git clone <repo_url> /opt/ifpa-projetos
cd /opt/ifpa-projetos
sudo cp .env.example .env
sudo chown -R $USER:$USER .
```

- Edite `.env` e ajuste variáveis importantes:
  - `MYSQL_ROOT_PASSWORD` (senha do MySQL)
  - `DB_PORT`, `BACKEND_PORT`, `FRONTEND_PORT` se desejar expor portas diferentes
  - `NEXT_PUBLIC_API_URL` — valor recomendado:
    - **Se usar nginx reverso (recomendado):** deixe `NEXT_PUBLIC_API_URL` vazio (`""`) para que o frontend faça chamadas relativas (`/api/...`).
    - **Se não usar proxy:** coloque `http://<HOST>:3333` apontando para o backend.

3) Iniciar containers
- Na raiz do projeto:

```bash
docker compose up --build -d
```

- Verifique containers e logs:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

4) HTTPS (recomendado)
- Configure TLS usando `certbot` + `nginx` ou `nginx-proxy` + `acme-companion`.
- Se usar domínio `meusite.exemplo`, ajuste `nginx` para responder no 80/443 e proxy para `frontend:3000` e `backend:3333` (ou para `/api/`).

5) Segurança e boas práticas
- Não exponha a porta do banco diretamente na internet. Use firewall (ufw/iptables) para permitir apenas o que precisa.
- Use senhas fortes e rotação de segredos. Considere usar um vault para produção.
- Faça backups regulares do volume do MySQL.

6) Atualizações / deploys
- Para atualizar, no repositório da VPS:

```bash
git pull
docker compose up -d --build
```

Isto cobre um fluxo básico e seguro para hospedar a aplicação em uma VPS com Docker. Se quiser, eu crio um `docker-compose.prod.yml` e um exemplo de configuração `nginx` pronto para o domínio que você fornecer.
