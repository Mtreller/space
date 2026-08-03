/**
 * MainMenuScene - Displays the main menu (handled by HTML overlay)
 */

import Phaser from 'phaser';
import { COLOR_PALETTE } from '../config/GameConfig';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    // Add some ambient ember particles in the background
    this.add.particles(0, 0, 'ember-particle', {
      x: { min: 0, max: this.cameras.main.width },
      y: this.cameras.main.height + 20,
      speedY: { min: -100, max: -50 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.3, end: 0.1 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 3000,
      frequency: 100,
      tint: COLOR_PALETTE.EMBER,
    });

    // The actual menu UI is handled by HTML overlay in index.html
    // This scene just provides atmospheric background
  }

  update() {
    // Keep embers floating
  }
}
