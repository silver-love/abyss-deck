export default [
  {
    id: 'slime_small',
    name: '小史莱姆',
    nameEn: 'Small Slime',
    hp: [8, 12],
    moves: [
      { id: 'tackle', name: '冲撞', intent: 'attack', value: 4, weight: 60 },
      { id: 'slime_defend', name: '粘液护盾', intent: 'defend', value: 4, weight: 30 },
      { id: 'slime_spit', name: '粘液喷射', intent: 'debuff', value: 1, effect: { type: 'apply_power', power: 'weak', amount: 1 }, weight: 10 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [] },
    layer: 1,
    isElite: false,
    isBoss: false
  },
  {
    id: 'slime_big',
    name: '大史莱姆',
    nameEn: 'Big Slime',
    hp: [16, 22],
    moves: [
      { id: 'slam', name: '猛击', intent: 'attack', value: 7, weight: 50 },
      { id: 'goop_shield', name: '粘液护体', intent: 'defend', value: 6, weight: 25 },
      { id: 'corrosive_spit', name: '腐蚀喷射', intent: 'debuff', value: 2, effect: { type: 'apply_power', power: 'vulnerable', amount: 1 }, weight: 25 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [{ condition: 'hp_below_50', modify: 'increase_attack_weight', value: 20 }] },
    layer: 1,
    isElite: false,
    isBoss: false,
    onDeath: 'split_into_small_slimes'
  },
  {
    id: 'goblin',
    name: '哥布林',
    nameEn: 'Goblin',
    hp: [10, 14],
    moves: [
      { id: 'stab', name: '刺击', intent: 'attack', value: 5, weight: 50 },
      { id: 'rush', name: '冲锋', intent: 'attack', value: 7, weight: 30 },
      { id: 'steal', name: '偷窃', intent: 'special', value: 0, effect: { type: 'steal_gold', amount: 5 }, weight: 20 }
    ],
    ai_pattern: { type: 'aggressive', rules: [{ condition: 'always', action: 'prefer_attack' }] },
    layer: 1,
    isElite: false,
    isBoss: false
  },
  {
    id: 'bat_swarm',
    name: '蝙蝠群',
    nameEn: 'Bat Swarm',
    hp: [7, 10],
    moves: [
      { id: 'screech', name: '尖啸', intent: 'debuff', value: 1, effect: { type: 'apply_power', power: 'weak', amount: 1 }, weight: 40 },
      { id: 'bite', name: '撕咬', intent: 'attack', value: 3, weight: 40 },
      { id: 'dive', name: '俯冲', intent: 'attack', value: 5, weight: 20 }
    ],
    ai_pattern: { type: 'alternating', rules: [{ condition: 'every_other_turn', action: 'use_debuff' }] },
    layer: 1,
    isElite: false,
    isBoss: false
  },
  {
    id: 'dark_knight',
    name: '暗黑骑士',
    nameEn: 'Dark Knight',
    hp: [30, 38],
    moves: [
      { id: 'dark_slash', name: '暗黑斩', intent: 'attack', value: 8, weight: 40 },
      { id: 'shield_bash', name: '盾击', intent: 'attack', value: 5, weight: 20 },
      { id: 'dark_armor', name: '暗黑护甲', intent: 'defend', value: 10, weight: 20 },
      { id: 'crush_defense', name: '破防', intent: 'debuff', value: 2, effect: { type: 'apply_power', power: 'vulnerable', amount: 2 }, weight: 20 }
    ],
    ai_pattern: { type: 'pattern', rules: [
      { turn: 1, move: 'crush_defense' },
      { turn: 2, move: 'dark_slash' },
      { turn: 3, move: 'dark_armor' }
    ]},
    layer: 1,
    isElite: true,
    isBoss: false
  },
  {
    id: 'guardian',
    name: '守护者',
    nameEn: 'Guardian',
    hp: [70, 70],
    moves: [
      { id: 'shield_wall', name: '盾墙', intent: 'defend', value: 14, weight: 30 },
      { id: 'guardian_strike', name: '守护打击', intent: 'attack', value: 7, weight: 25 },
      { id: 'fortify', name: '固守', intent: 'defend', value: 10, weight: 25 },
      { id: 'retaliate', name: '反击', intent: 'attack', value: 10, weight: 20 },
      { id: 'berserker_fury', name: '狂暴', intent: 'attack', value: 12, weight: 40 },
      { id: 'double_strike', name: '双重打击', intent: 'attack', value: 8, weight: 30 }
    ],
    ai_pattern: { type: 'phase', rules: [
      { phase: 1, condition: 'hp_above_50', moves: ['shield_wall', 'guardian_strike', 'fortify'] },
      { phase: 2, condition: 'hp_below_50', moves: ['berserker_fury', 'double_strike', 'retaliate'], description: '守护者进入狂暴阶段，放弃防御全力攻击' }
    ]},
    layer: 1,
    isElite: false,
    isBoss: true
  },
  {
    id: 'skeleton',
    name: '骷髅兵',
    nameEn: 'Skeleton',
    hp: [12, 16],
    moves: [
      { id: 'bone_strike', name: '骨击', intent: 'attack', value: 5, weight: 50 },
      { id: 'bone_shield', name: '骨盾', intent: 'defend', value: 5, weight: 30 },
      { id: 'rattle', name: '骨骼嘎响', intent: 'debuff', value: 1, effect: { type: 'apply_power', power: 'weak', amount: 1 }, weight: 20 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [] },
    layer: 2,
    isElite: false,
    isBoss: false,
    onDeath: 'deal_3_damage_to_player'
  },
  {
    id: 'curse_mage',
    name: '缚咒法师',
    nameEn: 'Curse Mage',
    hp: [13, 18],
    moves: [
      { id: 'dark_bolt', name: '暗黑弹', intent: 'attack', value: 4, weight: 40 },
      { id: 'curse_weave', name: '诅咒编织', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_delay' }, weight: 30 },
      { id: 'hex', name: '妖术', intent: 'debuff', value: 2, effect: { type: 'apply_power', power: 'vulnerable', amount: 1 }, weight: 30 }
    ],
    ai_pattern: { type: 'timed', rules: [
      { condition: 'every_2_turns', action: 'curse_weave' }
    ]},
    layer: 2,
    isElite: false,
    isBoss: false
  },
  {
    id: 'wraith',
    name: '怨灵',
    nameEn: 'Wraith',
    hp: [15, 20],
    moves: [
      { id: 'spectral_touch', name: '幽灵触碰', intent: 'attack', value: 6, weight: 40 },
      { id: 'wail', name: '哀嚎', intent: 'debuff', value: 2, effect: { type: 'apply_power', power: 'weak', amount: 2 }, weight: 35 },
      { id: 'phase_shift', name: '相位移动', intent: 'defend', value: 6, weight: 25 }
    ],
    ai_pattern: { type: 'alternating', rules: [
      { condition: 'odd_turn', action: 'prefer_attack' },
      { condition: 'even_turn', action: 'prefer_debuff' }
    ]},
    layer: 2,
    isElite: false,
    isBoss: false
  },
  {
    id: 'cultist',
    name: '邪教徒',
    nameEn: 'Cultist',
    hp: [12, 17],
    moves: [
      { id: 'ritual', name: '仪式', intent: 'buff', value: 1, effect: { type: 'apply_power', power: 'strength', amount: 1 }, weight: 30 },
      { id: 'dark_strike', name: '暗影打击', intent: 'attack', value: 5, weight: 50 },
      { id: 'incantation', name: '咒语', intent: 'buff', value: 1, effect: { type: 'apply_power', power: 'ritual', amount: 1 }, weight: 20 }
    ],
    ai_pattern: { type: 'pattern', rules: [
      { turn: 1, move: 'ritual' },
      { turn: 2, move: 'dark_strike' },
      { turn: 3, move: 'incantation' }
    ]},
    layer: 2,
    isElite: false,
    isBoss: false
  },
  {
    id: 'shadow_fragment',
    name: '暗影碎片',
    nameEn: 'Shadow Fragment',
    hp: [5, 8],
    moves: [
      { id: 'fragment_strike', name: '碎片打击', intent: 'attack', value: 2, weight: 60 },
      { id: 'fragment_merge', name: '融合', intent: 'defend', value: 3, weight: 40 }
    ],
    ai_pattern: { type: 'fast', rules: [] },
    layer: 2,
    isElite: false,
    isBoss: false
  },
  {
    id: 'shadow_clone',
    name: '暗影分身',
    nameEn: 'Shadow Clone',
    hp: [35, 42],
    moves: [
      { id: 'shadow_strike', name: '暗影斩', intent: 'attack', value: 7, weight: 40 },
      { id: 'mirror_defense', name: '镜像防御', intent: 'defend', value: 6, weight: 30 },
      { id: 'clone_spawn', name: '分裂', intent: 'special', value: 0, effect: { type: 'summon', enemy: 'shadow_fragment', hp: 1 }, weight: 30 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [
      { condition: 'hp_above_60', modify: 'increase_special_weight', value: 15 }
    ]},
    layer: 2,
    isElite: true,
    isBoss: false,
    onHit: 'spawn_shadow_fragment'
  },
  {
    id: 'traitor_trio',
    name: '变节者三人组',
    nameEn: 'Traitor Trio',
    hp: [85, 85],
    moves: [
      { id: 'coordinated_attack', name: '协同攻击', intent: 'attack', value: 5, weight: 30 },
      { id: 'warriors_slash', name: '战士斩击', intent: 'attack', value: 8, weight: 25 },
      { id: 'mages_hex', name: '法师诅咒', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_doubt' }, weight: 20 },
      { id: 'rogues_poison', name: '盗贼下毒', intent: 'debuff', value: 3, effect: { type: 'apply_power', power: 'poison', amount: 3 }, weight: 25 },
      { id: 'enraged_strike', name: '狂怒打击', intent: 'attack', value: 12, weight: 30 },
      { id: 'desperate_curse', name: '绝望诅咒', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_pain' }, weight: 20 }
    ],
    ai_pattern: { type: 'multi_unit', rules: [
      { unit: 'warrior', moves: ['warriors_slash', 'coordinated_attack'] },
      { unit: 'mage', moves: ['mages_hex', 'coordinated_attack'] },
      { unit: 'rogue', moves: ['rogues_poison', 'coordinated_attack'] },
      { condition: 'one_dead', effect: 'buff_remaining_50_percent_damage' },
      { condition: 'two_dead', effect: 'buff_remaining_100_percent_damage' }
    ]},
    layer: 2,
    isElite: false,
    isBoss: true
  },
  {
    id: 'fire_elemental',
    name: '火元素',
    nameEn: 'Fire Elemental',
    hp: [16, 22],
    moves: [
      { id: 'fire_bolt', name: '火焰弹', intent: 'attack', value: 6, weight: 40 },
      { id: 'ignite', name: '点燃', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'status_burn' }, weight: 35 },
      { id: 'flame_shield', name: '火焰护盾', intent: 'defend', value: 6, weight: 25 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [
      { condition: 'every_3_turns', action: 'ignite' }
    ]},
    layer: 3,
    isElite: false,
    isBoss: false
  },
  {
    id: 'lava_golem',
    name: '熔岩魔像',
    nameEn: 'Lava Golem',
    hp: [20, 28],
    moves: [
      { id: 'lava_fist', name: '熔岩之拳', intent: 'attack', value: 8, weight: 45 },
      { id: 'magma_armor', name: '岩浆护甲', intent: 'defend', value: 8, weight: 30 },
      { id: 'eruption', name: '喷发', intent: 'attack', value: 11, weight: 25 }
    ],
    ai_pattern: { type: 'aggressive', rules: [
      { condition: 'player_no_block', action: 'bonus_damage', value: 2 }
    ]},
    layer: 3,
    isElite: false,
    isBoss: false
  },
  {
    id: 'imp',
    name: '小恶魔',
    nameEn: 'Imp',
    hp: [10, 15],
    moves: [
      { id: 'quick_claw', name: '利爪', intent: 'attack', value: 4, weight: 40 },
      { id: 'mockery', name: '嘲弄', intent: 'debuff', value: 1, effect: { type: 'apply_power', power: 'vulnerable', amount: 1 }, weight: 35 },
      { id: 'dodge', name: '闪避', intent: 'defend', value: 4, weight: 25 }
    ],
    ai_pattern: { type: 'fast', rules: [
      { condition: 'always', action: 'act_first' }
    ]},
    layer: 3,
    isElite: false,
    isBoss: false
  },
  {
    id: 'dragon_whelp',
    name: '幼龙',
    nameEn: 'Dragon Whelp',
    hp: [18, 24],
    moves: [
      { id: 'breath', name: '龙息', intent: 'attack', value: 7, weight: 35 },
      { id: 'tail_swipe', name: '尾击', intent: 'attack', value: 4, weight: 30 },
      { id: 'wing_guard', name: '翼盾', intent: 'defend', value: 7, weight: 20 },
      { id: 'fire_breath', name: '烈焰吐息', intent: 'attack', value: 5, weight: 15 }
    ],
    ai_pattern: { type: 'pattern', rules: [
      { turn: 1, move: 'breath' },
      { turn: 2, move: 'wing_guard' },
      { turn: 3, move: 'tail_swipe' }
    ]},
    layer: 3,
    isElite: false,
    isBoss: false
  },
  {
    id: 'inferno_lord',
    name: '炎魔领主',
    nameEn: 'Inferno Lord',
    hp: [48, 56],
    moves: [
      { id: 'infernal_strike', name: '炼狱打击', intent: 'attack', value: 10, weight: 30 },
      { id: 'multi_slash', name: '多重斩', intent: 'attack', value: 4, weight: 25 },
      { id: 'hellfire', name: '地狱火', intent: 'attack', value: 7, weight: 20 },
      { id: 'burning_aura', name: '燃烧光环', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'status_burn' }, weight: 25 }
    ],
    ai_pattern: { type: 'phase', rules: [
      { phase: 1, condition: 'hp_above_50', moves: ['infernal_strike', 'multi_slash', 'burning_aura'] },
      { phase: 2, condition: 'hp_below_50', moves: ['hellfire', 'multi_slash', 'infernal_strike'], description: '炎魔领主进入狂怒，攻击更加猛烈' }
    ]},
    layer: 3,
    isElite: true,
    isBoss: false
  },
  {
    id: 'cursed_thrall',
    name: '被诅咒的仆从',
    nameEn: 'Cursed Thrall',
    hp: [7, 11],
    moves: [
      { id: 'thrall_strike', name: '仆从打击', intent: 'attack', value: 3, weight: 50 },
      { id: 'thrall_curse', name: '诅咒之触', intent: 'debuff', value: 1, effect: { type: 'apply_power', power: 'weak', amount: 1 }, weight: 30 },
      { id: 'thrall_defend', name: '仆从护盾', intent: 'defend', value: 4, weight: 20 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [] },
    layer: 3,
    isElite: false,
    isBoss: false
  },
  {
    id: 'warlock_king',
    name: '术士王',
    nameEn: 'Warlock King',
    hp: [100, 100],
    moves: [
      { id: 'dark_decree', name: '黑暗敕令', intent: 'attack', value: 8, weight: 25 },
      { id: 'curse_of_abyss', name: '深渊诅咒', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_decay' }, weight: 20 },
      { id: 'summon_minion', name: '召唤仆从', intent: 'special', value: 0, effect: { type: 'summon', enemy: 'cursed_thrall', hp: 8 }, weight: 20 },
      { id: 'life_drain', name: '生命汲取', intent: 'attack', value: 6, effect: { type: 'heal_self', amount: 4 }, weight: 20 },
      { id: 'dark_bargain', name: '黑暗交易', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_normality' }, weight: 15 }
    ],
    ai_pattern: { type: 'pattern', rules: [
      { turn: 1, move: 'dark_decree' },
      { turn: 2, move: 'summon_minion' },
      { turn: 3, move: 'curse_of_abyss' },
      { turn: 4, move: 'life_drain' },
      { turn: 5, move: 'dark_bargain' }
    ]},
    layer: 3,
    isElite: false,
    isBoss: true
  },
  {
    id: 'void_stalker',
    name: '虚空潜行者',
    nameEn: 'Void Stalker',
    hp: [20, 28],
    moves: [
      { id: 'backstab', name: '背刺', intent: 'attack', value: 10, weight: 35 },
      { id: 'vanish', name: '消失', intent: 'defend', value: 10, weight: 30 },
      { id: 'shadow_rend', name: '暗影撕裂', intent: 'attack', value: 7, weight: 35 }
    ],
    ai_pattern: { type: 'stealth', rules: [
      { condition: 'first_turn', action: 'vanish' },
      { condition: 'after_stealth', action: 'backstab' }
    ]},
    layer: 4,
    isElite: false,
    isBoss: false
  },
  {
    id: 'abyssal_horror',
    name: '深渊恐惧',
    nameEn: 'Abyssal Horror',
    hp: [24, 32],
    moves: [
      { id: 'terror_gaze', name: '恐惧凝视', intent: 'debuff', value: 2, effect: { type: 'apply_power', power: 'weak', amount: 2 }, weight: 30 },
      { id: 'crushing_grip', name: '碾压之握', intent: 'attack', value: 7, weight: 35 },
      { id: 'madness_whisper', name: '疯狂低语', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_doubt' }, weight: 20 },
      { id: 'devour', name: '吞噬', intent: 'attack', value: 11, weight: 15 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [
      { condition: 'every_3_turns', action: 'madness_whisper' }
    ]},
    layer: 4,
    isElite: false,
    isBoss: false
  },
  {
    id: 'corrupted_paladin',
    name: '堕落圣骑',
    nameEn: 'Corrupted Paladin',
    hp: [22, 30],
    moves: [
      { id: 'corrupted_smite', name: '堕落圣击', intent: 'attack', value: 8, weight: 35 },
      { id: 'dark_heal', name: '暗黑治愈', intent: 'buff', value: 4, effect: { type: 'heal_self', amount: 4 }, weight: 25 },
      { id: 'holy_shield_corrupt', name: '腐化圣盾', intent: 'defend', value: 8, weight: 25 },
      { id: 'judgment_blade', name: '审判之刃', intent: 'attack', value: 11, weight: 15 }
    ],
    ai_pattern: { type: 'pattern', rules: [
      { turn: 1, move: 'corrupted_smite' },
      { turn: 2, move: 'holy_shield_corrupt' },
      { turn: 3, move: 'dark_heal' },
      { turn: 4, move: 'judgment_blade' }
    ]},
    layer: 4,
    isElite: false,
    isBoss: false
  },
  {
    id: 'shadow_dragon_hatchling',
    name: '暗影龙裔',
    nameEn: 'Shadow Dragon Hatchling',
    hp: [18, 26],
    moves: [
      { id: 'shadow_breath', name: '暗影吐息', intent: 'attack', value: 7, weight: 35 },
      { id: 'curse_breath', name: '诅咒吐息', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_delay' }, weight: 25 },
      { id: 'wing_buffet', name: '翼击', intent: 'attack', value: 4, weight: 25 },
      { id: 'shadow_scales', name: '暗影鳞甲', intent: 'defend', value: 6, weight: 15 }
    ],
    ai_pattern: { type: 'weighted_random', rules: [
      { condition: 'every_3_turns', action: 'curse_breath' }
    ]},
    layer: 4,
    isElite: false,
    isBoss: false
  },
  {
    id: 'ancient_lich',
    name: '远古巫妖',
    nameEn: 'Ancient Lich',
    hp: [55, 68],
    moves: [
      { id: 'soul_drain', name: '灵魂汲取', intent: 'attack', value: 6, effect: { type: 'heal_self', amount: 4 }, weight: 25 },
      { id: 'necrotic_curse', name: '亡灵诅咒', intent: 'debuff', value: 0, effect: { type: 'add_card_to_deck', card: 'curse_decay' }, weight: 20 },
      { id: 'raise_dead', name: '亡者苏生', intent: 'special', value: 0, effect: { type: 'summon', enemy: 'cursed_thrall', hp: 6 }, weight: 25 },
      { id: 'lich_touch', name: '巫妖之触', intent: 'attack', value: 10, weight: 20 },
      { id: 'decay_wave', name: '衰亡波动', intent: 'debuff', value: 3, effect: { type: 'apply_power', power: 'vulnerable', amount: 2 }, weight: 10 }
    ],
    ai_pattern: { type: 'pattern', rules: [
      { turn: 1, move: 'necrotic_curse' },
      { turn: 2, move: 'raise_dead' },
      { turn: 3, move: 'soul_drain' },
      { turn: 4, move: 'lich_touch' },
      { turn: 5, move: 'decay_wave' }
    ]},
    layer: 4,
    isElite: true,
    isBoss: false
  },
  {
    id: 'shattered_dragon',
    name: '破碎之龙',
    nameEn: 'Shattered Dragon',
    hp: [130, 130],
    moves: [
      { id: 'dragon_breath', name: '龙息', intent: 'attack', value: 10, weight: 25 },
      { id: 'tail_crush', name: '尾击', intent: 'attack', value: 8, weight: 20 },
      { id: 'wing_slam', name: '翼击', intent: 'attack', value: 6, weight: 20 },
      { id: 'roar', name: '龙吼', intent: 'debuff', value: 2, effect: { type: 'apply_power', power: 'vulnerable', amount: 2 }, weight: 15 },
      { id: 'devastation', name: '毁灭', intent: 'attack', value: 16, weight: 10 },
      { id: 'dark_breath', name: '暗黑吐息', intent: 'attack', value: 8, weight: 10 }
    ],
    ai_pattern: { type: 'multi_part', rules: [
      { part: 'head', hp: 50, moves: ['dragon_breath', 'roar', 'devastation'], description: '头部：主要攻击来源' },
      { part: 'left_wing', hp: 32, moves: ['wing_slam', 'dark_breath'], description: '左翼：辅助攻击' },
      { part: 'right_wing', hp: 32, moves: ['wing_slam', 'dark_breath'], description: '右翼：辅助攻击' },
      { part: 'body', hp: 65, moves: ['tail_crush'], description: '躯干：防御核心' },
      { condition: 'head_destroyed', effect: 'damage_reduced_50_percent' },
      { condition: 'both_wings_destroyed', effect: 'no_aoe_attacks' },
      { condition: 'body_destroyed', effect: 'no_defense' }
    ]},
    layer: 4,
    isElite: false,
    isBoss: true
  }
];
