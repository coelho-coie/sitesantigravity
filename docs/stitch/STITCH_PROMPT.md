# Lumina — The Living Canvas (Design Specification & Stitch Master Prompt)

Este documento contém a especificação completa de design, arquitetura de interface e o **Prompt Mestre** estruturado para ser utilizado no **Stitch** (ou ferramentas de geração de UI).

---

## 1. Visão Geral do Projeto
- **Nome do Projeto:** **Lumina** (*The Living Canvas*)
- **Proposta de Valor:** Plataforma social e galeria de prestígio para fotógrafos autorais, artistas visuais e criadores de conteúdo estético.
- **Referência:** Inspirada nas dinâmicas de engajamento do **Instagram** e na curadoria visual do **Unsplash/Behance**.
- **Diferenciação Visual:** Afasta-se da interface plana branca comum e introduz uma atmosfera **Dark Luxury Neo-Glassmorphic**, com superfícies translúcidas em camadas, brilhos dinâmicos difusos, micro-interações táteis e tipografia editorial sofisticada.

---

## 2. Paleta de Cores (6 Cores Primárias + Tons de Suporte)

| Nome da Cor | Hex | Função & Aplicação |
|---|---|---|
| **Abyssal Dark Canvas** | `#0B0E14` | Cor de fundo geral do sistema; profundidade absoluta sem ofuscar. |
| **Glass Surface Layer** | `#131926` | Fundo dos cards e painéis com `backdrop-filter: blur(16px)` e borda suave. |
| **Electric Violet (Primary)** | `#7C3AED` | Ações principais, botões primários, anéis de stories ativos e gradientes. |
| **Prism Cyan (Secondary)** | `#06B6D4` | Acento secundário, badges de destaque, links ativos e status de verificação. |
| **Crimson Heart (Accent)** | `#F43F5E` | Botões de curtida, badges de novidades e notificações urgentes. |
| **Amber Gold (Prestige)** | `#F59E0B` | Selos de curadoria, selo de fotógrafo Pro e avaliações. |
| **Text Pure White** | `#F8FAFC` | Títulos e textos de primeiro nível (contraste AAA). |
| **Text Muted Slate** | `#94A3B8` | Metadados, legendas secundárias, timestamps e ícones inativos. |

---

## 3. Tipografia & Escala
- **Headlines & Títulos:** `Plus Jakarta Sans` (pesos 600, 700 e 800), com tracking sutil `-0.02em`.
- **Textos de Leitura & Parágrafos:** `Inter` (pesos 400 e 500) para máxima legibilidade.
- **Metadados Fotográficos & Telemetria:** `JetBrains Mono` (abertura, ISO, obturador e resolução).

---

## 4. Estrutura de Páginas e Elementos

### Página 1: Feed Principal (Home)
- **Barra de Navegação Superior:** Logo Lumina com gradiente holográfico, campo de busca com atalho `/`, ícones de notificações com badge pulsante e avatar do usuário logado com menu dropdown.
- **Trilha de Stories / Destaques:** Carrossel horizontal de avatares com anel gradiente violeta/ciano pulsante, efeito hover de escala e botão "+ Criar História".
- **Cards de Postagem:**
  - Cabeçalho do post: foto do autor, nome, @username, selo Pro e menu de 3 pontos.
  - Imagem do post: proporção 4:5 ou 16:9, cantos arredondados (`border-radius: 12px`), sobreposição sutil em hover com botão de tela cheia.
  - Barra de ações rápidas: botão de Curtir com animação de pulso e contagem dinâmica, botão de Comentar com drawer/expansão rápida, botão de Salvar/Bookmark e Compartilhar.
  - Bloco de legenda com suporte a hashtags destacadas e link "Ver todos os 28 comentários".
  - Metadados EXIF discretos no rodapé do card: *50mm • f/1.8 • 1/250s • ISO 100*.
- **Sidebar Direita (Desktop):** "Criadores em Destaque", "Tendências da Semana" e links institucionais.

### Página 2: Explorar & Descoberta
- **Filtros de Categoria:** Chips horizontais (`#Minimalismo`, `#Retrato`, `#Arquitetura`, `#Cyberpunk`, `#Natureza`, `#PB`).
- **Grid Masonry Responsivo:** Fotos em diferentes alturas organizadas em colunas fluidas (4 colunas no Desktop, 2 no Mobile) com overlay revelando autor e número de curtidas ao passar o mouse.

### Página 3: Detalhes da Postagem & Conversas
- **Layout Split (Desktop):**
  - Coluna Esquerda (60%): Imagem ampliada em alta resolução com opção de zoom e fundo escurecido.
  - Coluna Direita (40%): Painel do fotógrafo, botão de "Seguir", lista de comentários rolável com respostas aninhadas e campo de inserção fixo no rodapé com suporte a emojis.

### Página 4: Perfil do Criador
- **Header do Perfil:** Foto de perfil grande com borda iluminada, botões "Editar Perfil" e "Compartilhar", contadores estatísticos (*142 Posts • 18.4K Seguidores • 420 Seguindo*), biografia formatada e links externos.
- **Abas de Conteúdo:** "Publicações", "Destaques Curados", "Salvos".
- **Grid 3 Colunas:** Galeria com efeito de transição rápida ao passar o mouse.

### Página 5: Publicar Nova Foto (Upload)
- **Área Drag & Drop:** Dropzone com linhas pontilhadas luminosas, preview instantâneo após seleção, botão de trocar imagem.
- **Formulário Lateral:** Campo de legenda com contador de caracteres, campo de tags separadas por vírgula, campos opcionais de câmera/lente.
- **Botão de Ação:** Botão "Publicar no Lumina" com gradiente de alta intensidade.

### Página 6: Autenticação (Login e Cadastro)
- **Card Centralizado Neo-Glass:** Cartão translúcido flutuante com desfoque de 20px, logotipo iluminado, campos de entrada com foco iluminado por anel violeta, botão de envio com efeito shimmer e link alternativo entre Login e Registro.

---

## 5. Requisitos Visuais & Efeitos CSS Obrigatórios

```css
/* Tokens de Cores */
:root {
  --lumina-bg: #0b0e14;
  --lumina-card: #131926;
  --lumina-card-border: rgba(255, 255, 255, 0.08);
  --lumina-primary: #7c3aed;
  --lumina-primary-hover: #6d28d9;
  --lumina-cyan: #06b6d4;
  --lumina-crimson: #f43f5e;
  --lumina-amber: #f59e0b;
  --lumina-text: #f8fafc;
  --lumina-text-muted: #94a3b8;
}

/* Efeito Glassmorphism dos Cards */
.lumina-card {
  background: rgba(19, 25, 38, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--lumina-card-border);
  border-radius: 16px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
}

.lumina-card:hover {
  transform: translateY(-2px);
  border-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(124, 58, 237, 0.15);
}

/* Botões Primários com Efeito de Luz e Shimmer */
.btn-lumina-primary {
  background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

.btn-lumina-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
}

.btn-lumina-primary:active {
  transform: scale(0.97);
}

/* Animação do Botão de Curtir */
@keyframes heartPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.35); }
  100% { transform: scale(1); }
}

.heart-active {
  color: #f43f5e;
  animation: heartPulse 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

---

## 6. Prompt Mestre Próprio para Copiar e Colar no Stitch

```markdown
Design a futuristic, high-end creative community web platform called "Lumina: The Living Canvas" (inspired by Instagram and Behance, but with an ultra-premium dark luxury neo-glassmorphic visual identity).

THEME & COLOR PALETTE:
- Background: Deep Obsidian Canvas (#0B0E14) with subtle radial atmospheric lighting
- Cards & Surfaces: Translucent tinted slate (#131926) with 16px background blur and delicate 1px border rgba(255,255,255,0.08)
- Primary Accent: Neon Violet (#7C3AED)
- Secondary Accent: Prism Cyan (#06B6D4)
- Heart / Like Accent: Crimson Rose (#F43F5E)
- Prestige Badge: Amber Gold (#F59E0B)
- Text Hierarchy: Crisp White (#F8FAFC) for headlines and titles; Muted Slate (#94A3B8) for metadata

PAGES & SCREENS:
1. Main Feed (Desktop & Mobile):
   - Sticky glass header with glowing Lumina branding, search bar with keyboard shortcut prompt, activity badges, and profile avatar.
   - Horizontal stories row with illuminated gradient rings and a "+ New Story" creator card.
   - Post cards featuring creator metadata (avatar, name, handle, Pro badge, timestamp), rich photo display (4:5 ratio, rounded corners), interactive engagement bar (animated like button with count, comment bubble, share, bookmark), caption with highlighted hashtags, and camera EXIF chips (e.g., 50mm, f/1.8, ISO 100).
   - Right desktop sidebar with suggested photographers and trending tags.
2. Explore Gallery:
   - Masonry layout of aesthetic photos with category pill filters (Portraits, Architecture, Cyberpunk, Monochrome).
   - Hover overlays showing photographer name and like count.
3. Post Detail View:
   - Split layout with high-resolution image on the left and creator info, real-time comment stream, and comment input on the right.
4. Creator Profile:
   - Hero section with gradient-ringed avatar, stats counter (Posts, Followers, Following), biography, social links, and "Follow" button.
   - Tabbed gallery (Posts, Curated, Saved).
5. Upload Modal / Page:
   - Modern drag-and-drop zone with dotted glowing border, file preview, caption textarea, and tag selector.
6. Login & Registration:
   - Floating glass modal card with smooth input focus states and glowing submit button.

VISUAL REQUIREMENTS:
- Fully responsive across desktop (12 columns), tablet (8 columns), and mobile (fixed bottom navigation bar).
- Smooth CSS hover transitions, glowing button states, micro-animations on interactive badges.
- Clean, uncluttered, intuitive information hierarchy that lets visual content shine.
```
