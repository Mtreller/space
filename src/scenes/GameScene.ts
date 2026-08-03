/**
 * GameScene - Core gameplay scene
 * Handles player, enemies, combat, upgrades, brood, and all game systems
 */

import Phaser from 'phaser';
import {
  GAME_CONFIG,
  PLAYER_CONFIG,
  FLAME_CONFIG,
  BROOD_CONFIG,
  COMBO_CONFIG,
  ENEMY_CONFIG,
  VFX_CONFIG,
  COLOR_PALETTE,
} from '../config/GameConfig';
import type { BroodMember, Enemy, Projectile, GameState, FlameTier } from '../config/types';
import { updateHUD, showGameOver, saveHighScore, getHighScore } from '../main';

export class GameScene extends Phaser.Scene {
  // Player
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerTargetX: number = PLAYER_CONFIG.START_X;
  private playerTargetY: number = PLAYER_CONFIG.START_Y;

  // Game state
  private gameState: GameState = {
    score: 0,
    lives: GAME_CONFIG.STARTING_LIVES,
    wave: 1,
    flameLevel: 0,
    comboMultiplier: 1,
    comboTimer: 0,
    highScore: 0,
    isPaused: false,
    isGameOver: false,
  };

  // Flame system
  private flameTimer: number = 0;
  private currentFlameTier: FlameTier = FLAME_CONFIG.TIERS[0];
  private projectiles: Projectile[] = [];
  private enemyProjectiles: Projectile[] = [];

  // Brood system
  private broodMembers: BroodMember[] = [];
  private broodSpawnCount: number = 0;
  private broodGrowthCount: number = 0;

  // Enemy system
  private enemies: Enemy[] = [];
  private waveSpawnTimer: number = 0;
  private waveEnemiesSpawned: number = 0;
  private waveEnemiesTotal: number = GAME_CONFIG.ENEMIES_PER_WAVE_BASE;
  private waveEnemiesKilled: number = 0;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { w: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key };
  private isTouchDevice: boolean = false;

  // Particles
  private emberParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private explosionParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

  // Camera effects
  private comboGlowIntensity: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Reset game state
    this.resetGameState();

    // Create background
    this.createBackground();

    // Create particle systems
    this.createParticleSystems();

    // Create player
    this.createPlayer();

    // Setup input
    this.setupInput();

    // Initialize HUD
    this.updateGameHUD();

    // Start first wave
    this.startWave();
  }

  update(time: number, delta: number) {
    if (this.gameState.isPaused || this.gameState.isGameOver) return;

    // Update player
    this.updatePlayer(delta);

    // Update flame system
    this.updateFlameSystem(delta);

    // Update brood
    this.updateBrood(delta);

    // Update enemies
    this.updateEnemies(time, delta);

    // Update projectiles
    this.updateProjectiles(delta);

    // Update combo system
    this.updateComboSystem(delta);

    // Update wave system
    this.updateWaveSystem(delta);

    // Check collisions
    this.checkCollisions();

    // Update camera effects
    this.updateCameraEffects(delta);
  }

  private resetGameState() {
    this.gameState = {
      score: 0,
      lives: GAME_CONFIG.STARTING_LIVES,
      wave: 1,
      flameLevel: 0,
      comboMultiplier: 1,
      comboTimer: 0,
      highScore: getHighScore(),
      isPaused: false,
      isGameOver: false,
    };

    this.flameTimer = 0;
    this.currentFlameTier = FLAME_CONFIG.TIERS[0];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.broodMembers = [];
    this.broodSpawnCount = 0;
    this.broodGrowthCount = 0;
    this.enemies = [];
    this.waveSpawnTimer = 0;
    this.waveEnemiesSpawned = 0;
    this.waveEnemiesTotal = GAME_CONFIG.ENEMIES_PER_WAVE_BASE;
    this.waveEnemiesKilled = 0;
    this.comboGlowIntensity = 0;
  }

  private createBackground() {
    // Dark mythic sky with parallax effect
    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      COLOR_PALETTE.BACKGROUND
    );

    // Add some ambient embers floating up
    this.add.particles(0, 0, 'ember-particle', {
      x: { min: 0, max: this.cameras.main.width },
      y: this.cameras.main.height + 20,
      speedY: { min: -50, max: -20 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.2, end: 0.05 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 5000,
      frequency: 200,
      tint: COLOR_PALETTE.EMBER,
    });
  }

  private createParticleSystems() {
    // Ember particles for flame trails
    this.emberParticles = this.add.particles(0, 0, 'ember-particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      tint: COLOR_PALETTE.PRIMARY_FLAME,
      emitting: false,
    });

    // Explosion particles
    this.explosionParticles = this.add.particles(0, 0, 'explosion-particle', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.6, end: 0.2 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      tint: COLOR_PALETTE.PRIMARY_FLAME,
      emitting: false,
    });
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(
      PLAYER_CONFIG.START_X,
      PLAYER_CONFIG.START_Y,
      'player-dragon'
    );
    this.player.setScale(PLAYER_CONFIG.SCALE);
    this.player.setCollideWorldBounds(true);
    this.player.setDrag(PLAYER_CONFIG.DRAG, PLAYER_CONFIG.DRAG);
    this.player.setMaxVelocity(PLAYER_CONFIG.MAX_SPEED, PLAYER_CONFIG.MAX_SPEED);

    this.playerTargetX = PLAYER_CONFIG.START_X;
    this.playerTargetY = PLAYER_CONFIG.START_Y;
  }

  private setupInput() {
    // Keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      w: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Detect touch device
    this.isTouchDevice = this.input.activePointer.isDown || 
                         'ontouchstart' in window;

    // Mouse follow on desktop (optional)
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isTouchDevice && pointer.isDown) {
        this.playerTargetX = pointer.x;
        this.playerTargetY = pointer.y;
      }
    });

    // Touch drag on mobile
    this.input.on('pointerdown', () => {
      this.isTouchDevice = true;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isTouchDevice && pointer.isDown) {
        this.playerTargetX = pointer.x;
        this.playerTargetY = pointer.y;
      }
    });
  }

  private updatePlayer(delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // Handle keyboard input
    let accelX = 0;
    let accelY = 0;

    if (this.cursors.left.isDown || this.wasd.a.isDown) {
      accelX = -PLAYER_CONFIG.ACCELERATION;
    } else if (this.cursors.right.isDown || this.wasd.d.isDown) {
      accelX = PLAYER_CONFIG.ACCELERATION;
    }

    if (this.cursors.up.isDown || this.wasd.w.isDown) {
      accelY = -PLAYER_CONFIG.ACCELERATION;
    } else if (this.cursors.down.isDown || this.wasd.s.isDown) {
      accelY = PLAYER_CONFIG.ACCELERATION;
    }

    // Apply keyboard acceleration
    if (accelX !== 0 || accelY !== 0) {
      body.setAcceleration(accelX, accelY);
    } else {
      // Smooth movement toward target (mouse/touch)
      const dx = this.playerTargetX - this.player.x;
      const dy = this.playerTargetY - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const velocityX = dx * PLAYER_CONFIG.SMOOTH_FACTOR * PLAYER_CONFIG.ACCELERATION * (delta / 16);
        const velocityY = dy * PLAYER_CONFIG.SMOOTH_FACTOR * PLAYER_CONFIG.ACCELERATION * (delta / 16);
        body.setVelocity(velocityX, velocityY);
      }

      body.setAcceleration(0, 0);
    }

    // Banking effect when turning
    const velocityX = body.velocity.x;
    const bankAngle = Phaser.Math.Clamp(
      velocityX / PLAYER_CONFIG.MAX_SPEED * PLAYER_CONFIG.BANK_ANGLE,
      -PLAYER_CONFIG.BANK_ANGLE,
      PLAYER_CONFIG.BANK_ANGLE
    );
    this.player.setAngle(bankAngle);

    // Emit ember trail
    this.emberParticles.emitParticleAt(this.player.x - 20, this.player.y, 2);
  }

  private updateFlameSystem(delta: number) {
    this.flameTimer += delta;

    const fireRate = this.currentFlameTier.fireRate;

    if (this.flameTimer >= fireRate) {
      this.flameTimer = 0;
      this.fireFlame();

      // Brood also fires
      this.broodMembers.forEach((member) => {
        this.fireBroodFlame(member);
      });
    }
  }

  private fireFlame() {
    const tier = this.currentFlameTier;
    const startX = this.player.x + 30;
    const startY = this.player.y;

    for (let i = 0; i < tier.streams; i++) {
      const angle = tier.spreadAngle > 0
        ? Phaser.Math.DegToRad((i - (tier.streams - 1) / 2) * (tier.spreadAngle / (tier.streams - 1 || 1)))
        : 0;

      const velocityX = Math.cos(angle) * tier.speed;
      const velocityY = Math.sin(angle) * tier.speed;

      const flame = this.physics.add.sprite(startX, startY, 'flame');
      flame.setTint(tier.color);
      flame.setScale(0.8);
      flame.setVelocity(velocityX, velocityY);

      this.projectiles.push({
        sprite: flame,
        damage: tier.damage,
        speed: tier.speed,
        isPlayerProjectile: true,
        piercing: tier.piercing,
        homing: tier.homing,
        hasHit: false,
      });

      // Flame trail particles
      this.emberParticles.emitParticleAt(startX, startY, 3);
    }
  }

  private fireBroodFlame(member: BroodMember) {
    const tier = this.currentFlameTier;
    const stage = BROOD_CONFIG.STAGES[member.stage === 'hatchling' ? 'HATCHLING' : 'JUVENILE'];
    const damage = tier.damage * stage.damageMultiplier;

    const startX = member.sprite.x + 20;
    const startY = member.sprite.y;

    const flame = this.physics.add.sprite(startX, startY, 'flame');
    flame.setTint(stage.color);
    flame.setScale(0.6);
    flame.setVelocity(tier.speed, 0);

    this.projectiles.push({
      sprite: flame,
      damage,
      speed: tier.speed,
      isPlayerProjectile: true,
      piercing: tier.piercing,
      homing: tier.homing,
      hasHit: false,
    });
  }

  private updateProjectiles(_delta: number) {
    // Update player projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];

      // Homing behavior
      if (proj.homing && this.enemies.length > 0) {
        const nearestEnemy = this.findNearestEnemy(proj.sprite.x, proj.sprite.y);
        if (nearestEnemy) {
          const dx = nearestEnemy.sprite.x - proj.sprite.x;
          const dy = nearestEnemy.sprite.y - proj.sprite.y;
          const angle = Math.atan2(dy, dx);
          proj.sprite.setVelocity(
            Math.cos(angle) * proj.speed,
            Math.sin(angle) * proj.speed
          );
        }
      }

      // Remove if off-screen
      if (
        proj.sprite.x < -50 ||
        proj.sprite.x > this.cameras.main.width + 50 ||
        proj.sprite.y < -50 ||
        proj.sprite.y > this.cameras.main.height + 50
      ) {
        proj.sprite.destroy();
        this.projectiles.splice(i, 1);
      }
    }

    // Update enemy projectiles
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const proj = this.enemyProjectiles[i];

      if (
        proj.sprite.x < -50 ||
        proj.sprite.x > this.cameras.main.width + 50 ||
        proj.sprite.y < -50 ||
        proj.sprite.y > this.cameras.main.height + 50
      ) {
        proj.sprite.destroy();
        this.enemyProjectiles.splice(i, 1);
      }
    }
  }

  private findNearestEnemy(x: number, y: number): Enemy | null {
    let nearest: Enemy | null = null;
    let minDist = Infinity;

    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue;
      const dist = Phaser.Math.Distance.Between(x, y, enemy.sprite.x, enemy.sprite.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = enemy;
      }
    }

    return nearest;
  }

  private updateBrood(_delta: number) {
    // Check for new brood spawns
    while (this.broodSpawnCount < BROOD_CONFIG.SPAWN_THRESHOLDS.length &&
           this.gameState.score >= BROOD_CONFIG.SPAWN_THRESHOLDS[this.broodSpawnCount]) {
      this.spawnBroodMember();
      this.broodSpawnCount++;
    }

    // Check for brood growth
    while (this.broodGrowthCount < BROOD_CONFIG.GROWTH_THRESHOLDS.length &&
           this.gameState.score >= BROOD_CONFIG.GROWTH_THRESHOLDS[this.broodGrowthCount]) {
      this.growBroodMember(this.broodGrowthCount);
      this.broodGrowthCount++;
    }

    // Update brood positions (trailing behavior)
    this.broodMembers.forEach((member, index) => {
      const leadTarget = index === 0 ? this.player : this.broodMembers[index - 1].sprite;
      
      const dx = leadTarget.x - member.sprite.x;
      const dy = leadTarget.y - member.sprite.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > BROOD_CONFIG.FOLLOW_DISTANCE) {
        const body = member.sprite.body as Phaser.Physics.Arcade.Body;
        const targetVelocityX = dx * BROOD_CONFIG.SMOOTH_FACTOR * 60;
        const targetVelocityY = dy * BROOD_CONFIG.SMOOTH_FACTOR * 60;
        body.setVelocity(targetVelocityX, targetVelocityY);
      }

      // Slight banking
      const velocityX = dx;
      const bankAngle = Phaser.Math.Clamp(velocityX * 0.1, -10, 10);
      member.sprite.setAngle(bankAngle);
    });
  }

  private spawnBroodMember() {
    const sprite = this.physics.add.sprite(
      this.player.x - 100,
      this.player.y,
      'hatchling-dragon'
    ) as Phaser.Physics.Arcade.Sprite;
    sprite.setScale(BROOD_CONFIG.STAGES.HATCHLING.scale);
    sprite.setTint(BROOD_CONFIG.STAGES.HATCHLING.color);

    const member: BroodMember = {
      sprite,
      stage: 'hatchling',
      position: { x: sprite.x, y: sprite.y },
      targetPosition: { x: sprite.x, y: sprite.y },
      index: this.broodMembers.length,
    };

    this.broodMembers.push(member);

    // Hatch animation
    this.tweens.add({
      targets: sprite,
      scale: BROOD_CONFIG.STAGES.HATCHLING.scale,
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Screen flash
    this.cameras.main.flash(200, 255, 150, 50);
  }

  private growBroodMember(index: number) {
    if (index >= this.broodMembers.length) return;

    const member = this.broodMembers[index];
    if (member.stage === 'juvenile') return;

    member.stage = 'juvenile';
    member.sprite.setTexture('juvenile-dragon');
    member.sprite.setScale(BROOD_CONFIG.STAGES.JUVENILE.scale);
    member.sprite.setTint(BROOD_CONFIG.STAGES.JUVENILE.color);

    // Growth animation
    this.tweens.add({
      targets: member.sprite,
      scale: BROOD_CONFIG.STAGES.JUVENILE.scale,
      duration: 800,
      ease: 'Back.easeOut',
    });

    this.cameras.main.flash(200, 255, 200, 100);
  }

  private updateEnemies(time: number, delta: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (!enemy.isAlive) {
        this.enemies.splice(i, 1);
        continue;
      }

      // AI behavior based on type
      this.updateEnemyAI(enemy, time, delta);

      // Remove if too far off-screen (left side)
      // Count as "killed" so wave can progress
      if (enemy.sprite.x < -100) {
        enemy.sprite.destroy();
        this.enemies.splice(i, 1);
        this.waveEnemiesKilled++;
      }
    }
  }

  private updateEnemyAI(enemy: Enemy, _time: number, delta: number) {
    const body = enemy.sprite.body as Phaser.Physics.Arcade.Body;

    switch (enemy.type) {
      case 'wyvern':
        // Fly toward player, attack when close
        const dx = this.player.x - enemy.sprite.x;
        const dy = this.player.y - enemy.sprite.y;
        const angle = Math.atan2(dy, dx);
        body.setVelocity(Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);
        
        enemy.attackTimer -= delta;
        if (enemy.attackTimer <= 0 && Phaser.Math.Distance.Between(
          enemy.sprite.x, enemy.sprite.y, this.player.x, this.player.y
        ) < 200) {
          this.enemyAttack(enemy);
          enemy.attackTimer = ENEMY_CONFIG.WYVERN.attackRate;
        }
        break;

      case 'dragonrider':
        // Similar to wyvern but faster attacks
        const dx2 = this.player.x - enemy.sprite.x;
        const dy2 = this.player.y - enemy.sprite.y;
        const angle2 = Math.atan2(dy2, dx2);
        body.setVelocity(Math.cos(angle2) * enemy.speed, Math.sin(angle2) * enemy.speed);
        
        enemy.attackTimer -= delta;
        if (enemy.attackTimer <= 0 && Phaser.Math.Distance.Between(
          enemy.sprite.x, enemy.sprite.y, this.player.x, this.player.y
        ) < 250) {
          this.enemyAttack(enemy);
          enemy.attackTimer = ENEMY_CONFIG.DRAGONRIDER.attackRate;
        }
        break;

      case 'ballista':
        // Stationary, fires arrow storms
        body.setVelocity(0, 0);
        enemy.attackTimer -= delta;
        if (enemy.attackTimer <= 0) {
          this.ballistaAttack(enemy);
          enemy.attackTimer = ENEMY_CONFIG.BALLISTA_TOWER.attackRate;
        }
        break;

      case 'flock':
        // Swarm behavior - move in formation
        body.setVelocity(-enemy.speed * 0.5, Math.sin(this.time.now * 0.003) * 100);
        break;
    }
  }

  private enemyAttack(enemy: Enemy) {
    const dx = this.player.x - enemy.sprite.x;
    const dy = this.player.y - enemy.sprite.y;
    const angle = Math.atan2(dy, dx);

    const projectile = this.physics.add.sprite(
      enemy.sprite.x,
      enemy.sprite.y,
      'arrow'
    );
    projectile.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
    projectile.setRotation(angle);

    this.enemyProjectiles.push({
      sprite: projectile,
      damage: ENEMY_CONFIG[enemy.type.toUpperCase() as keyof typeof ENEMY_CONFIG].attackDamage,
      speed: 300,
      isPlayerProjectile: false,
      piercing: false,
      homing: false,
      hasHit: false,
    });
  }

  private ballistaAttack(enemy: Enemy) {
    const projectileCount = ENEMY_CONFIG.BALLISTA_TOWER.projectileCount;

    for (let i = 0; i < projectileCount; i++) {
      const spreadAngle = (i - (projectileCount - 1) / 2) * 0.3;
      const dx = this.player.x - enemy.sprite.x;
      const dy = this.player.y - enemy.sprite.y;
      const baseAngle = Math.atan2(dy, dx);
      const angle = baseAngle + spreadAngle;

      const projectile = this.physics.add.sprite(
        enemy.sprite.x,
        enemy.sprite.y,
        'arrow'
      );
      projectile.setVelocity(
        Math.cos(angle) * ENEMY_CONFIG.BALLISTA_TOWER.projectileSpeed,
        Math.sin(angle) * ENEMY_CONFIG.BALLISTA_TOWER.projectileSpeed
      );
      projectile.setRotation(angle);

      this.enemyProjectiles.push({
        sprite: projectile,
        damage: ENEMY_CONFIG.BALLISTA_TOWER.attackDamage,
        speed: ENEMY_CONFIG.BALLISTA_TOWER.projectileSpeed,
        isPlayerProjectile: false,
        piercing: false,
        homing: false,
        hasHit: false,
      });
    }
  }

  private updateComboSystem(delta: number) {
    if (this.gameState.comboMultiplier > 1) {
      this.gameState.comboTimer -= delta;

      if (this.gameState.comboTimer <= 0) {
        // Decay combo
        this.gameState.comboMultiplier = Math.max(
          1,
          this.gameState.comboMultiplier - COMBO_CONFIG.DECAY_RATE * (delta / 1000)
        );

        if (this.gameState.comboMultiplier <= 1) {
          this.gameState.comboMultiplier = 1;
        }

        this.updateGameHUD();
      }
    }
  }

  private addCombo() {
    this.gameState.comboMultiplier = Math.min(
      COMBO_CONFIG.MAX_MULTIPLIER,
      this.gameState.comboMultiplier + COMBO_CONFIG.MULTIPLIER_INCREMENT
    );
    this.gameState.comboTimer = COMBO_CONFIG.DECAY_TIME;
    this.updateGameHUD();
  }

  private updateWaveSystem(delta: number) {
    if (this.waveEnemiesSpawned >= this.waveEnemiesTotal) {
      // Check if wave is complete
      if (this.enemies.length === 0 && this.waveEnemiesKilled >= this.waveEnemiesTotal) {
        this.startNextWave();
      }
      return;
    }

    this.waveSpawnTimer -= delta;

    if (this.waveSpawnTimer <= 0) {
      this.spawnEnemy();
      this.waveEnemiesSpawned++;
      
      const spawnDelay = GAME_CONFIG.BASE_ENEMY_SPAWN_DELAY / 
                        Math.pow(GAME_CONFIG.WAVE_DIFFICULTY_MULTIPLIER, this.gameState.wave - 1);
      this.waveSpawnTimer = spawnDelay;
    }
  }

  private startWave() {
    this.waveEnemiesSpawned = 0;
    this.waveEnemiesKilled = 0;
    this.waveEnemiesTotal = GAME_CONFIG.ENEMIES_PER_WAVE_BASE + 
                           (this.gameState.wave - 1) * GAME_CONFIG.ENEMIES_PER_WAVE_INCREMENT;
    this.waveSpawnTimer = 1000;

    // Wave start flash
    this.cameras.main.flash(300, 100, 50, 0);
  }

  private startNextWave() {
    this.gameState.wave++;
    this.updateGameHUD();
    this.startWave();

    // Reward for completing wave
    this.addScore(500);
  }

  private spawnEnemy() {
    // Choose enemy type based on wave
    let type: 'wyvern' | 'dragonrider' | 'ballista' | 'flock';
    const rand = Math.random();

    if (this.gameState.wave === 1) {
      type = rand < 0.7 ? 'wyvern' : 'flock';
    } else if (this.gameState.wave <= 3) {
      if (rand < 0.5) type = 'wyvern';
      else if (rand < 0.8) type = 'flock';
      else type = 'dragonrider';
    } else if (this.gameState.wave <= 6) {
      if (rand < 0.4) type = 'wyvern';
      else if (rand < 0.7) type = 'dragonrider';
      else if (rand < 0.9) type = 'flock';
      else type = 'ballista';
    } else {
      if (rand < 0.3) type = 'wyvern';
      else if (rand < 0.5) type = 'dragonrider';
      else if (rand < 0.75) type = 'flock';
      else type = 'ballista';
    }

    const config = ENEMY_CONFIG[type.toUpperCase() as keyof typeof ENEMY_CONFIG];
    
    const x = this.cameras.main.width + 50;
    const y = Phaser.Math.Between(50, this.cameras.main.height - 50);

    const sprite = this.physics.add.sprite(x, y, `enemy-${type}`);
    sprite.setScale(config.scale);
    sprite.setTint(config.color);

    const enemy: Enemy = {
      sprite,
      type,
      health: config.health,
      maxHealth: config.health,
      speed: config.speed,
      score: config.score,
      attackTimer: config.attackRate,
      isAlive: true,
    };

    this.enemies.push(enemy);
  }

  private checkCollisions() {
    // Player projectiles vs enemies
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      let hitEnemy = false;

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (!enemy.isAlive) continue;

        const distance = Phaser.Math.Distance.Between(
          proj.sprite.x,
          proj.sprite.y,
          enemy.sprite.x,
          enemy.sprite.y
        );

        if (distance < 30) {
          this.damageEnemy(enemy, proj.damage);
          hitEnemy = true;

          if (!proj.piercing) {
            proj.sprite.destroy();
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }

      if (hitEnemy && proj.piercing) {
        // Piercing projectiles keep going but mark as hit
        proj.hasHit = true;
      }
    }

    // Enemy projectiles vs player
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const proj = this.enemyProjectiles[i];

      const distance = Phaser.Math.Distance.Between(
        proj.sprite.x,
        proj.sprite.y,
        this.player.x,
        this.player.y
      );

      if (distance < PLAYER_CONFIG.HIT_RADIUS) {
        this.damagePlayer();
        proj.sprite.destroy();
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // Enemies vs player (collision damage)
    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue;

      const distance = Phaser.Math.Distance.Between(
        enemy.sprite.x,
        enemy.sprite.y,
        this.player.x,
        this.player.y
      );

      if (distance < PLAYER_CONFIG.HIT_RADIUS + 20) {
        this.damagePlayer();
        this.damageEnemy(enemy, enemy.health); // Kill enemy on collision
      }
    }
  }

  private damageEnemy(enemy: Enemy, damage: number) {
    enemy.health -= damage;

    // Hit flash
    enemy.sprite.setTint(0xffffff);
    this.time.delayedCall(50, () => {
      const config = ENEMY_CONFIG[enemy.type.toUpperCase() as keyof typeof ENEMY_CONFIG];
      enemy.sprite.setTint(config.color);
    });

    if (enemy.health <= 0) {
      this.killEnemy(enemy);
    }
  }

  private killEnemy(enemy: Enemy) {
    enemy.isAlive = false;

    // Explosion effect
    this.explosionParticles.emitParticleAt(enemy.sprite.x, enemy.sprite.y, 10);
    
    // Screen shake
    this.cameras.main.shake(VFX_CONFIG.SCREEN_SHAKE.duration, VFX_CONFIG.SCREEN_SHAKE.intensity * 0.001);

    // Score
    const scoreGained = Math.floor(enemy.score * this.gameState.comboMultiplier);
    this.addScore(scoreGained);

    // Combo
    this.addCombo();

    // Check for upgrades
    this.checkFlameUpgrade();

    enemy.sprite.destroy();
    this.waveEnemiesKilled++;
  }

  private damagePlayer() {
    this.gameState.lives--;
    this.updateGameHUD();

    // Reset combo
    this.gameState.comboMultiplier = 1;

    // Screen shake
    this.cameras.main.shake(200, 0.01);

    // Red flash
    this.cameras.main.flash(200, 255, 0, 0);

    // Lose brood on death
    this.clearBrood();

    if (this.gameState.lives <= 0) {
      this.gameOver();
    } else {
      // Brief invulnerability
      this.player.setAlpha(0.5);
      this.time.delayedCall(1500, () => {
        this.player.setAlpha(1);
      });
    }
  }

  private clearBrood() {
    for (const member of this.broodMembers) {
      member.sprite.destroy();
    }
    this.broodMembers = [];
    this.broodSpawnCount = 0;
    this.broodGrowthCount = 0;
  }

  private addScore(points: number) {
    this.gameState.score += points;
    this.updateGameHUD();

    // Check high score
    if (this.gameState.score > this.gameState.highScore) {
      this.gameState.highScore = this.gameState.score;
      saveHighScore(this.gameState.score);
    }
  }

  private checkFlameUpgrade() {
    for (let i = 0; i < FLAME_CONFIG.UPGRADE_SCORE_THRESHOLDS.length; i++) {
      if (this.gameState.score >= FLAME_CONFIG.UPGRADE_SCORE_THRESHOLDS[i] &&
          this.gameState.flameLevel < i + 1) {
        this.upgradeFlame(i + 1);
      }
    }
  }

  private upgradeFlame(level: number) {
    if (level >= FLAME_CONFIG.TIERS.length) return;

    this.gameState.flameLevel = level;
    this.currentFlameTier = FLAME_CONFIG.TIERS[level];

    // Upgrade flash
    this.cameras.main.flash(300, 255, 150, 0);

    // TODO: Show upgrade text
  }

  private updateCameraEffects(_delta: number) {
    // Combo glow effect
    const tier = COMBO_CONFIG.FEEDBACK_TIERS.find(
      (t) => this.gameState.comboMultiplier >= t.multiplier
    );

    if (tier) {
      this.comboGlowIntensity = Phaser.Math.Linear(
        this.comboGlowIntensity,
        tier.glowIntensity,
        0.1
      );
    } else {
      this.comboGlowIntensity = Phaser.Math.Linear(this.comboGlowIntensity, 0, 0.1);
    }

    // Apply glow (simulated with camera effects)
    // In production you'd use a post-processing pipeline
  }

  private updateGameHUD() {
    updateHUD({
      score: this.gameState.score,
      lives: this.gameState.lives,
      wave: this.gameState.wave,
      combo: this.gameState.comboMultiplier,
    });
  }

  private gameOver() {
    this.gameState.isGameOver = true;

    // Save high score
    saveHighScore(this.gameState.score);

    // Show game over screen
    showGameOver(this.gameState.score, this.gameState.wave);

    // Switch to game over scene
    this.scene.start('GameOverScene');
  }

  public pauseGame() {
    this.gameState.isPaused = true;
    this.physics.pause();
  }

  public resumeGame() {
    this.gameState.isPaused = false;
    this.physics.resume();
  }

  public isPaused(): boolean {
    return this.gameState.isPaused;
  }
}
