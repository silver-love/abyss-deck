import Game from './core/game.js';
import Renderer from './ui/renderer.js';
import AudioManager from './audio.js';
import CARDS from './data/cards.js';
import ENEMIES from './data/enemies.js';
import RELICS from './data/relics.js';
import EVENTS from './data/events.js';
import POTIONS from './data/potions.js';
import CHARACTERS from './data/characters.js';
import SaveSystem from './systems/save.js';

class AbyssDeck {
  constructor() {
    this.game = new Game();
    this.audio = new AudioManager();
    this.renderer = new Renderer(this.game, this.audio);
    this.data = {
      cards: CARDS,
      enemies: ENEMIES,
      relics: RELICS,
      events: EVENTS,
      potions: POTIONS,
      characters: CHARACTERS
    };
  }

  init() {
    this.audio.init();
    SaveSystem.ensureProgressInitialized();
    this.renderer.init();
    this.game.events.on('stateChange', ({ to }) => {
      if (to === 'BATTLE') this.audio.resume();
    });
    console.log('深渊牌局：破碎轮回 - 已初始化');
    console.log(`数据加载完成: ${CARDS.length}张卡牌, ${ENEMIES.length}个敌人, ${RELICS.length}个遗物, ${EVENTS.length}个事件, ${POTIONS.length}种药水, ${CHARACTERS.length}个角色`);
  }
}

const app = new AbyssDeck();
app.init();

export default app;
