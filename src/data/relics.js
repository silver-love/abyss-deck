export default [
  {
    id: 'voodoo_doll',
    name: '巫毒娃娃',
    nameEn: 'Voodoo Doll',
    description: '每当你消耗或移除一张诅咒牌时，对所有敌人造成8点伤害',
    rarity: 'common',
    character: null,
    triggers: ['card_exhausted', 'card_removed'],
    effect: 'damage_all_enemies_8_on_curse_exhaust'
  },
  {
    id: 'anchor',
    name: '锚',
    nameEn: 'Anchor',
    description: '每场战斗开始时获得10点格挡',
    rarity: 'common',
    character: null,
    triggers: ['combat_start'],
    effect: 'gain_10_block_on_combat_start'
  },
  {
    id: 'bag_of_marbles',
    name: '弹珠袋',
    nameEn: 'Bag of Marbles',
    description: '每场战斗开始时对所有敌人施加1层易伤',
    rarity: 'common',
    character: null,
    triggers: ['combat_start'],
    effect: 'apply_1_vulnerable_to_all_on_combat_start'
  },
  {
    id: 'orichalcum',
    name: '山铜',
    nameEn: 'Orichalcum',
    description: '若回合结束时没有格挡，获得6点格挡',
    rarity: 'common',
    character: null,
    triggers: ['turn_end'],
    effect: 'gain_6_block_if_no_block_at_turn_end'
  },
  {
    id: 'strawberry',
    name: '草莓',
    nameEn: 'Strawberry',
    description: '获得时增加7点最大生命值',
    rarity: 'common',
    character: null,
    triggers: ['relic_obtained'],
    effect: 'gain_7_max_hp_on_obtain'
  },
  {
    id: 'meat',
    name: '肉干',
    nameEn: 'Meat',
    description: '获得时恢复5点生命值',
    rarity: 'common',
    character: null,
    triggers: ['relic_obtained'],
    effect: 'heal_5_on_obtain'
  },
  {
    id: 'pen_nib',
    name: '笔尖',
    nameEn: 'Pen Nib',
    description: '每打出10张攻击牌，下一张攻击牌造成双倍伤害',
    rarity: 'common',
    character: null,
    triggers: ['attack_played'],
    effect: 'every_10th_attack_double_damage'
  },
  {
    id: 'ornamental_fan',
    name: '折扇',
    nameEn: 'Ornamental Fan',
    description: '每打出3张攻击牌，获得4点格挡',
    rarity: 'common',
    character: null,
    triggers: ['attack_played'],
    effect: 'every_3rd_attack_gain_4_block'
  },
  {
    id: 'kunai',
    name: '苦无',
    nameEn: 'Kunai',
    description: '每回合打出3张攻击牌，获得1层敏捷',
    rarity: 'common',
    character: null,
    triggers: ['attack_played'],
    effect: 'every_3rd_attack_in_turn_gain_1_dexterity'
  },
  {
    id: 'shuriken',
    name: '手里剑',
    nameEn: 'Shuriken',
    description: '每回合打出3张攻击牌，获得1层力量',
    rarity: 'common',
    character: null,
    triggers: ['attack_played'],
    effect: 'every_3rd_attack_in_turn_gain_1_strength'
  },
  {
    id: 'hourglass',
    name: '时光沙漏',
    nameEn: 'Hourglass',
    description: '每场战斗开始时获得一个额外回合，但该回合结束时获得1层空虚',
    rarity: 'rare',
    character: null,
    triggers: ['combat_start'],
    effect: 'extra_turn_but_gain_dazed'
  },
  {
    id: 'calipers',
    name: '卡尺',
    nameEn: 'Calipers',
    description: '回合结束时失去15点格挡而非全部',
    rarity: 'rare',
    character: null,
    triggers: ['turn_end'],
    effect: 'lose_15_block_instead_of_all_at_turn_end'
  },
  {
    id: 'pocketwatch',
    name: '怀表',
    nameEn: 'Pocketwatch',
    description: '每场战斗第一回合获得1点额外能量',
    rarity: 'rare',
    character: null,
    triggers: ['combat_start'],
    effect: 'gain_1_energy_first_turn'
  },
  {
    id: 'chemical_x',
    name: '化学X',
    nameEn: 'Chemical X',
    description: '药水效果提升50%',
    rarity: 'rare',
    character: null,
    triggers: ['potion_used'],
    effect: 'potions_50_percent_more_effective'
  },
  {
    id: 'strange_spoon',
    name: '奇异勺',
    nameEn: 'Strange Spoon',
    description: '具有消耗效果的牌有50%几率不消耗',
    rarity: 'rare',
    character: null,
    triggers: ['card_exhaust_check'],
    effect: 'exhaust_cards_50_percent_chance_not'
  },
  {
    id: 'dead_branch',
    name: '枯枝',
    nameEn: 'Dead Branch',
    description: '每当你消耗一张牌，将一张随机牌加入手牌',
    rarity: 'rare',
    character: null,
    triggers: ['card_exhausted'],
    effect: 'add_random_card_to_hand_on_exhaust'
  },
  {
    id: 'gambling_chip',
    name: '赌徒筹码',
    nameEn: 'Gambling Chip',
    description: '获得时获得50金币，卡牌奖励多1个选择',
    rarity: 'rare',
    character: null,
    triggers: ['relic_obtained', 'card_reward'],
    effect: 'gain_50_gold_on_obtain_plus_extra_card_choice'
  },
  {
    id: 'molten_egg',
    name: '熔岩蛋',
    nameEn: 'Molten Egg',
    description: '所有普通卡牌奖励自动升级',
    rarity: 'rare',
    character: null,
    triggers: ['card_reward'],
    effect: 'common_cards_in_rewards_upgraded'
  },
  {
    id: 'broken_crown',
    name: '破碎皇冠',
    nameEn: 'Broken Crown',
    description: '最大能量+1，但卡牌奖励只显示2张而非3张',
    rarity: 'boss',
    character: null,
    triggers: ['relic_obtained', 'card_reward'],
    effect: 'plus_1_max_energy_fewer_card_choices'
  },
  {
    id: 'cursed_key',
    name: '诅咒钥匙',
    nameEn: 'Cursed Key',
    description: '最大能量+1，但打开非Boss宝箱时获得一张诅咒',
    rarity: 'boss',
    character: null,
    triggers: ['relic_obtained', 'chest_opened'],
    effect: 'plus_1_max_energy_curse_on_chest'
  },
  {
    id: 'fusion_hammer',
    name: '融合战锤',
    nameEn: 'Fusion Hammer',
    description: '最大能量+1，但无法在营火休息',
    rarity: 'boss',
    character: null,
    triggers: ['relic_obtained', 'camp_rest'],
    effect: 'plus_1_max_energy_cannot_rest'
  },
  {
    id: 'runic_cube',
    name: '符文方块',
    nameEn: 'Runic Cube',
    description: '最大能量+1，但每抽1张牌受到1点伤害',
    rarity: 'boss',
    character: null,
    triggers: ['relic_obtained', 'card_drawn'],
    effect: 'plus_1_max_energy_take_1_damage_on_draw'
  },
  {
    id: 'burning_blood',
    name: '燃烧之血',
    nameEn: 'Burning Blood',
    description: '每场战斗结束后恢复6点生命值',
    rarity: 'character',
    character: 'ironclad',
    triggers: ['combat_end'],
    effect: 'heal_6_after_combat'
  },
  {
    id: 'cracked_core',
    name: '破损核心',
    nameEn: 'Cracked Core',
    description: '每场战斗中第一张技能牌消耗为0',
    rarity: 'character',
    character: 'arcanist',
    triggers: ['combat_start', 'skill_played'],
    effect: 'first_skill_each_combat_cost_0'
  },
  {
    id: 'viper_fang',
    name: '毒蛇之牙',
    nameEn: 'Viper Fang',
    description: '每回合第一次未被格挡的攻击施加2层中毒',
    rarity: 'character',
    character: 'shadow_blade',
    triggers: ['attack_deals_damage'],
    effect: 'first_unblocked_attack_applies_2_poison'
  },
  {
    id: 'rosary',
    name: '念珠',
    nameEn: 'Rosary',
    description: '每场战斗开始时获得2层虔诚',
    rarity: 'character',
    character: 'hierophant',
    triggers: ['combat_start'],
    effect: 'start_combat_with_2_devotion'
  }
];
