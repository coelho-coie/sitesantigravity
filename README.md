# Castelos & Ruínas - Sistema de Gestão de Fortalezas & Expedições (Projeto 3)

Aplicação web completa desenvolvida com **Python Flask**, seguindo padrões de engenharia de software sênior, conformidade rigorosa com **PEP8** e documentação estruturada em **PEP257**, com tema imersivo de **Castelos e Ruínas Antigas** e integrada ao ecossistema **Antigravity**.

---

## 1. Estrutura de Diretórios do Projeto

```text
Curso_Antigravity/
├── .agents/
│   ├── rules/
│   │   └── curso.md
│   ├── skills/
│   │   ├── skill_css/
│   │   │   └── SKILL.md
│   │   └── skill_formularios/
│   │       └── SKILL.md
│   └── workflows/
│       ├── documetacao.md
│       ├── testes.md
│       ├── workflow_debug.md
│       └── workflow_git.md
└── projeto3/
    ├── .agents/
    │   ├── skills/
    │   │   ├── skill_css/
    │   │   │   └── SKILL.md
    │   │   └── skill_formularios/
    │   │       └── SKILL.md
    │   └── workflows/
    │       ├── workflow_debug.md
    │       └── workflow_git.md
    ├── static/
    │   └── css/
    │       └── style.css
    ├── templates/
    │   ├── base.html
    │   ├── login.html
    │   ├── home.html
    │   ├── dashboard.html
    │   ├── tarefas.html
    │   ├── perfil.html
    │   ├── sobre.html
    │   └── 404.html
    ├── app.py
    ├── requirements.txt
    ├── test_app.py
    └── README.md
```

---

## 2. Guardiões do Reino (Usuários de Teste Pré-Cadastrados)

O sistema possui 3 guardiões pré-cadastrados com senhas criptografadas prontos para teste imediato de autenticação no **Portão da Fortaleza**:

| Guardião | Chave (Senha) | Nome Completo | Cargo na Cidadela |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Lorde Comandante Eldor | Grão-Mestre das Fortalezas |
| `dev_vitor` | `senha123` | Vitor, Mestre Arquiteto | Engenheiro de Muralhas & Torres |
| `qa_maria` | `teste123` | Maria, Guardiã das Ruínas | Especialista em Catacumbas & Relíquias |

---

## 3. Páginas e Rotas da Aplicação

1. **Portão da Fortaleza (`/login`)**: Autenticação com sessão, mensagens flash e cartões para preenchimento rápido de teste.
2. **Início (`/`)**: Apresentação do Reino, visão geral das fortalezas e resumo das expedições em andamento.
3. **Salão Estratégico (`/dashboard`)**: Painel de controle analítico com métricas de restauração, taxa de conquista em barra de progresso e missões recentes.
4. **Missões & Ruínas (`/tarefas`)**: Quadro de expedições com filtros por estado (Aguardando, Em Expedição, Restaurada), nível de perigo (Crítico, Médio, Baixo), busca textual e modal para selar novas missões.
5. **Registro do Guardião (`/perfil`)**: Registro nobiliárquico com estatísticas individuais e formulário de atualização cadastral.
6. **Crônicas & Arquitetura (`/sobre`)**: História do reino e detalhes técnicos da engenharia de software empregada (Flask, Jinja2, CSS Gótico/Stone Glass).
7. **Deixar a Fortaleza (`/logout`)**: Encerramento seguro da sessão.

---

## 4. Instruções de Execução

```bash
cd projeto3
pip install -r requirements.txt
python app.py
```

Acesse no navegador: `http://127.0.0.1:5000`
