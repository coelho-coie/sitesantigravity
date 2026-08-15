---
description: Gerenciamento de versionamento, fluxo de trabalho e boas práticas de commits com Git
---

# Workflow Git: Versionamento e Boas Práticas

Este workflow estabelece os padrões e etapas de controle de versão para o ciclo de vida de desenvolvimento do projeto.

---

## 1. Regras Fundamentais de Segurança

> [!IMPORTANT]
> **Ações Destrutivas ou de Publicação**: Comandos de alteração direta como `commit`, `push`, `pull`, `rebase` e `merge` devem ser orientados ou executados com expressa ciência e controle do desenvolvedor.

---

## 2. Padrão de Mensagens de Commit (Conventional Commits)

As mensagens de commit devem seguir o formato estruturado:
`<tipo>(<escopo>): <descrição curta e objetiva no imperativo>`

### Tipos Permitidos:
- `feat`: Nova funcionalidade para o usuário (ex: `feat(auth): adiciona autenticação com sessão`).
- `fix`: Correção de bug (ex: `fix(tarefas): corrige cálculo de porcentagem no dashboard`).
- `docs`: Alterações na documentação (ex: `docs(readme): atualiza instruções de instalação`).
- `style`: Formatação, ponto e vírgula, espaçamento (sem alteração de lógica).
- `refactor`: Refatoração de código sem alterar comportamento externo.
- `test`: Adição ou correção de testes automatizados.
- `chore`: Atualização de tarefas de build, pacotes ou dependências.

---

## 3. Fluxo de Trabalho por Etapas

1. **Verificação de Status**:
   - Inspecione arquivos modificados: `git status`.
   - Revise as alterações linha por linha: `git diff`.

2. **Organização e Staging**:
   - Adicione alterações de forma atômica: `git add <caminho_do_arquivo>`.
   - Evite `git add .` indiscriminado para não versionar arquivos temporários ou segredos.

3. **Criação de Branches**:
   - Crie branches descritivas para novas features:
     `git checkout -b feat/modulo-tarefas` ou `git switch -c fix/login-validation`.

4. **Revisão Pré-Commit**:
   - Certifique-se de que o código segue os padrões PEP8 e que todos os testes locais passaram com sucesso.
