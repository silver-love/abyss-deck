import CARDS from '../data/cards.js';
import RELICS from '../data/relics.js';

const SAVE_KEY = 'abyss_deck_save';
const PROGRESS_KEY = 'abyss_deck_progress';

const DEFAULT_PROGRESS = {
  highestAscension: {},
  totalVictories: 0,
  totalRuns: 0,
  totalEnemiesKilled: 0,
  totalGoldEarned: 0,
  totalCardsPlayed: 0,
  unlockedRelics: null,
  unlockedCards: null,
  characterVictories: {}
};

const ASCENSION_MODIFIERS = {
  1: { name: '敌人伤害+8%', enemyDamageMultiplier: 1.08 },
  2: { name: '精英出现更频繁', eliteSpawnBonus: 0.15 },
  3: { name: '起始生命-3', maxHpReduction: 3 },
  4: { name: '商店价格+15%', shopPriceMultiplier: 1.15 },
  5: { name: '普通敌人血量+10%', enemyHpMultiplier: 1.1 },
  6: { name: '敌人伤害+15%', enemyDamageMultiplier: 1.15 },
  7: { name: '每层获得1张诅咒', cursePerAct: 1 },
  8: { name: '精英血量+15%', eliteHpMultiplier: 1.15 },
  9: { name: 'Boss血量+20%', bossHpMultiplier: 1.2 },
  10: { name: '深渊模式：所有负面效果叠加', enemyDamageMultiplier: 1.2, eliteSpawnBonus: 0.2, maxHpReduction: 5, shopPriceMultiplier: 1.2, enemyHpMultiplier: 1.15, cursePerAct: 1, bossHpMultiplier: 1.25 }
};

export default class SaveSystem {
  static save(game) {
    try {
      const data = {
        seed: game.seed,
        rngState: game.rng ? game.rng.getState() : null,
        state: game.state,
        previousState: game.previousState,
        ascension: game.ascension,
        floor: game.floor,
        act: game.act,
        turn: game.turn,
        player: JSON.parse(JSON.stringify(game.player)),
        map: game.map ? JSON.parse(JSON.stringify(game.map)) : null,
        battle: null,
        currentEvent: game.currentEvent ? JSON.parse(JSON.stringify(game.currentEvent)) : null,
        shopItems: game.shopItems ? JSON.parse(JSON.stringify(game.shopItems)) : null,
        treasureRelic: game.treasureRelic ? JSON.parse(JSON.stringify(game.treasureRelic)) : null,
        cardRemovalCount: game.cardRemovalCount || 0,
        lastRemovedCard: game.lastRemovedCard || null,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  }

  static hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  static deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {}
  }

  static saveProgress(progress) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return true;
    } catch (e) {
      console.error('Progress save failed:', e);
      return false;
    }
  }

  static loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return { ...DEFAULT_PROGRESS };
      return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_PROGRESS };
    }
  }

  static ensureProgressInitialized() {
    const progress = SaveSystem.loadProgress();
    let changed = false;

    if (!progress.unlockedCards || progress.unlockedCards.length === 0) {
      progress.unlockedCards = CARDS
        .filter(c => c.rarity === 'common' && c.type !== 'curse' && c.type !== 'status')
        .map(c => c.id);
      changed = true;
    }

    if (!progress.unlockedRelics || progress.unlockedRelics.length === 0) {
      progress.unlockedRelics = RELICS
        .filter(r => r.rarity === 'common')
        .map(r => r.id);
      changed = true;
    }

    if (changed) {
      SaveSystem.saveProgress(progress);
    }
    return progress;
  }

  static isCardUnlocked(cardId) {
    const progress = SaveSystem.ensureProgressInitialized();
    return progress.unlockedCards.includes(cardId);
  }

  static isRelicUnlocked(relicId) {
    const progress = SaveSystem.ensureProgressInitialized();
    return progress.unlockedRelics.includes(relicId);
  }

  static updateProgress(updates) {
    const progress = SaveSystem.loadProgress();
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'number' && typeof progress[key] === 'number') {
        progress[key] += value;
      } else if (typeof value === 'object' && value !== null && typeof progress[key] === 'object') {
        progress[key] = { ...progress[key], ...value };
      } else {
        progress[key] = value;
      }
    }
    SaveSystem.saveProgress(progress);
    return progress;
  }

  static recordVictory(characterId, ascension) {
    const progress = SaveSystem.loadProgress();
    progress.totalVictories++;
    progress.totalRuns++;

    if (!progress.highestAscension[characterId] || progress.highestAscension[characterId] < ascension) {
      progress.highestAscension[characterId] = ascension;
    }

    if (!progress.characterVictories[characterId]) {
      progress.characterVictories[characterId] = 0;
    }
    progress.characterVictories[characterId]++;

    if (ascension >= progress.highestAscension[characterId] && ascension < 10) {
      progress.highestAscension[characterId] = ascension + 1;
    }

    if (!progress.unlockedCards || progress.unlockedCards.length === 0) {
      progress.unlockedCards = CARDS
        .filter(c => c.rarity === 'common' && c.type !== 'curse' && c.type !== 'status')
        .map(c => c.id);
    }
    if (!progress.unlockedRelics || progress.unlockedRelics.length === 0) {
      progress.unlockedRelics = RELICS
        .filter(r => r.rarity === 'common')
        .map(r => r.id);
    }

    const lockedCards = CARDS.filter(c =>
      c.type !== 'curse' && c.type !== 'status' && !progress.unlockedCards.includes(c.id)
    );
    const numCardsToUnlock = Math.min(2, lockedCards.length);
    for (let i = 0; i < numCardsToUnlock; i++) {
      const idx = Math.floor(Math.random() * lockedCards.length);
      progress.unlockedCards.push(lockedCards[idx].id);
      lockedCards.splice(idx, 1);
    }

    const lockedRelics = RELICS.filter(r =>
      r.rarity !== 'boss' && !progress.unlockedRelics.includes(r.id)
    );
    const numRelicsToUnlock = Math.min(1, lockedRelics.length);
    for (let i = 0; i < numRelicsToUnlock; i++) {
      const idx = Math.floor(Math.random() * lockedRelics.length);
      progress.unlockedRelics.push(lockedRelics[idx].id);
      lockedRelics.splice(idx, 1);
    }

    SaveSystem.saveProgress(progress);
    return progress;
  }

  static recordDeath(characterId) {
    const progress = SaveSystem.loadProgress();
    progress.totalRuns++;
    SaveSystem.saveProgress(progress);
    return progress;
  }

  static getHighestAscension(characterId) {
    const progress = SaveSystem.loadProgress();
    return progress.highestAscension[characterId] || 0;
  }

  static getAscensionModifiers(ascensionLevel) {
    const modifiers = {
      enemyDamageMultiplier: 1.0,
      eliteSpawnBonus: 0,
      maxHpReduction: 0,
      shopPriceMultiplier: 1.0,
      fewerCommonCards: 0,
      enemyHpMultiplier: 1.0,
      cursePerAct: 0,
      eliteHpMultiplier: 1.0,
      bossHpMultiplier: 1.0
    };

    for (let i = 1; i <= Math.min(ascensionLevel, 10); i++) {
      const mod = ASCENSION_MODIFIERS[i];
      if (!mod) continue;
      if (mod.enemyDamageMultiplier) modifiers.enemyDamageMultiplier = mod.enemyDamageMultiplier;
      if (mod.eliteSpawnBonus) modifiers.eliteSpawnBonus = mod.eliteSpawnBonus;
      if (mod.maxHpReduction) modifiers.maxHpReduction = mod.maxHpReduction;
      if (mod.shopPriceMultiplier) modifiers.shopPriceMultiplier = mod.shopPriceMultiplier;
      if (mod.fewerCommonCards) modifiers.fewerCommonCards = mod.fewerCommonCards;
      if (mod.enemyHpMultiplier) modifiers.enemyHpMultiplier = mod.enemyHpMultiplier;
      if (mod.cursePerAct) modifiers.cursePerAct = mod.cursePerAct;
      if (mod.eliteHpMultiplier) modifiers.eliteHpMultiplier = mod.eliteHpMultiplier;
      if (mod.bossHpMultiplier) modifiers.bossHpMultiplier = mod.bossHpMultiplier;
    }

    return modifiers;
  }

  static getAscensionName(level) {
    if (level === 0) return '普通';
    const mod = ASCENSION_MODIFIERS[level];
    return mod ? `N${level}: ${mod.name}` : `N${level}`;
  }

  static resetProgress() {
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(SAVE_KEY);
    } catch {}
  }
}
