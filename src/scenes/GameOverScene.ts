/**
 * GameOverScene - Displays game over screen (handled by HTML overlay)
 */

import Phaser from 'phaser';
import { COLOR_PALETTE } from '../config/GameConfig';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    // Add dramatic falling embers
    this.add.particles(0, 0, 'ember-particle', {
      x: { min: 0, max: this.cameras.main.width },
      y: -20,
      speedY: { min: 100, max: 200 },
      speedX: { min: -30, max: 30 },
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 1, end: 0 },
      lifespan: 4000,
      frequency: 50,
      tint: COLOR_PALETTE.EMBER,
    });

    // The actual game over UI is handled by HTML overlay
  }
}
