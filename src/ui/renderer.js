import CHARACTERS from '../data/characters.js';
import CARDS from '../data/cards.js';
import ENEMIES from '../data/enemies.js';
import RELICS from '../data/relics.js';
import POTIONS from '../data/potions.js';
import SaveSystem from '../systems/save.js';

const POWER_NAMES = {
  vulnerable: '易伤', weak: '虚弱', poison: '中毒', strength: '力量',
  dexterity: '敏捷', thorns: '荆棘', flame_barrier: '火焰屏障',
  regen: '再生', metallicize: '金属化', ritual: '仪式',
  intangible: '虚无', corruption: '腐化', brutality: '残暴',
  echo: '回响', focus: '专注', focus_decay: '专注衰减',
  strength_per_turn: '力量/回合', machine_learning: '机器学习',
  machine_learning_plus: '机器学习+', hymn_of_light: '光明颂歌',
  hymn_of_light_plus: '光明颂歌+', sanctuary: '圣域',
  sanctuary_plus: '圣域+', bastion: '壁垒', bastion_plus: '壁垒+',
  no_block: '无格挡', attack_cost_reduce: '攻击消耗-1',
  accuracy: '精准', envenom: '淬毒', thousand_cuts: '千刃',
  burst: '爆发', divine_favor: '神恩', penitence: '忏悔',
  corpse_explosion: '尸爆', arcane_mastery: '奥术精通',
  resonance_strength: '共鸣强化', spell_storm: '法术风暴',
  spell_storm_plus: '法术风暴+', martyrdom: '殉道',
  martyrdom_plus: '殉道+', resurrection: '复活',
  resurrection_plus: '复活+', creative_ai: '创意AI',
  creative_ai_plus: '创意AI+', draw_reduction_next: '少抽牌',
  energy_loss_next: '少能量', play_limit_3: '限3牌',
  combo_reduce: '连击-1'
};

const POWER_DESCRIPTIONS = {
  vulnerable: '受到攻击时伤害增加50%，每回合减少1层',
  weak: '攻击造成的伤害减少25%，每回合减少1层',
  poison: '回合开始时受到等同层数的伤害，每回合减少1层',
  strength: '每层增加1点攻击伤害',
  dexterity: '每层增加1点获得的格挡',
  thorns: '受到攻击时，对攻击者造成等同层数的伤害',
  flame_barrier: '受到攻击时，对攻击者造成等同层数的伤害',
  regen: '回合开始时恢复等同层数的生命，每回合减少1层',
  metallicize: '回合结束获得等同层数的格挡',
  ritual: '每3回合获得等同层数的力量',
  intangible: '受到的任何伤害降为1点，每回合减少1层',
  corruption: '技能牌消耗变为0，但打出后消耗（移出战斗）',
  brutality: '回合开始失去等同层数的生命，获得1点力量',
  echo: '下一张打出的牌打出两次',
  focus: '每层增强1点能力牌的效果',
  focus_decay: '每回合专注减少1层',
  strength_per_turn: '回合结束获得1点力量',
  machine_learning: '回合结束增加1层专注',
  machine_learning_plus: '回合结束增加1层专注',
  hymn_of_light: '回合开始获得1点虔诚',
  hymn_of_light_plus: '回合开始获得2点虔诚',
  sanctuary: '回合开始获得等同层数的格挡',
  sanctuary_plus: '回合开始获得等同层数的格挡',
  bastion: '获得格挡时额外获得等同层数的格挡',
  bastion_plus: '获得格挡时额外获得等同层数的格挡',
  no_block: '无法获得格挡，每回合减少1层',
  attack_cost_reduce: '攻击牌消耗减少1点',
  accuracy: '连击牌伤害增加等同层数',
  envenom: '每当攻击命中时，施加1层中毒',
  thousand_cuts: '每打出一张牌，对所有敌人造成等同层数的伤害',
  burst: '下一张技能牌打出两次',
  divine_favor: '回合开始额外获得等同层数的虔诚',
  penitence: '受到伤害时获得等同层数的虔诚',
  corpse_explosion: '敌人死亡时，对其他敌人造成其最大生命等同层数的伤害',
  arcane_mastery: '共鸣牌效果增强',
  resonance_strength: '共鸣效果增强，每层增加1点共鸣',
  spell_storm: '每打出一张法术牌，对所有敌人造成等同层数的伤害',
  spell_storm_plus: '每打出一张法术牌，对所有敌人造成等同层数的伤害',
  martyrdom: '受到伤害时获得等同层数的格挡',
  martyrdom_plus: '受到伤害时获得等同层数的格挡',
  resurrection: '死亡时复活，恢复等同层数的生命',
  resurrection_plus: '死亡时复活，恢复等同层数的生命',
  creative_ai: '回合结束随机获得一张能力牌加入手牌',
  creative_ai_plus: '回合结束随机获得一张能力牌加入手牌',
  draw_reduction_next: '下回合少抽等同层数的牌',
  energy_loss_next: '下回合少获得等同层数的能量',
  play_limit_3: '本回合最多打出3张牌',
  combo_reduce: '连击层数每回合减少1'
};

const POWER_CATEGORIES = {
  vulnerable: 'debuff', weak: 'debuff', poison: 'debuff',
  strength: 'buff', dexterity: 'buff', thorns: 'buff',
  flame_barrier: 'buff', regen: 'buff', metallicize: 'buff',
  ritual: 'buff', intangible: 'buff', corruption: 'special',
  brutality: 'special', echo: 'buff', focus: 'buff',
  focus_decay: 'debuff', strength_per_turn: 'buff',
  machine_learning: 'buff', machine_learning_plus: 'buff',
  hymn_of_light: 'buff', hymn_of_light_plus: 'buff',
  sanctuary: 'buff', sanctuary_plus: 'buff',
  bastion: 'buff', bastion_plus: 'buff',
  no_block: 'debuff', attack_cost_reduce: 'buff',
  accuracy: 'buff', envenom: 'buff', thousand_cuts: 'buff',
  burst: 'buff', divine_favor: 'buff', penitence: 'buff',
  corpse_explosion: 'buff', arcane_mastery: 'buff',
  resonance_strength: 'buff', spell_storm: 'buff',
  spell_storm_plus: 'buff', martyrdom: 'buff',
  martyrdom_plus: 'buff', resurrection: 'buff',
  resurrection_plus: 'buff', creative_ai: 'buff',
  creative_ai_plus: 'buff', draw_reduction_next: 'debuff',
  energy_loss_next: 'debuff', play_limit_3: 'debuff',
  combo_reduce: 'debuff'
};

const INTENT_ICONS = {
  attack: '⚔️', defend: '🛡️', buff: '🔮', debuff: '☠️', special: '⚡'
};

const NODE_ICONS = {
  battle: '⚔️', elite: '💀', boss: '👑', shop: '💰', event: '❓', camp: '🏕️', treasure: '🎁'
};

export default class Renderer {
  constructor(game, audio) {
    this.game = game;
    this.audio = audio;
    this.app = document.getElementById('app');
    this._currentScreen = null;
    this._selectedCardIndex = -1;
    this._targetingMode = false;
    this._logListeners = [];
    this._seedInput = '';
    this._selectedCharacter = null;
    this._selectedAscension = 0;
    this._eventResultText = '';
    this._showingEventResult = false;
  }

  init() {
    this.game.events.on('stateChange', ({ to }) => this._renderScreen(to));
    this._initTooltipListeners();
    this._renderScreen(this.game.state);
  }

  _cleanup() {
    for (const { event, fn } of this._logListeners) {
      this.game.events.off(event, fn);
    }
    this._logListeners = [];
    this._selectedCardIndex = -1;
    this._targetingMode = false;
  }

  _on(event, fn) {
    this.game.events.on(event, fn);
    this._logListeners.push({ event, fn });
  }

  _renderScreen(state) {
    this._cleanup();
    this._currentScreen = state;
    this.app.innerHTML = '';
    switch (state) {
      case 'MENU': this._renderMenu(); break;
      case 'CHARACTER_SELECT': this._renderCharacterSelect(); break;
      case 'MAP': this._renderMap(); break;
      case 'BATTLE': this._renderBattle(); break;
      case 'CAMP': this._renderCamp(); break;
      case 'SHOP': this._renderShop(); break;
      case 'EVENT': this._renderEvent(); break;
      case 'TREASURE': this._renderTreasure(); break;
      case 'CARD_REWARD': this._renderCardReward(); break;
      case 'GAME_OVER': this._renderGameOver(); break;
      case 'VICTORY': this._renderVictory(); break;
      default: this.app.innerHTML = `<div class="screen active"><p>未知状态: ${state}</p></div>`;
    }
  }

  _renderMenu() {
    const screen = document.createElement('div');
    screen.className = 'screen title-screen active';
    const hasSave = SaveSystem.hasSave();
    const progress = SaveSystem.loadProgress();

    screen.innerHTML = `
      <div class="menu-bg"></div>
      <div class="menu-content">
        <h1 class="game-title">深渊牌局</h1>
        <p class="game-subtitle">破碎轮回</p>
        <div class="btn-group">
          <button class="btn btn-primary" id="btn-new-game">开始新游戏</button>
          <button class="btn" id="btn-continue" ${!hasSave ? 'disabled' : ''}>继续游戏</button>
          <button class="btn" id="btn-seed">输入种子</button>
          <button class="btn" id="btn-stats">成就/统计</button>
          <button class="btn" id="btn-settings">设置</button>
        </div>
        <div class="menu-stats">
          <span>总胜利: ${progress.totalVictories}</span>
          <span>总场次: ${progress.totalRuns}</span>
        </div>
      </div>
    `;
    this.app.appendChild(screen);

    document.getElementById('btn-new-game').addEventListener('click', () => {
      if (this.audio) this.audio.playButtonClick();
      this._seedInput = '';
      this._selectedCharacter = null;
      this._selectedAscension = 0;
      this.game.setState('CHARACTER_SELECT');
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
      if (this.audio) this.audio.playButtonClick();
      if (this.game.continueGame()) {
        this._renderScreen(this.game.state);
      }
    });

    document.getElementById('btn-seed').addEventListener('click', () => {
      if (this.audio) this.audio.playButtonClick();
      this._showSeedDialog();
    });

    document.getElementById('btn-stats').addEventListener('click', () => {
      if (this.audio) this.audio.playButtonClick();
      this._showStatsDialog();
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      if (this.audio) this.audio.playButtonClick();
      this._showSettingsDialog();
    });
  }

  _showSeedDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog">
        <div class="dialog-title">输入种子</div>
        <input type="text" class="seed-input" id="seed-input" placeholder="输入种子字符串..." maxlength="20">
        <div class="dialog-buttons">
          <button class="btn btn-primary" id="btn-seed-confirm">确认</button>
          <button class="btn" id="btn-seed-cancel">取消</button>
        </div>
      </div>
    `;
    this.app.appendChild(overlay);

    document.getElementById('btn-seed-confirm').addEventListener('click', () => {
      this._seedInput = document.getElementById('seed-input').value.trim();
      overlay.remove();
      this._selectedCharacter = null;
      this._selectedAscension = 0;
      this.game.setState('CHARACTER_SELECT');
    });

    document.getElementById('btn-seed-cancel').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _showSettingsDialog() {
    const savedVolume = parseInt(localStorage.getItem('abyss_deck_volume') || '50');
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog">
        <div class="dialog-title">设置</div>
        <div style="margin:16px 0">
          <label style="color:var(--text-secondary);display:block;margin-bottom:8px">音量: <span id="volume-value">${savedVolume}</span>%</label>
          <input type="range" id="volume-slider" min="0" max="100" value="${savedVolume}" style="width:100%;accent-color:var(--accent-gold)">
        </div>
        <div class="dialog-buttons">
          <button class="btn" id="btn-close-settings">关闭</button>
        </div>
      </div>
    `;
    this.app.appendChild(overlay);

    const slider = document.getElementById('volume-slider');
    const valueLabel = document.getElementById('volume-value');
    slider.addEventListener('input', () => {
      const vol = parseInt(slider.value);
      valueLabel.textContent = vol;
      localStorage.setItem('abyss_deck_volume', vol.toString());
      if (this.audio) this.audio.volume = vol / 100;
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _showStatsDialog() {
    const progress = SaveSystem.loadProgress();
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog" style="max-width:600px">
        <div class="dialog-title">成就与统计</div>
        <div class="stats-grid">
          <div class="stat-item"><span class="stat-label">总胜利</span><span class="stat-value">${progress.totalVictories}</span></div>
          <div class="stat-item"><span class="stat-label">总场次</span><span class="stat-value">${progress.totalRuns}</span></div>
          <div class="stat-item"><span class="stat-label">击杀敌人</span><span class="stat-value">${progress.totalEnemiesKilled}</span></div>
          <div class="stat-item"><span class="stat-label">获得金币</span><span class="stat-value">${progress.totalGoldEarned}</span></div>
        </div>
        <div class="dialog-title" style="margin-top:16px;font-size:1.1rem">角色记录</div>
        <div class="char-records">
          ${CHARACTERS.map(ch => {
            const hi = progress.highestAscension[ch.id] || 0;
            const wins = progress.characterVictories[ch.id] || 0;
            return `<div class="char-record"><span>${ch.name}</span><span>最高难度: N${hi}</span><span>胜利: ${wins}</span></div>`;
          }).join('')}
        </div>
        <div class="dialog-buttons" style="margin-top:16px">
          <button class="btn" id="btn-reset-progress" style="border-color:var(--hp-red);color:var(--hp-red)">重置进度</button>
          <button class="btn" id="btn-close-stats">关闭</button>
        </div>
      </div>
    `;
    this.app.appendChild(overlay);

    document.getElementById('btn-close-stats').addEventListener('click', () => overlay.remove());

    document.getElementById('btn-reset-progress').addEventListener('click', () => {
      if (confirm('确定要重置所有进度吗？此操作不可撤销！')) {
        SaveSystem.resetProgress();
        overlay.remove();
        this._renderScreen('MENU');
      }
    });
  }

  _renderCharacterSelect() {
    const screen = document.createElement('div');
    screen.className = 'screen character-select-screen active';

    let cardsHtml = '';
    for (const ch of CHARACTERS) {
      const hiAsc = SaveSystem.getHighestAscension(ch.id);
      const startRelic = RELICS.find(r => r.id === ch.startingRelic);
      cardsHtml += `
        <div class="character-card" data-char="${ch.id}">
          <div class="character-name">${ch.name}</div>
          <div class="character-hp">❤️ ${ch.maxHp}</div>
          <div class="character-mechanic">${ch.mechanic.name}</div>
          <div class="character-mechanic-desc">${ch.mechanic.description}</div>
          <div class="character-description">${ch.description}</div>
          <div class="character-relic">遗物: ${startRelic ? startRelic.name : ch.startingRelic}</div>
          ${hiAsc > 0 ? `<div class="character-asc">最高难度: N${hiAsc}</div>` : ''}
        </div>
      `;
    }

    screen.innerHTML = `
      <h2 style="color:var(--accent-gold);margin-bottom:24px;font-family:var(--font-title)">选择角色</h2>
      ${this._seedInput ? `<p style="color:var(--text-secondary);margin-bottom:12px">种子: ${this._seedInput}</p>` : ''}
      <div class="character-grid" id="character-grid">${cardsHtml}</div>
      <div class="ascension-select" id="ascension-select" style="display:none;margin-top:20px">
        <span style="color:var(--text-secondary);margin-right:12px">难度等级:</span>
        <div class="ascension-buttons" id="ascension-buttons"></div>
      </div>
      <button class="btn btn-primary" id="btn-confirm-char" style="margin-top:24px;display:none">确认</button>
      <button class="btn" id="btn-back-menu" style="margin-top:12px">返回</button>
    `;
    this.app.appendChild(screen);

    screen.querySelectorAll('.character-card').forEach(card => {
      card.addEventListener('click', () => {
        screen.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this._selectedCharacter = card.dataset.char;

        const ascSelect = document.getElementById('ascension-select');
        const confirmBtn = document.getElementById('btn-confirm-char');
        ascSelect.style.display = 'flex';
        confirmBtn.style.display = 'inline-flex';

        const hiAsc = Math.min(SaveSystem.getHighestAscension(this._selectedCharacter), 10);
        const ascBtns = document.getElementById('ascension-buttons');
        let btnsHtml = '';
        for (let i = 0; i <= hiAsc; i++) {
          const name = SaveSystem.getAscensionName(i);
          btnsHtml += `<button class="btn asc-btn ${i === this._selectedAscension ? 'btn-primary' : ''}" data-asc="${i}" style="min-width:60px;font-size:0.8rem;padding:6px 10px">${name}</button>`;
        }
        ascBtns.innerHTML = btnsHtml;

        ascBtns.querySelectorAll('.asc-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            this._selectedAscension = parseInt(btn.dataset.asc);
            ascBtns.querySelectorAll('.asc-btn').forEach(b => b.classList.remove('btn-primary'));
            btn.classList.add('btn-primary');
          });
        });
      });
    });

    document.getElementById('btn-confirm-char').addEventListener('click', () => {
      if (this._selectedCharacter) {
        if (this.audio) this.audio.playButtonClick();
        this.game.newGame(this._selectedCharacter, this._seedInput || null, this._selectedAscension);
      }
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.game.setState('MENU');
    });
  }

  _renderMap() {
    const screen = document.createElement('div');
    screen.className = 'screen map-screen active';
    const p = this.game.player;
    const map = this.game.getOrGenerateMap();
    const mapGen = this.game.mapGenerator;
    const available = mapGen.getAvailableNodes(map);

    const availableSet = new Set(available.map(n => `${n.row}-${n.col}`));

    let mapHtml = '';
    for (let i = map.floors.length - 1; i >= 0; i--) {
      const floor = map.floors[i];
      mapHtml += `<div class="map-row">`;
      for (const node of floor.nodes) {
        const isCurrent = i === map.currentFloor.row && node.col === map.currentFloor.col;
        const isVisited = node.visited;
        const isAvailable = availableSet.has(`${node.row}-${node.col}`);
        const typeIcon = NODE_ICONS[node.type] || '•';
        const cls = `map-node ${node.type} ${isCurrent ? 'current' : ''} ${isVisited ? 'visited' : ''} ${isAvailable ? 'available' : ''}`;
        mapHtml += `<div class="${cls}" data-floor="${i}" data-col="${node.col}" data-type="${node.type}">${typeIcon}</div>`;
      }
      mapHtml += `</div>`;
    }

    const layerName = map.layerName || `第${this.game.act}层`;

    screen.innerHTML = `
      <div class="top-bar">
        <div class="top-bar-left">
          <span class="stat stat-hp">❤️ ${p.hp}/${p.maxHp}</span>
          <span class="stat stat-gold">💰 ${p.gold}</span>
          <span class="floor-indicator">${layerName} - 第${this.game.act}幕</span>
          ${this.game.ascension > 0 ? `<span class="asc-indicator">N${this.game.ascension}</span>` : ''}
        </div>
        <div class="top-bar-right">
          <div class="potion-bar">${this._renderPotions(p.potions)}</div>
          <div class="relic-bar">${this._renderRelics(p.relics)}</div>
          <button class="btn btn-small" id="btn-view-deck" title="查看牌组">📚</button>
          <button class="btn btn-small" id="btn-view-relics" title="查看遗物">🏺</button>
          <button class="btn btn-small" id="btn-abandon" style="border-color:var(--hp-red);color:var(--hp-red)" title="放弃本局">放弃本局</button>
        </div>
      </div>
      <div class="map-container" id="map-container">
        <div class="map-content" id="map-content">${mapHtml}</div>
      </div>
    `;
    this.app.appendChild(screen);

    requestAnimationFrame(() => {
      this._drawMapConnections(map);
    });

    screen.querySelectorAll('.map-node.available').forEach(node => {
      node.addEventListener('click', () => {
        const row = parseInt(node.dataset.floor);
        const col = parseInt(node.dataset.col);
        const type = node.dataset.type;

        mapGen.moveToNode(map, row, col);
        this.game.enterNode(row, col);
      });
    });

    const deckBtn = document.getElementById('btn-view-deck');
    if (deckBtn) deckBtn.addEventListener('click', () => this._showDeckView());

    const relicBtn = document.getElementById('btn-view-relics');
    if (relicBtn) relicBtn.addEventListener('click', () => this._showRelicView());

    const abandonBtn = document.getElementById('btn-abandon');
    if (abandonBtn) abandonBtn.addEventListener('click', () => this._showAbandonConfirm());
  }

  _showAbandonConfirm() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog">
        <div class="dialog-title">放弃本局</div>
        <p style="color:var(--text-secondary);text-align:center;margin-bottom:16px">确定要放弃当前游戏吗？进度将丢失！</p>
        <div class="dialog-buttons">
          <button class="btn" id="btn-abandon-confirm" style="border-color:var(--hp-red);color:var(--hp-red)">确定放弃</button>
          <button class="btn" id="btn-abandon-cancel">取消</button>
        </div>
      </div>
    `;
    this.app.appendChild(overlay);

    overlay.querySelector('#btn-abandon-confirm').addEventListener('click', () => {
      SaveSystem.deleteSave();
      this.game.battle = null;
      this.game.player = null;
      this.game.map = null;
      overlay.remove();
      this._hideTooltip();
      this.game.setState('MENU');
    });

    overlay.querySelector('#btn-abandon-cancel').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _drawMapConnections(map) {
    const mapContent = document.getElementById('map-content');
    if (!mapContent) return;

    const existingSvg = mapContent.querySelector('.map-connections-svg');
    if (existingSvg) existingSvg.remove();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('map-connections-svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const contentRect = mapContent.getBoundingClientRect();

    const nodePositions = {};
    mapContent.querySelectorAll('.map-node').forEach(el => {
      const floor = el.dataset.floor;
      const col = el.dataset.col;
      const rect = el.getBoundingClientRect();
      nodePositions[`${floor}-${col}`] = {
        x: rect.left + rect.width / 2 - contentRect.left,
        y: rect.top + rect.height / 2 - contentRect.top
      };
    });

    for (const floor of map.floors) {
      for (const node of floor.nodes) {
        for (const conn of node.connections) {
          const fromKey = `${node.row}-${node.col}`;
          const toKey = `${conn.row}-${conn.col}`;
          const from = nodePositions[fromKey];
          const to = nodePositions[toKey];

          if (from && to) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);

            const targetFloor = map.floors[conn.row];
            const targetNode = targetFloor ? targetFloor.nodes.find(n => n.col === conn.col) : null;
            const isVisited = targetNode && targetNode.visited;
            line.setAttribute('stroke', isVisited ? 'rgba(212, 168, 67, 0.15)' : 'rgba(212, 168, 67, 0.3)');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', isVisited ? '4,4' : 'none');
            svg.appendChild(line);
          }
        }
      }
    }

    mapContent.insertBefore(svg, mapContent.firstChild);
  }

  _renderBattle() {
    const screen = document.createElement('div');
    screen.className = 'screen battle-screen active';
    screen.innerHTML = `
      <div class="top-bar" id="battle-top-bar"></div>
      <div class="enemy-area" id="enemy-area"></div>
      <div class="player-area" id="player-area"></div>
      <div class="middle-bar" id="middle-bar"></div>
      <div class="hand-container" id="hand-container"></div>
      <div class="battle-log" id="battle-log"></div>
    `;
    this.app.appendChild(screen);

    const battle = this.game.battle;
    if (!battle || battle.enemies.length === 0) {
      this._startNewBattle();
    }

    this._updateBattleUI();

    this._on('battleLog', () => this._updateBattleLog());
    this._on('enemyDamaged', ({ enemy, damage }) => this._showDamageNumber(enemy, 'enemy', damage));
    this._on('playerDamaged', ({ amount }) => this._showDamageNumber(null, 'player', amount));
    this._on('playerHealed', ({ amount }) => this._showDamageNumber(null, 'heal', amount));
    this._on('blockGained', ({ amount }) => this._showDamageNumber(null, 'block', amount));
    this._on('cardPlayed', ({ cardData, handIndex }) => {
      if (this.audio) {
        if (cardData.type === 'attack') this.audio.playAttack();
        else if (cardData.type === 'skill') this.audio.playBlock();
        else if (cardData.type === 'power') this.audio.playPower();
      }
      this._animateCardPlay(handIndex, cardData.type);
    });
    this._on('cardDrawn', () => {
      if (this.audio) this.audio.playCardDraw();
      this._updateBattleUI();
    });
    this._on('playerTurnStart', () => this._updateBattleUI());
    this._on('enemyTurnStart', () => {
      this._updateBattleUI();
      setTimeout(() => this._updateBattleUI(), 600);
    });
    this._on('battleEnd', ({ victory, rewards }) => {
      if (this.audio) {
        if (victory) this.audio.playVictory();
        else this.audio.playGameOver();
      }
      setTimeout(() => {
        if (victory) {
          this.game.handleBattleVictory(rewards);
        } else {
          this.game.handleBattleDefeat();
        }
      }, 500);
    });
  }

  _startNewBattle() {
    const battle = this.game.battle;
    if (!battle) return;
    const enemyIds = this.game.pendingBattleEnemies || battle.generateEncounter(this.game.floor || 1, this.game.act || 1);
    this.game.pendingBattleEnemies = null;
    battle.startBattle(enemyIds);
    if (this.audio) this.audio.resume();
  }

  _updateBattleUI() {
    const battle = this.game.battle;
    if (!battle) return;
    const p = this.game.player;

    const topBar = document.getElementById('battle-top-bar');
    if (topBar) {
      topBar.innerHTML = `
        <div class="top-bar-left">
          <span class="stat stat-hp">❤️ ${p.hp}/${p.maxHp}</span>
          <span class="stat stat-block">🛡️ ${p.block}</span>
          <span class="stat stat-gold">💰 ${p.gold}</span>
        </div>
        <div class="top-bar-right">
          <div class="potion-bar" id="potion-bar">${this._renderPotions(p.potions)}</div>
          <div class="relic-bar">${this._renderRelics(p.relics)}</div>
          <button class="btn btn-small" id="btn-battle-abandon" style="border-color:var(--hp-red);color:var(--hp-red)">放弃</button>
        </div>
      `;
      this._bindPotionEvents();

      const battleAbandonBtn = document.getElementById('btn-battle-abandon');
      if (battleAbandonBtn) {
        battleAbandonBtn.addEventListener('click', () => this._showAbandonConfirm());
      }
    }

    const enemyArea = document.getElementById('enemy-area');
    if (enemyArea) {
      enemyArea.innerHTML = this._renderEnemies(battle.enemies);
      this._bindEnemyEvents();
    }

    const playerArea = document.getElementById('player-area');
    if (playerArea) {
      playerArea.innerHTML = `
        <div class="player-stats">
          <div class="energy-orb">${p.energy}/${p.maxEnergy}</div>
          <div class="player-powers">${this._renderPlayerPowers(p)}</div>
          <div class="player-mechanic">${this._renderMechanic(p)}</div>
          ${this._hasActivePowers(p) ? `<div class="power-area-indicator clickable" id="power-area-btn" title="查看能力详情">⚡</div>` : ''}
        </div>
      `;
      const powerAreaBtn = document.getElementById('power-area-btn');
      if (powerAreaBtn) {
        powerAreaBtn.addEventListener('click', () => this._showPileView('powers'));
      }
    }

    const middleBar = document.getElementById('middle-bar');
    if (middleBar) {
      const canEndTurn = battle.isPlayerTurn && !battle.gameOver;
      middleBar.innerHTML = `
        <div class="middle-bar-content">
          <div class="deck-counter clickable" id="draw-counter" title="查看抽牌堆">📚 ${p.drawPile.length}</div>
          <div class="player-powers-bar">${this._renderPlayerPowersBar(p)}</div>
          <button class="btn btn-primary end-turn-btn" id="btn-end-turn" ${!canEndTurn ? 'disabled' : ''}>
            ${canEndTurn ? '结束回合' : '敌方回合...'}
          </button>
          <div class="deck-counter clickable" id="discard-counter" title="查看弃牌堆">🗑️ ${p.discardPile.length}</div>
        </div>
      `;
      const endBtn = document.getElementById('btn-end-turn');
      if (endBtn && canEndTurn) {
        endBtn.addEventListener('click', () => {
          if (battle.isPlayerTurn && !battle.gameOver) {
            this._selectedCardIndex = -1;
            this._targetingMode = false;
            battle.endPlayerTurn();
            this._updateBattleUI();
          }
        });
      }

      const drawCounter = document.getElementById('draw-counter');
      if (drawCounter) {
        drawCounter.addEventListener('click', () => this._showPileView('draw'));
      }

      const discardCounter = document.getElementById('discard-counter');
      if (discardCounter) {
        discardCounter.addEventListener('click', () => this._showPileView('discard'));
      }
    }

    const handContainer = document.getElementById('hand-container');
    if (handContainer) {
      handContainer.innerHTML = this._renderHand(p.hand, battle);
      this._bindCardEvents();
    }

    this._updateBattleLog();
  }

  _renderEnemies(enemies) {
    let html = '';
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.hp <= 0) continue;
      const hpPct = Math.max(0, (e.hp / e.maxHp) * 100);
      const intent = e.intent;
      const intentIcon = intent ? INTENT_ICONS[intent.intent] || '❓' : '';
      const intentText = intent ? this._getIntentText(intent) : '';
      const intentClass = intent ? intent.intent : '';
      const targeted = this._targetingMode ? 'targetable' : '';

      let powersHtml = '';
      for (const [pid, stacks] of Object.entries(e.powers)) {
        if (stacks !== 0) {
          powersHtml += this._renderPowerIcon(pid, stacks, false, true);
        }
      }

      html += `
        <div class="enemy ${targeted}" data-enemy-index="${i}">
          <div class="enemy-intent ${intentClass}">${intentIcon} ${intentText}</div>
          <div class="enemy-name">${e.name}</div>
          <div class="hp-bar"><div class="hp-bar-fill" style="width:${hpPct}%"></div></div>
          <div class="enemy-hp-text">${e.hp}/${e.maxHp}</div>
          ${e.block > 0 ? `<div class="enemy-block">🛡️${e.block}</div>` : ''}
          <div class="enemy-powers">${powersHtml}</div>
        </div>
      `;
    }
    return html;
  }

  _getIntentText(intent) {
    switch (intent.intent) {
      case 'attack': return `${intent.value}`;
      case 'defend': return `${intent.value}`;
      case 'buff': return intent.name || '强化';
      case 'debuff': return intent.name || '削弱';
      case 'special': return intent.name || '特殊';
      default: return '';
    }
  }

  _renderHand(hand, battle) {
    let html = '';
    const handSize = hand.length;
    for (let i = 0; i < handSize; i++) {
      const card = hand[i];
      const cardData = this.game.getCardData(card);
      if (!cardData) continue;

      const canPlay = battle.canPlayCard(i);
      const needsTarget = battle.cardNeedsTarget(i);
      const isSelected = this._selectedCardIndex === i;
      const playableClass = canPlay ? 'playable' : 'unplayable';
      const selectedClass = isSelected ? 'selected' : '';

      let cost = cardData.cost;
      if (cost === -1) cost = 'X';
      if (typeof cost === 'number' && cardData.type === 'attack' && this.game.player.powers.attack_cost_reduce) {
        cost = Math.max(0, cost - this.game.player.powers.attack_cost_reduce);
      }
      if (this.game.player.powers.corruption && cardData.type === 'skill') {
        cost = 0;
      }
      if (this.game.hasRelic('cracked_core') && !battle.firstSkillPlayedThisCombat && cardData.type === 'skill') {
        cost = 0;
      }

      const typeColors = {
        attack: 'card-attack', skill: 'card-skill', power: 'card-power',
        curse: 'card-curse', status: 'card-status'
      };
      const typeClass = typeColors[cardData.type] || '';

      const angle = handSize > 1 ? (i - (handSize - 1) / 2) * 5 : 0;
      const yOffset = Math.abs(i - (handSize - 1) / 2) * 8;

      html += `
        <div class="card ${playableClass} ${selectedClass} ${typeClass}" 
             data-hand-index="${i}" 
             data-needs-target="${needsTarget}"
             data-rarity="${cardData.rarity}"
             data-type="${cardData.type}"
             style="transform: rotate(${angle}deg) translateY(${yOffset}px)">
          <div class="card-cost">${cost}</div>
          <div class="card-name">${cardData.name}${cardData.upgraded ? '+' : ''}</div>
          <div class="card-type">${this._getTypeName(cardData.type)}</div>
          <div class="card-description">${cardData.description}</div>
          ${cardData.exhaust ? '<div class="card-exhaust">消耗</div>' : ''}
        </div>
      `;
    }
    return html;
  }

  _getTypeName(type) {
    return { attack: '攻击', skill: '技能', power: '能力', curse: '诅咒', status: '状态' }[type] || type;
  }

  _renderRelics(relics) {
    let html = '';
    for (const r of relics) {
      const relic = RELICS.find(rl => rl.id === r.id);
      if (!relic) continue;
      html += `<div class="relic-icon js-tip" data-tip-type="relic" data-tip-id="${relic.id}">${relic.name.substring(0, 2)}</div>`;
    }
    return html;
  }

  _renderPotions(potions) {
    let html = '';
    for (let i = 0; i < potions.length; i++) {
      const pot = POTIONS.find(p => p.id === potions[i].id);
      if (!pot) continue;
      html += `<div class="potion-icon js-tip" data-potion-index="${i}" data-tip-type="potion" data-tip-id="${pot.id}">${pot.name.substring(0, 2)}</div>`;
    }
    return html;
  }

  _renderPlayerPowers(p) {
    let html = '';
    const important = ['vulnerable', 'weak', 'strength', 'dexterity', 'intangible', 'no_block'];
    for (const pid of important) {
      if (p.powers[pid] && p.powers[pid] !== 0) {
        html += this._renderPowerIcon(pid, p.powers[pid]);
      }
    }
    return html;
  }

  _renderPlayerPowersBar(p) {
    let html = '';
    for (const [pid, stacks] of Object.entries(p.powers)) {
      if (stacks === 0 || pid.startsWith('_')) continue;
      html += this._renderPowerIcon(pid, stacks, true);
    }
    return html;
  }

  _renderMechanic(p) {
    const charId = p.characterId;
    if (charId === 'ironclad') return `<span class="mechanic-indicator js-tip" data-tip-type="mechanic" data-tip-id="fury">🔥${p.fury}</span>`;
    if (charId === 'arcanist') return `<span class="mechanic-indicator js-tip" data-tip-type="mechanic" data-tip-id="resonance">✨${p.resonance}</span>`;
    if (charId === 'shadow_blade') return `<span class="mechanic-indicator js-tip" data-tip-type="mechanic" data-tip-id="combo">⚡${p.combo}</span>`;
    if (charId === 'hierophant') return `<span class="mechanic-indicator js-tip" data-tip-type="mechanic" data-tip-id="devotion">🙏${p.devotion}</span>`;
    return '';
  }

  _hasActivePowers(p) {
    for (const [pid, stacks] of Object.entries(p.powers)) {
      if (stacks !== 0 && !pid.startsWith('_')) return true;
    }
    return false;
  }

  _renderPowerIcon(pid, stacks, small = false, tipBelow = false) {
    const name = POWER_NAMES[pid] || pid;
    const desc = POWER_DESCRIPTIONS[pid] || '';
    const category = POWER_CATEGORIES[pid] || 'special';
    const cls = small ? 'power-icon-sm' : 'power-icon';
    const displayName = name.length > 3 ? name.substring(0, 2) : name;
    return `<span class="${cls} power-tooltip ${category}" data-pid="${pid}" data-pstacks="${stacks}">${displayName}${stacks > 0 ? stacks : ''}</span>`;
  }

  _initTooltipListeners() {
    document.addEventListener('mouseover', (e) => {
      const powerEl = e.target.closest('.power-tooltip');
      if (powerEl) {
        const pid = powerEl.dataset.pid;
        if (!pid) return;
        const name = POWER_NAMES[pid] || pid;
        const desc = POWER_DESCRIPTIONS[pid] || '';
        const stacks = parseInt(powerEl.dataset.pstacks) || 0;
        const category = POWER_CATEGORIES[pid] || 'special';
        this._showTooltip(powerEl, name, desc, stacks, category);
        return;
      }
      const tipEl = e.target.closest('.js-tip');
      if (tipEl) {
        const tipType = tipEl.dataset.tipType;
        const tipId = tipEl.dataset.tipId;
        if (tipType === 'relic') {
          const relic = RELICS.find(r => r.id === tipId);
          if (relic) {
            this._showTooltip(tipEl, relic.name, relic.description, null, 'special');
          }
        } else if (tipType === 'potion') {
          const pot = POTIONS.find(p => p.id === tipId);
          if (pot) {
            this._showTooltip(tipEl, pot.name, pot.description, null, 'buff');
          }
        } else if (tipType === 'mechanic') {
          const MECHANIC_INFO = {
            fury: { name: '战意', desc: '每点战意使攻击牌伤害增加1点。部分卡牌效果与战意层数相关。' },
            resonance: { name: '共鸣', desc: '共鸣层数影响法术牌的效果强度。部分卡牌消耗共鸣产生强力效果。' },
            combo: { name: '连击', desc: '每打出一张攻击牌，连击+1。连击层数影响部分攻击牌的额外效果。回合开始时连击重置。' },
            devotion: { name: '虔诚', desc: '虔诚是祭司的核心资源，用于施放神圣法术和触发圣礼效果。' }
          };
          const info = MECHANIC_INFO[tipId];
          if (info) {
            this._showTooltip(tipEl, info.name, info.desc, null, 'buff');
          }
        }
      }
    });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('.power-tooltip') || e.target.closest('.js-tip');
      if (el) this._hideTooltip();
    });
  }

  _showTooltip(anchor, name, desc, stacks, category) {
    this._hideTooltip();
    const tip = document.createElement('div');
    tip.className = 'js-tooltip';
    tip.innerHTML = `
      <div class="tooltip-name ${category}">${name}</div>
      ${desc ? `<div class="tooltip-desc">${desc}</div>` : ''}
      ${stacks !== null ? `<div class="tooltip-stacks">层数: ${stacks}</div>` : ''}
    `;
    document.body.appendChild(tip);

    const rect = anchor.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    let top = rect.top - tipRect.height - 8;

    if (top < 4) {
      top = rect.bottom + 8;
    }
    if (left < 4) left = 4;
    if (left + tipRect.width > window.innerWidth - 4) {
      left = window.innerWidth - tipRect.width - 4;
    }

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    this._currentTooltip = tip;
  }

  _hideTooltip() {
    if (this._currentTooltip) {
      this._currentTooltip.remove();
      this._currentTooltip = null;
    }
  }

  _showPileView(type) {
    const p = this.game.player;
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    let title = '';
    let cardsHtml = '';

    if (type === 'draw') {
      title = `抽牌堆 (${p.drawPile.length}张)`;
      for (const card of p.drawPile) {
        const cd = this.game.getCardData(card);
        if (!cd) continue;
        const typeColors = { attack: 'card-attack', skill: 'card-skill', power: 'card-power', curse: 'card-curse', status: 'card-status' };
        const typeClass = typeColors[cd.type] || '';
        cardsHtml += `
          <div class="card ${typeClass}" style="cursor:default;transform:none">
            <div class="card-cost">${cd.cost}</div>
            <div class="card-name">${cd.name}${card.upgraded ? '+' : ''}</div>
            <div class="card-type">${this._getTypeName(cd.type)}</div>
            <div class="card-description">${cd.description}</div>
          </div>
        `;
      }
    } else if (type === 'discard') {
      title = `弃牌堆 (${p.discardPile.length}张)`;
      for (const card of p.discardPile) {
        const cd = this.game.getCardData(card);
        if (!cd) continue;
        const typeColors = { attack: 'card-attack', skill: 'card-skill', power: 'card-power', curse: 'card-curse', status: 'card-status' };
        const typeClass = typeColors[cd.type] || '';
        cardsHtml += `
          <div class="card ${typeClass}" style="cursor:default;transform:none">
            <div class="card-cost">${cd.cost}</div>
            <div class="card-name">${cd.name}${card.upgraded ? '+' : ''}</div>
            <div class="card-type">${this._getTypeName(cd.type)}</div>
            <div class="card-description">${cd.description}</div>
          </div>
        `;
      }
    } else if (type === 'powers') {
      title = '能力详情';
      let powersHtml = '';
      for (const [pid, stacks] of Object.entries(p.powers)) {
        if (stacks === 0 || pid.startsWith('_')) continue;
        const name = POWER_NAMES[pid] || pid;
        const desc = POWER_DESCRIPTIONS[pid] || '';
        const category = POWER_CATEGORIES[pid] || 'special';
        const colorStyle = category === 'buff' ? 'color:var(--hp-green)' : category === 'debuff' ? 'color:var(--hp-red)' : 'color:var(--accent-blue)';
        powersHtml += `
          <div class="power-detail-item">
            <div class="power-detail-name" style="${colorStyle}">${name}</div>
            <div class="power-detail-stacks">层数: ${stacks}</div>
            ${desc ? `<div style="color:var(--text-secondary);font-size:0.75rem;margin-top:2px;line-height:1.3">${desc}</div>` : ''}
          </div>
        `;
      }
      cardsHtml = powersHtml || '<p style="color:var(--text-secondary)">没有激活的能力</p>';
    }

    overlay.innerHTML = `
      <div class="dialog" style="max-width:800px;max-height:80vh;overflow-y:auto">
        <div class="dialog-title">${title}</div>
        <div class="reward-container">${cardsHtml || '<p style="color:var(--text-secondary)">空</p>'}</div>
        <button class="btn" id="btn-close-pile" style="margin-top:12px">关闭</button>
      </div>
    `;

    this.app.appendChild(overlay);

    document.getElementById('btn-close-pile').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _bindCardEvents() {
    document.querySelectorAll('.card.playable').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(card.dataset.handIndex);
        const battle = this.game.battle;
        if (!battle || !battle.isPlayerTurn || battle.gameOver) return;

        const needsTarget = card.dataset.needsTarget === 'true';

        if (needsTarget) {
          if (this._selectedCardIndex === idx) {
            this._selectedCardIndex = -1;
            this._targetingMode = false;
          } else {
            this._selectedCardIndex = idx;
            this._targetingMode = true;
          }
          this._updateBattleUI();
        } else {
          this._selectedCardIndex = -1;
          this._targetingMode = false;
          const aliveEnemies = battle.enemies.filter(e => e.hp > 0);
          const targetIdx = aliveEnemies.length === 1 ? battle.enemies.indexOf(aliveEnemies[0]) : 0;
          battle.playCard(idx, targetIdx);
          this._updateBattleUI();
        }
      });

      card.addEventListener('mousedown', (e) => {
        this._startDrag(e, card);
      });

      card.addEventListener('touchstart', (e) => {
        this._startDrag(e, card);
      }, { passive: false });
    });
  }

  _startDrag(e, cardEl) {
    const idx = parseInt(cardEl.dataset.handIndex);
    const battle = this.game.battle;
    if (!battle || !battle.isPlayerTurn || battle.gameOver) return;

    const needsTarget = cardEl.dataset.needsTarget === 'true';
    if (!needsTarget) return;

    const isTouch = e.type === 'touchstart';
    if (isTouch) e.preventDefault();

    this._dragData = {
      cardIndex: idx,
      startX: isTouch ? e.touches[0].clientX : e.clientX,
      startY: isTouch ? e.touches[0].clientY : e.clientY,
      dragging: false,
      cardEl: cardEl
    };

    const onMove = (ev) => {
      const cx = isTouch ? ev.touches[0].clientX : ev.clientX;
      const cy = isTouch ? ev.touches[0].clientY : ev.clientY;
      const dx = cx - this._dragData.startX;
      const dy = cy - this._dragData.startY;

      if (!this._dragData.dragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        this._dragData.dragging = true;
        this._selectedCardIndex = idx;
        this._targetingMode = true;
        this._updateBattleUI();
      }

      if (this._dragData.dragging) {
        const enemyEl = this._getEnemyAtPoint(cx, cy);
        document.querySelectorAll('.enemy').forEach(el => el.classList.remove('drag-highlight'));
        if (enemyEl) enemyEl.classList.add('drag-highlight');
      }
    };

    const onEnd = (ev) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);

      document.querySelectorAll('.enemy').forEach(el => el.classList.remove('drag-highlight'));

      if (this._dragData && this._dragData.dragging) {
        const cx = isTouch ? ev.changedTouches[0].clientX : ev.clientX;
        const cy = isTouch ? ev.changedTouches[0].clientY : ev.clientY;
        const enemyEl = this._getEnemyAtPoint(cx, cy);

        if (enemyEl) {
          const targetIdx = parseInt(enemyEl.dataset.enemyIndex);
          battle.playCard(this._dragData.cardIndex, targetIdx);
          this._selectedCardIndex = -1;
          this._targetingMode = false;
          this._updateBattleUI();
        } else {
          this._selectedCardIndex = -1;
          this._targetingMode = false;
          this._updateBattleUI();
        }
      }

      this._dragData = null;
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }

  _getEnemyAtPoint(x, y) {
    const enemies = document.querySelectorAll('.enemy');
    for (const el of enemies) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return el;
      }
    }
    return null;
  }

  _bindEnemyEvents() {
    document.querySelectorAll('.enemy').forEach(enemyEl => {
      enemyEl.addEventListener('click', () => {
        if (!this._targetingMode || this._selectedCardIndex < 0) return;
        const battle = this.game.battle;
        if (!battle || !battle.isPlayerTurn || battle.gameOver) return;

        const targetIdx = parseInt(enemyEl.dataset.enemyIndex);
        battle.playCard(this._selectedCardIndex, targetIdx);
        this._selectedCardIndex = -1;
        this._targetingMode = false;
        this._updateBattleUI();
      });
    });
  }

  _bindPotionEvents() {
    document.querySelectorAll('.potion-icon').forEach(el => {
      el.addEventListener('click', () => {
        const battle = this.game.battle;
        if (!battle || !battle.isPlayerTurn || battle.gameOver) return;
        const idx = parseInt(el.dataset.potionIndex);
        const potion = this.game.player.potions[idx];
        if (!potion) return;
        const potData = POTIONS.find(p => p.id === potion.id);
        if (!potData) return;

        if (potData.effect.target === 'single_enemy') {
          const aliveEnemies = battle.enemies.filter(e => e.hp > 0);
          if (aliveEnemies.length >= 1) {
            battle.usePotion(idx, battle.enemies.indexOf(aliveEnemies[0]));
          }
        } else {
          battle.usePotion(idx, -1);
        }
        this._updateBattleUI();
      });
    });
  }

  _updateBattleLog() {
    const logEl = document.getElementById('battle-log');
    if (!logEl) return;
    const battle = this.game.battle;
    if (!battle) return;
    const logs = battle.battleLog.slice(-10);
    logEl.innerHTML = logs.map(l => `<div class="log-entry">${l}</div>`).join('');
    logEl.scrollTop = logEl.scrollHeight;
  }

  _showDamageNumber(target, type, amount) {
    const screen = document.querySelector('.battle-screen');
    if (!screen) return;

    const floater = document.createElement('div');
    if (type === 'heal') {
      floater.className = 'damage-number heal-number';
      floater.textContent = amount != null ? `+${amount}` : '+';
    } else if (type === 'block') {
      floater.className = 'damage-number block-number';
      floater.textContent = amount != null ? `🛡️${amount}` : '🛡️';
    } else {
      floater.className = 'damage-number';
      floater.textContent = amount ? `-${amount}` : '💥';
    }
    floater.style.left = `${200 + Math.random() * 500}px`;
    floater.style.top = type === 'player' ? '380px' : '120px';
    screen.appendChild(floater);
    setTimeout(() => floater.remove(), 1000);

    if (type === 'player') {
      if (this.audio) this.audio.playDamage();
      screen.classList.add('shake');
      setTimeout(() => screen.classList.remove('shake'), 500);
    }
  }

  _animateCardPlay(handIndex, cardType) {
    const cardEl = document.querySelector(`.card[data-hand-index="${handIndex}"]`);
    if (!cardEl) {
      this._updateBattleUI();
      return;
    }

    const rect = cardEl.getBoundingClientRect();
    const clone = cardEl.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.margin = '0';
    clone.style.zIndex = '200';
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'none';
    clone.style.transform = 'none';

    const animClass = cardType === 'attack' ? 'card-play-attack' : 'card-play-skill';
    clone.classList.add(animClass);

    document.body.appendChild(clone);

    cardEl.style.opacity = '0';

    setTimeout(() => {
      clone.remove();
      this._updateBattleUI();
    }, 300);
  }

  _renderCardReward() {
    const screen = document.createElement('div');
    screen.className = 'screen reward-screen active';
    const rewards = this.game.pendingRewards;

    if (!rewards) {
      this.game.setState('MAP');
      return;
    }

    this.game.player.gold += rewards.gold;
    this.game.goldEarnedThisRun += rewards.gold;

    let cardsHtml = '';
    if (rewards.cards && rewards.cards.length > 0) {
      for (const card of rewards.cards) {
        const typeColors = {
          attack: 'card-attack', skill: 'card-skill', power: 'card-power',
          curse: 'card-curse', status: 'card-status'
        };
        const typeClass = typeColors[card.type] || '';
        cardsHtml += `
          <div class="card reward-card ${typeClass}" data-card-id="${card.id}" data-rarity="${card.rarity}" data-type="${card.type}">
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}${card.upgraded ? '+' : ''}</div>
            <div class="card-type">${this._getTypeName(card.type)}</div>
            <div class="card-description">${card.description}</div>
          </div>
        `;
      }
    }

    let relicsHtml = '';
    if (rewards.relics && rewards.relics.length > 0) {
      for (const relic of rewards.relics) {
        relicsHtml += `
          <div class="boss-relic-choice" data-relic-id="${relic.id}">
            <div class="boss-relic-name">${relic.name}</div>
            <div class="boss-relic-rarity">Boss遗物</div>
            <div class="boss-relic-desc">${relic.description}</div>
          </div>
        `;
      }
    }

    screen.innerHTML = `
      <div class="reward-container-screen">
        <h2 style="color:var(--accent-gold);font-family:var(--font-title);margin-bottom:20px">战斗胜利！</h2>
        <div class="reward-gold">💰 获得 ${rewards.gold} 金币</div>
        ${rewards.relics && rewards.relics.length > 0 ? `
          <div class="boss-relic-section">
            <div class="reward-cards-title">选择一个Boss遗物：</div>
            <div class="boss-relic-container">${relicsHtml}</div>
          </div>
        ` : ''}
        <div class="reward-cards-title">选择一张卡牌加入牌组：</div>
        <div class="reward-container">${cardsHtml}</div>
        <button class="btn" id="btn-skip-reward">跳过</button>
      </div>
    `;
    this.app.appendChild(screen);

    screen.querySelectorAll('.boss-relic-choice').forEach(relicEl => {
      relicEl.addEventListener('click', () => {
        const relicId = relicEl.dataset.relicId;
        this.game.addRelic(relicId);
        screen.querySelectorAll('.boss-relic-choice').forEach(r => r.style.opacity = '0.3');
        relicEl.style.opacity = '1';
        relicEl.style.borderColor = 'var(--hp-green)';
        relicEl.style.pointerEvents = 'none';
        screen.querySelectorAll('.boss-relic-choice:not([style*="borderColor"])').forEach(r => {
          r.style.pointerEvents = 'none';
        });
      });
    });

    screen.querySelectorAll('.reward-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const cardId = cardEl.dataset.cardId;
        const cardData = rewards.cards.find(c => c.id === cardId);
        this.game.addCardToDeck(cardId, cardData ? cardData.upgraded : false);
        this.game.pendingRewards = null;
        this.game.autoSave();
        this.game.setState('MAP');
      });
    });

    document.getElementById('btn-skip-reward').addEventListener('click', () => {
      this.game.pendingRewards = null;
      this.game.autoSave();
      this.game.setState('MAP');
    });
  }

  _renderCamp() {
    const screen = document.createElement('div');
    screen.className = 'screen camp-screen active';
    const p = this.game.player;
    const canRest = !this.game.hasRelic('fusion_hammer');
    const healAmt = Math.floor(p.maxHp * 0.3);

    screen.innerHTML = `
      <div class="camp-container">
        <div class="campfire">🔥</div>
        <h2 style="color:var(--energy-blue);font-family:var(--font-title);font-size:2rem;margin-bottom:20px">营火</h2>
        <p style="color:var(--text-secondary);margin-bottom:24px">当前生命：${p.hp}/${p.maxHp}</p>
        <div class="camp-actions">
          <button class="btn btn-primary camp-btn" id="btn-rest" ${!canRest ? 'disabled' : ''}>
            <span class="camp-btn-icon">💤</span>
            <span>休息（恢复${healAmt}点生命）</span>
            ${!canRest ? '<span class="camp-btn-note">融合战锤：无法休息</span>' : ''}
          </button>
          <button class="btn camp-btn" id="btn-upgrade">
            <span class="camp-btn-icon">⚒️</span>
            <span>锻造（升级一张牌）</span>
          </button>
        </div>
        <button class="btn" id="btn-camp-abandon" style="margin-top:20px;border-color:var(--hp-red);color:var(--hp-red)">放弃本局</button>
      </div>
    `;
    this.app.appendChild(screen);

    document.getElementById('btn-rest').addEventListener('click', () => {
      if (canRest) {
        this.game.heal(healAmt);
        this.game.autoSave();
        this.game.setState('MAP');
      }
    });

    document.getElementById('btn-upgrade').addEventListener('click', () => {
      this._showUpgradeScreen();
    });

    document.getElementById('btn-camp-abandon').addEventListener('click', () => this._showAbandonConfirm());
  }

  _showUpgradeScreen() {
    const p = this.game.player;
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    let cardsHtml = '';
    for (let i = 0; i < p.deck.length; i++) {
      const card = p.deck[i];
      if (card.upgraded) continue;
      const cd = this.game.getCardData(card);
      if (!cd || !cd.upgrade) continue;
      const typeColors = { attack: 'card-attack', skill: 'card-skill', power: 'card-power' };
      const typeClass = typeColors[cd.type] || '';
      cardsHtml += `
        <div class="card reward-card ${typeClass}" data-deck-index="${i}" data-rarity="${cd.rarity}" data-type="${cd.type}">
          <div class="card-cost">${cd.cost}</div>
          <div class="card-name">${cd.name}</div>
          <div class="card-type">${this._getTypeName(cd.type)}</div>
          <div class="card-description">${cd.description}</div>
          <div class="card-upgrade-preview">→ ${cd.upgrade.description}</div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="dialog" style="max-width:700px">
        <div class="dialog-title">选择卡牌升级</div>
        <div class="reward-container">${cardsHtml || '<p style="color:var(--text-secondary)">没有可升级的卡牌</p>'}</div>
        <button class="btn" id="btn-cancel-upgrade">取消</button>
      </div>
    `;

    this.app.appendChild(overlay);

    overlay.querySelectorAll('.reward-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const idx = parseInt(cardEl.dataset.deckIndex);
        p.deck[idx].upgraded = true;
        overlay.remove();
        this.game.autoSave();
        this.game.setState('MAP');
      });
    });

    document.getElementById('btn-cancel-upgrade').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _renderShop() {
    const p = this.game.player;
    const shopItems = this.game.shopItems;

    if (!shopItems) {
      this.game.setState('MAP');
      return;
    }

    this.app.innerHTML = '';

    const screen = document.createElement('div');
    screen.className = 'screen shop-screen active';

    const ascMods = SaveSystem.getAscensionModifiers(this.game.ascension);
    const priceMultiplier = ascMods.shopPriceMultiplier || 1.0;

    let cardsHtml = '';
    for (let i = 0; i < shopItems.cards.length; i++) {
      const card = shopItems.cards[i];
      if (card.sold) continue;
      const adjustedPrice = Math.floor(card.price * priceMultiplier);
      const typeColors = { attack: 'card-attack', skill: 'card-skill', power: 'card-power' };
      const typeClass = typeColors[card.type] || '';
      cardsHtml += `
        <div class="card reward-card ${typeClass} shop-item" data-shop-type="card" data-shop-index="${i}" data-price="${adjustedPrice}" data-rarity="${card.rarity}" data-type="${card.type}">
          <div class="card-cost">${card.cost}</div>
          <div class="card-name">${card.name}</div>
          <div class="card-type">${this._getTypeName(card.type)}</div>
          <div class="card-description">${card.description}</div>
          <div class="card-price">💰${adjustedPrice}</div>
        </div>
      `;
    }

    let relicsHtml = '';
    for (let i = 0; i < shopItems.relics.length; i++) {
      const relic = shopItems.relics[i];
      if (relic.sold) continue;
      const adjustedPrice = Math.floor(relic.price * priceMultiplier);
      relicsHtml += `
        <div class="shop-relic-item shop-item" data-shop-type="relic" data-shop-index="${i}" data-price="${adjustedPrice}">
          <div class="shop-relic-name">${relic.name}</div>
          <div class="shop-relic-desc">${relic.description}</div>
          <div class="card-price">💰${adjustedPrice}</div>
        </div>
      `;
    }

    let potionsHtml = '';
    for (let i = 0; i < shopItems.potions.length; i++) {
      const potion = shopItems.potions[i];
      if (potion.sold) continue;
      const adjustedPrice = Math.floor(potion.price * priceMultiplier);
      potionsHtml += `
        <div class="shop-potion-item shop-item" data-shop-type="potion" data-shop-index="${i}" data-price="${adjustedPrice}">
          <div class="shop-potion-name">${potion.name}</div>
          <div class="shop-potion-desc">${potion.description}</div>
          <div class="card-price">💰${adjustedPrice}</div>
        </div>
      `;
    }

    const removalCost = Math.floor(this.game.getCardRemovalCost() * priceMultiplier);
    const canRemove = p.gold >= removalCost;

    screen.innerHTML = `
      <div class="shop-container">
        <h2 style="color:var(--accent-gold);font-family:var(--font-title);font-size:2rem;margin-bottom:8px">商店</h2>
        <p style="color:var(--accent-gold);margin-bottom:20px">💰 ${p.gold} 金币</p>
        <div class="shop-section">
          <h3 class="shop-section-title">卡牌</h3>
          <div class="reward-container" id="shop-cards">${cardsHtml || '<p style="color:var(--text-secondary)">已售罄</p>'}</div>
        </div>
        <div class="shop-section">
          <h3 class="shop-section-title">遗物</h3>
          <div class="shop-items-row" id="shop-relics">${relicsHtml || '<p style="color:var(--text-secondary)">已售罄</p>'}</div>
        </div>
        <div class="shop-section">
          <h3 class="shop-section-title">药水</h3>
          <div class="shop-items-row" id="shop-potions">${potionsHtml || '<p style="color:var(--text-secondary)">已售罄</p>'}</div>
        </div>
        <div class="shop-section">
          <button class="btn shop-remove-btn" id="btn-remove-card" ${!canRemove ? 'disabled' : ''}>
            移除一张牌（💰${removalCost}）
          </button>
        </div>
        <button class="btn" id="btn-leave-shop" style="margin-top:20px">离开商店</button>
        <button class="btn" id="btn-shop-abandon" style="margin-top:8px;border-color:var(--hp-red);color:var(--hp-red)">放弃本局</button>
      </div>
    `;
    this.app.appendChild(screen);

    const self = this;
    screen.querySelectorAll('.shop-item').forEach(item => {
      item.addEventListener('click', () => {
        const price = parseInt(item.dataset.price);
        const shopType = item.dataset.shopType;
        const shopIndex = parseInt(item.dataset.shopIndex);

        if (p.gold < price) return;

        p.gold -= price;

        if (shopType === 'card') {
          const card = shopItems.cards[shopIndex];
          self.game.addCardToDeck(card.id);
          card.sold = true;
        } else if (shopType === 'relic') {
          const relic = shopItems.relics[shopIndex];
          self.game.addRelic(relic.id);
          relic.sold = true;
        } else if (shopType === 'potion') {
          const potion = shopItems.potions[shopIndex];
          if (p.potions.length < 3) {
            self.game.addPotion(potion.id);
          }
          potion.sold = true;
        }

        self.game.autoSave();
        self._renderShop();
      });
    });

    document.getElementById('btn-remove-card').addEventListener('click', () => {
      if (p.gold >= removalCost) {
        this._showCardRemovalScreen(removalCost);
      }
    });

    document.getElementById('btn-leave-shop').addEventListener('click', () => {
      this.game.shopItems = null;
      this.game.autoSave();
      this.game.setState('MAP');
    });

    document.getElementById('btn-shop-abandon').addEventListener('click', () => this._showAbandonConfirm());
  }

  _showCardRemovalScreen(cost) {
    const p = this.game.player;
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    let cardsHtml = '';
    for (let i = 0; i < p.deck.length; i++) {
      const card = p.deck[i];
      const cd = this.game.getCardData(card);
      if (!cd) continue;
      const typeColors = { attack: 'card-attack', skill: 'card-skill', power: 'card-power', curse: 'card-curse', status: 'card-status' };
      const typeClass = typeColors[cd.type] || '';
      cardsHtml += `
        <div class="card reward-card ${typeClass}" data-deck-uuid="${card.uuid}" data-rarity="${cd.rarity}" data-type="${cd.type}">
          <div class="card-cost">${cd.cost}</div>
          <div class="card-name">${cd.name}${card.upgraded ? '+' : ''}</div>
          <div class="card-type">${this._getTypeName(cd.type)}</div>
          <div class="card-description">${cd.description}</div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="dialog" style="max-width:700px">
        <div class="dialog-title">选择要移除的卡牌（💰${cost}）</div>
        <div class="reward-container">${cardsHtml}</div>
        <button class="btn" id="btn-cancel-removal">取消</button>
      </div>
    `;

    this.app.appendChild(overlay);

    overlay.querySelectorAll('.reward-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const uuid = cardEl.dataset.deckUuid;
        p.gold -= cost;
        this.game.removeCardFromDeckByUuid(uuid);
        overlay.remove();
        this.game.autoSave();
        this._renderShop();
      });
    });

    document.getElementById('btn-cancel-removal').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _renderEvent() {
    const screen = document.createElement('div');
    screen.className = 'screen event-screen active';
    const eventData = this.game.currentEvent;

    if (!eventData) {
      this.game.setState('MAP');
      return;
    }

    if (this._showingEventResult) {
      screen.innerHTML = `
        <div class="event-container">
          <div class="event-title">${eventData.name}</div>
          <div class="event-result-text">${this._eventResultText}</div>
          <button class="btn btn-primary" id="btn-event-continue">继续</button>
        </div>
      `;
      this.app.appendChild(screen);

      document.getElementById('btn-event-continue').addEventListener('click', () => {
        this._showingEventResult = false;
        this._eventResultText = '';
        this.game.autoSave();
        this.game.setState('MAP');
      });
      return;
    }

    let choicesHtml = '';
    for (let i = 0; i < eventData.choices.length; i++) {
      const choice = eventData.choices[i];
      choicesHtml += `<button class="btn event-choice-btn" id="event-choice-${i}" data-choice-index="${i}">${choice.text}</button>`;
    }

    screen.innerHTML = `
      <div class="event-container">
        <div class="event-illustration">${this._getEventIllustration(eventData.id)}</div>
        <div class="event-title">${eventData.name}</div>
        <div class="event-description">${eventData.description}</div>
        <div class="event-choices">${choicesHtml}</div>
        <button class="btn" id="btn-event-abandon" style="margin-top:16px;border-color:var(--hp-red);color:var(--hp-red)">放弃本局</button>
      </div>
    `;
    this.app.appendChild(screen);

    for (let i = 0; i < eventData.choices.length; i++) {
      document.getElementById(`event-choice-${i}`).addEventListener('click', () => {
        const choice = eventData.choices[i];
        const result = choice.result;
        this._eventResultText = result.description || '什么也没发生。';
        const applyResult = this.game.applyEventResult(result);

        if (applyResult === 'battle') {
          this._showingEventResult = false;
          return;
        }

        this._showingEventResult = true;
        this._renderEvent();
      });
    }

    document.getElementById('btn-event-abandon').addEventListener('click', () => this._showAbandonConfirm());
  }

  _getEventIllustration(eventId) {
    const illustrations = {
      mysterious_altar: '🏛️', living_wall: '🧱', time_corridor: '⏳',
      golden_shrine: '🕍', cursed_mirror: '🪞', forgotten_library: '📚',
      blood_pact: '📜', healing_spring: '⛲', dark_ritual: '💀',
      merchant_ghost: '👻', ancient_forge: '🔥', fallen_hero: '⚔️',
      crystal_ball: '🔮', shadow_dealer: '🎭', twin_sisters: '👯',
      cursed_chest: '📦', training_dummy: '🎯', ancient_totem: '🗿',
      void_rift: '🌀', final_offering: '🩸'
    };
    return illustrations[eventId] || '❓';
  }

  _renderTreasure() {
    const screen = document.createElement('div');
    screen.className = 'screen treasure-screen active';
    const relic = this.game.treasureRelic;

    if (!relic) {
      screen.innerHTML = `
        <div class="event-container">
          <div class="event-title">🎁 宝箱</div>
          <div class="event-description">宝箱是空的……</div>
          <button class="btn btn-primary" id="btn-treasure-continue">继续</button>
        </div>
      `;
      this.app.appendChild(screen);
      document.getElementById('btn-treasure-continue').addEventListener('click', () => {
        this.game.autoSave();
        this.game.setState('MAP');
      });
      return;
    }

    screen.innerHTML = `
      <div class="treasure-container">
        <div class="treasure-chest">🎁</div>
        <h2 style="color:var(--accent-gold);font-family:var(--font-title);font-size:1.8rem;margin-bottom:16px">发现遗物！</h2>
        <div class="treasure-relic">
          <div class="treasure-relic-name">${relic.name}</div>
          <div class="treasure-relic-rarity">${relic.rarity === 'rare' ? '稀有' : relic.rarity === 'uncommon' ? '罕见' : '普通'}</div>
          <div class="treasure-relic-desc">${relic.description}</div>
        </div>
        <div class="treasure-actions">
          <button class="btn btn-gold" id="btn-take-relic">拾取</button>
          <button class="btn" id="btn-skip-relic">跳过</button>
          <button class="btn" id="btn-treasure-abandon" style="border-color:var(--hp-red);color:var(--hp-red)">放弃本局</button>
        </div>
      </div>
    `;
    this.app.appendChild(screen);

    document.getElementById('btn-take-relic').addEventListener('click', () => {
      this.game.addRelic(relic.id);
      this.game.treasureRelic = null;
      this.game.autoSave();
      this.game.setState('MAP');
    });

    document.getElementById('btn-skip-relic').addEventListener('click', () => {
      this.game.treasureRelic = null;
      this.game.autoSave();
      this.game.setState('MAP');
    });

    document.getElementById('btn-treasure-abandon').addEventListener('click', () => this._showAbandonConfirm());
  }

  _renderGameOver() {
    const screen = document.createElement('div');
    screen.className = 'screen game-over-screen active';
    const p = this.game.player;

    screen.innerHTML = `
      <div class="game-over-container">
        <h1 class="game-over-title">你已陨落</h1>
        <p style="color:var(--text-secondary);margin-bottom:24px">深渊吞噬了你的灵魂……</p>
        <div class="game-over-stats">
          <div class="stat-item"><span class="stat-label">到达层数</span><span class="stat-value">第${this.game.floor}层</span></div>
          <div class="stat-item"><span class="stat-label">到达幕数</span><span class="stat-value">第${this.game.act}幕</span></div>
          <div class="stat-item"><span class="stat-label">击杀敌人</span><span class="stat-value">${this.game.enemiesKilledThisRun}</span></div>
          <div class="stat-item"><span class="stat-label">获得金币</span><span class="stat-value">${this.game.goldEarnedThisRun}</span></div>
          <div class="stat-item"><span class="stat-label">牌组大小</span><span class="stat-value">${p ? p.deck.length : 0}</span></div>
          <div class="stat-item"><span class="stat-label">遗物数量</span><span class="stat-value">${p ? p.relics.length : 0}</span></div>
        </div>
        <button class="btn btn-primary" id="btn-back-menu">返回主菜单</button>
      </div>
    `;
    this.app.appendChild(screen);

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.game.setState('MENU');
    });
  }

  _renderVictory() {
    const screen = document.createElement('div');
    screen.className = 'screen victory-screen active';
    const p = this.game.player;
    const progress = SaveSystem.loadProgress();
    const newAsc = SaveSystem.getHighestAscension(p.characterId);

    screen.innerHTML = `
      <div class="victory-container">
        <h1 class="victory-title">轮回终结</h1>
        <p style="color:var(--accent-gold);margin-bottom:24px;font-size:1.2rem">你打破了破碎的轮回！</p>
        <div class="victory-stats">
          <div class="stat-item"><span class="stat-label">角色</span><span class="stat-value">${p.characterName}</span></div>
          <div class="stat-item"><span class="stat-label">难度</span><span class="stat-value">N${this.game.ascension}</span></div>
          <div class="stat-item"><span class="stat-label">剩余生命</span><span class="stat-value">${p.hp}/${p.maxHp}</span></div>
          <div class="stat-item"><span class="stat-label">击杀敌人</span><span class="stat-value">${this.game.enemiesKilledThisRun}</span></div>
          <div class="stat-item"><span class="stat-label">获得金币</span><span class="stat-value">${this.game.goldEarnedThisRun}</span></div>
          <div class="stat-item"><span class="stat-label">牌组大小</span><span class="stat-value">${p.deck.length}</span></div>
          <div class="stat-item"><span class="stat-label">遗物数量</span><span class="stat-value">${p.relics.length}</span></div>
        </div>
        ${newAsc > this.game.ascension ? `<div class="victory-unlock">🎉 解锁难度 N${newAsc}！</div>` : ''}
        <button class="btn btn-gold" id="btn-back-menu">返回主菜单</button>
      </div>
    `;
    this.app.appendChild(screen);

    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.game.setState('MENU');
    });
  }

  _showDeckView() {
    const p = this.game.player;
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    const sorted = [...p.deck].sort((a, b) => {
      const da = this.game.getCardData(a);
      const db = this.game.getCardData(b);
      if (!da || !db) return 0;
      const typeOrder = { attack: 0, skill: 1, power: 2, curse: 3, status: 4 };
      const ta = typeOrder[da.type] !== undefined ? typeOrder[da.type] : 5;
      const tb = typeOrder[db.type] !== undefined ? typeOrder[db.type] : 5;
      if (ta !== tb) return ta - tb;
      return da.name.localeCompare(db.name);
    });

    let cardsHtml = '';
    for (const card of sorted) {
      const cd = this.game.getCardData(card);
      if (!cd) continue;
      const typeColors = { attack: 'card-attack', skill: 'card-skill', power: 'card-power', curse: 'card-curse', status: 'card-status' };
      const typeClass = typeColors[cd.type] || '';
      cardsHtml += `
        <div class="card ${typeClass}" data-rarity="${cd.rarity}" data-type="${cd.type}" style="cursor:default">
          <div class="card-cost">${cd.cost}</div>
          <div class="card-name">${cd.name}${card.upgraded ? '+' : ''}</div>
          <div class="card-type">${this._getTypeName(cd.type)}</div>
          <div class="card-description">${cd.description}</div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="dialog" style="max-width:800px;max-height:80vh;overflow-y:auto">
        <div class="dialog-title">牌组 (${p.deck.length}张)</div>
        <div class="reward-container">${cardsHtml}</div>
        <button class="btn" id="btn-close-deck">关闭</button>
      </div>
    `;

    this.app.appendChild(overlay);

    document.getElementById('btn-close-deck').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _showRelicView() {
    const p = this.game.player;
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    let relicsHtml = '';
    for (const r of p.relics) {
      const relic = RELICS.find(rl => rl.id === r.id);
      if (!relic) continue;
      relicsHtml += `
        <div class="relic-detail-item">
          <div class="relic-detail-name">${relic.name}</div>
          <div class="relic-detail-rarity">${relic.rarity === 'boss' ? 'Boss' : relic.rarity === 'rare' ? '稀有' : relic.rarity === 'uncommon' ? '罕见' : '普通'}</div>
          <div class="relic-detail-desc">${relic.description}</div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="dialog" style="max-width:600px;max-height:80vh;overflow-y:auto">
        <div class="dialog-title">遗物 (${p.relics.length}个)</div>
        <div class="relic-list">${relicsHtml || '<p style="color:var(--text-secondary)">没有遗物</p>'}</div>
        <button class="btn" id="btn-close-relics">关闭</button>
      </div>
    `;

    this.app.appendChild(overlay);

    document.getElementById('btn-close-relics').addEventListener('click', () => {
      overlay.remove();
    });
  }

  _hasSave() {
    return SaveSystem.hasSave();
  }
}
