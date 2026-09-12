/**
 * Canvas 2D Procedural Renderer for Roguelike Dungeon
 * AAA Dark Fantasy & Final Fantasy Overhaul: 48px Detailed Sprites,
 * Epic Boss Sprites (Lich & Bahamut), Spell Visual Effects (Fire, Ice, Lightning, Cure),
 * Limit Break Aura & Atmospheric Dynamic Lighting.
 */

import { TILE_WALL, TILE_FLOOR } from './map_gen.js?v=20260912_ff_expansion';

export class DungeonRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = 48;

    // Floating text notifications for damage/heals
    this.floatingTexts = [];

    // Active spell & attack visual effects on canvas
    this.spellEffects = [];

    // Screen shake for impacts
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    // Viewport camera
    this.camera = { x: 0, y: 0 };

    // Atmospheric animation tick
    this.tick = 0;

    // Atmospheric floating embers in the dungeon air
    this.embers = [];
    for (let i = 0; i < 24; i++) {
      this.embers.push({
        x: Math.random() * 800,
        y: Math.random() * 576,
        size: 1 + Math.random() * 2,
        speedY: 0.2 + Math.random() * 0.4,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }
  }

  addFloatingText(text, tileX, tileY, color = '#f87171') {
    this.floatingTexts.push({
      text,
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize - 8,
      color,
      alpha: 1.0,
      life: 55,
      vy: -0.95
    });
  }

  addSpellEffect(type, tileX, tileY, extra = {}) {
    this.spellEffects.push({
      type,
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize + this.tileSize / 2,
      progress: 0,
      maxLife: type === 'limit' ? 35 : 24,
      extra,
    });
  }

  triggerShake(intensity = 8, duration = 12) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  updateCamera(playerX, playerY, mapWidth, mapHeight) {
    const viewW = this.canvas.width;
    const viewH = this.canvas.height;

    const targetX = playerX * this.tileSize + this.tileSize / 2 - viewW / 2;
    const targetY = playerY * this.tileSize + this.tileSize / 2 - viewH / 2;

    const maxCamX = Math.max(0, mapWidth * this.tileSize - viewW);
    const maxCamY = Math.max(0, mapHeight * this.tileSize - viewH);

    this.camera.x = Math.max(0, Math.min(maxCamX, targetX));
    this.camera.y = Math.max(0, Math.min(maxCamY, targetY));
  }

  render(map, fov, player, entities, items) {
    this.tick++;
    const ctx = this.ctx;
    const ts = this.tileSize;

    // Clear background
    ctx.fillStyle = '#040508';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    // Apply screen shake
    if (this.shakeDuration > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(sx, sy);
      this.shakeDuration--;
    }

    // Apply Camera translation
    ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    // Calculate visible tile range in camera view
    const startCol = Math.max(0, Math.floor(this.camera.x / ts));
    const endCol = Math.min(map.width - 1, Math.ceil((this.camera.x + this.canvas.width) / ts));
    const startRow = Math.max(0, Math.floor(this.camera.y / ts));
    const endRow = Math.min(map.height - 1, Math.ceil((this.camera.y + this.canvas.height) / ts));

    // 1. Render Map Tiles
    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const isVis = fov.isVisible(x, y);
        const isExp = fov.isExplored(x, y);

        if (!isExp) continue;

        const px = x * ts;
        const py = y * ts;
        const tile = map.getTile(x, y);

        const dist = Math.hypot(x - player.x, y - player.y);
        const flameFlicker = Math.sin(this.tick * 0.12 + (x * 7 + y * 13)) * 0.05;
        const baseLight = Math.max(0.15, 1 - (dist / (fov.radius + 1.2)) * 0.8);
        const lightRatio = isVis ? Math.min(1.0, Math.max(0, baseLight + flameFlicker)) : 0;

        const seed = (x * 17 + y * 31) % 12;

        if (tile === TILE_WALL) {
          this.drawWall(ctx, px, py, ts, isVis, lightRatio, seed, x, y);
        } else {
          this.drawFloor(ctx, px, py, ts, isVis, lightRatio, seed);
        }
      }
    }

    // 2. Render Items
    for (const item of items) {
      const isVis = fov.isVisible(item.x, item.y);
      const isExp = fov.isExplored(item.x, item.y);

      if (isVis || (isExp && item.itemType === 'stairs')) {
        const px = item.x * ts;
        const py = item.y * ts;
        this.drawItem(ctx, item, px, py, ts, isVis);
      }
    }

    // 3. Render Monsters and Bosses
    for (const entity of entities) {
      if (!entity.isAlive || entity === player) continue;
      if (fov.isVisible(entity.x, entity.y)) {
        const px = entity.x * ts;
        const py = entity.y * ts;
        this.drawMonster(ctx, entity, px, py, ts);
      }
    }

    // 4. Render Player with Limit Break Aura
    this.drawPlayer(ctx, player, player.x * ts, player.y * ts, ts);

    // 5. Render Spell Visual Effects (Fireball, Thunder, Ice, Holy Cure, Omnislash)
    this.renderSpellEffects(ctx);

    // 6. Render Floating Combat Damage & Status Numbers
    this.renderFloatingTexts(ctx);

    ctx.restore();

    // 7. Atmospheric Lighting & Torch Glow Overlay
    this.renderAtmosphericLighting(ctx, player);

    // 8. Atmospheric Embers in the Dungeon Air
    this.renderEmbers(ctx);
  }

  /* --------------------------------------------------------------------------
     SCENERY: CHISELED BASALT STONE FLOOR
     -------------------------------------------------------------------------- */
  drawFloor(ctx, x, y, size, isVisible, light, seed) {
    if (isVisible) {
      const r = Math.floor(28 + light * 42);
      const g = Math.floor(26 + light * 34);
      const b = Math.floor(24 + light * 22);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, size, size);

      ctx.strokeStyle = `rgba(12, 14, 20, 0.85)`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);

      ctx.fillStyle = `rgba(255, 235, 200, ${0.08 * light})`;
      ctx.fillRect(x + 1, y + 1, size - 2, 2);

      if (seed === 1 || seed === 7) {
        ctx.strokeStyle = `rgba(8, 10, 14, ${0.65 * light})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 12);
        ctx.lineTo(x + 20, y + 24);
        ctx.lineTo(x + 36, y + 20);
        ctx.stroke();
      } else if (seed === 3 || seed === 9) {
        ctx.fillStyle = `rgba(140, 20, 20, ${0.45 * light})`;
        ctx.beginPath();
        ctx.arc(x + 26, y + 26, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + 18, y + 23, 4, 3);
        ctx.fillRect(x + 30, y + 20, 3, 4);
      } else if (seed === 5) {
        const runeAlpha = 0.25 * light + Math.sin(this.tick * 0.08) * 0.08;
        ctx.strokeStyle = `rgba(212, 175, 55, ${Math.max(0, runeAlpha)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, runeAlpha)})`;
        ctx.font = 'bold 9px serif';
        ctx.textAlign = 'center';
        ctx.fillText('ᚲ', x + size / 2, y + size / 2 + 3);
      }
    } else {
      ctx.fillStyle = '#0f121a';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#080a0f';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    }
  }

  /* --------------------------------------------------------------------------
     SCENERY: FORTIFIED STONE WALL
     -------------------------------------------------------------------------- */
  drawWall(ctx, x, y, size, isVisible, light, seed, tileX, tileY) {
    if (isVisible) {
      const r = Math.floor(36 + light * 36);
      const g = Math.floor(38 + light * 34);
      const b = Math.floor(48 + light * 28);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, size, size);

      ctx.fillStyle = `rgba(220, 230, 255, ${0.28 + light * 0.35})`;
      ctx.fillRect(x, y, size, 5);

      ctx.fillStyle = 'rgba(4, 5, 8, 0.85)';
      ctx.fillRect(x, y + size - 7, size, 7);

      ctx.strokeStyle = 'rgba(10, 12, 18, 0.95)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + size / 2);
      ctx.lineTo(x + size, y + size / 2);

      if (seed % 2 === 0) {
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.moveTo(x + size / 4, y + size / 2);
        ctx.lineTo(x + size / 4, y + size);
        ctx.moveTo(x + (size * 3) / 4, y + size / 2);
        ctx.lineTo(x + (size * 3) / 4, y + size);
      } else {
        ctx.moveTo(x + size / 4, y);
        ctx.lineTo(x + size / 4, y + size / 2);
        ctx.moveTo(x + (size * 3) / 4, y);
        ctx.lineTo(x + (size * 3) / 4, y + size / 2);
        ctx.moveTo(x + size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size);
      }
      ctx.stroke();

      // Wall Torch Brazier on select tiles
      if ((tileX + tileY * 3) % 9 === 0) {
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(x + size / 2 - 2, y + 18, 4, 12);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + size / 2 - 4, y + 16, 8, 4);

        const flameOffset = Math.sin(this.tick * 0.2 + tileX) * 2;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(x + size / 2 + flameOffset * 0.5, y + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x + size / 2 + flameOffset * 0.3, y + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else {
      ctx.fillStyle = '#121622';
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = '#181e2e';
      ctx.fillRect(x, y, size, 4);
    }
  }

  /* --------------------------------------------------------------------------
     ITEMS: POTION, CHEST, STAIRS
     -------------------------------------------------------------------------- */
  drawItem(ctx, item, x, y, size, isVisible) {
    const cx = x + size / 2;
    const cy = y + size / 2;

    if (item.itemType === 'potion') {
      const pulse = 0.7 + Math.sin(this.tick * 0.15) * 0.3;
      if (isVisible) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 14 * pulse;
      }

      ctx.fillStyle = `rgba(239, 68, 68, ${0.25 * pulse})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 14, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(cx, cy + 3, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - 3, cy + 1, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(cx - 4, cy - 2, 3, 3);

      ctx.fillStyle = '#f87171';
      ctx.fillRect(cx - 3, cy - 10, 6, 8);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(cx - 5, cy - 6, 10, 3);

      ctx.fillStyle = '#b45309';
      ctx.fillRect(cx - 4, cy - 14, 8, 5);

      ctx.shadowBlur = 0;
    } else if (item.itemType === 'chest') {
      if (isVisible) {
        ctx.shadowColor = 'rgba(245, 158, 11, 0.65)';
        ctx.shadowBlur = 12;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 14, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3f1807';
      ctx.fillRect(cx - 14, cy - 9, 28, 20);

      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - 14, cy - 9, 4, 20);
      ctx.fillRect(cx + 10, cy - 9, 4, 20);

      ctx.fillStyle = '#d4af37';
      ctx.fillRect(cx - 14, cy - 4, 28, 4);
      ctx.fillRect(cx - 5, cy - 3, 10, 8);

      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(cx - 2, cy - 1, 4, 4);

      ctx.shadowBlur = 0;
    } else if (item.itemType === 'stairs') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(cx - 16, cy - 16, 32, 32);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 16, cy - 16, 32, 32);

      for (let i = 0; i < 5; i++) {
        const stepShade = 15 + i * 18;
        ctx.fillStyle = `rgb(${stepShade}, ${stepShade + 15}, ${stepShade + 35})`;
        ctx.fillRect(cx - 13 + i * 2.5, cy - 13 + i * 5, 26 - i * 5, 4);
      }

      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('▼', cx, cy + 12);
    }
  }

  /* --------------------------------------------------------------------------
     MONSTERS & BOSSES: GOBLIN, SKELETON, OGRE, LICH REI, BAHAMUT
     -------------------------------------------------------------------------- */
  drawMonster(ctx, monster, x, y, size) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const bob = Math.sin(this.tick * 0.15 + (x + y)) * 1.5;

    // === BOSS 1: LICH REI ESQUELETO (Floor 3) ===
    if (monster.icon === 'boss_lich') {
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 18;

      // Dark spectral ground pool
      ctx.fillStyle = 'rgba(88, 28, 135, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 18, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Necromancer Robes
      ctx.fillStyle = '#3b0764';
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - 6 + bob);
      ctx.lineTo(cx - 18, cy + 18 + bob);
      ctx.lineTo(cx + 18, cy + 18 + bob);
      ctx.lineTo(cx + 14, cy - 6 + bob);
      ctx.fill();

      // Ancient Crown of Souls
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(cx - 10, cy - 20 + bob, 20, 6);
      ctx.fillRect(cx - 8, cy - 24 + bob, 4, 5);
      ctx.fillRect(cx - 1, cy - 26 + bob, 4, 7);
      ctx.fillRect(cx + 6, cy - 24 + bob, 4, 5);

      // Skull Face
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(cx, cy - 10 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Purple Soul Fire Eyes
      ctx.fillStyle = '#0f051d';
      ctx.fillRect(cx - 6, cy - 12 + bob, 4, 4);
      ctx.fillRect(cx + 2, cy - 12 + bob, 4, 4);

      ctx.fillStyle = '#c084fc';
      ctx.fillRect(cx - 5, cy - 11 + bob, 2.5, 2.5);
      ctx.fillRect(cx + 3, cy - 11 + bob, 2.5, 2.5);

      // Bone Staff with Glowing Skull Orb
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx + 14, cy - 18 + bob, 3, 36);
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(cx + 15, cy - 20 + bob, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    }
    // === BOSS 2: DRAGÃO BAHAMUT (Floor 5) ===
    else if (monster.icon === 'boss_bahamut') {
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 24;

      // Dark Magma shadow pool
      ctx.fillStyle = 'rgba(153, 27, 27, 0.7)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 18, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Colossal Dragon Wings
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 8 + bob);
      ctx.lineTo(cx - 26, cy - 22 + bob);
      ctx.lineTo(cx - 18, cy + 4 + bob);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 8 + bob);
      ctx.lineTo(cx + 26, cy - 22 + bob);
      ctx.lineTo(cx + 18, cy + 4 + bob);
      ctx.fill();

      // Black Dragon Scaled Body
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.arc(cx, cy - 2 + bob, 16, 0, Math.PI * 2);
      ctx.fill();

      // Horns
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 10 + bob);
      ctx.lineTo(cx - 18, cy - 24 + bob);
      ctx.lineTo(cx - 4, cy - 14 + bob);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 10 + bob);
      ctx.lineTo(cx + 18, cy - 24 + bob);
      ctx.lineTo(cx + 4, cy - 14 + bob);
      ctx.fill();

      // Burning Eyes & Flaming Jaw
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 7, cy - 8 + bob, 4, 3);
      ctx.fillRect(cx + 3, cy - 8 + bob, 4, 3);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx - 6, cy + 2 + bob, 12, 5);

      ctx.shadowBlur = 0;
    }
    // === REGULAR MONSTERS ===
    else if (monster.icon === 'goblin') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 16, 11, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(cx, cy + 2 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy - 2 + bob);
      ctx.lineTo(cx - 20, cy - 8 + bob);
      ctx.lineTo(cx - 7, cy + 6 + bob);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 9, cy - 2 + bob);
      ctx.lineTo(cx + 20, cy - 8 + bob);
      ctx.lineTo(cx + 7, cy + 6 + bob);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx - 6, cy + 7 + bob, 12, 5);

      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.fillRect(cx - 5, cy - 2 + bob, 3, 3);
      ctx.fillRect(cx + 2, cy - 2 + bob, 3, 3);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cx + 10, cy - 4 + bob, 3, 13);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(cx + 10, cy + 6 + bob, 3, 4);

    } else if (monster.icon === 'skeleton') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 16, 11, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy - 5 + bob, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#020617';
      ctx.fillRect(cx - 6, cy - 7 + bob, 4, 4);
      ctx.fillRect(cx + 2, cy - 7 + bob, 4, 4);

      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillRect(cx - 5, cy - 6 + bob, 2.5, 2.5);
      ctx.fillRect(cx + 3, cy - 6 + bob, 2.5, 2.5);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 7, cy + 5 + bob, 14, 2.5);
      ctx.fillRect(cx - 5, cy + 9 + bob, 10, 2.5);
      ctx.fillRect(cx - 2, cy + 3 + bob, 4, 11);

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx - 11, cy + 4 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.fillRect(cx + 11, cy - 12 + bob, 2.5, 26);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 17 + bob);
      ctx.lineTo(cx + 8, cy - 10 + bob);
      ctx.lineTo(cx + 16, cy - 10 + bob);
      ctx.fill();

    } else {
      // OGRE
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 18, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(cx, cy - 2 + bob, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#450a0a';
      ctx.fillRect(cx - 10, cy - 4 + bob, 20, 3);
      ctx.fillRect(cx - 6, cy + 2 + bob, 12, 3);

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 8 + bob);
      ctx.lineTo(cx - 20, cy - 20 + bob);
      ctx.lineTo(cx - 6, cy - 13 + bob);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 8 + bob);
      ctx.lineTo(cx + 20, cy - 20 + bob);
      ctx.lineTo(cx + 6, cy - 13 + bob);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 8;
      ctx.fillRect(cx - 7, cy - 7 + bob, 4, 4);
      ctx.fillRect(cx + 3, cy - 7 + bob, 4, 4);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 5, cy + 2 + bob, 3, 5);
      ctx.fillRect(cx + 2, cy + 2 + bob, 3, 5);

      ctx.fillStyle = '#292524';
      ctx.fillRect(cx + 13, cy - 14 + bob, 8, 26);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx + 21, cy - 10 + bob, 4, 3);
      ctx.fillRect(cx + 21, cy + 0 + bob, 4, 3);
      ctx.fillRect(cx + 9, cy - 6 + bob, 4, 3);
    }

    // Overhead Health Bar
    const hpRatio = Math.max(0, monster.hp / monster.maxHp);
    const barW = monster.isBoss ? size + 16 : size - 6;
    const barH = monster.isBoss ? 6 : 4;
    const bx = monster.isBoss ? x - 8 : x + 3;
    const by = monster.isBoss ? y - 14 : y - 7;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(bx, by, barW, barH);
    ctx.fillStyle = monster.isBoss ? '#c084fc' : (hpRatio > 0.4 ? '#22c55e' : '#ef4444');
    ctx.fillRect(bx, by, Math.ceil(barW * hpRatio), barH);
    ctx.strokeStyle = monster.isBoss ? '#d4af37' : '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, barW, barH);
  }

  /* --------------------------------------------------------------------------
     PLAYER: CAVALEIRO ERRANTE + FINAL FANTASY LIMIT BREAK AURA
     -------------------------------------------------------------------------- */
  drawPlayer(ctx, player, x, y, size) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const breathe = Math.sin(this.tick * 0.12) * 1.5;

    // LIMIT BREAK READY AURA! (Final Fantasy burning golden aura!)
    if (player.limitGauge >= player.maxLimitGauge) {
      const auraPulse = 0.8 + Math.sin(this.tick * 0.25) * 0.3;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 28 * auraPulse;

      // Golden flaming rings swirling
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.7 * auraPulse})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 24 + Math.sin(this.tick * 0.2) * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Sparkles
      ctx.fillStyle = '#fef08a';
      for (let i = 0; i < 4; i++) {
        const angle = this.tick * 0.15 + (i * Math.PI) / 2;
        const sparkX = cx + Math.cos(angle) * 22;
        const sparkY = cy + Math.sin(angle) * 22;
        ctx.fillRect(sparkX - 2, sparkY - 2, 4, 4);
      }
    } else {
      ctx.shadowColor = 'rgba(245, 158, 11, 0.75)';
      ctx.shadowBlur = 16;
    }

    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 17, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Billowing crimson cape
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 4 + breathe);
    ctx.lineTo(cx - 15, cy + 16 + breathe);
    ctx.lineTo(cx + 6, cy + 15 + breathe);
    ctx.lineTo(cx + 8, cy - 4 + breathe);
    ctx.fill();

    // Defensive barrier shield when defending
    if (player.isDefending) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Dark Iron Plate Cuirass
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 9, cy - 4 + breathe, 18, 17);

    // Gilded breastplate cross
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(cx - 2, cy - 2 + breathe, 4, 12);
    ctx.fillRect(cx - 6, cy + 2 + breathe, 12, 3);

    // Forged Steel Greathelm
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(cx, cy - 9 + breathe, 10, 0, Math.PI * 2);
    ctx.fill();

    // Golden incandescent visor slit
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 7, cy - 10 + breathe, 14, 3.5);

    // Royal red crest plume
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 3, cy - 21 + breathe, 6, 6);

    // Tower Kite Shield
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(cx - 12, cy + 3 + breathe, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(cx - 12, cy + 3 + breathe, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 14, cy + 1 + breathe, 4, 4);

    // Gleaming Runic Broadsword
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx + 11, cy - 14 + breathe, 4, 23);
    ctx.beginPath();
    ctx.moveTo(cx + 13, cy - 18 + breathe);
    ctx.lineTo(cx + 10, cy - 14 + breathe);
    ctx.lineTo(cx + 16, cy - 14 + breathe);
    ctx.fill();

    // Gold Crossguard & Pommel
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(cx + 7, cy + 3 + breathe, 12, 3);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx + 11, cy + 6 + breathe, 4, 5);

    ctx.shadowBlur = 0;
  }

  /* --------------------------------------------------------------------------
     SPELL VISUAL EFFECTS (FINAL FANTASY STYLE MAGIC ANIMATIONS ON CANVAS)
     -------------------------------------------------------------------------- */
  renderSpellEffects(ctx) {
    for (let i = this.spellEffects.length - 1; i >= 0; i--) {
      const fx = this.spellEffects[i];
      fx.progress++;
      const norm = fx.progress / fx.maxLife;

      if (fx.type === 'fire') {
        // Exploding Firaga fireball
        const radius = 10 + norm * 35;
        const alpha = Math.max(0, 1 - norm);
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Fire sparks
        for (let s = 0; s < 6; s++) {
          const angle = (s * Math.PI) / 3 + norm * 2;
          const dist = radius * 1.2;
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(fx.x + Math.cos(angle) * dist, fx.y + Math.sin(angle) * dist, 3, 3);
        }
      } else if (fx.type === 'ice') {
        // Blizzaga Crystal Spikes
        const alpha = Math.max(0, 1 - norm);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 3;
        for (let s = 0; s < 5; s++) {
          const angle = (s * Math.PI * 2) / 5;
          const len = 15 + norm * 20;
          ctx.beginPath();
          ctx.moveTo(fx.x, fx.y);
          ctx.lineTo(fx.x + Math.cos(angle) * len, fx.y + Math.sin(angle) * len);
          ctx.stroke();
        }
      } else if (fx.type === 'thunder') {
        // Thundaga Lightning Bolt from heaven
        const alpha = Math.max(0, 1 - norm);
        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(fx.x - 10, fx.y - 120);
        ctx.lineTo(fx.x + 8, fx.y - 60);
        ctx.lineTo(fx.x - 6, fx.y - 20);
        ctx.lineTo(fx.x, fx.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, 20 * (1 - norm), 0, Math.PI * 2);
        ctx.fill();
      } else if (fx.type === 'cure') {
        // Curaga Radiant Healing Pillars
        const alpha = Math.max(0, 1 - norm);
        for (let p = 0; p < 8; p++) {
          const px = fx.x + (Math.sin(p + this.tick * 0.2) * 22);
          const py = fx.y + 10 - norm * 45 - p * 3;
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        }
      } else if (fx.type === 'limit') {
        // Omnislash Golden Celestial Cross-Slashes
        const alpha = Math.max(0, 1 - norm);
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.lineWidth = 5;

        // Diagonal sword flashes
        ctx.beginPath();
        ctx.moveTo(fx.x - 120 * (1 - norm), fx.y - 120 * (1 - norm));
        ctx.lineTo(fx.x + 120 * (1 - norm), fx.y + 120 * (1 - norm));
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fx.x + 120 * (1 - norm), fx.y - 120 * (1 - norm));
        ctx.lineTo(fx.x - 120 * (1 - norm), fx.y + 120 * (1 - norm));
        ctx.stroke();
      }

      if (fx.progress >= fx.maxLife) {
        this.spellEffects.splice(i, 1);
      }
    }
  }

  /* --------------------------------------------------------------------------
     ATMOSPHERIC LIGHTING & RADIAL TORCH GRADIENT
     -------------------------------------------------------------------------- */
  renderAtmosphericLighting(ctx, player) {
    const screenX = player.x * this.tileSize + this.tileSize / 2 - this.camera.x;
    const screenY = player.y * this.tileSize + this.tileSize / 2 - this.camera.y;

    const torchRadius = this.tileSize * 6.5;
    const flicker = Math.sin(this.tick * 0.15) * 8;

    const grad = ctx.createRadialGradient(
      screenX, screenY, 20,
      screenX, screenY, torchRadius + flicker
    );
    grad.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
    grad.addColorStop(0.4, 'rgba(234, 88, 12, 0.08)');
    grad.addColorStop(0.8, 'rgba(15, 23, 42, 0.12)');
    grad.addColorStop(1, 'rgba(4, 5, 8, 0.45)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /* --------------------------------------------------------------------------
     FLOATING EMBERS IN DUNGEON AIR
     -------------------------------------------------------------------------- */
  renderEmbers(ctx) {
    for (const ember of this.embers) {
      ember.y -= ember.speedY;
      ember.x += ember.speedX;

      if (ember.y < 0) {
        ember.y = this.canvas.height;
        ember.x = Math.random() * this.canvas.width;
      }

      ctx.fillStyle = `rgba(245, 158, 11, ${ember.alpha * (0.6 + Math.sin(this.tick * 0.1) * 0.4)})`;
      ctx.fillRect(ember.x, ember.y, ember.size, ember.size);
    }
  }

  /* --------------------------------------------------------------------------
     FLOATING COMBAT TEXT
     -------------------------------------------------------------------------- */
  renderFloatingTexts(ctx) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';

      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.max(0, ft.alpha)})`;
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);

      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillText(ft.text, ft.x, ft.y);

      ft.y += ft.vy;
      ft.alpha -= 0.018;
      ft.life--;

      if (ft.life <= 0 || ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
    ctx.globalAlpha = 1.0;
  }
}
