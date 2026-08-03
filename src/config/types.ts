/**
 * Type definitions for Dragon Flight
 */

export interface FlameTier {
  name: string;
  level: number;
  damage: number;
  fireRate: number;
  streams: number;
  spreadAngle: number;
  piercing: boolean;
  homing: boolean;
  speed: number;
  color: number;
}

export interface BroodMember {
  sprite: Phaser.Physics.Arcade.Sprite;
  stage: 'hatchling' | 'juvenile';
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
  index: number;
}

export interface Enemy {
  sprite: Phaser.GameObjects.Sprite;
  type: 'wyvern' | 'dragonrider' | 'ballista' | 'flock';
  health: number;
  maxHealth: number;
  speed: number;
  score: number;
  attackTimer: number;
  isAlive: boolean;
}

export interface Projectile {
  sprite: Phaser.Physics.Arcade.Sprite;
  damage: number;
  speed: number;
  isPlayerProjectile: boolean;
  piercing: boolean;
  homing: boolean;
  hasHit: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  wave: number;
  flameLevel: number;
  comboMultiplier: number;
  comboTimer: number;
  highScore: number;
  isPaused: boolean;
  isGameOver: boolean;
}

export interface PowerUp {
  type: 'inferno' | 'shield';
  duration: number;
  startTime: number;
}
