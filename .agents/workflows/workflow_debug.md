---
description: Rastreamento de erros, registro de logs estruturados e procedimentos de depuração sistemática em Django
---

# Workflow Debug: Rastreamento de Erros, Logs e Depuração Sistemática

Este workflow orienta o desenvolvedor na identificação, isolamento e resolução de falhas em aplicações **Django 5.x** na plataforma Lumina.

---

## 1. Níveis de Log e Diagnóstico

O Django integra o módulo nativo `logging` do Python. Ao diagnosticar comportamentos inesperados:

- **DEBUG**: Detalhes de execução, consultas SQL executadas pelo ORM (`django.db.backends`), payloads e cabeçalhos de requisições.
- **INFO**: Eventos de negócio confirmados (login realizado, upload de imagem processado, novo comentário inserido).
- **WARNING**: Situações não fatais (falha de autenticação, CSRF token expirado, tentativa de acesso a rota inexistente).
- **ERROR**: Exceções não tratadas durante o ciclo de view (`IntegrityError`, `ValidationError`, falhas no processamento de mídia).
- **CRITICAL**: Falhas de inicialização do servidor ou corrupção do banco de dados.

---

## 2. Protocolo Sistemático de Depuração (4 Passos)

1. **Reproduzir o Erro com Precisão**:
   - Isole a URL afetada (ex: `POST /post/1/like/` ou `POST /create/`).
   - Verifique o método HTTP utilizado e os dados enviados via formulário ou corpo JSON.
   - Analise se o problema ocorre apenas para usuários autenticados ou também anônimos.

2. **Inspecionar o Traceback do Terminal**:
   - Analise a pilha de chamadas (Traceback) de baixo para cima para identificar o arquivo e a linha exata da falha.
   - Em desenvolvimento (`DEBUG=True`), utilize a tela amarela detalhada do Django para inspecionar variáveis de contexto e request.

3. **Verificar Estado do Banco de Dados e Queries ORM**:
   - Inspecione a integridade das tabelas via shell interativo:
     ```powershell
     .\manage.ps1 shell
     ```
   - Teste consultas problemáticas diretamente no shell do Django:
     ```python
     from core.models import Post, Like
     print(Post.objects.filter(likes__isnull=False).query)
     ```

4. **Isolar e Resolver Falhas Comuns no Django**:
   - **Erro CSRF (403 Forbidden)**: Verifique se o template inclui a tag `{% csrf_token %}` dentro da tag `<form>` ou se a requisição AJAX envia o cabeçalho `X-CSRFToken`.
   - **Upload de Imagem Quebrado**: Certifique-se de que a tag `<form>` contém o atributo `enctype="multipart/form-data"`.
   - **Erro de Mídia em Desenvolvimento**: Confirme que `settings.DEBUG` está ativo e que as URLs de mídia estão concatenadas em `lumina_core/urls.py`.

---

## 3. Testes Automatizados de Regressão

Sempre execute a suíte de testes unitários para validar que a correção não quebrou outras funcionalidades:

```powershell
.\manage.ps1 test
```
