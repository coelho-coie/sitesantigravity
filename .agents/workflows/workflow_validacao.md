---
description: Roteiro e procedimentos para teste e validação da aplicação web no navegador
---

# Workflow Validação: Testes E2E e Validação no Navegador

Este workflow define o protocolo sistemático para validação visual, funcional e de experiência de usuário (E2E) da aplicação web no navegador.

---

## 1. Pré-Requisitos e Inicialização

1. **Garantir Dependências**:
   - Verifique se as dependências do `requirements.txt` estão instaladas no ambiente Python.
2. **Iniciar Servidor Local**:
   - Execute o servidor Flask em segundo plano ou terminal dedicado:
     ```powershell
     python app.py
     ```
   - Confirme a disponibilidade na porta local: `http://127.0.0.1:5000`.

---

## 2. Roteiro de Validação por Rotas e Fluxos

### Fluxo 1: Página Inicial e Navegação Pública
- **URL**: `http://127.0.0.1:5000/`
- **Itens de Verificação**:
  - [ ] Renderização correta da Navbar, Hero Section e Cartões de Recursos.
  - [ ] Estilização visual medieval (cores temáticas, tipografia, contraste e ícones).
  - [ ] Funcionamento dos links e botões de chamada para ação (CTA).
  - [ ] Acesso à página institucional `/sobre` e verificação da arquitetura do reino.

---

### Fluxo 2: Autenticação e Controle de Acesso
- **URL**: `http://127.0.0.1:5000/login`
- **Credenciais de Teste**:
  - `admin` / `admin123` (Lorde Comandante Eldor)
  - `dev_vitor` / `senha123` (Vitor, Mestre Arquiteto)
  - `qa_maria` / `teste123` (Maria, Guardiã das Ruínas)
- **Itens de Verificação**:
  - [ ] Tentativa de acesso a rota protegida sem login (deve redirecionar para `/login` com alerta flash).
  - [ ] Teste de credenciais incorretas (mensagem de erro amigável sem quebra da página).
  - [ ] Login bem-sucedido e redirecionamento automático para o `/dashboard`.

---

### Fluxo 3: Salão Estratégico (Dashboard)
- **URL**: `http://127.0.0.1:5000/dashboard`
- **Itens de Verificação**:
  - [ ] Saudação personalizada com o nome e insígnia do usuário autenticado.
  - [ ] Cards de métricas operacionais (Total, Concluídas, Em Andamento, Pendentes, Taxa %).
  - [ ] Lista das últimas missões recentes atualizadas em tempo real.

---

### Fluxo 4: Gestão de Missões e Expedições (Tarefas)
- **URL**: `http://127.0.0.1:5000/tarefas`
- **Itens de Verificação**:
  - [ ] **Criar Nova Missão**: Preenchimento do modal/formulário e persistência na lista com status *Pendente*.
  - [ ] **Atualização de Status**: Transição de estado (*Pendente* -> *Em Andamento* -> *Concluída*) via formulário/seletor.
  - [ ] **Filtros e Busca**: Filtragem por status, nível de prioridade e busca textual por termos.
  - [ ] **Exclusão/Arquivamento**: Remoção de missão com feedback visual instantâneo.

---

### Fluxo 5: Registro do Guardião e Encerramento (Perfil & Logout)
- **URLs**: `http://127.0.0.1:5000/perfil` e `/logout`
- **Itens de Verificação**:
  - [ ] Exibição das estatísticas individuais do guardião conectado.
  - [ ] Edição e atualização de dados cadastrais (nome, cargo, email).
  - [ ] Logout seguro limpando a sessão e redirecionando para a tela inicial/login.

---

## 3. Critérios de Aceite de UI/UX e Responsividade

- **Responsividade**: Layout fluido em resoluções Desktop (1920x1080 / 1366x768) e Mobile/Tablet.
- **Acessibilidade & Feedback**: Alertas flash visíveis e dispensáveis para todas as ações do usuário.
- **Resiliência a Erros**: Validação de erros HTTP 404/500 exibindo o template medieval amigável.
