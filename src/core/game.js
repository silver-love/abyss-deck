import SeededRandom from './rng.js';
import EventEmitter from './events.js';
import { deepClone, clamp } from '../utils/helpers.js';
import CHARACTERS from '../data/characters.js';
import CARDS from '../data/cards.js';
import RELICS from '../data/relics.js';
import POTIONS from '../data/potions.js';
import BattleSystem from '../systems/battle.js';
import MapGenerator from '../systems/map.js';
import SaveSystem from '../systems/save.js';

const STATES = {
  MENU: 'MENU',
  CHARACTER_SELECT: 'CHARACTER_SELECT',
  MAP: 'MAP',
  BATTLE: 'BATTLE',
  CAMP: 'CAMP',
  SHOP: 'SHOP',
  EVENT: 'EVENT',
  TREASURE: 'TREASURE',
  CARD_REWARD: 'CARD_REWARD',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
};

const VALID_TRANSITIONS = {
  [STATES.MENU]: [STATES.CHARACTER_SELECT, STATES.MAP],
  [STATES.CHARACTER_SELECT]: [STATES.MAP, STATES.MENU],
  [STATES.MAP]: [STATES.BATTLE, STATES.CAMP, STATES.SHOP, STATES.EVENT, STATES.TREASURE, STATES.GAME_OVER, STATES.VICTORY, STATES.CARD_REWARD, STATES.MENU],
  [STATES.BATTLE]: [STATES.MAP, STATES.GAME_OVER, STATES.VICTORY, STATES.CARD_REWARD, STATES.MENU],
  [STATES.CAMP]: [STATES.MAP, STATES.MENU],
  [STATES.SHOP]: [STATES.MAP, STATES.MENU],
  [STATES.EVENT]: [STATES.MAP, STATES.BATTLE, STATES.MENU],
  [STATES.TREASURE]: [STATES.MAP, STATES.MENU],
  [STATES.CARD_REWARD]: [STATES.MAP, STATES.MENU],
  [STATES.GAME_OVER]: [STATES.MENU],
  [STATES.VICTORY]: [STATES.MENU]
};

export { STATES };

export default class Game {
  constructor() {
    this.events = new EventEmitter();
    this.state = STATES.MENU;
    this.previousState = null;
    this.rng = null;
    this.seed = null;
    this.player = null;
    this.map = null;
    this.battle = null;
    this.mapGenerator = null;
    this.ascension = 0;
    this.floor = 0;
    this.act = 1;
    this.turn = 0;
    this.cardsPlayedThisTurn = 0;
    this.attacksPlayedThisTurn = 0;
    this.skillsPlayedThisTurn = 0;
    this.powersPlayedThisTurn = 0;
    this.cardsPlayedThisCombat = 0;
    this._saveSlot = 'default';
    this.currentEvent = null;
    this.shopItems = null;
    this.treasureRelic = null;
    this.cardRemovalCount = 0;
    this.lastRemovedCard = null;
    this.currentNode = null;
    this.pendingBattleEnemies = null;
    this.pendingRewards = null;
    this.enemiesKilledThisRun = 0;
    this.goldEarnedThisRun = 0;

    this.events.on('enter:BATTLE', () => {
      if (!this.battle || this.battle.gameOver) {
        this.battle = new BattleSystem(this);
      }
    });
  }

  setState(newState) {
    const allowed = VALID_TRANSITIONS[this.state];
    if (!allowed || !allowed.includes(newState)) {
      if (this.state !== newState) {
        console.warn(`Invalid state transition: ${this.state} -> ${newState}`);
      }
      return false;
    }
    this.previousState = this.state;
    this.state = newState;
    this.events.emit('stateChange', { from: this.previousState, to: newState });
    this.events.emit(`enter:${newState}`, { previousState: this.previousState });
    return true;
  }

  newGame(characterId, seed, ascension) {
    this.seed = seed || Date.now().toString();
    this.rng = new SeededRandom(this.seed);
    this.ascension = Math.min(ascension || 0, 10);
    this.floor = 0;
    this.act = 1;
    this.turn = 0;
    this.cardsPlayedThisTurn = 0;
    this.attacksPlayedThisTurn = 0;
    this.skillsPlayedThisTurn = 0;
    this.powersPlayedThisTurn = 0;
    this.cardsPlayedThisCombat = 0;
    this.currentEvent = null;
    this.shopItems = null;
    this.treasureRelic = null;
    this.cardRemovalCount = 0;
    this.lastRemovedCard = null;
    this.currentNode = null;
    this.pendingBattleEnemies = null;
    this.pendingRewards = null;
    this.enemiesKilledThisRun = 0;
    this.goldEarnedThisRun = 0;

    const charData = CHARACTERS.find(c => c.id === characterId);
    if (!charData) {
      console.error(`Character not found: ${characterId}`);
      return;
    }

    const cardDb = {};
    CARDS.forEach(c => { cardDb[c.id] = c; });

    const deck = charData.startingDeck.map(cardId => {
      const template = cardDb[cardId];
      if (!template) {
        console.error(`Card not found: ${cardId}`);
        return null;
      }
      return {
        id: cardId,
        uuid: `${cardId}_${this.rng.nextInt(0, 999999)}`,
        upgraded: false
      };
    }).filter(Boolean);

    const ascMods = SaveSystem.getAscensionModifiers(this.ascension);
    let maxHp = charData.maxHp - (ascMods.maxHpReduction || 0);

    this.player = {
      characterId: charData.id,
      characterName: charData.name,
      mechanic: charData.mechanic,
      hp: maxHp,
      maxHp: maxHp,
      gold: 99,
      energy: 3,
      maxEnergy: 3,
      block: 0,
      strength: 0,
      dexterity: 0,
      fury: 0,
      resonance: 0,
      devotion: 0,
      combo: 0,
      powers: {},
      deck: deck,
      hand: [],
      drawPile: [],
      discardPile: [],
      exhaustPile: [],
      relics: [{ id: charData.startingRelic }],
      potions: [],
      curses: [],
      cardsPlayedThisTurn: 0,
      attacksPlayedThisTurn: 0,
      skillsPlayedThisTurn: 0,
      powersPlayedThisTurn: 0
    };

    this.map = null;
    this.battle = null;
    this.mapGenerator = new MapGenerator(this.rng);

    this.events.emit('gameNew', { characterId, seed: this.seed });
    this.previousState = this.state;
    this.state = STATES.MAP;
    this.events.emit('stateChange', { from: this.previousState, to: STATES.MAP });
    this.events.emit(`enter:${STATES.MAP}`, { previousState: this.previousState });
  }

  continueGame() {
    const saveData = SaveSystem.load();
    if (saveData) {
      this._restoreState(saveData);
      this.events.emit('gameContinue');
      return true;
    }
    return false;
  }

  autoSave() {
    SaveSystem.save(this);
  }

  saveGame() {
    return SaveSystem.save(this);
  }

  loadGame() {
    return SaveSystem.load();
  }

  _restoreState(data) {
    this.seed = data.seed;
    this.rng = new SeededRandom(data.seed);
    if (data.rngState != null) this.rng.setState(data.rngState);
    this.state = data.state || STATES.MAP;
    if (this.state === STATES.BATTLE) {
      this.state = STATES.MAP;
    }
    this.previousState = data.previousState;
    this.ascension = Math.min(data.ascension || 0, 10);
    this.floor = data.floor || 0;
    this.act = data.act || 1;
    this.turn = data.turn || 0;
    this.player = data.player;
    this.map = data.map;
    this.battle = null;
    this.currentEvent = data.currentEvent || null;
    this.shopItems = data.shopItems || null;
    this.treasureRelic = data.treasureRelic || null;
    this.cardRemovalCount = data.cardRemovalCount || 0;
    this.lastRemovedCard = data.lastRemovedCard || null;
    this.currentNode = null;
    this.pendingBattleEnemies = null;
    this.pendingRewards = null;
    this.enemiesKilledThisRun = 0;
    this.goldEarnedThisRun = 0;
    this.mapGenerator = new MapGenerator(this.rng);
  }

  getOrGenerateMap() {
    if (!this.map) {
      this.map = this.mapGenerator.generate(this.act);
      const startFloor = this.map.floors[0];
      if (startFloor && startFloor.nodes.length > 0) {
        startFloor.nodes[0].visited = true;
        this.map.visitedFloors.push({ row: 0, col: 0 });
      }
    }
    return this.map;
  }

  enterNode(row, col) {
    const map = this.getOrGenerateMap();
    const floor = map.floors[row];
    if (!floor) return;
    const node = floor.nodes.find(n => n.col === col);
    if (!node) return;

    this.currentNode = node;
    this.floor = row + 1;

    switch (node.type) {
      case 'battle':
      case 'elite': {
        const enemyIds = this.mapGenerator.getEnemiesForNode(node, this.act);
        this.pendingBattleEnemies = enemyIds;
        this.battle = new BattleSystem(this);
        this.setState(STATES.BATTLE);
        break;
      }
      case 'boss': {
        const enemyIds = this.mapGenerator.getEnemiesForNode(node, this.act);
        this.pendingBattleEnemies = enemyIds;
        this.battle = new BattleSystem(this);
        this.setState(STATES.BATTLE);
        break;
      }
      case 'camp':
        this.setState(STATES.CAMP);
        break;
      case 'shop': {
        this.shopItems = this.mapGenerator.generateShopItems(this.act, this.player.characterId);
        this.setState(STATES.SHOP);
        break;
      }
      case 'event': {
        this.currentEvent = this.mapGenerator.getEventForNode(node, this.act);
        this.setState(STATES.EVENT);
        break;
      }
      case 'treasure': {
        const relicPool = RELICS.filter(r => {
          if (r.rarity === 'boss') return false;
          if (r.character && r.character !== this.player.characterId) return false;
          if (this.hasRelic(r.id)) return false;
          return true;
        });
        if (relicPool.length > 0) {
          this.treasureRelic = this.rng.nextChoice(relicPool);
        } else {
          this.treasureRelic = null;
        }
        this.setState(STATES.TREASURE);
        break;
      }
      default:
        this.setState(STATES.MAP);
    }

    this.autoSave();
  }

  handleBattleVictory(rewards) {
    this.pendingRewards = rewards;
    this.enemiesKilledThisRun += this.battle._originalEnemies.length;

    if (this._pendingEventRelicReward) {
      this._pendingEventRelicReward = false;
      const relic = this._getRandomRelic(null);
      if (relic) this.addRelic(relic.id);
    }

    if (this.currentNode && this.currentNode.type === 'boss') {
      if (this.act >= 4) {
        this.handleGameVictory();
        return;
      } else {
        this.act++;
        this.map = null;
        this.mapGenerator = new MapGenerator(this.rng);
        this.floor = 0;

        const ascMods = SaveSystem.getAscensionModifiers(this.ascension);
        if (ascMods.cursePerAct && ascMods.cursePerAct > 0) {
          for (let i = 0; i < ascMods.cursePerAct; i++) {
            this._addRandomCurse();
          }
        }

        this.setState(STATES.CARD_REWARD);
        return;
      }
    }

    this.setState(STATES.CARD_REWARD);
  }

  handleBattleDefeat() {
    SaveSystem.recordDeath(this.player.characterId);
    SaveSystem.deleteSave();
    this.setState(STATES.GAME_OVER);
  }

  handleGameVictory() {
    SaveSystem.recordVictory(this.player.characterId, this.ascension);
    SaveSystem.deleteSave();
    this.setState(STATES.VICTORY);
  }

  applyEventResult(result) {
    const p = this.player;
    if (!p) return;

    switch (result.type) {
      case 'lose_hp_and_gain_relic': {
        const hpCost = result.value.hp_cost || 10;
        p.hp = Math.max(1, p.hp - hpCost);
        const relic = this._getRandomRelic(result.value.relic_rarity);
        if (relic) this.addRelic(relic.id);
        break;
      }
      case 'gain_gold': {
        const gold = result.value || 0;
        p.gold += gold;
        this.goldEarnedThisRun += gold;
        break;
      }
      case 'remove_card_for_relic': {
        const relic = this._getRandomRelic('common');
        if (relic) this.addRelic(relic.id);
        break;
      }
      case 'nothing':
        break;
      case 'restore_last_removed_card': {
        if (this.lastRemovedCard) {
          p.deck.push(this.lastRemovedCard);
          this.lastRemovedCard = null;
        }
        break;
      }
      case 'spend_gold_for_buff': {
        const cost = result.value.gold_cost || 50;
        if (p.gold >= cost) {
          p.gold -= cost;
          const roll = this.rng.next();
          if (roll < 0.5) {
            p.strength += 1;
          } else {
            p.maxHp += 5;
            p.hp += 5;
          }
        }
        break;
      }
      case 'gain_relic_and_curse': {
        const relic = this._getRandomRelic(result.value.relic_rarity);
        if (relic) this.addRelic(relic.id);
        this._addRandomCurse();
        break;
      }
      case 'upgrade_random_cards': {
        const count = result.value || 1;
        const upgradeable = p.deck.filter(c => !c.upgraded);
        const chosen = [];
        for (let i = 0; i < count && upgradeable.length > 0; i++) {
          const idx = this.rng.nextInt(0, upgradeable.length - 1);
          chosen.push(upgradeable.splice(idx, 1)[0]);
        }
        for (const card of chosen) {
          card.upgraded = true;
        }
        break;
      }
      case 'remove_card': {
        const nonBasic = p.deck.filter(c => {
          const cd = this.getCardData(c);
          return cd && cd.id !== 'strike' && cd.id !== 'defend';
        });
        if (nonBasic.length > 0) {
          const toRemove = this.rng.nextChoice(nonBasic);
          const idx = p.deck.indexOf(toRemove);
          if (idx >= 0) {
            this.lastRemovedCard = p.deck.splice(idx, 1)[0];
          }
        }
        break;
      }
      case 'lose_max_hp_for_gold': {
        const hpPercent = result.value.hp_percent || 15;
        const goldGain = result.value.gold || 150;
        const hpLoss = Math.floor(p.maxHp * hpPercent / 100);
        p.maxHp -= hpLoss;
        p.hp = Math.min(p.hp, p.maxHp);
        p.gold += goldGain;
        this.goldEarnedThisRun += goldGain;
        break;
      }
      case 'heal_percent': {
        const percent = result.value || 25;
        const healAmt = Math.floor(p.maxHp * percent / 100);
        this.heal(healAmt);
        break;
      }
      case 'gain_buff_and_curses': {
        const buff = result.value.buff;
        if (buff && buff.type === 'strength') {
          p.strength += buff.amount;
        }
        const curseCount = result.value.curses || 1;
        for (let i = 0; i < curseCount; i++) {
          this._addRandomCurse();
        }
        break;
      }
      case 'buy_relic': {
        const cost = result.value.gold_cost || 80;
        if (p.gold >= cost) {
          p.gold -= cost;
          const relic = this._getRandomRelic('common');
          if (relic) this.addRelic(relic.id);
        }
        break;
      }
      case 'fight_elite_for_relic': {
        const layer = Math.min(this.act, 4);
        const eliteIds = [];
        if (layer === 1) eliteIds.push('dark_knight');
        else if (layer === 2) eliteIds.push('shadow_clone');
        else if (layer === 3) eliteIds.push('inferno_lord');
        else eliteIds.push('ancient_lich');
        this.pendingBattleEnemies = eliteIds;
        this.battle = new BattleSystem(this);
        this._pendingEventRelicReward = true;
        this.setState(STATES.BATTLE);
        return 'battle';
      }
      case 'gain_random_card': {
        const rarity = result.value.rarity || 'common';
        const cardType = result.value.type;
        const pool = CARDS.filter(c => {
          if (c.type === 'curse' || c.type === 'status') return false;
          if (c.character && c.character !== p.characterId) return false;
          if (rarity !== 'any' && c.rarity !== rarity) return false;
          if (cardType && c.type !== cardType) return false;
          return true;
        });
        if (pool.length > 0) {
          const chosen = this.rng.nextChoice(pool);
          this.addCardToDeck(chosen.id);
        }
        break;
      }
      case 'transform_cards':
      case 'transform_cards_same_rarity': {
        const count = result.value || 1;
        for (let i = 0; i < count && p.deck.length > 0; i++) {
          const nonBasic = p.deck.filter(c => {
            const cd = this.getCardData(c);
            return cd && cd.id !== 'strike' && cd.id !== 'defend' && cd.type !== 'curse';
          });
          if (nonBasic.length === 0) break;
          const toTransform = this.rng.nextChoice(nonBasic);
          const oldData = this.getCardData(toTransform);
          const idx = p.deck.indexOf(toTransform);
          if (idx >= 0) {
            p.deck.splice(idx, 1);
            const sameRarity = result.type === 'transform_cards_same_rarity';
            const pool = CARDS.filter(c => {
              if (c.type === 'curse' || c.type === 'status') return false;
              if (c.character && c.character !== p.characterId) return false;
              if (sameRarity && oldData && c.rarity !== oldData.rarity) return false;
              return true;
            });
            if (pool.length > 0) {
              const newCard = this.rng.nextChoice(pool);
              this.addCardToDeck(newCard.id);
            }
          }
        }
        break;
      }
      case 'remove_curse_lose_max_hp': {
        const maxHpCost = result.value.max_hp_cost || 5;
        const curseCards = p.deck.filter(c => {
          const cd = this.getCardData(c);
          return cd && cd.type === 'curse';
        });
        if (curseCards.length > 0) {
          const toRemove = this.rng.nextChoice(curseCards);
          const idx = p.deck.indexOf(toRemove);
          if (idx >= 0) {
            p.deck.splice(idx, 1);
          }
          p.maxHp -= maxHpCost;
          p.hp = Math.min(p.hp, p.maxHp);
        }
        break;
      }
      case 'gain_gold_and_potion': {
        const gold = result.value.gold || 20;
        p.gold += gold;
        this.goldEarnedThisRun += gold;
        if (p.potions.length < 3) {
          const potion = this.rng.nextChoice(POTIONS);
          if (potion) this.addPotion(potion.id);
        }
        break;
      }
      case 'upgrade_all_strikes_and_defends': {
        for (const card of p.deck) {
          const cd = this.getCardData(card);
          if (cd && (cd.id === 'strike' || cd.id === 'defend') && !card.upgraded) {
            card.upgraded = true;
          }
        }
        break;
      }
      case 'permanent_stat_boost': {
        const stat = result.value.stat;
        const amount = result.value.amount || 1;
        if (stat === 'strength') p.strength += amount;
        else if (stat === 'dexterity') p.dexterity += amount;
        else if (stat === 'maxHp') {
          p.maxHp += amount;
          p.hp += amount;
        }
        break;
      }
      case 'reveal_map_nodes':
        break;
      case 'reroll_map_nodes': {
        const cost = result.value.gold_cost || 30;
        if (p.gold >= cost) {
          p.gold -= cost;
          this.map = this.mapGenerator.generate(this.act);
        }
        break;
      }
      case 'lose_hp_for_boss_relic': {
        const hpCost = result.value.hp_cost || 20;
        p.hp = Math.max(1, p.hp - hpCost);
        const bossRelics = RELICS.filter(r => r.rarity === 'boss' && !this.hasRelic(r.id));
        if (bossRelics.length > 0) {
          const chosen = this.rng.nextChoice(bossRelics);
          this.addRelic(chosen.id);
        }
        break;
      }
      case 'lose_hp': {
        const hpLoss = result.value || 10;
        p.hp = Math.max(1, p.hp - hpLoss);
        break;
      }
      default:
        break;
    }

    this.autoSave();
    return 'done';
  }

  _getRandomRelic(rarity) {
    const pool = RELICS.filter(r => {
      if (r.character && r.character !== this.player.characterId) return false;
      if (this.hasRelic(r.id)) return false;
      if (rarity && r.rarity !== rarity) return false;
      return true;
    });
    return pool.length > 0 ? this.rng.nextChoice(pool) : null;
  }

  _addRandomCurse() {
    const curses = CARDS.filter(c => c.type === 'curse');
    if (curses.length > 0) {
      const chosen = this.rng.nextChoice(curses);
      this.addCardToDeck(chosen.id);
    }
  }

  getCardRemovalCost() {
    return 75 + this.cardRemovalCount * 25;
  }

  removeCardFromDeckByUuid(uuid) {
    const removed = this.removeCardFromDeck(uuid);
    if (removed) {
      this.cardRemovalCount++;
      this.lastRemovedCard = removed;
    }
    return removed;
  }

  getPlayerStat(stat) {
    if (!this.player) return 0;
    return this.player[stat] || 0;
  }

  setPlayerStat(stat, value) {
    if (!this.player) return;
    this.player[stat] = value;
    this.events.emit('playerStatChange', { stat, value });
  }

  modifyPlayerStat(stat, delta) {
    if (!this.player) return;
    const newVal = this.player[stat] + delta;
    this.player[stat] = stat === 'hp' ? clamp(newVal, 0, this.player.maxHp) : newVal;
    this.events.emit('playerStatChange', { stat, value: this.player[stat], delta });
  }

  addPower(powerId, amount) {
    if (!this.player) return;
    if (!this.player.powers[powerId]) {
      this.player.powers[powerId] = 0;
    }
    this.player.powers[powerId] += amount;
    this.events.emit('powerApplied', { powerId, amount, target: 'player' });
  }

  getPower(powerId) {
    if (!this.player || !this.player.powers[powerId]) return 0;
    return this.player.powers[powerId];
  }

  addRelic(relicId) {
    if (!this.player) return;
    if (this.player.relics.some(r => r.id === relicId)) return;
    this.player.relics.push({ id: relicId });
    const relic = RELICS.find(r => r.id === relicId);
    if (relic) {
      if (relic.id === 'strawberry') {
        this.player.maxHp += 7;
        this.player.hp += 7;
      }
      if (relic.id === 'meat') {
        this.heal(5);
      }
      if (relic.id === 'gambling_chip') {
        this.player.gold += 50;
      }
    }
    this.events.emit('relicObtained', { relicId });
  }

  hasRelic(relicId) {
    if (!this.player) return false;
    return this.player.relics.some(r => r.id === relicId);
  }

  addPotion(potionId) {
    if (!this.player) return;
    if (this.player.potions.length >= 3) return;
    this.player.potions.push({ id: potionId });
    this.events.emit('potionObtained', { potionId });
  }

  removePotion(index) {
    if (!this.player) return;
    this.player.potions.splice(index, 1);
    this.events.emit('potionUsed', { index });
  }

  addCardToDeck(cardId, upgraded = false) {
    if (!this.player) return;
    this.player.deck.push({
      id: cardId,
      uuid: `${cardId}_${this.rng.nextInt(0, 999999)}`,
      upgraded
    });
    this.events.emit('cardAddedToDeck', { cardId, upgraded });
  }

  removeCardFromDeck(uuid) {
    if (!this.player) return;
    const idx = this.player.deck.findIndex(c => c.uuid === uuid);
    if (idx !== -1) {
      const removed = this.player.deck.splice(idx, 1)[0];
      this.events.emit('cardRemovedFromDeck', { card: removed });
      return removed;
    }
    return null;
  }

  heal(amount) {
    if (!this.player) return;
    const oldHp = this.player.hp;
    this.player.hp = clamp(this.player.hp + amount, 0, this.player.maxHp);
    const healed = this.player.hp - oldHp;
    if (healed > 0) {
      this.events.emit('playerHealed', { amount: healed });
    }
  }

  takeDamage(amount) {
    if (!this.player) return;
    let remaining = amount;
    if (this.player.block > 0) {
      const absorbed = Math.min(this.player.block, remaining);
      this.player.block -= absorbed;
      remaining -= absorbed;
      this.events.emit('blockLost', { amount: absorbed });
    }
    if (remaining > 0) {
      this.player.hp = clamp(this.player.hp - remaining, 0, this.player.maxHp);
      this.events.emit('playerDamaged', { amount: remaining });
      if (this.player.hp <= 0) {
        this.events.emit('playerDied');
        this.setState(STATES.GAME_OVER);
      }
    }
  }

  gainBlock(amount) {
    if (!this.player) return;
    const dexterityBonus = this.player.dexterity;
    const totalBlock = Math.max(0, amount + dexterityBonus);
    this.player.block += totalBlock;
    this.events.emit('blockGained', { amount: totalBlock });
  }

  resetBlock() {
    if (!this.player) return;
    this.player.block = 0;
  }

  resetTurnCounters() {
    if (!this.player) return;
    this.player.cardsPlayedThisTurn = 0;
    this.player.attacksPlayedThisTurn = 0;
    this.player.skillsPlayedThisTurn = 0;
    this.player.powersPlayedThisTurn = 0;
    this.cardsPlayedThisTurn = 0;
    this.attacksPlayedThisTurn = 0;
    this.skillsPlayedThisTurn = 0;
    this.powersPlayedThisTurn = 0;
  }

  startCombat() {
    if (!this.player) return;
    this.player.block = 0;
    this.player.powers = {};
    this.player.hand = [];
    this.player.drawPile = [];
    this.player.discardPile = [];
    this.player.exhaustPile = [];
    this.player.fury = 0;
    this.player.resonance = 0;
    this.player.devotion = 0;
    this.player.combo = 0;
    this.player.energy = this.player.maxEnergy;
    this.resetTurnCounters();
    this.cardsPlayedThisCombat = 0;
    this.turn = 0;
    this.events.emit('combatStart');
  }

  endCombat() {
    if (!this.player) return;
    this.player.block = 0;
    this.player.powers = {};
    this.player.hand = [];
    this.player.drawPile = [];
    this.player.discardPile = [];
    this.player.exhaustPile = [];
    this.player.energy = this.player.maxEnergy;
    this.resetTurnCounters();
    this.events.emit('combatEnd');
  }

  startTurn() {
    if (!this.player) return;
    this.turn++;
    this.resetBlock();
    this.player.energy = this.player.maxEnergy;
    this.resetTurnCounters();
    this.events.emit('turnStart', { turn: this.turn });
  }

  endTurn() {
    if (!this.player) return;
    this.events.emit('turnEnd', { turn: this.turn });
  }

  getCardData(cardInstance) {
    const template = CARDS.find(c => c.id === cardInstance.id);
    if (!template) return null;
    if (cardInstance.upgraded && template.upgrade) {
      return {
        ...template,
        cost: template.upgrade.cost !== undefined ? template.upgrade.cost : template.cost,
        effects: template.upgrade.effects || template.effects,
        description: template.upgrade.description || template.description
      };
    }
    return { ...template };
  }
}
