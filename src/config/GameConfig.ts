/**
 * Central configuration for Dragon Flight
 * All game balance, progression, and tuning values live here
 */

export const GAME_CONFIG = {
  // Canvas dimensions
  WIDTH: 1280,
  HEIGHT: 720,
  
  // Lives system
  STARTING_LIVES: 3,
  
  // Wave system
  BASE_ENEMY_SPAWN_DELAY: 2000, // ms between spawns
  WAVE_DIFFICULTY_MULTIPLIER: 1.15, // difficulty increase per wave
  ENEMIES_PER_WAVE_BASE: 8,
  ENEMIES_PER_WAVE_INCREMENT: 2,
};

/**
 * Dragon player configuration
 */
export const PLAYER_CONFIG = {
  SPEED: 250,
  MAX_SPEED: 400,
  ACCELERATION: 800,
  DRAG: 600,
  SCALE: 1.2,
  START_X: 200,
  START_Y: 360,
  HIT_RADIUS: 30,
  
  // Flight feel
  BANK_ANGLE: 15, // degrees of tilt when turning
  SMOOTH_FACTOR: 0.15, // easing for smooth movement
};

/**
 * Flame upgrade system - all tiers and their properties
 */
export const FLAME_CONFIG = {
  // Upgrade tiers (gained through gameplay)
  TIERS: [
    {
      name: 'Single Stream',
      level: 0,
      damage: 10,
      fireRate: 100, // ms between shots
      streams: 1,
      spreadAngle: 0,
      piercing: false,
      homing: false,
      speed: 500,
      color: 0xff6600,
    },
    {
      name: 'Hotter Flame',
      level: 1,
      damage: 15,
      fireRate: 90,
      streams: 1,
      spreadAngle: 0,
      piercing: false,
      homing: false,
      speed: 550,
      color: 0xff4400,
    },
    {
      name: 'Twin Streams',
      level: 2,
      damage: 12,
      fireRate: 85,
      streams: 2,
      spreadAngle: 15,
      piercing: false,
      homing: false,
      speed: 550,
      color: 0xff5500,
    },
    {
      name: 'Wide Cone',
      level: 3,
      damage: 10,
      fireRate: 80,
      streams: 3,
      spreadAngle: 25,
      piercing: false,
      homing: false,
      speed: 500,
      color: 0xff6611,
    },
    {
      name: 'Ember Burst',
      level: 4,
      damage: 18,
      fireRate: 75,
      streams: 5,
      spreadAngle: 35,
      piercing: false,
      homing: false,
      speed: 480,
      color: 0xff7722,
    },
    {
      name: 'Homing Cinders',
      level: 5,
      damage: 20,
      fireRate: 70,
      streams: 3,
      spreadAngle: 20,
      piercing: false,
      homing: true,
      speed: 450,
      color: 0xffaa33,
    },
    {
      name: 'Piercing Dragonfire',
      level: 6,
      damage: 25,
      fireRate: 65,
      streams: 2,
      spreadAngle: 10,
      piercing: true,
      homing: false,
      speed: 600,
      color: 0xff3300,
    },
  ],
  
  // Score thresholds for upgrades (alternative to drops)
  UPGRADE_SCORE_THRESHOLDS: [500, 1200, 2500, 4500, 7500, 12000],
  
  // Temporary power-ups
  POWER_UPS: {
    INFERNO_OVERDRIVE: {
      duration: 5000, // ms
      damageMultiplier: 3,
      fireRateMultiplier: 0.5,
    },
    SCALE_SHIELD: {
      duration: 8000,
      invulnerable: true,
    },
  },
};

/**
 * Brood system - hatchlings and juveniles that follow the player
 */
export const BROOD_CONFIG = {
  // Formation positions relative to player (offset x, y)
  HATCHLING_OFFSETS: [
    { x: -80, y: 0 },
    { x: -120, y: -40 },
    { x: -120, y: 40 },
    { x: -160, y: -80 },
    { x: -160, y: 80 },
  ],
  
  JUVENILE_OFFSETS: [
    { x: -100, y: -50 },
    { x: -100, y: 50 },
    { x: -180, y: 0 },
  ],
  
  // Growth stages
  STAGES: {
    HATCHLING: {
      name: 'Hatchling',
      scale: 0.6,
      damageMultiplier: 0.3,
      fireRateMultiplier: 1.5, // slower fire
      color: 0xffaa66,
    },
    JUVENILE: {
      name: 'Juvenile',
      scale: 0.9,
      damageMultiplier: 0.7,
      fireRateMultiplier: 1.2,
      color: 0xff8833,
    },
  },
  
  // Score thresholds for new brood members
  SPAWN_THRESHOLDS: [1000, 2000, 3500, 5500, 8500, 13000, 20000, 30000],
  
  // Score thresholds for hatchling → juvenile growth
  GROWTH_THRESHOLDS: [2500, 6000, 15000],
  
  // Trailing behavior
  FOLLOW_DISTANCE: 80,
  FOLLOW_SPEED_MULTIPLIER: 1.1,
  SMOOTH_FACTOR: 0.12,
};

/**
 * Combo multiplier system
 */
export const COMBO_CONFIG = {
  MAX_MULTIPLIER: 10,
  DECAY_TIME: 2000, // ms without kill before decay starts
  DECAY_RATE: 0.5, // multiplier lost per second during decay
  MULTIPLIER_INCREMENT: 0.5, // added per consecutive kill
  
  // Thresholds for visual/audio feedback escalation
  FEEDBACK_TIERS: [
    { multiplier: 2, glowIntensity: 0.3, pitchShift: 1.1 },
    { multiplier: 4, glowIntensity: 0.5, pitchShift: 1.2 },
    { multiplier: 6, glowIntensity: 0.7, pitchShift: 1.3 },
    { multiplier: 8, glowIntensity: 0.9, pitchShift: 1.4 },
  ],
  
  // High combo flame intensity boost
  FLAME_BOOST_THRESHOLD: 5,
  FLAME_BOOST_MULTIPLIER: 1.3,
};

/**
 * Enemy configurations
 */
export const ENEMY_CONFIG = {
  WYVERN: {
    name: 'Wyvern',
    health: 30,
    speed: 150,
    score: 100,
    scale: 0.8,
    attackDamage: 1,
    attackRate: 2000,
    color: 0x884422,
  },
  
  DRAGONRIDER: {
    name: 'Dragonrider',
    health: 50,
    speed: 120,
    score: 200,
    scale: 1.0,
    attackDamage: 1,
    attackRate: 1500,
    color: 0x995533,
  },
  
  BALLISTA_TOWER: {
    name: 'Ballista Tower',
    health: 80,
    speed: 0, // stationary
    score: 300,
    scale: 1.2,
    attackDamage: 2,
    attackRate: 3000,
    projectileSpeed: 400,
    projectileCount: 5, // arrow-storm
    color: 0x665544,
  },
  
  FLOCK: {
    name: 'Flock',
    health: 10,
    speed: 200,
    score: 50,
    scale: 0.4,
    formationSize: 6, // number in formation
    attackDamage: 1,
    attackRate: 1000,
    color: 0x776655,
  },
};

/**
 * Visual effect settings
 */
export const VFX_CONFIG = {
  PARTICLE_CONFIG: {
    ember: {
      lifespan: 1000,
      speed: { min: 50, max: 150 },
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 1, end: 0 },
    },
    explosion: {
      lifespan: 500,
      speed: { min: 100, max: 300 },
      scale: { start: 0.6, end: 0.2 },
      alpha: { start: 1, end: 0 },
    },
    flame: {
      lifespan: 400,
      speed: { min: 30, max: 80 },
      scale: { start: 0.5, end: 0.2 },
      alpha: { start: 0.9, end: 0 },
    },
  },
  
  SCREEN_SHAKE: {
    intensity: 5,
    duration: 100,
  },
  
  BLOOM: {
    intensity: 0.3,
    threshold: 0.5,
  },
};

/**
 * Color palette - Ember & Ash aesthetic
 */
export const COLOR_PALETTE = {
  BACKGROUND: 0x0a0a0a,
  PRIMARY_FLAME: 0xff6600,
  SECONDARY_FLAME: 0xff9933,
  HOT_FLAME: 0xff3300,
  EMBER: 0xffaa44,
  ASH: 0x332211,
  UI_TEXT: 0xff9933,
  UI_GLOW: 0xff6600,
};
