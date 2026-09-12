# Especificação de Game Design & Mecânicas

Este documento detalha as regras de jogo, balanceamento, fórmulas matemáticas de combate, tipos de monstros, progressão de andares e sistema de Linha de Visão (Fog of War).

---

## 1. O Jogador (Cavaleiro Errante)

- **Símbolo**: `@`
- **Atributos Iniciais**:
  - **Vida Máxima (Max HP)**: 45
  - **Ataque (ATK)**: 7
  - **Defesa (DEF)**: 3
  - **Raio de Visão (FOV Radius)**: 8 tiles
- **Progressão**:
  - A cada baú encontrado, o jogador recebe um incremento permanente: `+2 ATK` ou `+1 DEF`.
  - A cada monstro derrotado, o jogador acumula Pontos de Experiência (XP) e Pontuação (Score).

---

## 2. Bestiário & Inteligência Artificial

A cada andar $F$, os monstros sofrem escala de poder multiplicativa baseada na fórmula:
$$\text{Fator de Escala} = 1 + (F - 1) \times 0.25$$

| Monstro | Símbolo | Papel Tático | HP Base | ATK Base | DEF Base | Raio de Alerta |
|---|---|---|---|---|---|---|
| **Goblin Sorrateiro** | `g` | Oportunista rápido de baixo dano | 14 | 4 | 1 | 7 tiles |
| **Guerreiro Esqueleto** | `s` | Soldado de combate corpo-a-corpo blindado | 22 | 6 | 2 | 7 tiles |
| **Ogro das Profundezas** | `O` | Bruto colossal de alta resistência (surge a partir do Andar 3) | 36 | 8 | 3 | 7 tiles |

### Lógica da IA de Inimigos
1. **Verificação de Visibilidade**: Se o monstro estiver dentro do raio de alerta do jogador e possuir linha de visão direta (ou se a distância Euclidiana for menor que 3 tiles), ele entra em estado de alerta (`isAlerted = true`).
2. **Engajamento**:
   - Se a distância Manhattan for igual a 1 ($|\Delta x| + |\Delta y| = 1$), o monstro executa um ataque corpo-a-corpo contra o jogador.
   - Caso contrário, o monstro avalia os 4 passos ortogonais adjacentes, descartando paredes e células ocupadas por outros monstros vivos, escolhendo a posição com a menor distância Euclidiana ao jogador.

---

## 3. Fórmulas de Combate

Quando uma entidade $A$ ataca uma entidade $D$:

1. **Variação Aleatória de Dano ($\Delta$)**:
   $$\Delta \in \{-1, 0, +1\}$$
2. **Dano Bruto Base**:
   $$\text{Dano Bruto} = \text{ATK}_A - \text{DEF}_D + \Delta$$
3. **Acerto Crítico (12% de chance)**:
   $$\text{Dano Final} = \begin{cases} \max(1, \lfloor \text{Dano Bruto} \times 1.5 \rfloor), & \text{se Crítico} \\ \max(1, \text{Dano Bruto}), & \text{caso contrário} \end{cases}$$

---

## 4. Itens e Objetos de Mapa

| Item | Símbolo | Efeito |
|---|---|---|
| **Poção de Cura** | `!` | Restaura instantaneamente 18 pontos de vida (sem exceder Max HP). Toca arpejo ascendente C-E-G-C. |
| **Baú de Tesouro** | `=` | Abre e concede arma (+2 ATK) ou armadura (+1 DEF) e +50 pontos. Toca acorde de vitória. |
| **Escada Descendente** | `>` | Conduz o jogador ao próximo andar ($F + 1$), gerando um novo mapa procedural e concedendo +100 pontos. |

---

## 5. Algoritmo de Visão e Fog of War

O sistema implementa 3 estados de visibilidade para cada ladrilho $(x, y)$:
- **Não Explorado (`isExplored = false`)**: Ladrilho completamente escuro (`#000000`), sem renderização prévia.
- **Explorado na Memória (`isExplored = true, isVisible = false`)**: Ladrilho visitado em turnos anteriores. Renderizado em tons frios dessaturados e escuros de pedra (`#12151e`), permitindo que o jogador se oriente. Monstros ocultos nessa área **não são visíveis**.
- **Diretamente Visível (`isVisible = true`)**: Ladrilho dentro da linha de visão do jogador. Renderizado com iluminação quente simulando luz de tocha, decaindo suavemente conforme a distância. Todos os monstros e itens são desenhados.
