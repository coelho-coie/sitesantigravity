/**
 * Entities, Monsters, Bosses, Items and AI system with Final Fantasy mechanics
 */

export class Entity {
  constructor(x, y, name, char, color) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.char = char;
    this.color = color;
    this.blocksMovement = true;
  }
}

export class Fighter extends Entity {
  constructor(x, y, name, char, color, stats) {
    super(x, y, name, char, color);
    this.maxHp = stats.hp || 30;
    this.hp = this.maxHp;
    this.atk = stats.atk || 5;
    this.def = stats.def || 2;
    this.xpReward = stats.xp || 10;
    this.isAlive = true;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp === 0) {
      this.isAlive = false;
      this.blocksMovement = false;
    }
    return this.hp;
  }

  heal(amount) {
    const prev = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp - prev;
  }
}

export class Player extends Fighter {
  constructor(x, y) {
    super(x, y, 'Cavaleiro', '@', '#f6c445', { hp: 45, atk: 7, def: 3 });
    this.floor = 1;
    this.kills = 0;
    this.turns = 0;
    this.score = 0;
    this.gold = 0;
    this.potionsDrank = 0;

    // Final Fantasy Magic & Limit Break mechanics
    this.maxMp = 30;
    this.mp = 30;
    this.limitGauge = 0;
    this.maxLimitGauge = 100;
    this.isDefending = false;
  }

  useMp(amount) {
    if (this.mp >= amount) {
      this.mp -= amount;
      return true;
    }
    return false;
  }

  restoreMp(amount) {
    const prev = this.mp;
    this.mp = Math.min(this.maxMp, this.mp + amount);
    return this.mp - prev;
  }

  chargeLimit(amount) {
    this.limitGauge = Math.min(this.maxLimitGauge, this.limitGauge + amount);
    return this.limitGauge;
  }

  takeDamage(amount) {
    let finalDamage = amount;
    if (this.isDefending) {
      finalDamage = Math.max(1, Math.round(amount * 0.5));
      this.restoreMp(2); // Defending meditates and recovers MP
    }

    // Gaining damage charges the Limit Break gauge (Final Fantasy style!)
    this.chargeLimit(Math.round(finalDamage * 3.2));

    return super.takeDamage(finalDamage);
  }

  levelUpStats(statType) {
    if (statType === 'atk') {
      this.atk += 2;
    } else if (statType === 'def') {
      this.def += 1;
    } else if (statType === 'hp') {
      this.maxHp += 8;
      this.hp = Math.min(this.maxHp, this.hp + 8);
      this.maxMp += 4;
      this.mp = Math.min(this.maxMp, this.mp + 4);
    }
  }
}

export class Monster extends Fighter {
  constructor(x, y, type, floor = 1) {
    const scale = 1 + (floor - 1) * 0.25;

    if (type === 'goblin') {
      super(x, y, 'Goblin Sorrateiro', 'g', '#4ade80', {
        hp: Math.round(14 * scale),
        atk: Math.round(4 * scale),
        def: Math.round(1 * scale),
        xp: 15,
      });
      this.speed = 1;
      this.icon = 'goblin';
    } else if (type === 'skeleton') {
      super(x, y, 'Guerreiro Esqueleto', 's', '#e2e8f0', {
        hp: Math.round(22 * scale),
        atk: Math.round(6 * scale),
        def: Math.round(2 * scale),
        xp: 25,
      });
      this.speed = 1;
      this.icon = 'skeleton';
    } else {
      super(x, y, 'Ogro das Profundezas', 'O', '#f87171', {
        hp: Math.round(36 * scale),
        atk: Math.round(8 * scale),
        def: Math.round(3 * scale),
        xp: 45,
      });
      this.speed = 1;
      this.icon = 'ogre';
    }

    this.alertRadius = 7;
    this.isAlerted = false;
    this.isBoss = false;
  }

  getNextStepToward(targetX, targetY, map, entities) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.alertRadius) return null;

    // Direct adjacent step
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      return { x: targetX, y: targetY };
    }

    // Evaluate valid neighboring tiles
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    let bestDir = null;
    let minDistance = Infinity;

    for (const dir of directions) {
      const nextX = this.x + dir.x;
      const nextY = this.y + dir.y;

      if (!map.isWalkable(nextX, nextY)) continue;

      // Check if blocked by another alive entity
      const blocked = entities.some(
        (e) => e.isAlive && e.blocksMovement && e.x === nextX && e.y === nextY && !(e.x === targetX && e.y === targetY)
      );
      if (blocked) continue;

      const d = Math.hypot(targetX - nextX, targetY - nextY);
      if (d < minDistance) {
        minDistance = d;
        bestDir = { x: nextX, y: nextY };
      }
    }

    return bestDir;
  }
}

/**
 * Boss Monster Class (Monumental presence, special spells & massive health)
 */
export class BossMonster extends Monster {
  constructor(x, y, floor = 3) {
    if (floor <= 3) {
      super(x, y, 'ogre', floor);
      this.name = 'Lich Rei Esqueleto';
      this.char = '💀';
      this.color = '#c084fc';
      this.icon = 'boss_lich';
      this.maxHp = 150;
      this.hp = 150;
      this.atk = 11;
      this.def = 4;
      this.xpReward = 200;
      this.title = 'Monarca da Cripta Profana';
    } else {
      super(x, y, 'ogre', floor);
      this.name = 'Dragão do Vazio Bahamut';
      this.char = '🐉';
      this.color = '#e11d48';
      this.icon = 'boss_bahamut';
      this.maxHp = 250;
      this.hp = 250;
      this.atk = 15;
      this.def = 6;
      this.xpReward = 400;
      this.title = 'Soberano das Chamas Negras';
    }

    this.isBoss = true;
    this.alertRadius = 12;
    this.turnCounter = 0;
    this.chargingSpecial = false;
  }
}

export class Item extends Entity {
  constructor(x, y, itemType) {
    if (itemType === 'potion') {
      super(x, y, 'Poção de Cura', '!', '#ec4899');
      this.itemType = 'potion';
      this.healAmount = 22;
    } else if (itemType === 'chest') {
      super(x, y, 'Baú de Tesouro', '=', '#eab308');
      this.itemType = 'chest';
      this.bonusType = Math.random() < 0.5 ? 'atk' : 'def';
    } else if (itemType === 'stairs') {
      super(x, y, 'Escadarias Descendentes', '>', '#38bdf8');
      this.itemType = 'stairs';
    }
    this.blocksMovement = false;
  }
}
