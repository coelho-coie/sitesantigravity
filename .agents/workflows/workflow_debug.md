---
description: Rastreamento de erros, registro de logs estruturados e procedimentos de testes locais
---

# Workflow Debug: Rastreamento de Erros, Logs e Testes Locais

Este workflow orienta o desenvolvedor na identificação, isolamento e resolução sistemática de falhas em aplicações web Flask.

---

## 1. Configuração e Níveis de Log

Utilize o módulo nativo `logging` do Python para registrar eventos com severidades apropriadas:

- **DEBUG**: Informações detalhadas para diagnóstico durante desenvolvimento (parâmetros de rota, payloads).
- **INFO**: Confirmação de eventos normais de negócio (usuário logado, tarefa criada).
- **WARNING**: Situações imprevistas não fatais (tentativa de login falha, sessão expirando).
- **ERROR**: Falhas de execução que impediram uma operação (erro de banco de dados, exceção tratada).
- **CRITICAL**: Falhas severas que impedem a continuidade da aplicação.

---

## 2. Procedimento Sistemático de Depuração

1. **Reproduzir o Problema**:
   - Isole a rota e a ação exata que dispara o erro.
   - Verifique o método HTTP utilizado (`GET`, `POST`) e os parâmetros enviados.

2. **Inspecionar Traceback**:
   - Leia a pilha de chamadas (Traceback) do terminal de baixo para cima para identificar o arquivo e a linha exata da falha.
   - No Flask com modo `debug=True`, utilize o depurador interativo da Werkzeug no navegador.

3. **Verificar Estado de Sessão e Variáveis**:
   - Inspecione os dados armazenados em `session` (ex: `user_id`, `logged_in`).
   - Imprima ou registre em log o estado dos objetos antes e depois das mutações.

4. **Tratamento de Exceções**:
   - Utilize blocos `try...except` específicos, evitando capturar exceções genéricas sem logar o erro.
   - Retorne páginas de erro amigáveis (`404.html`, `500.html`) para o usuário final.

---

## 3. Testes Locais

- **Execução com Servidor de Desenvolvimento**:
  Execute `python app.py` e verifique os logs no console.
- **Teste de Rotas HTTP**:
  Teste cada rota com diferentes cenários (usuário logado, usuário anônimo, payload inválido).
