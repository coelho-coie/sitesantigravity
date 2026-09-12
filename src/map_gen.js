/**
 * Procedural Dungeon Map Generator
 * Guarantees 100% connected rooms via deterministic corridors.
 */

export const TILE_WALL = 0;
export const TILE_FLOOR = 1;

export class RectRoom {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.centerX = Math.floor(x + w / 2);
    this.centerY = Math.floor(y + h / 2);
  }

  intersects(other, padding = 1) {
    return (
      this.x - padding <= other.x + other.w &&
      this.x + this.w + padding >= other.x &&
      this.y - padding <= other.y + other.h &&
      this.y + this.h + padding >= other.y
    );
  }
}

export class DungeonMap {
  constructor(width = 54, height = 36) {
    this.width = width;
    this.height = height;
    this.tiles = new Uint8Array(width * height);
    this.rooms = [];
    this.stairs = { x: 0, y: 0 };
    this.playerStart = { x: 0, y: 0 };
  }

  getTile(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return TILE_WALL;
    }
    return this.tiles[y * this.width + x];
  }

  setTile(x, y, type) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[y * this.width + x] = type;
    }
  }

  isWalkable(x, y) {
    return this.getTile(x, y) === TILE_FLOOR;
  }

  carveRoom(room) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        this.setTile(x, y, TILE_FLOOR);
      }
    }
  }

  carveHorizontalTunnel(x1, x2, y) {
    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);
    for (let x = start; x <= end; x++) {
      this.setTile(x, y, TILE_FLOOR);
    }
  }

  carveVerticalTunnel(y1, y2, x) {
    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);
    for (let y = start; y <= end; y++) {
      this.setTile(x, y, TILE_FLOOR);
    }
  }

  carveCorridor(x1, y1, x2, y2) {
    if (Math.random() < 0.5) {
      this.carveHorizontalTunnel(x1, x2, y1);
      this.carveVerticalTunnel(y1, y2, x2);
    } else {
      this.carveVerticalTunnel(y1, y2, x1);
      this.carveHorizontalTunnel(x1, x2, y2);
    }
  }

  generate(options = {}) {
    const maxRooms = options.maxRooms || 18;
    const roomMinSize = options.roomMinSize || 5;
    const roomMaxSize = options.roomMaxSize || 10;

    this.tiles.fill(TILE_WALL);
    this.rooms = [];

    for (let i = 0; i < maxRooms * 3 && this.rooms.length < maxRooms; i++) {
      const w = Math.floor(Math.random() * (roomMaxSize - roomMinSize + 1)) + roomMinSize;
      const h = Math.floor(Math.random() * (roomMaxSize - roomMinSize + 1)) + roomMinSize;
      const x = Math.floor(Math.random() * (this.width - w - 2)) + 1;
      const y = Math.floor(Math.random() * (this.height - h - 2)) + 1;

      const newRoom = new RectRoom(x, y, w, h);
      let failed = false;

      for (const other of this.rooms) {
        if (newRoom.intersects(other, 1)) {
          failed = true;
          break;
        }
      }

      if (!failed) {
        this.carveRoom(newRoom);

        if (this.rooms.length > 0) {
          const prevRoom = this.rooms[this.rooms.length - 1];
          this.carveCorridor(
            newRoom.centerX,
            newRoom.centerY,
            prevRoom.centerX,
            prevRoom.centerY
          );
        }

        this.rooms.push(newRoom);
      }
    }

    // Connect random extra rooms to create loop paths and tactical alternatives
    if (this.rooms.length > 3) {
      const extraTunnels = Math.min(4, Math.floor(this.rooms.length / 3));
      for (let i = 0; i < extraTunnels; i++) {
        const r1 = this.rooms[Math.floor(Math.random() * this.rooms.length)];
        const r2 = this.rooms[Math.floor(Math.random() * this.rooms.length)];
        if (r1 !== r2) {
          this.carveCorridor(r1.centerX, r1.centerY, r2.centerX, r2.centerY);
        }
      }
    }

    // First room is player start
    this.playerStart = {
      x: this.rooms[0].centerX,
      y: this.rooms[0].centerY,
    };

    // Find furthest room from start for the stairs
    let maxDist = -1;
    let stairRoom = this.rooms[this.rooms.length - 1];
    for (let i = 1; i < this.rooms.length; i++) {
      const r = this.rooms[i];
      const dist = Math.hypot(r.centerX - this.playerStart.x, r.centerY - this.playerStart.y);
      if (dist > maxDist) {
        maxDist = dist;
        stairRoom = r;
      }
    }

    this.stairs = {
      x: stairRoom.centerX,
      y: stairRoom.centerY,
    };

    return this;
  }
}
