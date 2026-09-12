---
name: workflow_validacao
description: Roteiro de validação funcional, critérios de aceitação e testes no navegador para a plataforma Lumina
---

# Workflow de Validação de Interface e Funcionalidades

Este workflow orienta a verificação prática da plataforma **Lumina Canvas** no navegador, validando cada rota, efeito visual e comportamento assíncrono.

---

## 1. Roteiro de Testes no Navegador

### Teste 1: Feed Principal e Identidade Visual (`/`)
- [ ] **Stories**: Verificar se o carrossel superior exibe os avatares com gradiente violeta/ciano pulsante.
- [ ] **Cards Glassmorphism**: Confirmar o fundo translúcido (`rgba(19, 25, 38, 0.7)`), desfoque `backdrop-filter: blur(16px)` e bordas sutis.
- [ ] **Telemetria EXIF**: Observar se os badges de câmera, lente, abertura e ISO aparecem sobre as fotos com estilo neon.
- [ ] **Badge de Tags**: Confirmar que as tags `#cyberpunk`, `#neon`, `#cinematic` possuem estilo fosforescente e são clicáveis.

### Teste 2: Sistema de Curtidas Assíncrono (AJAX / Fetch)
- [ ] **Estado Deslogado**: Clicar no botão de coração de um post; deve redirecionar para `/auth/login/`.
- [ ] **Estado Autenticado**: Fazer login com `lumina_demo` / `lumina123456`.
- [ ] **Microinteração**: Clicar no botão de like:
  - O ícone do coração deve preencher com a cor carmesim (`#F43F5E`).
  - A animação CSS de pulsação (`scale(1.3)`) deve ser disparada.
  - O contador numérico de likes deve incrementar em +1 sem recarregar a página.
  - Um segundo clique deve remover o like e decrementar o contador.

### Teste 3: Comentários e Detalhes do Post (`/post/<id>/`)
- [ ] Clicar no botão de balão de comentário em qualquer card do feed.
- [ ] A página de detalhes deve carregar exibindo a imagem ampliada em alta resolução à esquerda e o painel de discussão à direita.
- [ ] Enviar um comentário; o texto deve ser persistido e adicionado à lista imediatamente.

### Teste 4: Mural Explorar e Filtros Dinâmicos (`/explore/`)
- [ ] Acessar `/explore/`.
- [ ] Verificar a barra horizontal de filtros com tags populares (`#cyberpunk`, `#neon`, `#portrait`, `#landscape`, `#architecture`).
- [ ] Clicar na tag `#cyberpunk`:
  - Apenas as publicações associadas à tag devem ser filtradas e exibidas no grid.
  - O layout responsivo em grid com efeito de zoom suave no hover (`scale(1.03)`) deve funcionar fluidamente.

### Teste 5: Publicação de Nova Foto (`/create/`)
- [ ] Acessar `/create/` com usuário autenticado.
- [ ] **Live Preview**: Fazer upload de uma imagem do computador e verificar se o container de preview exibe a foto instantaneamente antes do envio.
- [ ] Preencher legenda, tags separadas por vírgula e parâmetros opcionais de câmera (Modelo, Lente, Abertura, ISO, Shutter).
- [ ] Clicar em **Publicar Obra**.
- [ ] A aplicação deve redirecionar para o feed com a nova publicação visível no topo.

### Teste 6: Perfil do Artista e Edição (`/profile/<username>/`)
- [ ] Acessar `/profile/lumina_demo/`.
- [ ] Validar a exibição da foto de perfil, contadores de publicações, seguidores e curtidas acumuladas.
- [ ] Validar a grade de miniaturas do fotógrafo.
- [ ] Clicar em **Editar Perfil** (`/profile/edit/`) e alterar biografia ou localização, salvando com sucesso.

### Teste 7: Responsividade e Dispositivos Móveis
- [ ] Redimensionar a janela do navegador para largura mobile (375px a 768px).
- [ ] Confirmar que o menu lateral superior se adapta (menu hambúrguer ou barra de navegação inferior).
- [ ] Confirmar que os cards do feed e o grid de exploração ocupam 100% da largura sem barras de rolagem horizontal indesejadas.
