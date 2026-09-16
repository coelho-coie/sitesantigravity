---
name: workflow_deploy
description: Procedimento completo e checklist de deploy da aplicação Lumina na Vercel com Zero-Configuration e Git Deploy direto
---

# Workflow Deploy: Publicação na Nuvem (Vercel Zero-Config)

Este workflow detalha o checklist de pré-requisitos, estrutura de configuração e comandos para implantar a plataforma **Lumina Canvas** no ambiente serverless da **Vercel** sem arquivos de configuração legados.

---

## 1. Checklist de Pré-Requisitos (Pre-flight Checks)

Antes de realizar o deploy, confirme os itens:

- [x] **Ponto de Entrada WSGI Nativo**: `lumina_core/wsgi.py` configurado com `application` e alias `app`, além de garantir o diretório raiz no `sys.path`.
- [x] **Zero-Configuration**: Arquivos legados `vercel.json` e `api/index.py` removidos para permitir detecção nativa do Django pela Vercel.
- [x] **Otimização de Pacote**: O arquivo `.vercelignore` exclui pastas locais (`.venv/`, `__pycache__/`, `.git/`, `node_modules/`).
- [x] **WhiteNoise Ativo**: `whitenoise.middleware.WhiteNoiseMiddleware` configurado em `settings.py` com compressão estática.
- [x] **Suporte Serverless SQLite Gravável**: `settings.py` redireciona o banco SQLite para `/tmp/db.sqlite3` em execuções no Vercel (`IS_VERCEL`).
- [x] **Auto-Migração e Seed**: `lumina_core/wsgi.py` executa migrações automáticas e seeding de dados no cold start com criação de flag `/tmp/.db_ready`.
- [x] **Suporte a Banco Externo**: Suporte a `DATABASE_URL` via `dj-database-url` para PostgreSQL/Neon/Supabase.

---

## 2. Variáveis de Ambiente no Painel da Vercel

Ao configurar o projeto no Vercel Dashboard, adicione as seguintes variáveis em **Project Settings → Environment Variables**:

| Variável | Valor Recomendado | Finalidade |
|---|---|---|
| `DJANGO_SECRET_KEY` | *(Gerar chave de 50 caracteres)* | Proteção criptográfica de sessões e CSRF (com fallback automático se ausente) |
| `DJANGO_DEBUG` | `False` | Desativa telas de erro detalhadas em produção |
| `ALLOWED_HOSTS` | `.vercel.app,localhost,127.0.0.1` | Hosts permitidos para o Django responder |
| `DATABASE_URL` | *(Opcional)* | Conexão para Postgres externo |

---

## 3. Fluxo de Deploy via Git (Padrão Recomendado)

A Vercel realiza o build e deploy automaticamente a cada `git push`:

```bash
git add .
git commit -m "refactor: adequacao lumina para vercel zero-config"
git push origin main
```

---

## 4. Resolução de Falhas Comuns no Vercel

- **Erro `550 / FUNCTION_INVOCATION_FAILED`**:
  - Eliminado pela remoção do `vercel.json` (que continha builds legados `@vercel/python`) e pelo redirecionamento do SQLite para o caminho gravável `/tmp/db.sqlite3`.
- **Erro `no such table` na primeira carga**:
  - Resolvido pela rotina em `lumina_core/wsgi.py` que executa automaticamente `migrate` e `seed_data.run_seed()` no cold start da função serverless.
