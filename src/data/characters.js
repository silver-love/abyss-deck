export default [
  {
    id: 'ironclad',
    name: '铁甲战士',
    nameEn: 'Ironclad',
    description: '以战养战的钢铁战士，生命值越低战意越强，擅长高伤害与自我回复',
    maxHp: 80,
    startingDeck: [
      'strike', 'strike', 'strike', 'strike', 'strike',
      'defend', 'defend', 'defend', 'defend',
      'bash'
    ],
    startingRelic: 'burning_blood',
    mechanic: {
      name: '战意',
      nameEn: 'Fury',
      description: '每回合首次受到伤害时获得1层战意，每层战意使攻击伤害+2'
    },
    cardPool: [
      'fury_rage', 'pain_strike', 'bastion', 'blood_strike', 'iron_wave',
      'flame_barrier', 'heavy_slash', 'war_cry', 'berserk', 'reaper',
      'immolate', 'fiend_fire', 'limit_break', 'feed', 'offering'
    ]
  },
  {
    id: 'arcanist',
    name: '奥术行者',
    nameEn: 'Arcanist',
    description: '驾驭奥术之力的行者，通过共鸣强化法术，擅长连锁施法与能量操控',
    maxHp: 70,
    startingDeck: [
      'strike', 'strike', 'strike', 'strike',
      'defend', 'defend', 'defend', 'defend',
      'arcane_missile', 'charge'
    ],
    startingRelic: 'cracked_core',
    mechanic: {
      name: '共鸣',
      nameEn: 'Resonance',
      description: '每回合施放2张及以上技能牌时触发共鸣，使下一张攻击牌伤害+50%'
    },
    cardPool: [
      'chain_lightning', 'meditation', 'magic_matrix', 'arcane_shield',
      'mana_surge', 'spell_weave', 'echo_blast', 'temporal_shift',
      'energy_nova', 'prismatic_spray', 'arcane_mastery', 'mana_leech',
      'resonance_burst', 'dimensional_rift', 'spell_storm'
    ]
  },
  {
    id: 'shadow_blade',
    name: '暗影之刃',
    nameEn: 'Shadow Blade',
    description: '潜行于暗影中的刺客，连击触发额外效果，擅长毒素与多段攻击',
    maxHp: 70,
    startingDeck: [
      'strike', 'strike', 'strike', 'strike', 'strike',
      'defend', 'defend', 'defend', 'defend',
      'quick_slash'
    ],
    startingRelic: 'viper_fang',
    mechanic: {
      name: '连击',
      nameEn: 'Combo',
      description: '每回合打出3张及以上卡牌时触发连击，使下一张攻击牌额外造成一次伤害'
    },
    cardPool: [
      'pierce', 'smoke_bomb', 'assassination_art', 'blade_dance',
      'poison_stab', 'shadow_step', 'fan_of_knives', 'escape_plan',
      'envenom', 'corpse_explosion', 'burst', 'accuracy',
      'phantom_killer', 'thousand_cuts', 'catalyst'
    ]
  },
  {
    id: 'hierophant',
    name: '圣言牧师',
    nameEn: 'Hierophant',
    description: '虔诚的信仰守护者，以虔诚之力净化邪恶，擅长治疗与神圣伤害',
    maxHp: 75,
    startingDeck: [
      'strike', 'strike', 'strike', 'strike',
      'defend', 'defend', 'defend', 'defend',
      'prayer', 'holy_strike'
    ],
    startingRelic: 'rosary',
    mechanic: {
      name: '虔诚',
      nameEn: 'Devotion',
      description: '虔诚达到5层时自动释放神圣之光，对所有敌人造成8点伤害并恢复3点生命'
    },
    cardPool: [
      'repentance', 'purify', 'divine_favor', 'holy_shield',
      'blessing', 'smite', 'sanctuary', 'judgment',
      'hymn_of_light', 'divine_intervention', 'holy_nova', 'martyrdom',
      'consecration', 'resurrection', 'divine_wrath'
    ]
  }
];
