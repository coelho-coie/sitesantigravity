# Referência Completa de API & Módulos

Este documento documenta todas as classes, métodos, constantes e assinaturas de funções expostas nos módulos de `src/`.

---

## 1. Módulo `src/map_gen.js`

### Constantes
- `TILE_WALL = 0`: Representa parede oclusiva e não caminhável.
- `TILE_FLOOR = 1`: Representa chão transitável e não oclusivo.

### Classes

#### `RectRoom`
- `constructor(x, y, w, h)`
  - Cria uma sala retangular delimitada por coordenadas de grade.
- `intersects(other, padding = 1): boolean`
  - Retorna `true` se houver sobreposição com outra sala.
- `centerX: number`, `centerY: number`
  - Coordenadas centrais da sala.

#### `DungeonMap`
- `constructor(width = 54, height = 36)`
  - Inicializa o mapa preenchido com `TILE_WALL`.
- `getTile(x, y): number`
  - Retorna o tipo de ladrilho na posição $(x, y)$.
- `setTile(x, y, type): void`
  - Modifica o tipo de ladrilho na posição $(x, y)$.
- `isWalkable(x, y): boolean`
  - Retorna `true` se o ladrilho for `TILE_FLOOR`.
- `carveRoom(room: RectRoom): void`
  - Converte as células da sala em `TILE_FLOOR`.
- `carveCorridor(x1, y1, x2, y2): void`
  - Escava um túnel em L conectando dois pontos centrais.
- `generate(options): DungeonMap`
  - Executa a geração procedural com posicionamento do jogador e escadaria.

---

## 2. Módulo `src/fov.js`

#### `FieldOfView`
- `constructor(width, height)`
  - Aloca matrizes `Uint8Array` para `visible` e `explored`.
- `isVisible(x, y): boolean`
  - Retorna `true` se a célula estiver no campo de visão atual.
- `isExplored(x, y): boolean`
  - Retorna `true` se a célula já tiver sido visitada pelo jogador.
- `compute(map, originX, originY, radius = 8): void`
  - Projeta 180 raios angulares a partir da origem para calcular iluminação e oclusão.

---

## 3. Módulo `src/entities.js`

#### `Entity`
- `constructor(x, y, name, char, color)`
  - Classe base de todos os atores e objetos no mapa.

#### `Fighter extends Entity`
- `maxHp: number`, `hp: number`, `atk: number`, `def: number`
- `takeDamage(amount: number): number`
  - Subtrai dano da vida e altera `isAlive` para `false` se `hp === 0`.
- `heal(amount: number): number`
  - Recupera pontos de vida respeitando `maxHp`.

#### `Player extends Fighter`
- `floor: number`: Andar atual da masmorra.
- `kills: number`: Quantidade de monstros eliminados.
- `turns: number`: Quantidade total de turnos jogados.
- `score: number`: Pontuação total acumulada.
- `levelUpStats(statType: 'atk' | 'def' | 'hp'): void`

#### `Monster extends Fighter`
- `constructor(x, y, type: 'goblin' | 'skeleton' | 'ogre', floor = 1)`
- `alertRadius: number`: Distância máxima para detectar o jogador.
- `isAlerted: boolean`: Estado de alerta ativo.
- `getNextStepToward(targetX, targetY, map, entities): {x, y} | null`
  - Algoritmo de busca heurística para aproximação ortogonal.

#### `Item extends Entity`
- `constructor(x, y, itemType: 'potion' | 'chest' | 'stairs')`

---

## 4. Módulo `src/combat.js`

#### `CombatSystem`
- `constructor(logCallback: (message, type) => void)`
- `attack(attacker: Fighter, defender: Fighter): { damage, isCrit, killed }`
  - Executa o cálculo de dano, emite som, gera mensagens de log e atualiza estatísticas.

---

## 5. Módulo `src/renderer.js`

#### `DungeonRenderer`
- `constructor(canvas: HTMLCanvasElement)`
- `tileSize: number = 32`
- `camera: { x, y }`
- `addFloatingText(text, tileX, tileY, color): void`
  - Registra números de dano/cura flutuantes.
- `triggerShake(intensity, duration): void`
  - Produz tremor de tela cinemático durante impactos.
- `updateCamera(playerX, playerY, mapW, mapH): void`
  - Centraliza a visualização no jogador com limites de borda.
- `render(map, fov, player, entities, items): void`
  - Desenha todo o frame do jogo.

---

## 6. Módulo `src/audio.js`

#### `ProceduralAudio`
- Métodos expostos:
  - `playStep()`
  - `playSword()`
  - `playHit()`
  - `playPlayerDamage()`
  - `playPotion()`
  - `playChest()`
  - `playStairs()`
  - `playDeath()`
