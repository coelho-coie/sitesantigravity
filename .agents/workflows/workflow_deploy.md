---
name: workflow_deploy
description: Procedimento completo e checklist de deploy da aplicação Lumina na Vercel com WhiteNoise e SQLite Serverless
---

# Workflow Deploy: Publicação na Nuvem (Vercel)

Este workflow detalha o checklist de pré-requisitos, estrutura de configuração e comandos para implantar a plataforma **Lumina Canvas** no ambiente serverless da **Vercel**.

---

## 1. Checklist de Pré-Requisitos (Pre-flight Checks)

Antes de executar o comando de deploy, confirme os itens:

- [x] **Ponto de Entrada WSGI**: O arquivo [`api/index.py`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/api/index.py) exporta o manipulador `app = get_wsgi_application()`.
- [x] **Configuração de Roteamento**: O arquivo [`vercel.json`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/vercel.json) direciona todas as requisições para `api/index.py`.
- [x] **Otimização de Pacote**: O arquivo [`.vercelignore`](file:///c:/Users/Vitor/OneDrive/Desktop/Arquivos/VS+AntiGravity/Projeto07/.vercelignore) exclui pastas pesadas (`.venv/`, `__pycache__/`, `.git/`, `node_modules/`).
- [x] **WhiteNoise Ativo**: `whitenoise.middleware.WhiteNoiseMiddleware` configurado em `settings.py` com compressão `CompressedManifestStaticFilesStorage`.
- [x] **Suporte Serverless SQLite**: `settings.py` preparado para copiar o banco de dados pré-populado para o diretório efêmero `/tmp/db.sqlite3` em runtime quando `VERCEL=1`.
- [x] **Coleta de Estáticos**: Executar `.\manage.ps1 collectstatic` para gerar os assets com hashes de cache no diretório `staticfiles/`.
- [x] **Suíte de Testes**: Executar `.\manage.ps1 test` e garantir 100% de sucesso.

---

## 2. Variáveis de Ambiente no Painel da Vercel

Ao configurar o projeto no Vercel Dashboard, adicione as seguintes variáveis em **Project Settings → Environment Variables**:

| Variável | Valor Recomendado | Finalidade |
|---|---|---|
| `SECRET_KEY` | *(Gerar chave de 50 caracteres aleatórios)* | Proteção criptográfica de sessões e CSRF |
| `DEBUG` | `False` | Desativa telas de erro detalhadas em produção |
| `ALLOWED_HOSTS` | `.vercel.app,localhost,127.0.0.1` | Hosts permitidos para o Django responder |
| `VERCEL` | `1` | Ativa o modo de banco de dados em `/tmp/` |

---

## 3. Comandos de Deploy via Vercel CLI

### Opção A: Deploy de Visualização (Preview)
Gera uma URL de homologação temporária para testar as alterações antes do ambiente de produção:
```powershell
npx vercel
```

### Opção B: Deploy Oficial de Produção
Publica diretamente no domínio principal do projeto:
```powershell
npx vercel --prod
```

### Opção C: Inspeção de Logs em Tempo Real
Para verificar tracebacks ou requisições na nuvem:
```powershell
npx vercel logs
```

---

## 4. Resolução de Falhas Comuns no Vercel

- **Erro `500 Server Error` na primeira carga**:
  - Verifique se a variável `SECRET_KEY` foi cadastrada no painel da Vercel.
  - Verifique se `ALLOWED_HOSTS` inclui `.vercel.app`.
- **Estáticos sem estilo (CSS 404)**:
  - Certifique-se de que os arquivos foram gerados na pasta `staticfiles/` antes do deploy com `.\manage.ps1 collectstatic`.
- **Erro de escrita no banco de dados (`database is locked` / `readonly database`)**:
  - Na Vercel, o sistema de arquivos raiz é estritamente somente leitura. O projeto Lumina contorna isso redirecionando o SQLite para `/tmp/db.sqlite3` quando detecta a variável `VERCEL=1`.
