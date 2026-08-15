---
name: skill_css
description: >-
  Diretrizes de estilização, arquitetura CSS3, layout responsivo, 
  design tokens e boas práticas de UI/UX para aplicações web modernas.
---

# Skill CSS: Estilização e Boas Práticas de Design

Esta skill define as diretrizes fundamentais de arquitetura CSS, organização de estilos e padrões de design visual para o projeto.

---

## 1. Princípios de Arquitetura CSS

1. **Design Tokens & Variáveis CSS (`:root`)**:
   - Centralize cores, tipografia, espaçamentos, raios de borda e sombras em variáveis nativas do CSS.
   - Facilite a manutenção e a alternância entre temas (Dark/Light).

2. **Mobile-First & Responsividade**:
   - Comece o layout com estilos base para telas menores e utilize `@media (min-width: ...)` para expandir em tablets e desktops.
   - Use unidades fluidas como `rem`, `em`, `%`, `vw` e `vh`, evitando tamanhos fixos em pixels para containers principais.

3. **Layout Moderno (Flexbox & CSS Grid)**:
   - Use **Flexbox** para componentes unidimensionais (barras de navegação, alinhamento de itens, grupos de botões).
   - Use **CSS Grid** para estruturas bidimensionais (grades de cartões, dashboards, layouts de página).

4. **Nomenclatura Semântica**:
   - Adote classes descritivas e modulares (ex: `.card-metric`, `.badge-status`, `.btn-primary-custom`).
   - Evite seletores excessivamente aninhados ou com especificidade excessiva (`!important` deve ser evitado).

---

## 2. Padrões Visuais e UI/UX

- **Hierarquia Visual Clara**: Títulos, subtítulos e textos corridos devem possuir contrastes e tamanhos proporcionais.
- **Micro-interações**: Adicione transições suaves (`transition: all 0.2s ease-in-out`) em botões, links e cards ao passar o cursor (`:hover`) e focar (`:focus-visible`).
- **Acessibilidade (a11y)**:
  - Garanta contraste mínimo de texto (padrão WCAG AA).
  - Nunca remova o contorno de foco (`outline`) sem fornecer um substituto visual visível.
- **Glassmorphism e Sombras Sutis**:
  - Utilize fundos semi-transparentes com `backdrop-filter: blur(...)` e sombras suaves (`box-shadow: 0 4px 12px rgba(0,0,0,0.06)`).

---

## 3. Checklist de Implementação CSS

- [ ] Todas as cores do tema estão mapeadas em variáveis CSS.
- [ ] O layout foi testado em resolução mobile (< 576px), tablet (768px) e desktop (> 992px).
- [ ] Todos os elementos interativos possuem estados de `:hover`, `:focus` e `:active`.
- [ ] O contraste de texto atende aos requisitos de legibilidade.
- [ ] Não há barras de rolagem horizontal indesejadas (`overflow-x: hidden` verificado).
