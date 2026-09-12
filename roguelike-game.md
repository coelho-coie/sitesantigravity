# Roguelike Masmorra - Implementation Plan

**Objective**: Desenvolver e executar localmente um jogo Roguelike de masmorra procedural completo no navegador (HTML5 Canvas + Vanilla ES6 Modules + Web Audio API) com combate em turnos, FoV (Fog of War), múltiplos inimigos, progressão de andares, permadeath e HUD tático.

## Architecture Breakdown

| Módulo | Responsabilidade |
|---|---|
| `index.html` | Layout da aplicação, container do canvas, HUD lateral e painel de log de combate |
| `style.css` | Design styling premium dark/dungeon, tipografia retro-moderna, responsividade e HUD |
| `src/audio.js` | Sintetizador procedural com Web Audio API (passos, ataque, dano, poção, escada, morte) |
| `src/map_gen.js` | Geração procedural de salas e corredores com conectividade garantida (sem salas isoladas) |
| `src/fov.js` | Sistema de campo de visão (Raycasting / Shadowcasting) com tiles visíveis e explorados |
| `src/entities.js` | Classes e instâncias: Player, Inimigos (Goblin, Esqueleto), Baús, Poções e Escadaria |
| `src/combat.js` | Resolução tática de combate por turnos, cálculo de dano e registro de eventos |
| `src/renderer.js` | Renderização 2D procedural no Canvas (tiles, iluminação, entidades estilizadas e efeitos) |
| `src/main.js` | Orquestração do loop de jogo, máquina de estados (Run, Game Over), inputs e HUD |

## Tasks

- [x] Task 1: Scaffolding e estrutura de arquivos base (`index.html`, `style.css`)
- [x] Task 2: Implementação do sintetizador de áudio procedural (`src/audio.js`)
- [x] Task 3: Algoritmo de geração de masmorra procedural e conectividade (`src/map_gen.js`)
- [x] Task 4: Sistema de Linha de Visão e Fog of War (`src/fov.js`)
- [x] Task 5: Entidades, tipos de monstros, itens e IA de perseguição (`src/entities.js`)
- [x] Task 6: Sistema de combate por turnos e log de eventos (`src/combat.js`)
- [x] Task 7: Renderizador Canvas 2D com estética procedural rica (`src/renderer.js`)
- [x] Task 8: Orquestrador principal, inputs, ciclo de turnos e HUD (`src/main.js`)
- [x] Task 9: Execução de servidor HTTP local e validação com browser subagent/testes
