# Registro de Memória e Decisões de Arquitetura — Projeto 07 (Lumina)

## Contexto Geral
- **Data de Início:** 12/09/2026
- **Objetivo:** Desenvolvimento de uma plataforma web completa em Django inspirada no Instagram/Unsplash com tema e identidade visual própria ("Lumina: The Living Canvas").
- **Design System:** Dark Luxury Neo-Glassmorphism projetado no Stitch (`projects/15185693362484550746`).

## Decisões Tomadas
1. **Modelagem de Dados**:
   - `Profile`: Perfil estendido do usuário Django contendo avatar, bio, selo Pro e links.
   - `Post`: Conteúdo multimídia autoral, legenda, dados EXIF simulados (câmera, lente, abertura, ISO, local), timestamp e contadores desnormalizados.
   - `Tag`: Sistema de categorização por hashtags (`#Cyberpunk`, `#Minimalismo`, etc.).
   - `Like`: Relação M2M ou modelo explícito ligando `User` a `Post` com constraint de unicidade.
   - `Comment`: Mensagens encadeadas com autor e data.
2. **Estilo & CSS**:
   - Vanilla CSS puro seguindo as diretrizes de Web Design: zero Tailwind, paleta com 6 cores ricas, efeitos táteis de hover, blur 16px/24px, responsividade mobile-first.
