# Dungeon Roguelike - Masmorra em Turnos

> Jogo Roguelike tático de exploração de masmorra em turnos, renderizado via HTML5 Canvas e sintetizado em tempo real com Web Audio API, construído com JavaScript modular puro (ES6 Modules) sem nenhuma dependência externa.

---

## 🎮 Visão Geral

**Dungeon Roguelike** coloca o jogador no papel de um Cavaleiro explorando masmorras geradas proceduralmente. A cada andar, salas e corredores únicos são gerados com inimigos com IA de perseguição, baús de tesouro, poções e escadarias para as profundezas.

### Destaques
- 🧱 **Geração Procedural Garantida**: Salas retangulares conectadas por corredores determinísticos em L sem salas isoladas.
- 👁️ **Linha de Visão & Fog of War**: Algoritmo de Raycasting 360° revelando áreas em tempo real com memória crepuscular para áreas visitadas.
- ⚔️ **Combate Tático em Turnos**: O mundo só se move quando o jogador age. Cálculo de dano dinâmico, variação de ataque e golpes críticos.
- 👾 **Múltiplos Inimigos com IA**: Goblins ágeis, Esqueletos blindados e Ogros brutais com perseguição vetorial.
- 🔊 **Áudio 100% Procedural**: Sintetização sonora em tempo real via Web Audio API (passos, espadas, impactos, poções, baús, escadas e morte).
- 💀 **Permadeath Autêntico**: Perdeu a vida, a jornada é encerrada com tela de estatísticas da run (andar alcançado, monstros abatidos, turnos sobrevividos).

---

## ⚡ Quick Start

### Pré-requisitos
- Navegador moderno com suporte a HTML5 Canvas e ES6 Modules (Chrome, Edge, Firefox, Safari).
- Python 3 instalado para servidor HTTP local (ou qualquer servidor web estático).

### Execução em 2 Passos

1. **Iniciar o servidor HTTP local** na raiz do projeto:
   ```bash
   python -m http.server 8085
   ```

2. **Abrir no navegador**:
   Acesse [http://localhost:8085/](http://localhost:8085/)

---

## 🕹️ Controles

| Ação | Teclas de Teclado | D-Pad na Tela |
|---|---|---|
| **Mover / Atacar (Cima)** | `W` ou `Seta para Cima` ou `Numpad 8` | Botão `▲` |
| **Mover / Atacar (Baixo)** | `S` ou `Seta para Baixo` ou `Numpad 2` | Botão `▼` |
| **Mover / Atacar (Esquerda)** | `A` ou `Seta para Esquerda` ou `Numpad 4` | Botão `◀` |
| **Mover / Atacar (Direita)** | `D` ou `Seta para Direita` ou `Numpad 6` | Botão `▶` |
| **Aguardar Turno** | `Espaço` ou `.` ou `Numpad 5` | Botão central `●` |
| **Reiniciar Jogo** | `R` (ou botão na tela de Game Over) | Botão "Renascer" |

---

## 🗺️ Guia de Elementos e Ícones

| Símbolo | Nome | Descrição |
|---|---|---|
| `@` | **Cavaleiro** | O jogador. Vida inicial 45, Ataque 7, Defesa 3. |
| `g` | **Goblin** | Inimigo veloz com vida menor e ataques rápidos. |
| `s` | **Esqueleto** | Guerreiro morto-vivo com maior resistência física. |
| `O` | **Ogro** | Monstro brutal presente em andares mais profundos. |
| `!` | **Poção de Cura** | Frasco brilhante que restaura 18 pontos de vida. |
| `=` | **Baú de Tesouro** | Concede +2 de Ataque ou +1 de Defesa permanente. |
| `>` | **Escadaria** | Passagem descendente que gera um novo andar inédito. |

---

## 📁 Estrutura do Projeto

```
Projeto6/
├── .agents/                 # Sistema de regras, agentes e memória do AG Kit
│   ├── rules/               # Regras ativas (P0, TIER 0)
│   └── memory/              # Convenções persistentes de projeto
├── docs/                    # Documentação técnica completa
│   ├── ARCHITECTURE.md      # Arquitetura do sistema e fluxo de dados
│   ├── GAME_DESIGN.md       # Regras, fórmulas de combate e mecânicas
│   ├── AUDIO_SYNTHESIS.md   # Engenharia do sintetizador Web Audio API
│   └── API_REFERENCE.md     # Documentação dos módulos e classes
├── src/                     # Código fonte modular (ES6)
│   ├── audio.js             # Sintetizador procedural de efeitos sonoros
│   ├── combat.js            # Resolução de ataques, críticos e eventos
│   ├── entities.js          # Classes de entidades, monstros e IA
│   ├── fov.js               # Campo de visão (FOV) e névoa de guerra
│   ├── main.js              # Controlador principal, ciclo de turnos e HUD
│   ├── map_gen.js           # Gerador procedural de masmorra
│   └── renderer.js          # Renderizador 2D Canvas e iluminação
├── .env                     # Variáveis de ambiente locais
├── .env.example             # Modelo versionado de ambiente
├── .gitignore               # Configurações defensivas do Git
├── index.html               # Estrutura da página, HUD e Canvas
├── README.md                # Este documento
├── roguelike-game.md        # Plano de tarefas do projeto
└── style.css                # Estilização visual medieval e responsividade
```

---

## 📚 Documentação Técnica Completa

Para detalhes aprofundados sobre a engenharia do projeto, consulte a pasta [`docs/`](./docs/):

- [Arquitetura de Sistema (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [Design de Jogo & Fórmulas (`docs/GAME_DESIGN.md`)](./docs/GAME_DESIGN.md)
- [Sintetizador Web Audio API (`docs/AUDIO_SYNTHESIS.md`)](./docs/AUDIO_SYNTHESIS.md)
- [Referência de API & Módulos (`docs/API_REFERENCE.md`)](./docs/API_REFERENCE.md)

---

## 🛡️ Licença

Projeto desenvolvido sob a licença MIT. Livre para estudo, modificação e distribuição.
