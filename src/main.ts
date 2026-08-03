/**
 * Dragon Flight - Main Entry Point
 * A mythic dragon arcade shooter
 */

import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { GAME_CONFIG } from './config/GameConfig';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0a0a0a',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [BootScene, MainMenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
};

// Initialize the game
const game = new Phaser.Game(config);

// Global reference for debugging
(window as any).game = game;

// Handle menu interactions via DOM
document.addEventListener('DOMContentLoaded', () => {
  setupMenuHandlers();
});

function setupMenuHandlers() {
  const startBtn = document.getElementById('start-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const restartBtn = document.getElementById('restart-btn');
  const quitBtn = document.getElementById('quit-btn');
  const retryBtn = document.getElementById('retry-btn');
  const menuBtn = document.getElementById('menu-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      hideOverlay('main-menu');
      game.scene.start('GameScene');
    });
  }

  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      hideOverlay('pause-menu');
      const gameScene = game.scene.getScene('GameScene') as GameScene;
      if (gameScene) {
        gameScene.resumeGame();
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      hideOverlay('pause-menu');
      game.scene.stop('GameScene');
      game.scene.start('GameScene');
    });
  }

  if (quitBtn) {
    quitBtn.addEventListener('click', () => {
      hideOverlay('pause-menu');
      game.scene.stop('GameScene');
      game.scene.start('MainMenuScene');
      showOverlay('main-menu');
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      hideOverlay('game-over-menu');
      game.scene.stop('GameOverScene');
      game.scene.start('GameScene');
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      hideOverlay('game-over-menu');
      game.scene.stop('GameOverScene');
      game.scene.start('MainMenuScene');
      showOverlay('main-menu');
    });
  }

  // Pause key (Escape)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const gameScene = game.scene.getScene('GameScene') as GameScene;
      if (gameScene && gameScene.scene.isActive()) {
        if (!gameScene.isPaused()) {
          gameScene.pauseGame();
          showOverlay('pause-menu');
        } else {
          gameScene.resumeGame();
          hideOverlay('pause-menu');
        }
      }
    }
  });
}

export function showOverlay(id: string) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('active');
  }
}

export function hideOverlay(id: string) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('active');
  }
}

export function updateHUD(data: {
  score?: number;
  lives?: number;
  wave?: number;
  combo?: number;
}) {
  if (data.score !== undefined) {
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = `Score: ${data.score}`;
  }

  if (data.lives !== undefined) {
    const livesEl = document.getElementById('lives');
    if (livesEl) livesEl.textContent = `Lives: ${data.lives}`;
  }

  if (data.wave !== undefined) {
    const waveEl = document.getElementById('wave');
    if (waveEl) waveEl.textContent = `Wave: ${data.wave}`;
  }

  if (data.combo !== undefined) {
    const comboEl = document.getElementById('combo');
    if (comboEl) {
      if (data.combo > 1) {
        comboEl.style.display = 'block';
        comboEl.textContent = `Combo: x${data.combo.toFixed(1)}`;
      } else {
        comboEl.style.display = 'none';
      }
    }
  }
}

export function showGameOver(score: number, wave: number) {
  const highScore = getHighScore();
  
  const finalScoreEl = document.getElementById('final-score');
  const highScoreEl = document.getElementById('high-score');
  const waveReachedEl = document.getElementById('wave-reached');

  if (finalScoreEl) finalScoreEl.textContent = `Score: ${score}`;
  if (highScoreEl) highScoreEl.textContent = `High Score: ${highScore}`;
  if (waveReachedEl) waveReachedEl.textContent = `Wave Reached: ${wave}`;

  showOverlay('game-over-menu');
}

export function getHighScore(): number {
  const saved = localStorage.getItem('dragonFlightHighScore');
  return saved ? parseInt(saved, 10) : 0;
}

export function saveHighScore(score: number) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem('dragonFlightHighScore', score.toString());
  }
}
