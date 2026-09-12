---
description: Gerenciamento de versionamento, fluxo de trabalho e boas práticas de commits com Git para a plataforma Lumina
---

# Workflow Git: Versionamento e Boas Práticas

Este workflow estabelece os padrões e etapas de controle de versão para o ciclo de vida de desenvolvimento do projeto **Lumina (Django)**.

---

## 1. Regras Fundamentais de Segurança

> [!IMPORTANT]
> **Ações de Alteração Direta no Histórico**: Comandos como `git commit`, `git push`, `git pull`, `git rebase` e `git merge` são estritamente reservados à execução ou aprovação explícita do desenvolvedor humano. O agente pode inspecionar (`git status`, `git diff`, `git log`) e preparar os arquivos no stage (`git add`).

---

## 2. Padrão de Mensagens de Commit (Conventional Commits)

As mensagens de commit devem seguir o formato estruturado:
`<tipo>(<escopo>): <descrição curta e objetiva no modo imperativo>`

### Tipos Permitidos:
- `feat`: Nova funcionalidade para o usuário final (ex: `feat(feed): adiciona toggle assíncrono de curtidas com microinteração`).
- `fix`: Correção de bug ou falha (ex: `fix(auth): corrige validação de senha no formulário de registro`).
- `docs`: Atualizações ou adições na documentação (ex: `docs(stitch): documenta o prompt mestre do design system`).
- `style`: Ajustes puramente visuais, CSS, indentação ou formatação (ex: `style(glass): refina sombras neon e desfoque dos cards`).
- `refactor`: Refatoração de código sem alteração do comportamento externo (ex: `refactor(models): otimiza queries com prefetch_related em tags`).
- `test`: Criação ou atualização de testes automatizados (ex: `test(core): adiciona 8 testes unitários para models e views`).
- `chore`: Atualização de dependências, scripts de workflow ou configurações (ex: `chore(vercel): configura vercel.json e whitenoise`).

---

## 3. Fluxo de Trabalho por Etapas

1. **Verificação de Status e Diff**:
   - Inspecione arquivos modificados:
     ```powershell
     git status
     ```
   - Revise as alterações linha por linha:
     ```powershell
     git diff
     ```

2. **Organização e Staging Atômico**:
   - Adicione alterações de forma seletiva e consciente:
     ```powershell
     git add <caminho_do_arquivo>
     ```
   - *Nunca utilize `git add .` indiscriminado* sem verificar se segredos (`.env`), bancos SQLite ou arquivos temporários estão protegidos pelo `.gitignore`.

3. **Criação de Branches Descritivas**:
   - Para novas funcionalidades:
     ```powershell
     git checkout -b feat/sistema-curtidas
     ```
   - Para correções emergenciais:
     ```powershell
     git checkout -b fix/upload-preview
     ```

4. **Revisão Pré-Commit**:
   - Certifique-se de que a suíte de testes passou sem erros:
     ```powershell
     .\manage.ps1 test
     ```
