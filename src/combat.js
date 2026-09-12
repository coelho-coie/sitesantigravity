/**
 * Turn-based Combat Resolution, Final Fantasy Magic Spells & Limit Breaks
 */

import { sound } from './audio.js?v=20260912_ff_expansion';

export class CombatSystem {
  constructor(logCallback) {
    this.logCallback = logCallback || (() => {});
  }

  attack(attacker, defender) {
    sound.playSword();

    // Damage formula: Atk - Def with variance
    const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
    let rawDamage = attacker.atk - defender.def + variance;
    let isCrit = Math.random() < 0.15;

    if (isCrit) {
      rawDamage = Math.round(rawDamage * 1.6);
    }

    const damage = Math.max(1, rawDamage);
    defender.takeDamage(damage);

    const isPlayerAttacking = attacker.name === 'Cavaleiro';

    if (isPlayerAttacking) {
      sound.playHit();
      const critText = isCrit ? ' ★ GOLPE CRÍTICO!' : '';
      this.logCallback(
        `Você golpeou ${defender.name} causando ${damage} de dano!${critText}`,
        isCrit ? 'crit' : 'player_hit'
      );

      if (!defender.isAlive) {
        attacker.kills += 1;
        attacker.score += defender.xpReward;
        this.logCallback(
          `⚔️ Você derrotou ${defender.name}! (+${defender.xpReward} Pontos)`,
          'kill'
        );
      }
    } else {
      sound.playPlayerDamage();
      this.logCallback(
        `${attacker.name} atacou você causando ${damage} de dano!`,
        'player_damaged'
      );

      if (!defender.isAlive) {
        sound.playDeath();
        this.logCallback(`💀 Sua vida se esgotou nas profundezas da masmorra...`, 'death');
      }
    }

    return { damage, isCrit, killed: !defender.isAlive };
  }

  /**
   * Final Fantasy Magic Casting System
   */
  castSpell(player, spellType, targetMonster, entities = []) {
    const costs = { fire: 6, ice: 8, thunder: 10, cure: 8 };
    const mpCost = costs[spellType] || 6;

    if (player.mp < mpCost) {
      this.logCallback(`⚠️ MP insuficiente! Você precisa de ${mpCost} MP para conjurar.`, 'log-info');
      return null;
    }

    player.useMp(mpCost);

    if (spellType === 'cure') {
      sound.playCure();
      const healAmount = Math.floor(25 + Math.random() * 12);
      const actualHealed = player.heal(healAmount);
      this.logCallback(`✨ Você conjurou CURAGA restaurando ${actualHealed} PV!`, 'log-heal');
      return {
        spellType: 'cure',
        targetX: player.x,
        targetY: player.y,
        amount: actualHealed,
      };
    }

    if (!targetMonster || !targetMonster.isAlive) {
      this.logCallback(`Nenhum inimigo selecionado para a magia!`, 'log-info');
      return null;
    }

    if (spellType === 'fire') {
      sound.playFire();
      const damage = Math.floor(18 + Math.random() * 10);
      targetMonster.takeDamage(damage);
      this.logCallback(
        `🔥 Você disparou FIRAGA em ${targetMonster.name} causando ${damage} de dano ígneo!`,
        'crit'
      );

      if (!targetMonster.isAlive) {
        player.kills += 1;
        player.score += targetMonster.xpReward;
        this.logCallback(`🔥 ${targetMonster.name} foi consumido pelo fogo! (+${targetMonster.xpReward} Pontos)`, 'kill');
      }

      return {
        spellType: 'fire',
        targetX: targetMonster.x,
        targetY: targetMonster.y,
        damage,
        target: targetMonster,
      };
    }

    if (spellType === 'ice') {
      sound.playIce();
      const damage = Math.floor(15 + Math.random() * 8);
      targetMonster.takeDamage(damage);
      this.logCallback(
        `❄️ Você disparou BLIZZAGA congelando ${targetMonster.name} por ${damage} de dano!`,
        'player_hit'
      );

      if (!targetMonster.isAlive) {
        player.kills += 1;
        player.score += targetMonster.xpReward;
        this.logCallback(`❄️ ${targetMonster.name} estilhaçou em gelo! (+${targetMonster.xpReward} Pontos)`, 'kill');
      }

      return {
        spellType: 'ice',
        targetX: targetMonster.x,
        targetY: targetMonster.y,
        damage,
        target: targetMonster,
      };
    }

    if (spellType === 'thunder') {
      sound.playThunder();
      const primaryDamage = Math.floor(22 + Math.random() * 12);
      targetMonster.takeDamage(primaryDamage);
      this.logCallback(
        `⚡ Você invocou THUNDAGA eletrocutando ${targetMonster.name} por ${primaryDamage} de dano!`,
        'crit'
      );

      // Chain lightning to up to 2 other nearby monsters within 3 tiles
      const targets = [targetMonster];
      const otherMonsters = entities.filter(
        (e) => e !== targetMonster && e !== player && e.isAlive && Math.hypot(e.x - targetMonster.x, e.y - targetMonster.y) <= 3
      );

      otherMonsters.slice(0, 2).forEach((chainTarget) => {
        const chainDamage = Math.floor(primaryDamage * 0.65);
        chainTarget.takeDamage(chainDamage);
        targets.push(chainTarget);
        this.logCallback(
          `⚡ O relâmpago saltou em ${chainTarget.name} causando ${chainDamage} de dano!`,
          'player_hit'
        );
        if (!chainTarget.isAlive) {
          player.kills += 1;
          player.score += chainTarget.xpReward;
          this.logCallback(`⚡ ${chainTarget.name} foi fulminado! (+${chainTarget.xpReward} Pontos)`, 'kill');
        }
      });

      if (!targetMonster.isAlive) {
        player.kills += 1;
        player.score += targetMonster.xpReward;
        this.logCallback(`⚡ ${targetMonster.name} sucumbiu ao raio! (+${targetMonster.xpReward} Pontos)`, 'kill');
      }

      return {
        spellType: 'thunder',
        targetX: targetMonster.x,
        targetY: targetMonster.y,
        targets,
        damage: primaryDamage,
      };
    }

    return null;
  }

  /**
   * Final Fantasy Limit Break: OMNISLASH / Lâmina do Julgamento
   */
  executeLimitBreak(player, visibleMonsters = []) {
    if (player.limitGauge < player.maxLimitGauge) {
      this.logCallback(`⚠️ Barra de Limite ainda não está cheia (${Math.round(player.limitGauge)}%)!`, 'log-info');
      return null;
    }

    player.limitGauge = 0;
    sound.playLimit();

    this.logCallback(
      `💥 LIMIT BREAK: OMNISLASH! O Cavaleiro desfere a lendária Lâmina do Julgamento!`,
      'crit'
    );

    const hits = [];
    visibleMonsters.forEach((mon) => {
      if (!mon.isAlive || mon === player) return;
      const damage = Math.floor(45 + Math.random() * 25);
      mon.takeDamage(damage);
      hits.push({ target: mon, damage });

      this.logCallback(
        `✦ Corte Celestial atingiu ${mon.name} causando ${damage} de DANO SUPREMO!`,
        'crit'
      );

      if (!mon.isAlive) {
        player.kills += 1;
        player.score += mon.xpReward * 2;
        this.logCallback(`💀 ${mon.name} foi erradicado pelo Limite! (+${mon.xpReward * 2} Pontos)`, 'kill');
      }
    });

    return { type: 'limit', hits };
  }

  /**
   * Defensive Stance (Defend command)
   */
  defend(player) {
    player.isDefending = true;
    player.restoreMp(4);
    this.logCallback(
      `🛡️ POSTURA DEFENSIVA: Dano recebido reduzido em 50% até o próximo turno e +4 MP restaurados!`,
      'log-info'
    );
  }

  /**
   * Boss AI Special Actions & Spells
   */
  bossAction(boss, player) {
    boss.turnCounter = (boss.turnCounter || 0) + 1;
    sound.playBossRoar();

    if (boss.icon === 'boss_lich') {
      if (boss.turnCounter % 3 === 0) {
        // Lich casts Dark Death Wave
        const damage = Math.floor(12 + Math.random() * 8);
        player.takeDamage(damage);
        this.logCallback(
          `☠️ O ${boss.name} conjurou ONDA DA MORTE causando ${damage} de dano sombrio em você!`,
          'death'
        );
        return { type: 'boss_spell', spell: 'death_wave', damage };
      }
    } else if (boss.icon === 'boss_bahamut') {
      if (boss.chargingSpecial) {
        // Release MEGAFLARE
        boss.chargingSpecial = false;
        sound.playFire();
        const damage = Math.floor(22 + Math.random() * 12);
        player.takeDamage(damage);
        this.logCallback(
          `☄️ BAHAMUT DISPAROU MEGAFLARE! Uma tempestade de chamas ancestrais causou ${damage} de dano!`,
          'death'
        );
        return { type: 'boss_spell', spell: 'megaflare', damage };
      } else if (boss.turnCounter % 3 === 0) {
        boss.chargingSpecial = true;
        this.logCallback(
          `⚠️ ATENÇÃO: ${boss.name} está acumulando energia para o MEGAFLARE! Use DEFENDER [E]!`,
          'crit'
        );
        return { type: 'boss_spell', spell: 'charging' };
      }
    }

    return null;
  }
}
