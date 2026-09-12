/**
 * Roguelike Dungeon Crawler - Main Controller & Game Loop
 * Final Fantasy Tactical Magic, Limit Break, Boss Battles & Procedural Exploration
 */

import { DungeonMap } from './map_gen.js?v=20260912_ff_expansion';
import { FieldOfView } from './fov.js?v=20260912_ff_expansion';
import { Player, Monster, BossMonster, Item } from './entities.js?v=20260912_ff_expansion';
import { CombatSystem } from './combat.js?v=20260912_ff_expansion';
import { DungeonRenderer } from './renderer.js?v=20260912_ff_expansion';
import { sound } from './audio.js?v=20260912_ff_expansion';

export const GAME_STATE = {
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
};

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new DungeonRenderer(this.canvas);
    this.state = GAME_STATE.PLAYING;

    // HUD Elements - Vital & Stats
    this.hpFillEl = document.getElementById('hpFill');
    this.hpTextEl = document.getElementById('hpText');
    this.mpFillEl = document.getElementById('mpFill');
    this.mpTextEl = document.getElementById('mpText');
    this.limitFillEl = document.getElementById('limitFill');
    this.limitTextEl = document.getElementById('limitText');
    this.limitStatusTextEl = document.getElementById('limitStatusText');

    this.floorEl = document.getElementById('floorNum');
    this.atkEl = document.getElementById('atkVal');
    this.defEl = document.getElementById('defVal');
    this.killsEl = document.getElementById('killsVal');
    this.scoreEl = document.getElementById('scoreVal');
    this.combatLogEl = document.getElementById('combatLog');

    // Boss Bar Elements
    this.bossBarContainer = document.getElementById('bossBarContainer');
    this.bossIconEl = document.getElementById('bossIcon');
    this.bossNameEl = document.getElementById('bossName');
    this.bossTitleEl = document.getElementById('bossTitle');
    this.bossHpTextEl = document.getElementById('bossHpText');
    this.bossHpFillEl = document.getElementById('bossHpFill');

    // Tactical Command Buttons
    this.cmdAttack = document.getElementById('cmdAttack');
    this.cmdFire = document.getElementById('cmdFire');
    this.cmdIce = document.getElementById('cmdIce');
    this.cmdThunder = document.getElementById('cmdThunder');
    this.cmdCure = document.getElementById('cmdCure');
    this.cmdDefend = document.getElementById('cmdDefend');
    this.cmdLimit = document.getElementById('cmdLimit');

    // Game Over Modal
    this.gameOverModal = document.getElementById('gameOverModal');
    this.finalFloorEl = document.getElementById('finalFloor');
    this.finalKillsEl = document.getElementById('finalKills');
    this.finalTurnsEl = document.getElementById('finalTurns');
    this.finalScoreEl = document.getElementById('finalScore');
    this.restartBtn = document.getElementById('restartBtn');

    this.combat = new CombatSystem((msg, type) => this.addLog(msg, type));

    this.map = null;
    this.fov = null;
    this.player = null;
    this.entities = [];
    this.items = [];
    this.activeBoss = null;

    this.setupInputs();
    this.startNewGame();
  }

  addLog(message, type = 'info') {
    if (!this.combatLogEl) return;
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `> ${message}`;
    this.combatLogEl.appendChild(entry);
    this.combatLogEl.scrollTop = this.combatLogEl.scrollHeight;

    // Keep up to 60 log entries
    while (this.combatLogEl.children.length > 60) {
      this.combatLogEl.removeChild(this.combatLogEl.firstChild);
    }
  }

  startNewGame() {
    this.state = GAME_STATE.PLAYING;
    if (this.gameOverModal) {
      this.gameOverModal.classList.add('hidden');
    }
    if (this.combatLogEl) {
      this.combatLogEl.innerHTML = '';
    }

    this.player = new Player(0, 0);
    this.addLog('⚔️ Bem-vindo às profundezas da masmorra! Derrote as trevas e liberte o reino.', 'info');
    this.addLog('✨ Domine magias arcanas [1-4], assuma postura defensiva [E] e libere o Omnislash [L]!', 'info');
    this.initFloor(1);
    this.updateHud();
    this.requestRender();
  }

  initFloor(floorNum) {
    this.player.floor = floorNum;
    this.map = new DungeonMap(52, 34);
    this.map.generate({ maxRooms: 14 + Math.min(6, floorNum) });
    this.fov = new FieldOfView(this.map.width, this.map.height);

    // Position player in starting room
    this.player.x = this.map.playerStart.x;
    this.player.y = this.map.playerStart.y;

    this.entities = [this.player];
    this.items = [];
    this.activeBoss = null;

    // Place descent stairs
    this.items.push(new Item(this.map.stairs.x, this.map.stairs.y, 'stairs'));

    // Populate remaining rooms
    for (let i = 1; i < this.map.rooms.length; i++) {
      const room = this.map.rooms[i];

      // Spawn regular monsters
      const monsterCount = Math.floor(Math.random() * 2) + 1;
      for (let m = 0; m < monsterCount; m++) {
        const mx = room.x + 1 + Math.floor(Math.random() * (room.w - 2));
        const my = room.y + 1 + Math.floor(Math.random() * (room.h - 2));

        // Monster variety & difficulty scaling
        const roll = Math.random();
        let monsterType = 'goblin';
        if (floorNum >= 3 && roll < 0.35) {
          monsterType = 'ogre';
        } else if (roll < 0.6) {
          monsterType = 'skeleton';
        }

        this.entities.push(new Monster(mx, my, monsterType, floorNum));
      }

      // Spawn Items (Health potions and chests)
      if (Math.random() < 0.65) {
        const ix = room.x + 1 + Math.floor(Math.random() * (room.w - 2));
        const iy = room.y + 1 + Math.floor(Math.random() * (room.h - 2));
        const itemType = Math.random() < 0.6 ? 'potion' : 'chest';
        this.items.push(new Item(ix, iy, itemType));
      }
    }

    // Spawn Boss on floors 3 and 5 in the stair sanctum
    if (floorNum === 3 || floorNum === 5) {
      let stairRoom = this.map.rooms[this.map.rooms.length - 1];
      for (let i = 1; i < this.map.rooms.length; i++) {
        const r = this.map.rooms[i];
        if (r.centerX === this.map.stairs.x && r.centerY === this.map.stairs.y) {
          stairRoom = r;
          break;
        }
      }

      const bx = (stairRoom.centerX !== this.map.stairs.x) ? stairRoom.centerX : (stairRoom.x + 1);
      const by = (stairRoom.centerY !== this.map.stairs.y) ? stairRoom.centerY : (stairRoom.y + 1);
      const boss = new BossMonster(bx, by, floorNum);
      this.entities.push(boss);
      this.activeBoss = boss;

      if (floorNum === 3) {
        this.addLog(`⚠️ PRESENÇA ATERRADORA: O ${boss.name} (${boss.title}) aguarda no santuário mais profundo deste andar!`, 'death');
      } else {
        this.addLog(`☄️ RUGIDO ENSURDECEDOR: ${boss.name} (${boss.title}) desperta para o confronto final!`, 'death');
      }
    }

    // Compute initial FoV
    this.fov.compute(this.map, this.player.x, this.player.y, 8);
    this.renderer.updateCamera(this.player.x, this.player.y, this.map.width, this.map.height);

    this.addLog(`Você desceu para o Andar ${floorNum}. O ar fica mais denso...`, 'floor');
    this.updateHud();
  }

  handlePlayerAction(dx, dy, isWait = false) {
    if (this.state !== GAME_STATE.PLAYING) return;

    sound.ensureContext();
    this.player.turns++;

    if (isWait) {
      this.addLog('Você aguarda em guarda e observa o ambiente...', 'info');
      this.runEnemyTurn();
      this.finishTurn();
      return;
    }

    const targetX = this.player.x + dx;
    const targetY = this.player.y + dy;

    // 1. Check if attacking a monster in melee
    const monsterTarget = this.entities.find(
      (e) => e !== this.player && e.isAlive && e.x === targetX && e.y === targetY
    );

    if (monsterTarget) {
      const result = this.combat.attack(this.player, monsterTarget);
      this.renderer.triggerShake(result.isCrit ? 8 : 4, 8);
      this.renderer.addFloatingText(
        `-${result.damage}`,
        monsterTarget.x,
        monsterTarget.y,
        result.isCrit ? '#fbbf24' : '#f87171'
      );

      this.runEnemyTurn();
      this.finishTurn();
      return;
    }

    // 2. Check if walkable
    if (!this.map.isWalkable(targetX, targetY)) {
      return;
    }

    // Move player
    this.player.x = targetX;
    this.player.y = targetY;
    sound.playStep();

    // 3. Check for Items at new position
    const itemIndex = this.items.findIndex((item) => item.x === targetX && item.y === targetY);
    if (itemIndex !== -1) {
      const item = this.items[itemIndex];
      this.collectItem(item, itemIndex);
    }

    // Monsters turn
    this.runEnemyTurn();
    this.finishTurn();
  }

  castPlayerSpell(spellType) {
    if (this.state !== GAME_STATE.PLAYING) return;
    sound.ensureContext();

    if (spellType === 'cure') {
      const result = this.combat.castSpell(this.player, 'cure');
      if (result) {
        this.renderer.addSpellEffect('cure', this.player.x, this.player.y);
        this.renderer.addFloatingText(`+${result.amount} PV`, this.player.x, this.player.y, '#34d399');
        this.renderer.triggerShake(2, 6);
        this.player.turns++;
        this.runEnemyTurn();
        this.finishTurn();
      }
      return;
    }

    // Offensive spells (fire, ice, thunder)
    const visibleMonsters = this.entities
      .filter((e) => e !== this.player && e.isAlive && this.fov.isVisible(e.x, e.y))
      .sort((a, b) => {
        const distA = Math.hypot(a.x - this.player.x, a.y - this.player.y);
        const distB = Math.hypot(b.x - this.player.x, b.y - this.player.y);
        return distA - distB;
      });

    if (visibleMonsters.length === 0) {
      this.addLog('Nenhum inimigo visível no seu campo de visão para conjurar!', 'info');
      return;
    }

    const targetMonster = visibleMonsters[0];
    const result = this.combat.castSpell(this.player, spellType, targetMonster, this.entities);
    if (!result) return;

    if (spellType === 'fire') {
      this.renderer.addSpellEffect('fire', result.targetX, result.targetY);
      this.renderer.addFloatingText(`-${result.damage} FOGO`, result.targetX, result.targetY, '#f97316');
      this.renderer.triggerShake(7, 12);
    } else if (spellType === 'ice') {
      this.renderer.addSpellEffect('ice', result.targetX, result.targetY);
      this.renderer.addFloatingText(`-${result.damage} GELO`, result.targetX, result.targetY, '#38bdf8');
      this.renderer.triggerShake(5, 10);
    } else if (spellType === 'thunder') {
      this.renderer.addSpellEffect('thunder', result.targetX, result.targetY);
      this.renderer.addFloatingText(`-${result.damage} TROVÃO`, result.targetX, result.targetY, '#facc15');
      if (result.targets && result.targets.length > 1) {
        result.targets.slice(1).forEach((t) => {
          this.renderer.addSpellEffect('thunder', t.x, t.y);
          this.renderer.addFloatingText(`-${Math.floor(result.damage * 0.65)} TROVÃO`, t.x, t.y, '#fef08a');
        });
      }
      this.renderer.triggerShake(8, 14);
    }

    this.player.turns++;
    this.runEnemyTurn();
    this.finishTurn();
  }

  triggerLimitBreak() {
    if (this.state !== GAME_STATE.PLAYING) return;
    sound.ensureContext();

    const visibleMonsters = this.entities.filter(
      (e) => e !== this.player && e.isAlive && this.fov.isVisible(e.x, e.y)
    );

    if (visibleMonsters.length === 0) {
      this.addLog('Nenhum inimigo visível para desferir o Omnislash!', 'info');
      return;
    }

    const result = this.combat.executeLimitBreak(this.player, visibleMonsters);
    if (!result) return;

    this.renderer.triggerShake(14, 25);
    result.hits.forEach((hit) => {
      this.renderer.addSpellEffect('limit', hit.target.x, hit.target.y);
      this.renderer.addFloatingText(`-${hit.damage} CRÍTICO!`, hit.target.x, hit.target.y, '#fbbf24');
    });

    this.player.turns++;
    this.runEnemyTurn();
    this.finishTurn();
  }

  triggerDefend() {
    if (this.state !== GAME_STATE.PLAYING) return;
    sound.ensureContext();

    this.combat.defend(this.player);
    this.renderer.addFloatingText('DEFESA +4 MP', this.player.x, this.player.y, '#38bdf8');
    this.renderer.triggerShake(2, 4);

    this.player.turns++;
    this.runEnemyTurn();
    this.finishTurn();
  }

  triggerPlayerAttack() {
    if (this.state !== GAME_STATE.PLAYING) return;
    sound.ensureContext();

    const adjacentMonster = this.entities.find(
      (e) => e !== this.player && e.isAlive && Math.abs(e.x - this.player.x) + Math.abs(e.y - this.player.y) === 1
    );

    if (adjacentMonster) {
      const dx = adjacentMonster.x - this.player.x;
      const dy = adjacentMonster.y - this.player.y;
      this.handlePlayerAction(dx, dy);
    } else {
      this.addLog('Nenhum inimigo adjacente para atacar corpo-a-corpo! Aproxime-se com WASD ou dispare magias [1-3] à distância.', 'info');
    }
  }

  collectItem(item, index) {
    if (item.itemType === 'potion') {
      const healed = this.player.heal(item.healAmount);
      this.player.restoreMp(10);
      this.player.potionsDrank++;
      sound.playPotion();
      this.renderer.addFloatingText(`+${healed} HP / +10 MP`, this.player.x, this.player.y, '#34d399');
      this.addLog(`Você bebeu um Elixir de Cura e recuperou ${healed} HP e 10 MP!`, 'heal');
      this.items.splice(index, 1);
    } else if (item.itemType === 'chest') {
      sound.playChest();
      if (item.bonusType === 'atk') {
        this.player.atk += 2;
        this.addLog(`Você abriu um Baú e encontrou uma Espada Forjada! (+2 ATK)`, 'chest');
        this.renderer.addFloatingText(`+2 ATK`, this.player.x, this.player.y, '#fbbf24');
      } else {
        this.player.def += 1;
        this.addLog(`Você abriu um Baú e encontrou uma Armadura Reforçada! (+1 DEF)`, 'chest');
        this.renderer.addFloatingText(`+1 DEF`, this.player.x, this.player.y, '#60a5fa');
      }
      this.player.score += 50;
      this.items.splice(index, 1);
    } else if (item.itemType === 'stairs') {
      sound.playStairs();
      this.player.score += 100;
      this.initFloor(this.player.floor + 1);
    }
  }

  runEnemyTurn() {
    for (const entity of this.entities) {
      if (!entity.isAlive || entity === this.player) continue;

      const monster = entity;
      const dist = Math.hypot(this.player.x - monster.x, this.player.y - monster.y);

      // Trigger awareness if monster sees player or is in close proximity
      if (dist <= monster.alertRadius && (this.fov.isVisible(monster.x, monster.y) || dist <= 3.5)) {
        monster.isAlerted = true;
      }

      if (!monster.isAlerted) continue;

      // Boss special ability and spell check
      if (monster.isBoss) {
        const bAction = this.combat.bossAction(monster, this.player);
        if (bAction) {
          if (bAction.spell === 'death_wave') {
            this.renderer.triggerShake(10, 16);
            this.renderer.addSpellEffect('ice', this.player.x, this.player.y);
            this.renderer.addFloatingText(`-${bAction.damage} MORTE`, this.player.x, this.player.y, '#c084fc');
          } else if (bAction.spell === 'megaflare') {
            this.renderer.triggerShake(14, 22);
            this.renderer.addSpellEffect('fire', this.player.x, this.player.y);
            this.renderer.addFloatingText(`-${bAction.damage} MEGAFLARE`, this.player.x, this.player.y, '#ef4444');
          } else if (bAction.spell === 'charging') {
            this.renderer.addFloatingText('CARREGANDO...', monster.x, monster.y, '#fbbf24');
          }

          if (!this.player.isAlive) {
            this.triggerGameOver();
            return;
          }
          continue; // Boss spell consumed its turn!
        }
      }

      // Attack if adjacent
      if (Math.abs(this.player.x - monster.x) + Math.abs(this.player.y - monster.y) === 1) {
        const result = this.combat.attack(monster, this.player);
        this.renderer.triggerShake(6, 10);
        this.renderer.addFloatingText(
          `-${result.damage}`,
          this.player.x,
          this.player.y,
          '#ef4444'
        );

        if (!this.player.isAlive) {
          this.triggerGameOver();
          return;
        }
      } else {
        // Move towards player
        const nextStep = monster.getNextStepToward(this.player.x, this.player.y, this.map, this.entities);
        if (nextStep) {
          monster.x = nextStep.x;
          monster.y = nextStep.y;
        }
      }
    }

    // Defend stance expires after enemies act this turn
    this.player.isDefending = false;
  }

  finishTurn() {
    this.fov.compute(this.map, this.player.x, this.player.y, 8);
    this.renderer.updateCamera(this.player.x, this.player.y, this.map.width, this.map.height);
    this.updateHud();
    this.requestRender();
  }

  triggerGameOver() {
    this.state = GAME_STATE.GAME_OVER;
    if (this.finalFloorEl) this.finalFloorEl.textContent = this.player.floor;
    if (this.finalKillsEl) this.finalKillsEl.textContent = this.player.kills;
    if (this.finalTurnsEl) this.finalTurnsEl.textContent = this.player.turns;
    if (this.finalScoreEl) this.finalScoreEl.textContent = this.player.score;

    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
    }
  }

  updateHud() {
    if (!this.player) return;

    // HP Bar
    const hpRatio = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    if (this.hpFillEl) this.hpFillEl.style.width = `${hpRatio}%`;
    if (this.hpTextEl) this.hpTextEl.textContent = `${this.player.hp} / ${this.player.maxHp}`;

    // MP Bar
    const mpRatio = Math.max(0, (this.player.mp / this.player.maxMp) * 100);
    if (this.mpFillEl) this.mpFillEl.style.width = `${mpRatio}%`;
    if (this.mpTextEl) this.mpTextEl.textContent = `${this.player.mp} / ${this.player.maxMp}`;

    // Limit Break Bar
    const limitRatio = Math.min(100, Math.max(0, (this.player.limitGauge / this.player.maxLimitGauge) * 100));
    if (this.limitFillEl) this.limitFillEl.style.width = `${limitRatio}%`;
    if (this.limitTextEl) this.limitTextEl.textContent = `${Math.round(limitRatio)}%`;
    if (this.limitStatusTextEl) this.limitStatusTextEl.textContent = `${Math.round(limitRatio)}%`;

    // Limit Break Ready Highlight
    if (this.cmdLimit) {
      if (this.player.limitGauge >= this.player.maxLimitGauge) {
        this.cmdLimit.classList.add('ready');
      } else {
        this.cmdLimit.classList.remove('ready');
      }
    }

    // Stats Grid
    if (this.floorEl) this.floorEl.textContent = this.player.floor;
    if (this.atkEl) this.atkEl.textContent = this.player.atk;
    if (this.defEl) this.defEl.textContent = this.player.def;
    if (this.killsEl) this.killsEl.textContent = this.player.kills;
    if (this.scoreEl) this.scoreEl.textContent = this.player.score;

    // Boss Bar Display
    if (this.bossBarContainer) {
      if (this.activeBoss && this.activeBoss.isAlive) {
        const bossVisible = this.fov && this.fov.isVisible(this.activeBoss.x, this.activeBoss.y);
        if (bossVisible || this.activeBoss.isAlerted) {
          this.bossBarContainer.classList.remove('hidden');
          if (this.bossIconEl) this.bossIconEl.textContent = this.activeBoss.char;
          if (this.bossNameEl) this.bossNameEl.textContent = this.activeBoss.name;
          if (this.bossTitleEl) this.bossTitleEl.textContent = this.activeBoss.title;
          if (this.bossHpTextEl) this.bossHpTextEl.textContent = `${this.activeBoss.hp} / ${this.activeBoss.maxHp}`;
          if (this.bossHpFillEl) {
            const ratio = Math.max(0, (this.activeBoss.hp / this.activeBoss.maxHp) * 100);
            this.bossHpFillEl.style.width = `${ratio}%`;
          }
        }
      } else {
        this.bossBarContainer.classList.add('hidden');
      }
    }
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (this.state === GAME_STATE.GAME_OVER) {
        if (e.code === 'KeyR' || e.code === 'Enter' || e.code === 'Space') {
          this.startNewGame();
        }
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
        case 'Numpad8':
          this.handlePlayerAction(0, -1);
          break;
        case 'KeyS':
        case 'ArrowDown':
        case 'Numpad2':
          this.handlePlayerAction(0, 1);
          break;
        case 'KeyA':
        case 'ArrowLeft':
        case 'Numpad4':
          this.handlePlayerAction(-1, 0);
          break;
        case 'KeyD':
        case 'ArrowRight':
        case 'Numpad6':
          this.handlePlayerAction(1, 0);
          break;
        case 'Space':
        case 'Numpad5':
        case 'Period':
          this.handlePlayerAction(0, 0, true);
          break;
        case 'Digit1':
          this.castPlayerSpell('fire');
          break;
        case 'Digit2':
          this.castPlayerSpell('ice');
          break;
        case 'Digit3':
          this.castPlayerSpell('thunder');
          break;
        case 'Digit4':
          this.castPlayerSpell('cure');
          break;
        case 'KeyE':
          this.triggerDefend();
          break;
        case 'KeyL':
          this.triggerLimitBreak();
          break;
        case 'KeyR':
          this.startNewGame();
          break;
      }
    });

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.startNewGame();
      });
    }

    // Tactical Command Buttons Click Handlers
    if (this.cmdAttack) this.cmdAttack.addEventListener('click', () => this.triggerPlayerAttack());
    if (this.cmdFire) this.cmdFire.addEventListener('click', () => this.castPlayerSpell('fire'));
    if (this.cmdIce) this.cmdIce.addEventListener('click', () => this.castPlayerSpell('ice'));
    if (this.cmdThunder) this.cmdThunder.addEventListener('click', () => this.castPlayerSpell('thunder'));
    if (this.cmdCure) this.cmdCure.addEventListener('click', () => this.castPlayerSpell('cure'));
    if (this.cmdDefend) this.cmdDefend.addEventListener('click', () => this.triggerDefend());
    if (this.cmdLimit) this.cmdLimit.addEventListener('click', () => this.triggerLimitBreak());

    // On-screen D-pad controls for touch/mouse
    const btnUp = document.getElementById('btnUp');
    const btnDown = document.getElementById('btnDown');
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnWait = document.getElementById('btnWait');

    if (btnUp) btnUp.addEventListener('click', () => this.handlePlayerAction(0, -1));
    if (btnDown) btnDown.addEventListener('click', () => this.handlePlayerAction(0, 1));
    if (btnLeft) btnLeft.addEventListener('click', () => this.handlePlayerAction(-1, 0));
    if (btnRight) btnRight.addEventListener('click', () => this.handlePlayerAction(1, 0));
    if (btnWait) btnWait.addEventListener('click', () => this.handlePlayerAction(0, 0, true));
  }

  requestRender() {
    requestAnimationFrame(() => {
      this.renderer.render(this.map, this.fov, this.player, this.entities, this.items);
    });
  }
}

// Continuous 60fps render loop for torches, spell particles & Limit Break auras
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const loop = () => {
    game.renderer.render(game.map, game.fov, game.player, game.entities, game.items);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
});
