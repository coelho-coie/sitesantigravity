# Regras Específicas: Lumina Django Web Platform

- **Framework**: Django 5.x com Python 3.12.
- **Frontend**: HTML5 Semântico com Vanilla CSS (Glassmorphism, custom properties, transiton e keyframes). Não utilizar TailwindCSS.
- **Banco de Dados**: SQLite para desenvolvimento local com migrações automáticas.
- **Armazenamento de Mídia**: Suporte a upload de fotos em `media/uploads/` com fallbacks gerados em SVG/CSS para exibição sem imagens quebradas.
- **Autenticação**: Uso de `django.contrib.auth` com formulários customizados, telas de login, registro, logout e perfil de usuário vinculado via Signal (`Profile`).
- **Engajamento**: Rotas dinâmicas para toggle de curtidas (JSON endpoint) e comentários assíncronos.
