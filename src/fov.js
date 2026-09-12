/**
 * Field of View (FOV) and Fog of War calculation
 * Raycasting around the player to compute visibility and persistent exploration memory.
 */

import { TILE_WALL } from './map_gen.js';

export class FieldOfView {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.visible = new Uint8Array(width * height);
    this.explored = new Uint8Array(width * height);
    this.radius = 8;
  }

  reset() {
    this.visible.fill(0);
    this.explored.fill(0);
  }

  isVisible(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    return this.visible[y * this.width + x] === 1;
  }

  isExplored(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    return this.explored[y * this.width + x] === 1;
  }

  compute(map, originX, originY, radius = 8) {
    this.radius = radius;
    // Clear currently visible flags
    this.visible.fill(0);

    // Origin is always visible and explored
    const originIdx = originY * this.width + originX;
    this.visible[originIdx] = 1;
    this.explored[originIdx] = 1;

    // Cast rays to a perimeter around the origin
    const samples = 180;
    const stepAngle = (2 * Math.PI) / samples;

    for (let i = 0; i < samples; i++) {
      const angle = i * stepAngle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      let currentX = originX + 0.5;
      let currentY = originY + 0.5;

      for (let step = 0; step <= radius * 2; step++) {
        currentX += cos * 0.5;
        currentY += sin * 0.5;

        const tileX = Math.floor(currentX);
        const tileY = Math.floor(currentY);

        if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
          break;
        }

        const dist = Math.hypot(tileX - originX, tileY - originY);
        if (dist > radius) {
          break;
        }

        const idx = tileY * this.width + tileX;
        this.visible[idx] = 1;
        this.explored[idx] = 1;

        // Vision is blocked by walls
        if (map.getTile(tileX, tileY) === TILE_WALL) {
          break;
        }
      }
    }
  }
}
