# Lumina — The Living Canvas (Django & Stitch Web Platform)

> **Plataforma Web autoral de prestígio para fotógrafos, artistas visuais e criadores de estética.**
> Referência de dinâmica: **Instagram / Unsplash** | Identidade Visual: **Dark Luxury Neo-Glassmorphism**.

---

## 📸 Sobre o Projeto

O **Lumina** foi projetado para elevar a apresentação de fotografia e arte digital através de uma experiência imersiva e responsiva. O projeto substitui o visual branco e plano das redes sociais convencionais por uma atmosfera noturna com efeitos ópticos, superfícies em vidro translúcido (*backdrop-filter: blur*), anéis gradientes nos stories e telemetria EXIF de câmera para cada fotografia.

### Destaques do Projeto
- **Estética Dark Neo-Glassmorphic**: Paleta rica de 6+ tons com acentos em Violeta Elétrico (`#7C3AED`), Ciano Prisma (`#06B6D4`), Carmesim (`#F43F5E`) e Âmbar (`#F59E0B`).
- **Prompt Mestre para Stitch**: Especificação técnica detalhada arquivada em [`docs/stitch/STITCH_PROMPT.md`](docs/stitch/STITCH_PROMPT.md) e projeto sincronizado via MCP Stitch (`projects/15185693362484550746`).
- **Telemetria EXIF por Post**: Exibição elegante de corpo de câmera, lente, velocidade, abertura, ISO e localização.
- **Interações Reativas**: Sistema assíncrono de curtidas com micro-animação sem refresh de página, preview instantâneo de upload e comentários em tempo real.
- **Autenticação & Perfis**: Sistema completo de cadastro, login com credenciais de demonstração, edição de perfil e contadores de engajamento.

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Python 3.12, Django 5.2 (ORM, Auth, Signals, Forms, Views, Migrations)
- **Frontend**: HTML5 Semântico, Vanilla CSS Puro (sem dependência de Tailwind/Bootstrap), Vanilla JavaScript
- **Banco de Dados**: SQLite3
- **Design & UI**: Stitch MCP (Google Cloud Project Design)

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- Python 3.12+
- Git

### 2. Configuração do Ambiente e Dependências

Clone ou abra o repositório e execute no PowerShell:

```powershell
# Ativar o ambiente virtual criado
.\.venv\Scripts\Activate.ps1

# Se necessário reinstalar dependências:
pip install -r requirements.txt
```

### 3. Migrações e Banco de Dados

```powershell
.\manage.ps1 migrate
```

### 4. Carga de Dados de Demonstração (Seed)

Popula o banco com criadores autorais, fotos em alta resolução, tags e comentários:

```powershell
.\manage.ps1 seed
```

### 5. Iniciar o Servidor de Desenvolvimento

```powershell
.\manage.ps1 run
```

Acesse no navegador: **`http://127.0.0.1:8000/`**

---

## 🔑 Credenciais de Teste / Demonstração

| Usuário | Senha | Perfil |
|---|---|---|
| `lumina_demo` | `lumina123456` | Fotógrafo Pro (Aiden Mercer) |
| `kenji_shibuya` | `lumina123456` | Street Photographer (Tóquio) |
| `elena_rostova` | `lumina123456` | Arquiteta & Curadora (Atacama) |
| `aria_lens` | `lumina123456` | Retratista Conceitual (Londres) |

---

## 🧪 Testes Automatizados

Para rodar a suíte completa de testes unitários:

```powershell
.\manage.ps1 test
```

---

## 📂 Estrutura de Diretórios

```
Projeto07/
├── .agents/                    # Configurações e memórias dos agentes
│   ├── rules/                  # Regras operacionais e universais
│   └── memory/                 # Registro de arquitetura e decisões
├── docs/
│   └── stitch/                 # Master Prompt e tokens de design do Stitch
├── lumina_core/                # Núcleo de configuração do Django
│   ├── settings.py             # Configurações, dotenv, static e media
│   ├── urls.py                 # Roteamento global
│   └── wsgi.py
├── core/                       # Aplicação principal
│   ├── models.py               # Profile, Post, Tag, Like, Comment, Story
│   ├── forms.py                # UserRegister, PostCreate, CommentForm
│   ├── views.py                # Feed, Explore, PostDetail, Create, Profile
│   ├── urls.py                 # Rotas da aplicação
│   ├── admin.py                # Painel administrativo
│   └── tests.py                # Suíte de testes unitários
├── static/
│   ├── css/                    # Design System Vanilla CSS (style.css, animations.css)
│   └── js/                     # Lógica assíncrona (main.js)
├── templates/                  # Templates HTML5 Glassmorphism
│   ├── base.html
│   ├── feed.html
│   ├── explore.html
│   ├── post_detail.html
│   ├── create_post.html
│   ├── profile.html
│   └── auth/
├── manage.ps1                  # Workflow CLI utilitário
├── requirements.txt            # Dependências do projeto
└── seed_data.py                # Gerador de dados de demonstração
```
