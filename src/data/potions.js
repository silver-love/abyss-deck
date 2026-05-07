export default [
  {
    id: 'attack_potion',
    name: '攻击药水',
    nameEn: 'Attack Potion',
    description: '对一个敌人造成20点伤害',
    rarity: 'common',
    effect: { type: 'damage', value: 20, target: 'single_enemy' },
    usableInBattle: true,
    usableOutBattle: false
  },
  {
    id: 'block_potion',
    name: '护盾药水',
    nameEn: 'Block Potion',
    description: '获得18点格挡',
    rarity: 'common',
    effect: { type: 'block', value: 18, target: 'self' },
    usableInBattle: true,
    usableOutBattle: false
  },
  {
    id: 'dexterity_potion',
    name: '敏捷药水',
    nameEn: 'Dexterity Potion',
    description: '本场战斗获得2层敏捷',
    rarity: 'common',
    effect: { type: 'apply_power', value: 2, target: 'self', power: 'dexterity' },
    usableInBattle: true,
    usableOutBattle: false
  },
  {
    id: 'strength_potion',
    name: '力量药水',
    nameEn: 'Strength Potion',
    description: '本场战斗获得2层力量',
    rarity: 'common',
    effect: { type: 'apply_power', value: 2, target: 'self', power: 'strength' },
    usableInBattle: true,
    usableOutBattle: false
  },
  {
    id: 'draw_potion',
    name: '抽牌药水',
    nameEn: 'Draw Potion',
    description: '抽3张牌',
    rarity: 'common',
    effect: { type: 'draw', value: 3, target: 'self' },
    usableInBattle: true,
    usableOutBattle: false
  },
  {
    id: 'heal_potion',
    name: '回复药水',
    nameEn: 'Heal Potion',
    description: '恢复20点生命值',
    rarity: 'common',
    effect: { type: 'heal', value: 20, target: 'self' },
    usableInBattle: false,
    usableOutBattle: true
  },
  {
    id: 'curse_clear_potion',
    name: '诅咒清除药水',
    nameEn: 'Curse Clear Potion',
    description: '从牌组中移除一张诅咒牌',
    rarity: 'rare',
    effect: { type: 'remove_curse', value: 1, target: 'deck' },
    usableInBattle: false,
    usableOutBattle: true
  }
];
