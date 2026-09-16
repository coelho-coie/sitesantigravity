# Guia de Deploy no Vercel Zero-Configuration — Lumina Platform (Django)

Este documento descreve a arquitetura moderna Zero-Configuration e o fluxo de publicação contínua da aplicação Django **Lumina** na **Vercel** usando Serverless Functions Python via Git Deploy direto.

---

## 1. Arquitetura Serverless Zero-Config

A aplicação utiliza detecção nativa do Django pela Vercel, dispensando arquivos de configuração legados (`vercel.json` e `api/index.py`):

| Componente | Localização | Função |
|---|---|---|
| **Entrypoint WSGI Nativo** | `lumina_core/wsgi.py` | Detectado nativamente pela Vercel via `manage.py`; expõe `application` e alias `app`. |
| **Auto-Migração & Seed** | `lumina_core/wsgi.py` | Detecta ambiente Serverless (`VERCEL=1`), executa `migrate` e `seed_data.run_seed()` no cold start e marca `/tmp/.db_ready`. |
| **Banco SQLite Gravável** | `lumina_core/settings.py` | Como o sistema de arquivos `/var/task` é read-only, redireciona o SQLite automaticamente para `/tmp/db.sqlite3`. |
| **Suporte Opcional a PostgreSQL** | `lumina_core/settings.py` | Suporte nativo a `DATABASE_URL` via `dj-database-url` (Neon, Supabase, Vercel Postgres). |
| **Serviço de Estáticos** | `WhiteNoise 6.6+` | Integrado ao pipeline do Django para servir CSS/JS com compressão `CompressedStaticFilesStorage`. |
| **Otimização de Pacote** | `.vercelignore` | Ignora ambientes locais (`.venv/`), caches e arquivos desnecessários no deploy. |

---

## 2. Checklist Pré-Deploy

- [x] Arquitetura Zero-Configuration: `vercel.json` e `api/` legados removidos.
- [x] Suporte a fallback seguro de `SECRET_KEY` configurado em `settings.py`.
- [x] Redirecionamento e migração automática do banco de dados em `/tmp/` no cold-start do Vercel.
- [x] Dependências declaradas em `requirements.txt` (incluindo `whitenoise` e `dj-database-url`).
- [x] `ALLOWED_HOSTS` configurado com suporte a `.vercel.app`.

---

## 3. Fluxo de Deploy via Git (Recomendado)

1. Faça o commit das alterações no seu repositório:
   ```bash
   git add .
   git commit -m "refactor: adequacao lumina para vercel zero-config"
   git push origin main
   ```

2. No painel da **Vercel** ([vercel.com](https://vercel.com)):
   - Se o projeto já estiver conectado ao repositório Git, o deploy iniciará **automaticamente**.
   - Caso seja um novo projeto: clique em **"Add New..." → "Project"**, selecione o repositório e clique em **Deploy**.

3. O Vercel detectará o Django automaticamente através do `manage.py` e fará o build sem necessidade de parâmetros adicionais.

---

## 4. Variáveis de Ambiente no Vercel

Configuráveis no painel da Vercel (*Project Settings → Environment Variables*):

| Variável | Valor Recomendado | Finalidade |
|---|---|---|
| `DJANGO_SECRET_KEY` | *(chave aleatória segura)* | Chave de criptografia de sessões e CSRF |
| `DJANGO_DEBUG` | `False` | Desativa modo de depuração em produção |
| `ALLOWED_HOSTS` | `.vercel.app` | Domínios autorizados |
| `DATABASE_URL` | *(opcional)* | Conexão para banco de dados relacional externo (Neon/Postgres/Supabase) |
