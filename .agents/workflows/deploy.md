---
name: deploy
description: Workflow de deploy da plataforma Lumina no Vercel.
version: 1.0.0
platform: vercel
---

# Workflow de Deploy — Lumina (Vercel)

## 1. Verificações Pré-Deploy (Pre-flight Checks)
- [x] Testes unitários passando: `.\.venv\Scripts\python.exe manage.py test core`
- [x] Arquivos estáticos coletados: `.\.venv\Scripts\python.exe manage.py collectstatic --noinput`
- [x] Ponto de entrada WSGI: `api/index.py`
- [x] Configuração de roteamento: `vercel.json`
- [x] Otimização de payload: `.vercelignore`

## 2. Comandos de Deploy

### Preview Deploy
```powershell
npx vercel
```

### Production Deploy
```powershell
npx vercel --prod
```

### Status e Logs
```powershell
npx vercel logs
```
