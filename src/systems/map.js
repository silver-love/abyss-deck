import ENEMIES from '../data/enemies.js';
import RELICS from '../data/relics.js';
import CARDS from '../data/cards.js';
import POTIONS from '../data/potions.js';
import EVENTS from '../data/events.js';
import SaveSystem from './save.js';

const LAYER_ENEMIES = {
  1: { normal: ['slime_small', 'slime_big', 'goblin', 'bat_swarm'], elite: ['dark_knight'], boss: 'guardian' },
  2: { normal: ['skeleton', 'curse_mage', 'wraith', 'cultist'], elite: ['shadow_clone'], boss: 'traitor_trio' },
  3: { normal: ['fire_elemental', 'lava_golem', 'imp', 'dragon_whelp'], elite: ['inferno_lord'], boss: 'warlock_king' },
  4: { normal: ['void_stalker', 'abyssal_horror', 'corrupted_paladin', 'shadow_dragon_hatchling'], elite: ['ancient_lich'], boss: 'shattered_dragon' }
};

const LAYER_NAMES = {
  1: '幽暗地牢',
  2: '冤魂之殿',
  3: '熔岩腹地',
  4: '深渊王座'
};

export default class MapGenerator {
  constructor(rng) {
    this.rng = rng;
  }

  generate(act) {
    const layer = Math.min(act, 4);
    const floors = [];
    const totalRows = 15;

    for (let i = 0; i < totalRows; i++) {
      const floor = { row: i, nodes: [] };

      if (i === 0) {
        floor.nodes.push({
          type: 'battle', row: i, col: 0, visited: false, connections: []
        });
      } else if (i === totalRows - 1) {
        floor.nodes.push({
          type: 'boss', row: i, col: 0, visited: false, connections: []
        });
      } else if (i === totalRows - 2) {
        floor.nodes.push({
          type: 'camp', row: i, col: 0, visited: false, connections: []
        });
      } else {
        const nodeCount = this.rng.nextInt(2, 4);
        for (let j = 0; j < nodeCount; j++) {
          const type = this._randomNodeType(i, totalRows, layer);
          floor.nodes.push({
            type, row: i, col: j, visited: false, connections: []
          });
        }
      }

      floors.push(floor);
    }

    this._connectNodes(floors);

    return {
      act,
      layer,
      layerName: LAYER_NAMES[layer] || `第${act}层`,
      floors,
      currentFloor: { row: 0, col: 0 },
      visitedFloors: []
    };
  }

  _randomNodeType(floorIndex, totalFloors, layer) {
    const progress = floorIndex / totalFloors;
    const roll = this.rng.next();

    if (progress < 0.3) {
      if (roll < 0.55) return 'battle';
      if (roll < 0.75) return 'event';
      if (roll < 0.85) return 'shop';
      if (roll < 0.95) return 'treasure';
      return 'camp';
    } else if (progress < 0.7) {
      if (roll < 0.40) return 'battle';
      if (roll < 0.55) return 'elite';
      if (roll < 0.70) return 'event';
      if (roll < 0.80) return 'shop';
      if (roll < 0.90) return 'camp';
      return 'treasure';
    } else {
      if (roll < 0.30) return 'battle';
      if (roll < 0.50) return 'elite';
      if (roll < 0.65) return 'event';
      if (roll < 0.75) return 'camp';
      if (roll < 0.85) return 'shop';
      return 'treasure';
    }
  }

  _connectNodes(floors) {
    for (let i = 0; i < floors.length - 1; i++) {
      const current = floors[i].nodes;
      const next = floors[i + 1].nodes;

      for (const node of current) {
        const connectionCount = this.rng.nextInt(1, Math.min(3, next.length));
        const possibleTargets = [...Array(next.length).keys()];
        const targets = [];

        const nearestCol = Math.min(node.col, next.length - 1);
        targets.push(nearestCol);
        const idx = possibleTargets.indexOf(nearestCol);
        if (idx >= 0) possibleTargets.splice(idx, 1);

        for (let c = 1; c < connectionCount && possibleTargets.length > 0; c++) {
          const tIdx = this.rng.nextInt(0, possibleTargets.length - 1);
          targets.push(possibleTargets[tIdx]);
          possibleTargets.splice(tIdx, 1);
        }

        node.connections = targets.map(t => ({ row: i + 1, col: t }));
      }
    }

    this._ensurePathExists(floors);
  }

  _ensurePathExists(floors) {
    const reachable = new Set();
    reachable.add('0-0');

    for (let i = 0; i < floors.length - 1; i++) {
      const nextReachable = new Set();
      for (const node of floors[i].nodes) {
        const key = `${node.row}-${node.col}`;
        if (!reachable.has(key)) continue;
        for (const conn of node.connections) {
          nextReachable.add(`${conn.row}-${conn.col}`);
        }
      }

      if (nextReachable.size === 0 && floors[i + 1].nodes.length > 0) {
        const anyNode = floors[i].nodes[0];
        const target = floors[i + 1].nodes[0];
        anyNode.connections.push({ row: i + 1, col: target.col });
        nextReachable.add(`${i + 1}-0`);
      }

      reachable.clear();
      for (const k of nextReachable) reachable.add(k);
    }
  }

  getAvailableNodes(map) {
    if (!map || !map.currentFloor) return [];
    const { row, col } = map.currentFloor;
    const currentFloor = map.floors[row];
    if (!currentFloor) return [];
    const currentNode = currentFloor.nodes.find(n => n.col === col);
    if (!currentNode) return [];

    const available = [];
    for (const conn of currentNode.connections) {
      const targetFloor = map.floors[conn.row];
      if (targetFloor) {
        const targetNode = targetFloor.nodes.find(n => n.col === conn.col);
        if (targetNode && !targetNode.visited) {
          available.push(targetNode);
        }
      }
    }
    return available;
  }

  moveToNode(map, row, col) {
    const floor = map.floors[row];
    if (!floor) return false;
    const node = floor.nodes.find(n => n.col === col);
    if (!node) return false;

    const available = this.getAvailableNodes(map);
    const isAvailable = available.some(n => n.row === row && n.col === col);
    if (!isAvailable && !(row === map.currentFloor.row && col === map.currentFloor.col)) return false;

    node.visited = true;
    map.visitedFloors.push({ row, col });
    map.currentFloor = { row, col };
    return true;
  }

  getEnemiesForNode(node, act) {
    const layer = Math.min(act, 4);
    const layerData = LAYER_ENEMIES[layer];
    if (!layerData) return [];

    if (node.type === 'boss') {
      return [layerData.boss];
    }

    if (node.type === 'elite') {
      return [this.rng.nextChoice(layerData.elite)];
    }

    if (node.type === 'battle') {
      const count = this.rng.nextInt(1, 2);
      const enemies = [];
      for (let i = 0; i < count; i++) {
        enemies.push(this.rng.nextChoice(layerData.normal));
      }
      return enemies;
    }

    return [];
  }

  getEventForNode(node, act) {
    const layer = Math.min(act, 4);
    const eligible = EVENTS.filter(e => e.layer.includes(layer));
    if (eligible.length === 0) return null;
    return this.rng.nextChoice(eligible);
  }

  generateShopItems(act, playerCharacterId) {
    const layer = Math.min(act, 4);

    const cards = [];
    const cardPool = CARDS.filter(c => {
      if (c.type === 'curse' || c.type === 'status') return false;
      if (c.character && c.character !== playerCharacterId) return false;
      if (!SaveSystem.isCardUnlocked(c.id)) return false;
      return true;
    });

    if (cardPool.length === 0) {
      const fallbackPool = CARDS.filter(c => {
        if (c.type === 'curse' || c.type === 'status') return false;
        if (c.character && c.character !== playerCharacterId) return false;
        return true;
      });
      for (let i = 0; i < 3 && fallbackPool.length > 0; i++) {
        const chosen = this.rng.nextChoice(fallbackPool);
        const price = chosen.rarity === 'rare' ? 150 : chosen.rarity === 'uncommon' ? 75 : 50;
        cards.push({ id: chosen.id, name: chosen.name, description: chosen.description, type: chosen.type, rarity: chosen.rarity, cost: chosen.cost, price, sold: false });
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const roll = this.rng.next();
        let rarity;
        if (roll < 0.6) rarity = 'common';
        else if (roll < 0.9) rarity = 'uncommon';
        else rarity = 'rare';

        let filtered = cardPool.filter(c => c.rarity === rarity);
        if (filtered.length === 0) filtered = cardPool;

        const chosen = this.rng.nextChoice(filtered);
        if (chosen) {
          const price = chosen.rarity === 'rare' ? 150 : chosen.rarity === 'uncommon' ? 75 : 50;
          cards.push({ id: chosen.id, name: chosen.name, description: chosen.description, type: chosen.type, rarity: chosen.rarity, cost: chosen.cost, price, sold: false });
        }
      }
    }

    const relics = [];
    const relicPool = RELICS.filter(r => {
      if (r.rarity === 'boss') return false;
      if (r.character && r.character !== playerCharacterId) return false;
      if (!SaveSystem.isRelicUnlocked(r.id)) return false;
      return true;
    });
    const fallbackRelicPool = RELICS.filter(r => {
      if (r.rarity === 'boss') return false;
      if (r.character && r.character !== playerCharacterId) return false;
      return true;
    });
    const effectiveRelicPool = relicPool.length > 0 ? relicPool : fallbackRelicPool;
    const rareRelics = effectiveRelicPool.filter(r => r.rarity === 'rare');
    const otherRelics = effectiveRelicPool.filter(r => r.rarity !== 'rare');

    if (rareRelics.length > 0) {
      const chosen = this.rng.nextChoice(rareRelics);
      relics.push({ id: chosen.id, name: chosen.name, description: chosen.description, rarity: chosen.rarity, price: 300, sold: false });
    }
    if (otherRelics.length > 0) {
      const chosen = this.rng.nextChoice(otherRelics);
      relics.push({ id: chosen.id, name: chosen.name, description: chosen.description, rarity: chosen.rarity, price: 150, sold: false });
    }

    const potions = [];
    const potionPool = POTIONS;
    for (let i = 0; i < 3; i++) {
      const chosen = this.rng.nextChoice(potionPool);
      if (chosen) {
        const price = chosen.rarity === 'rare' ? 125 : 75;
        potions.push({ id: chosen.id, name: chosen.name, description: chosen.description, rarity: chosen.rarity, price, sold: false });
      }
    }

    return { cards, relics, potions };
  }

  getLayerName(act) {
    return LAYER_NAMES[Math.min(act, 4)] || `第${act}层`;
  }

  getLayerTheme(act) {
    const layer = Math.min(act, 4);
    switch (layer) {
      case 1: return { name: '幽暗地牢', rule: null };
      case 2: return { name: '冤魂之殿', rule: 'onDeath_deal_3_damage' };
      case 3: return { name: '熔岩腹地', rule: 'no_block_take_2_damage' };
      case 4: return { name: '深渊王座', rule: 'enemies_plus_20_hp' };
      default: return { name: '未知', rule: null };
    }
  }
}
