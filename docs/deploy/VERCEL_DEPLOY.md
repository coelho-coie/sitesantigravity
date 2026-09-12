# Guia de Deploy no Vercel — Lumina Platform (Django)

Este documento descreve a preparação arquitetural e o passo a passo para publicação da aplicação Django **Lumina** no **Vercel** usando Serverless Functions Python.

---

## 1. Arquitetura Serverless Configurada

A aplicação foi preparada especificamente para o ambiente serverless da Vercel:

| Componente | Arquivo de Configuração | Função |
|---|---|---|
| **Entrypoint WSGI** | [`api/index.py`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/api/index.py) | Expõe a variável `app = get_wsgi_application()` consumida pelo runtime `@vercel/python`. |
| **Roteamento Vercel** | [`vercel.json`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/vercel.json) | Roteia `/static/` diretamente para arquivos estáticos e todas as demais rotas para `api/index.py`. |
| **Otimização de Payload** | [`.vercelignore`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/.vercelignore) | Evita o upload desnecessário de `.venv/`, `.git/`, logs e caches. |
| **Serviço de Estáticos** | `WhiteNoise 6.12.0` | Integrado ao Django para servir CSS/JS diretamente com compressão e manifesto. |
| **Banco de Dados Serverless** | [`lumina_core/settings.py`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/lumina_core/settings.py) | Cópia automática do banco SQLite para o diretório gravável `/tmp/db.sqlite3` em execuções no Vercel. |

---

## 2. Checklist Pré-Deploy

- [x] Suíte de testes unitários passando: `8/8 OK`
- [x] Coleta de arquivos estáticos testada: `python manage.py collectstatic --noinput`
- [x] Dependências listadas em `requirements.txt` (incluindo `whitenoise`)
- [x] `ALLOWED_HOSTS` configurado para aceitar domínios `.vercel.app`
- [x] `api/index.py` e `vercel.json` criados e testados

---

## 3. Métodos de Deploy

### Opção A: Deploy via Vercel CLI (Direto pelo Terminal)

1. **Efetuar Login na Vercel:**
   ```powershell
   npx vercel login
   ```
   *Siga as instruções exibidas no navegador para autorizar o terminal.*

2. **Gerar Preview Deployment (Recomendado):**
   ```powershell
   npx vercel
   ```
   *Responda às perguntas interativas para vincular ao seu projeto na Vercel.*

3. **Deploy de Produção:**
   ```powershell
   npx vercel --prod
   ```

---

### Opção B: Deploy via Integração Git (Recomendado para Produção Contínua)

1. Crie um repositório no seu GitHub (ex: `lumina-platform`).
2. Adicione o remote e faça o push do código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/lumina-platform.git
   git add .
   git commit -m "feat: prepara projeto para deploy no Vercel"
   git push -u origin main
   ```
3. Acesse o **Dashboard da Vercel** ([vercel.com](https://vercel.com)):
   - Clique em **"Add New..."** → **"Project"**.
   - Importe o repositório `lumina-platform`.
   - Em **Environment Variables**, adicione:
     - `DJANGO_SECRET_KEY`: `sua-chave-secreta-de-producao`
     - `DJANGO_DEBUG`: `False`
     - `ALLOWED_HOSTS`: `.vercel.app`
   - Clique em **"Deploy"**.

---

## 4. Variáveis de Ambiente no Vercel

Configure no painel da Vercel (*Project Settings → Environment Variables*):

| Variável | Valor Recomendado | Finalidade |
|---|---|---|
| `DJANGO_SECRET_KEY` | *(chave aleatória longa)* | Criptografia de sessões e CSRF em produção |
| `DJANGO_DEBUG` | `False` | Desativa modo de depuração para segurança |
| `ALLOWED_HOSTS` | `.vercel.app` | Domínios autorizados a receber requisições |
| `VERCEL` | `1` | Ativa rotinas serverless automáticas |
