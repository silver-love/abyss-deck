export default [
  {
    id: 'mysterious_altar',
    name: '神秘的祭坛',
    nameEn: 'Mysterious Altar',
    description: '你发现了一座散发着诡异光芒的祭坛，石壁上刻满了古老的符文。祭坛上的火焰似乎在向你低语……',
    choices: [
      { text: '祈祷（失去10点生命，获得随机稀有遗物）', result: { type: 'lose_hp_and_gain_relic', value: { hp_cost: 10, relic_rarity: 'rare' }, description: '鲜血滴落在祭坛上，一道光芒闪过，你获得了一件遗物' } },
      { text: '摧毁祭坛（获得100金币）', result: { type: 'gain_gold', value: 100, description: '你砸碎了祭坛，金币从碎片中散落' } }
    ],
    layer: [1, 2, 3, 4]
  },
  {
    id: 'living_wall',
    name: '活体墙壁',
    nameEn: 'Living Wall',
    description: '走廊的墙壁突然蠕动起来，一张嘴从墙中浮现，似乎在等待着什么……',
    choices: [
      { text: '消耗一张牌，获得同等稀有度的遗物', result: { type: 'remove_card_for_relic', value: { match_rarity: true }, description: '墙壁吞噬了你的牌，吐出了一件遗物' } },
      { text: '离开', result: { type: 'nothing', value: 0, description: '你小心翼翼地绕过了墙壁' } }
    ],
    layer: [1, 2, 3, 4]
  },
  {
    id: 'time_corridor',
    name: '时光回廊',
    nameEn: 'Time Corridor',
    description: '你走进一条闪烁着时光碎片的走廊，过去的记忆在你眼前回放……',
    choices: [
      { text: '恢复最近移除的一张牌', result: { type: 'restore_last_removed_card', value: 1, description: '时光倒流，你找回了失去的牌' } },
      { text: '拒绝', result: { type: 'nothing', value: 0, description: '你选择继续前行' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'golden_shrine',
    name: '黄金神殿',
    nameEn: 'Golden Shrine',
    description: '一座金碧辉煌的神殿矗立在你面前，神像的眼睛闪烁着贪婪的光芒……',
    choices: [
      { text: '捐献50金币，获得随机增益', result: { type: 'spend_gold_for_buff', value: { gold_cost: 50, buff_type: 'random' }, description: '金币化为金光，你感受到了力量的涌动' } },
      { text: '拿走30金币', result: { type: 'gain_gold', value: 30, description: '你从神殿中取走了金币，神像的眼中闪过一丝怒意' } }
    ],
    layer: [1, 2, 3]
  },
  {
    id: 'cursed_mirror',
    name: '诅咒之镜',
    nameEn: 'Cursed Mirror',
    description: '一面古老的镜子映照出你扭曲的身影，镜中的你似乎在向你招手……',
    choices: [
      { text: '触碰镜子（获得随机稀有遗物，但获得一张诅咒）', result: { type: 'gain_relic_and_curse', value: { relic_rarity: 'rare', curse: 'random' }, description: '镜面碎裂，遗物从碎片中浮现，但诅咒也随之而来' } },
      { text: '离开', result: { type: 'nothing', value: 0, description: '你转身离开了这面诡异的镜子' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'forgotten_library',
    name: '遗忘图书馆',
    nameEn: 'Forgotten Library',
    description: '满是灰尘的图书馆中，古老的书籍仍在自行翻页，散发着微弱的光芒……',
    choices: [
      { text: '阅读书籍（升级2张随机牌）', result: { type: 'upgrade_random_cards', value: 2, description: '知识的力量流入了你的牌中' } },
      { text: '焚烧书籍（移除一张牌）', result: { type: 'remove_card', value: 1, description: '火焰吞噬了书籍，也带走了一张牌' } }
    ],
    layer: [1, 2, 3]
  },
  {
    id: 'blood_pact',
    name: '血之契约',
    nameEn: 'Blood Pact',
    description: '一份用鲜血书写的契约漂浮在空中，上面写着令人心动的条件……',
    choices: [
      { text: '签订契约（失去15%最大生命，获得150金币）', result: { type: 'lose_max_hp_for_gold', value: { hp_percent: 15, gold: 150 }, description: '鲜血从你身上流出，金币如雨般落下' } },
      { text: '撕毁契约', result: { type: 'nothing', value: 0, description: '你撕碎了契约，碎片化为灰烬' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'healing_spring',
    name: '治愈之泉',
    nameEn: 'Healing Spring',
    description: '一汪清澈的泉水从岩壁中涌出，散发着温暖的光芒……',
    choices: [
      { text: '饮用泉水（恢复25%生命值）', result: { type: 'heal_percent', value: 25, description: '温暖的泉水治愈了你的伤痛' } },
      { text: '用泉水洗礼武器（升级一张随机牌）', result: { type: 'upgrade_random_cards', value: 1, description: '泉水赋予了你的牌新的力量' } }
    ],
    layer: [1, 2, 3, 4]
  },
  {
    id: 'dark_ritual',
    name: '黑暗仪式',
    nameEn: 'Dark Ritual',
    description: '一个用骷髅围成的法阵在地上闪烁着暗红色的光芒……',
    choices: [
      { text: '参与仪式（本场战斗获得2层力量，但牌组加入2张诅咒）', result: { type: 'gain_buff_and_curses', value: { buff: { type: 'strength', amount: 2, duration: 'combat' }, curses: 2 }, description: '黑暗的力量涌入你的身体，但代价是永恒的诅咒' } },
      { text: '破坏法阵', result: { type: 'nothing', value: 0, description: '你踢散了骷髅，法阵的光芒消失了' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'merchant_ghost',
    name: '商人之魂',
    nameEn: 'Merchant Ghost',
    description: '一个半透明的商人灵魂飘浮在你面前，手中仍紧握着商品……',
    choices: [
      { text: '购买遗物（花费80金币）', result: { type: 'buy_relic', value: { gold_cost: 80 }, description: '灵魂满意地消散了，遗物留在了你手中' } },
      { text: '挑战精英（免费获得遗物）', result: { type: 'fight_elite_for_relic', value: 1, description: '你接受了挑战，一场恶战即将开始' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'ancient_forge',
    name: '远古熔炉',
    nameEn: 'Ancient Forge',
    description: '一座远古的熔炉仍在燃烧，炉火中似乎能锻造任何东西……',
    choices: [
      { text: '锻造（升级3张牌）', result: { type: 'upgrade_random_cards', value: 3, description: '炉火锻造了你的牌，使其更加强大' } },
      { text: '熔炼（变形2张牌）', result: { type: 'transform_cards', value: 2, description: '旧牌在炉火中化为灰烬，新牌从火焰中诞生' } }
    ],
    layer: [3, 4]
  },
  {
    id: 'fallen_hero',
    name: '陨落英雄',
    nameEn: 'Fallen Hero',
    description: '一位陨落英雄的盔甲矗立于此，似乎仍在守护着什么……',
    choices: [
      { text: '拾取遗物（获得一张随机稀有牌）', result: { type: 'gain_random_card', value: { rarity: 'rare' }, description: '英雄的遗志融入了你的牌中' } },
      { text: '搜刮（获得50金币）', result: { type: 'gain_gold', value: 50, description: '你从盔甲中找到了金币' } }
    ],
    layer: [1, 2, 3]
  },
  {
    id: 'crystal_ball',
    name: '水晶球',
    nameEn: 'Crystal Ball',
    description: '一个巨大的水晶球悬浮在空中，其中闪烁着未来的影像……',
    choices: [
      { text: '窥视未来（查看接下来3个地图节点）', result: { type: 'reveal_map_nodes', value: 3, description: '水晶球中显现了前方的道路' } },
      { text: '支付30金币重掷地图节点', result: { type: 'reroll_map_nodes', value: { gold_cost: 30 }, description: '命运被改写了' } }
    ],
    layer: [1, 2, 3, 4]
  },
  {
    id: 'shadow_dealer',
    name: '暗影交易者',
    nameEn: 'Shadow Dealer',
    description: '一个隐藏在暗影中的身影向你伸出手，低声说着条件……',
    choices: [
      { text: '交易（免费移除一张诅咒，但失去5点最大生命）', result: { type: 'remove_curse_lose_max_hp', value: { max_hp_cost: 5 }, description: '诅咒被剥离，但你感到身体更加虚弱' } },
      { text: '拒绝', result: { type: 'nothing', value: 0, description: '暗影交易者消失在了黑暗中' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'twin_sisters',
    name: '双子姐妹',
    nameEn: 'Twin Sisters',
    description: '两个长相一模一样的女子站在岔路口，一个微笑，一个冷笑……',
    choices: [
      { text: '跟随微笑的姐姐（获得20金币和随机药水）', result: { type: 'gain_gold_and_potion', value: { gold: 20, potion: 'random' }, description: '姐姐给了你金币和一瓶药水' } },
      { text: '跟随冷笑的妹妹（获得一张随机非凡牌）', result: { type: 'gain_random_card', value: { rarity: 'uncommon' }, description: '妹妹递给你一张牌，脸上露出了意味深长的笑容' } }
    ],
    layer: [1, 2, 3]
  },
  {
    id: 'cursed_chest',
    name: '诅咒宝箱',
    nameEn: 'Cursed Chest',
    description: '一个散发着不祥气息的宝箱，锁链上刻满了诅咒符文……',
    choices: [
      { text: '打开宝箱（获得遗物和诅咒）', result: { type: 'gain_relic_and_curse', value: { relic_rarity: 'common', curse: 'random' }, description: '遗物的光芒与诅咒的阴影同时笼罩了你' } },
      { text: '撬锁取金（获得75金币）', result: { type: 'gain_gold', value: 75, description: '你避开了诅咒，只取走了金币' } }
    ],
    layer: [1, 2, 3, 4]
  },
  {
    id: 'training_dummy',
    name: '训练假人',
    nameEn: 'Training Dummy',
    description: '一个破旧的训练假人立在角落，似乎还能使用……',
    choices: [
      { text: '训练（升级所有打击和防御牌）', result: { type: 'upgrade_all_strikes_and_defends', value: 0, description: '反复的训练让你的基础牌更加精炼' } },
      { text: '破坏假人（永久获得1层力量）', result: { type: 'permanent_stat_boost', value: { stat: 'strength', amount: 1 }, description: '你一拳击碎了假人，力量在体内涌动' } }
    ],
    layer: [1, 2]
  },
  {
    id: 'ancient_totem',
    name: '远古图腾',
    nameEn: 'Ancient Totem',
    description: '一根雕刻着神秘图案的图腾柱散发着古老的力量……',
    choices: [
      { text: '祈祷（获得一张随机能力牌）', result: { type: 'gain_random_card', value: { type: 'power', rarity: 'any' }, description: '图腾的力量化为了一张能力牌' } },
      { text: '汲取力量（恢复30%生命值）', result: { type: 'heal_percent', value: 30, description: '图腾的生命力流入了你的身体' } }
    ],
    layer: [2, 3, 4]
  },
  {
    id: 'void_rift',
    name: '虚空裂隙',
    nameEn: 'Void Rift',
    description: '一道虚空裂隙在空间中撕裂开来，混沌的力量从中涌出……',
    choices: [
      { text: '投入虚空（变形2张牌为同稀有度的随机牌）', result: { type: 'transform_cards_same_rarity', value: 2, description: '虚空重塑了你的牌' } },
      { text: '远离裂隙（失去10点生命）', result: { type: 'lose_hp', value: 10, description: '虚空的余波还是波及了你' } }
    ],
    layer: [3, 4]
  },
  {
    id: 'final_offering',
    name: '最终献祭',
    nameEn: 'Final Offering',
    description: '深渊的尽头，一座祭坛散发着令人窒息的力量，这是最后的考验……',
    choices: [
      { text: '献祭（失去20点生命，获得Boss遗物）', result: { type: 'lose_hp_for_boss_relic', value: { hp_cost: 20 }, description: '鲜血的献祭换来了无上的力量' } },
      { text: '拒绝献祭', result: { type: 'nothing', value: 0, description: '你选择了自己的道路' } }
    ],
    layer: [4]
  }
];
