# 🐉 Dragon Flight

A modern browser-based arcade shooter set in a dark mythic age. Control a dragon that breathes fire automatically while you master flight and positioning to survive waves of enemies.

## 🎮 Play Now

**Live Demo:** _(Deploy to GitHub Pages, Vercel, or Netlify)_

**Local Development:**
```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 🔥 Features

### Core Gameplay
- **Auto-Fire System**: Your dragon breathes fire continuously - focus on flight and positioning, not attacking
- **Progressive Difficulty**: Waves get harder with faster enemies, denser formations, and new attack patterns
- **Multiple Enemy Types**: 
  - Wyverns: Agile aerial threats
  - Dragonriders: Mounted attackers with ranged weapons
  - Ballista Towers: Stationary defenses firing arrow-storms
  - Flocks: Swarming formations

### Signature Mechanic: The Growing Brood
- Earn hatchlings that follow and fight alongside you
- They grow from hatchlings to juveniles as you progress
- Each brood member adds their own flame to your firepower
- **All brood is lost on death** - making them precious and creating emotional stakes

### Flame Upgrade System
Seven tiers of fire breath power that stack through a run:
1. Single Stream
2. Hotter Flame
3. Twin Streams
4. Wide Cone
5. Ember Burst
6. Homing Cinders
7. Piercing Dragonfire

Upgrades reset completely on death - every run starts fresh.

### Combo Multiplier
- Build up to 10x multiplier with consecutive kills
- Decays without combat
- Rewards aggressive positioning
- Increases score and provides escalating visual/audio feedback

## 🎨 Aesthetic: Ember & Ash

A near-black world lit almost entirely by your fire:
- High contrast dark background (0x0a0a0a)
- Glowing orange/gold flames (0xff6600, 0xff9933)
- Floating embers and particle effects
- Cinematic, dramatic, very readable

## 🕹️ Controls

**Desktop:**
- Arrow Keys or WASD to fly
- ESC to pause
- No attack button needed (auto-fire)

**Mobile:**
- Drag to fly
- Touch controls optimized for responsive gameplay

## 📱 PWA Support

Dragon Flight is installable on desktop and mobile:
- Offline play capability
- Native app-like experience
- No app store required

## 🛠️ Tech Stack

- **Phaser 3** - Game engine
- **TypeScript** - Type-safe game logic
- **Vite** - Fast build tool
- **PWA** - Progressive Web App support

## 🏗️ Architecture

```
src/
├── config/
│   ├── GameConfig.ts   # All game balance and tuning values
│   └── types.ts        # TypeScript interfaces
├── scenes/
│   ├── BootScene.ts    # Asset loading
│   ├── MainMenuScene.ts
│   ├── GameScene.ts    # Core gameplay
│   └── GameOverScene.ts
├── entities/           # (Future: Player, Enemy classes)
├── systems/            # (Future: Combat, Upgrade systems)
└── main.ts            # Entry point
```

### Design Principles

1. **Config-Driven**: All balance values in `GameConfig.ts` for easy tuning
2. **TypeScript Throughout**: Full type safety
3. **Separation of Concerns**: Phaser owns the canvas, HTML/CSS handles UI overlays
4. **Clean Code**: Clear modules, well-commented config objects

## 🎯 Gameplay Tips

1. **Positioning is Everything**: Since fire is automatic, success comes from smart positioning
2. **Protect Your Brood**: They amplify your power but are lost on death
3. **Combo for Score**: Chain kills to maximize your score multiplier
4. **Learn Enemy Patterns**: Each enemy type has unique behaviors
5. **Upgrade Strategically**: Different flame tiers suit different playstyles

## 🚀 Building for Production

```bash
npm run build
```

Outputs to `dist/` directory. Deploy to any static host:
- GitHub Pages
- Vercel
- Netlify
- AWS S3
- Your own server

## 🧪 Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🎵 Future Enhancements

- Audio system (flame roar, enemy screeches, combo feedback, war-drum ambience)
- More enemy types and bosses
- Additional power-ups
- Leaderboard system
- Achievements
- Mobile touch optimizations

## 📝 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

## 🙏 Credits

Built with Phaser 3 game engine.  
Original concept inspired by classic arcade shooters with modern twists.

---

**Survive the waves. Grow your brood. Master the flame.** 🔥🐉
