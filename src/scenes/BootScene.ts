/**
 * BootScene - Initial scene for loading assets and setup
 */

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // For now, we'll use Phaser's graphics for all visual elements
    // In a production game, you'd load sprite assets here
    this.load.setBaseURL('');
  }

  create() {
    // Generate placeholder graphics
    this.generatePlaceholderGraphics();
    
    // Start the main menu
    this.scene.start('MainMenuScene');
  }

  private generatePlaceholderGraphics() {
    // Dragon sprite
    const dragonGraphics = this.add.graphics();
    dragonGraphics.fillStyle(0xff6600, 1);
    dragonGraphics.fillCircle(25, 25, 20);
    dragonGraphics.fillTriangle(40, 25, 55, 15, 55, 35); // wing
    dragonGraphics.fillTriangle(-10, 25, 0, 15, 0, 35); // tail
    dragonGraphics.generateTexture('player-dragon', 60, 50);
    dragonGraphics.destroy();

    // Hatchling dragon
    const hatchlingGraphics = this.add.graphics();
    hatchlingGraphics.fillStyle(0xffaa66, 1);
    hatchlingGraphics.fillCircle(20, 20, 12);
    hatchlingGraphics.fillTriangle(28, 20, 36, 15, 36, 25);
    hatchlingGraphics.generateTexture('hatchling-dragon', 40, 40);
    hatchlingGraphics.destroy();

    // Juvenile dragon
    const juvenileGraphics = this.add.graphics();
    juvenileGraphics.fillStyle(0xff8833, 1);
    juvenileGraphics.fillCircle(22, 22, 16);
    juvenileGraphics.fillTriangle(34, 22, 45, 15, 45, 29);
    juvenileGraphics.generateTexture('juvenile-dragon', 50, 45);
    juvenileGraphics.destroy();

    // Wyvern enemy
    const wyvernGraphics = this.add.graphics();
    wyvernGraphics.fillStyle(0x884422, 1);
    wyvernGraphics.fillCircle(20, 20, 15);
    wyvernGraphics.fillTriangle(-5, 20, 5, 10, 5, 30);
    wyvernGraphics.generateTexture('enemy-wyvern', 40, 40);
    wyvernGraphics.destroy();

    // Dragonrider enemy
    const riderGraphics = this.add.graphics();
    riderGraphics.fillStyle(0x995533, 1);
    riderGraphics.fillCircle(22, 22, 18);
    riderGraphics.fillRect(20, 10, 8, 8); // rider
    riderGraphics.fillTriangle(-5, 22, 5, 12, 5, 32);
    riderGraphics.generateTexture('enemy-dragonrider', 45, 45);
    riderGraphics.destroy();

    // Ballista tower
    const ballistaGraphics = this.add.graphics();
    ballistaGraphics.fillStyle(0x665544, 1);
    ballistaGraphics.fillRect(10, 15, 30, 20);
    ballistaGraphics.fillRect(23, 5, 4, 15); // barrel
    ballistaGraphics.generateTexture('enemy-ballista', 50, 50);
    ballistaGraphics.destroy();

    // Flock bird
    const flockGraphics = this.add.graphics();
    flockGraphics.fillStyle(0x776655, 1);
    flockGraphics.fillCircle(12, 12, 8);
    flockGraphics.fillTriangle(16, 12, 22, 8, 22, 16);
    flockGraphics.generateTexture('enemy-flock', 25, 25);
    flockGraphics.destroy();

    // Flame projectile
    const flameGraphics = this.add.graphics();
    flameGraphics.fillStyle(0xff6600, 1);
    flameGraphics.fillCircle(8, 8, 6);
    flameGraphics.fillStyle(0xff9933, 1);
    flameGraphics.fillCircle(8, 8, 3);
    flameGraphics.generateTexture('flame', 16, 16);
    flameGraphics.destroy();

    // Enemy projectile (arrow)
    const arrowGraphics = this.add.graphics();
    arrowGraphics.fillStyle(0xcccccc, 1);
    arrowGraphics.fillRect(2, 5, 12, 2);
    arrowGraphics.fillTriangle(14, 6, 18, 4, 18, 8);
    arrowGraphics.generateTexture('arrow', 20, 12);
    arrowGraphics.destroy();

    // Particle textures
    const emberGraphics = this.add.graphics();
    emberGraphics.fillStyle(0xffaa44, 1);
    emberGraphics.fillCircle(4, 4, 4);
    emberGraphics.generateTexture('ember-particle', 8, 8);
    emberGraphics.destroy();

    const explosionGraphics = this.add.graphics();
    explosionGraphics.fillStyle(0xff6600, 1);
    explosionGraphics.fillCircle(8, 8, 8);
    explosionGraphics.generateTexture('explosion-particle', 16, 16);
    explosionGraphics.destroy();
  }
}
