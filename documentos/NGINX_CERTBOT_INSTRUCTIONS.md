# Instruções rápidas para integrar Nginx com Certbot (Let's Encrypt)

Este arquivo descreve formas comuns de obter e renovar certificados TLS para o `nginx` que está no `docker-compose.prod.yml`.

Opção A — Usar Certbot no host (mais simples)
1. Instale certbot no host (ex.: `sudo apt install certbot`)
2. Pare temporariamente o container nginx para liberar porta 80:

```bash
docker compose -f docker-compose.prod.yml stop nginx
```

3. Obtenha o certificado (substitua `seu.dominio`):

```bash
sudo certbot certonly --standalone -d seu.dominio -d www.seu.dominio
```

4. Copie ou monte os certificados para o container nginx. No `docker-compose.override.yml` montamos `./data/nginx/certs` → `/etc/letsencrypt`.

```bash
sudo mkdir -p ./data/nginx/certs
sudo cp -r /etc/letsencrypt/live /path/to/repo/data/nginx/certs/
```

5. Reinicie o nginx container:

```bash
docker compose -f docker-compose.prod.yml up -d nginx
```

6. Configure `documentos/nginx.prod.conf` para usar `ssl_certificate` e `ssl_certificate_key` apontando para os caminhos dentro do container (ex.: `/etc/letsencrypt/live/seu.dominio/fullchain.pem`).

7. Renovações: use `certbot renew` no host e copie novamente os certificados para `./data/nginx/certs` ou monte o `/etc/letsencrypt` do host diretamente no container.

Opção B — Usar `nginx-proxy` + `acme-companion` (Dockerized, automatiza certificados)
- Use as imagens `jwilder/nginx-proxy` e `nginxproxy/acme-companion` para gerar certificados automaticamente quando um container é iniciado com a variável `VIRTUAL_HOST` e `LETSENCRYPT_HOST`.
- Requer reorganizar `docker-compose` para incluir o nginx-proxy e labels/vars nas services do frontend/backend. Esta opção é mais avançada, mas fornece TLS automático.

Opção C — Usar `certbot` com webroot dentro do container nginx
- Configure um volume `./data/webroot` montado em `/var/www/certbot` no nginx
- Execute certbot com `--webroot -w /var/www/certbot -d seu.dominio`
- É necessário que nginx sirva o `/.well-known/acme-challenge/` desse webroot durante validação.

Notas
- Em produção, monte o diretório onde o certbot salva os certificados (`/etc/letsencrypt`) diretamente no container nginx com permissão de leitura.
- Não esqueça de configurar `server_name` em `documentos/nginx.prod.conf`.
- Teste `https://www.ssllabs.com/ssltest/` após a configuração para verificar a configuração TLS.

Precisa que eu gere a versão do `documentos/nginx.prod.conf` já com blocos `listen 443 ssl;` e `ssl_certificate` apontando para os caminhos de `./data/nginx/certs`? Posso criar isso se você quiser.