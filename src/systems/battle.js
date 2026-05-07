import CARDS from '../data/cards.js';
import ENEMIES from '../data/enemies.js';
import RELICS from '../data/relics.js';
import POTIONS from '../data/potions.js';
import CHARACTERS from '../data/characters.js';
import SaveSystem from './save.js';

export default class BattleSystem {
  static MAX_ENEMIES = 3;

  constructor(game) {
    this.game = game;
    this.events = game.events;
    this.enemies = [];
    this.turn = 0;
    this.isPlayerTurn = true;
    this.battleLog = [];
    this.cardsPlayedThisTurn = 0;
    this.attacksPlayedThisTurn = 0;
    this.skillsPlayedThisTurn = 0;
    this.powersPlayedThisTurn = 0;
    this.cardsPlayedThisCombat = 0;
    this.firstSkillPlayedThisCombat = false;
    this.firstAttackHitThisTurn = false;
    this.attackCounter = 0;
    this.isExtraTurn = false;
    this.selectedCard = null;
    this.selectedTarget = null;
    this.gameOver = false;
    this.victory = false;
    this.rewards = null;
    this.drawReductionNext = 0;
    this.energyLossNext = 0;
    this.playLimitThisTurn = -1;
    this.echoUsedThisTurn = false;
    this.burstCount = 0;
    this.arcaneMasteryCount = 0;
    this._originalEnemies = [];
  }

  startBattle(enemyIds) {
    this.enemies = [];
    this.turn = 0;
    this.isPlayerTurn = true;
    this.battleLog = [];
    this.cardsPlayedThisTurn = 0;
    this.attacksPlayedThisTurn = 0;
    this.skillsPlayedThisTurn = 0;
    this.powersPlayedThisTurn = 0;
    this.cardsPlayedThisCombat = 0;
    this.firstSkillPlayedThisCombat = false;
    this.firstAttackHitThisTurn = false;
    this.attackCounter = 0;
    this.isExtraTurn = false;
    this.selectedCard = null;
    this.selectedTarget = null;
    this.gameOver = false;
    this.victory = false;
    this.rewards = null;
    this.drawReductionNext = 0;
    this.energyLossNext = 0;
    this.playLimitThisTurn = -1;
    this.echoUsedThisTurn = false;
    this.burstCount = 0;
    this.arcaneMasteryCount = 0;

    const ascMods = SaveSystem.getAscensionModifiers(this.game.ascension);

    if (enemyIds.length > BattleSystem.MAX_ENEMIES) {
      enemyIds = enemyIds.slice(0, BattleSystem.MAX_ENEMIES);
    }

    for (const eid of enemyIds) {
      const template = ENEMIES.find(e => e.id === eid);
      if (!template) continue;
      let hp = this.game.rng.nextInt(template.hp[0], template.hp[1]);

      if (ascMods.enemyHpMultiplier && ascMods.enemyHpMultiplier > 1) {
        hp = Math.floor(hp * ascMods.enemyHpMultiplier);
      }
      if (template.isElite && ascMods.eliteHpMultiplier && ascMods.eliteHpMultiplier > 1) {
        hp = Math.floor(hp * ascMods.eliteHpMultiplier);
      }
      if (template.isBoss && ascMods.bossHpMultiplier && ascMods.bossHpMultiplier > 1) {
        hp = Math.floor(hp * ascMods.bossHpMultiplier);
      }

      const enemy = {
        id: template.id,
        name: template.name,
        nameEn: template.nameEn,
        hp: hp,
        maxHp: hp,
        block: 0,
        powers: {},
        intent: null,
        moves: template.moves,
        ai_pattern: template.ai_pattern,
        layer: template.layer,
        isElite: template.isElite || false,
        isBoss: template.isBoss || false,
        onDeath: template.onDeath || null,
        onHit: template.onHit || null,
        turnCount: 0,
        index: this.enemies.length
      };
      this.enemies.push(enemy);
    }

    this.game.startCombat();

    this._originalEnemies = this.enemies.map(e => ({ isElite: e.isElite, isBoss: e.isBoss }));

    const p = this.game.player;
    p.maxEnergy = 3;
    p.drawPile = this.game.rng.shuffle([...p.deck]);

    if (this.game.hasRelic('anchor')) {
      p.block += 10;
      this.addLog('锚：战斗开始获得10点格挡');
    }
    if (this.game.hasRelic('bag_of_marbles')) {
      for (const e of this.enemies) {
        this.addEnemyPower(e, 'vulnerable', 1);
      }
      this.addLog('弹珠袋：所有敌人获得1层易伤');
    }
    if (this.game.hasRelic('rosary')) {
      p.devotion += 2;
      this.addLog('念珠：获得2层虔诚');
    }
    if (this.game.hasRelic('cracked_core')) {
      this.firstSkillPlayedThisCombat = false;
    }
    if (this.game.hasRelic('hourglass')) {
      this.isExtraTurn = true;
      this.addLog('时光沙漏：获得额外回合');
    }
    if (this.game.hasRelic('broken_crown')) {
      p.maxEnergy += 1;
    }
    if (this.game.hasRelic('cursed_key')) {
      p.maxEnergy += 1;
    }
    if (this.game.hasRelic('fusion_hammer')) {
      p.maxEnergy += 1;
    }
    if (this.game.hasRelic('runic_cube')) {
      p.maxEnergy += 1;
    }
    if (this.game.hasRelic('pocketwatch')) {
      p.energy += 1;
    }

    this.startPlayerTurn();
    this.events.emit('battleStart', { enemyIds });
  }

  startPlayerTurn() {
    this.turn++;
    this.isPlayerTurn = true;
    this.cardsPlayedThisTurn = 0;
    this.attacksPlayedThisTurn = 0;
    this.skillsPlayedThisTurn = 0;
    this.powersPlayedThisTurn = 0;
    this.firstAttackHitThisTurn = false;
    this.echoUsedThisTurn = false;
    this.arcaneMasteryCount = 0;

    const p = this.game.player;
    if (this.game.hasRelic('calipers')) {
      p.block = Math.max(0, p.block - 15);
    } else if (!p.powers.bastion && !p.powers.bastion_plus) {
      p.block = 0;
    } else {
      const reduction = p.powers.bastion_plus ? 2 : 3;
      p.block = Math.max(0, p.block - reduction);
    }

    p.energy = p.maxEnergy;

    if (this.energyLossNext > 0) {
      p.energy = Math.max(0, p.energy - this.energyLossNext);
      this.addLog(`失去${this.energyLossNext}点能量`);
      this.energyLossNext = 0;
    }

    if (this.game.hasRelic('pocketwatch') && this.turn === 1) {
      p.energy += 1;
    }

    if (p.powers.brutality) {
      const stacks = p.powers.brutality;
      for (let i = 0; i < stacks; i++) {
        p.hp = Math.max(1, p.hp - 1);
        this.drawCards(1);
      }
      this.addLog(`残暴：失去${stacks}点生命，抽${stacks}张牌`);
    }

    if (p.powers.hymn_of_light) {
      const amount = p.powers.hymn_of_light;
      p.devotion += amount;
      this.addLog(`光明颂歌：获得${amount}层虔诚`);
    }
    if (p.powers.hymn_of_light_plus) {
      const amount = p.powers.hymn_of_light_plus * 2;
      p.devotion += amount;
      this.addLog(`光明颂歌+：获得${amount}层虔诚`);
    }

    if (p.powers.strength_per_turn) {
      const amount = p.powers.strength_per_turn;
      p.strength += amount;
      this.addLog(`恶魔形态：获得${amount}层力量`);
    }

    if (p.powers.focus_decay) {
      const amount = p.powers.focus_decay;
      if (p.powers.focus) {
        p.powers.focus = Math.max(0, p.powers.focus + amount);
      }
    }

    if (p.powers.regen && p.powers.regen > 0) {
      const healAmt = p.powers.regen;
      p.hp = Math.min(p.maxHp, p.hp + healAmt);
      this.addLog(`再生：恢复${healAmt}点生命`);
      p.powers.regen--;
      if (p.powers.regen <= 0) delete p.powers.regen;
    }

    let drawCount = 5;
    drawCount -= this.drawReductionNext;
    this.drawReductionNext = 0;
    drawCount = Math.max(1, drawCount);

    if (p.powers.machine_learning) {
      drawCount += 1;
    }
    if (p.powers.machine_learning_plus) {
      drawCount += 2;
    }

    this.drawCards(drawCount);

    if (this.playLimitThisTurn > 0) {
      this.playLimitThisTurn = 3;
    } else {
      this.playLimitThisTurn = -1;
    }

    for (const e of this.enemies) {
      if (e.hp > 0) {
        this.selectEnemyIntent(e);
      }
    }

    this.game.turn = this.turn;
    this.events.emit('turnStart', { turn: this.turn });
    this.events.emit('playerTurnStart', { turn: this.turn });
  }

  drawCards(count) {
    const p = this.game.player;
    for (let i = 0; i < count; i++) {
      if (p.drawPile.length === 0) {
        if (p.discardPile.length === 0) break;
        p.drawPile = this.game.rng.shuffle([...p.discardPile]);
        p.discardPile = [];
        this.addLog('弃牌堆洗入抽牌堆');
      }
      if (p.drawPile.length > 0) {
        const card = p.drawPile.pop();
        p.hand.push(card);
        if (this.game.hasRelic('runic_cube')) {
          p.hp = Math.max(1, p.hp - 1);
        }
        this.events.emit('cardDrawn', { card });
      }
    }
  }

  canPlayCard(handIndex) {
    const p = this.game.player;
    if (handIndex < 0 || handIndex >= p.hand.length) return false;
    if (!this.isPlayerTurn || this.gameOver) return false;

    const cardInstance = p.hand[handIndex];
    const cardData = this.game.getCardData(cardInstance);
    if (!cardData) return false;

    if (cardData.type === 'curse' && cardData.cost === -1) return false;
    if (cardData.type === 'status' && cardData.cost === -1) return false;

    let cost = cardData.cost;
    if (cost === -1 && cardData.type !== 'curse' && cardData.type !== 'status') {
      return p.energy > 0;
    }

    if (cardData.type === 'attack' && p.powers.attack_cost_reduce) {
      cost = Math.max(0, cost - p.powers.attack_cost_reduce);
    }

    if (p.powers.corruption && cardData.type === 'skill') {
      cost = 0;
    }

    if (this.game.hasRelic('cracked_core') && !this.firstSkillPlayedThisCombat && cardData.type === 'skill') {
      cost = 0;
    }

    if (cost > p.energy) return false;

    if (this.playLimitThisTurn > 0 && this.cardsPlayedThisTurn >= this.playLimitThisTurn) return false;

    return true;
  }

  cardNeedsTarget(handIndex) {
    const p = this.game.player;
    const cardInstance = p.hand[handIndex];
    const cardData = this.game.getCardData(cardInstance);
    if (!cardData) return false;

    const aliveEnemies = this.enemies.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0) return false;
    if (aliveEnemies.length === 1) return false;

    for (const eff of cardData.effects) {
      if (eff.target === 'enemy' || (eff.target === 'all_enemy' && aliveEnemies.length > 1)) {
        if (eff.type === 'damage' || eff.type === 'apply_power' || eff.type === 'remove_power') {
          if (eff.target === 'enemy') return true;
        }
      }
    }
    return false;
  }

  playCard(handIndex, targetIndex) {
    if (!this.canPlayCard(handIndex)) return false;

    const p = this.game.player;
    const cardInstance = p.hand.splice(handIndex, 1)[0];
    const cardData = this.game.getCardData(cardInstance);

    let cost = cardData.cost;
    if (cardData.type === 'attack' && p.powers.attack_cost_reduce) {
      cost = Math.max(0, cost - p.powers.attack_cost_reduce);
    }
    if (p.powers.corruption && cardData.type === 'skill') {
      cost = 0;
    }
    if (this.game.hasRelic('cracked_core') && !this.firstSkillPlayedThisCombat && cardData.type === 'skill') {
      cost = 0;
    }
    if (cardData.cost === -1) {
      cost = p.energy;
    }

    p.energy -= cost;

    this.cardsPlayedThisTurn++;
    this.cardsPlayedThisCombat++;

    if (cardData.type === 'attack') this.attacksPlayedThisTurn++;
    if (cardData.type === 'skill') this.skillsPlayedThisTurn++;
    if (cardData.type === 'power') this.powersPlayedThisTurn++;

    if (cardData.type === 'skill' && !this.firstSkillPlayedThisCombat) {
      this.firstSkillPlayedThisCombat = true;
    }

    const isEcho = !this.echoUsedThisTurn && p.powers.echo && this.cardsPlayedThisTurn === 1;

    for (const effect of cardData.effects) {
      this.executeEffect(effect, targetIndex, cardData);
    }

    if (cardData.type === 'power') {
      p.exhaustPile.push(cardInstance);
    } else if (cardData.exhaust || (p.powers.corruption && cardData.type === 'skill')) {
      let doExhaust = true;
      if (this.game.hasRelic('strange_spoon')) {
        doExhaust = this.game.rng.next() < 0.5;
        if (!doExhaust) {
          this.addLog('奇异勺：消耗未触发');
        }
      }
      if (doExhaust) {
        p.exhaustPile.push(cardInstance);
        this.events.emit('cardExhausted', { card: cardInstance, cardData });
        if (cardData.type === 'curse' || cardData.type === 'status') {
          this.triggerRelicOnCurseExhaust();
        }
        if (this.game.hasRelic('dead_branch')) {
          const randomCard = this.getRandomCardFromPool();
          if (randomCard) {
            p.hand.push(randomCard);
            this.addLog('枯枝：加入随机牌');
          }
        }
      } else {
        p.discardPile.push(cardInstance);
      }
    } else {
      p.discardPile.push(cardInstance);
    }

    if (cardData.type === 'attack') {
      this.attackCounter++;
      if (this.game.hasRelic('pen_nib') && this.attackCounter % 10 === 0) {
        this.addLog('笔尖：下一张攻击牌伤害翻倍');
      }
      if (this.game.hasRelic('ornamental_fan') && this.attacksPlayedThisTurn % 3 === 0) {
        p.block += 4;
        this.addLog('折扇：获得4点格挡');
      }
      if (this.game.hasRelic('kunai') && this.attacksPlayedThisTurn === 3) {
        p.dexterity += 1;
        this.addLog('苦无：获得1层敏捷');
      }
      if (this.game.hasRelic('shuriken') && this.attacksPlayedThisTurn === 3) {
        p.strength += 1;
        this.addLog('手里剑：获得1层力量');
      }
    }

    if (p.powers.thousand_cuts) {
      const dmg = p.powers.thousand_cuts;
      for (const e of this.enemies) {
        if (e.hp > 0) {
          this.dealDamageToEnemy(e, dmg, false);
        }
      }
    }

    if (cardData.combo) {
      p.combo++;
      let threshold = cardData.combo.threshold;
      if (p.powers.combo_reduce) {
        threshold = Math.max(1, threshold - p.powers.combo_reduce);
      }
      if (p.combo >= threshold) {
        this.executeEffect(cardData.combo.effect, targetIndex, cardData);
        this.addLog(`连击触发！`);
        p.combo = 0;
      }
    } else if (cardData.type !== 'curse' && cardData.type !== 'status') {
      p.combo = 0;
    }

    if (cardData.type === 'skill' && p.powers.burst && p.powers.burst > 0) {
      p.powers.burst--;
      if (p.powers.burst <= 0) delete p.powers.burst;
      this.addLog(`爆发：再次打出${cardData.name}`);
      for (const effect of cardData.effects) {
        this.executeEffect(effect, targetIndex, cardData);
      }
    }

    if (cardData.type === 'skill' && p.powers.arcane_mastery) {
      const maxRes = p.powers.arcane_mastery;
      if (this.arcaneMasteryCount < maxRes) {
        p.resonance += 1;
        this.arcaneMasteryCount++;
        this.addLog('奥术精通：获得1层共鸣');
      }
    }

    if (cardData.type === 'skill' && p.powers.spell_storm) {
      const dmg = 3;
      for (const e of this.enemies) {
        if (e.hp > 0) this.dealDamageToEnemy(e, dmg, false);
      }
      this.addLog('法术风暴：对所有敌人造成3点伤害');
    }
    if (cardData.type === 'skill' && p.powers.spell_storm_plus) {
      const dmg = 5;
      for (const e of this.enemies) {
        if (e.hp > 0) this.dealDamageToEnemy(e, dmg, false);
      }
      this.addLog('法术风暴+：对所有敌人造成5点伤害');
    }

    if (isEcho) {
      this.echoUsedThisTurn = true;
      this.addLog(`回响形态：再次打出${cardData.name}`);
      for (const effect of cardData.effects) {
        this.executeEffect(effect, targetIndex, cardData);
      }
    }

    this.checkAllEnemyDeath();

    this.events.emit('cardPlayed', { card: cardInstance, cardData, handIndex, targetIndex });
    this.addLog(`你打出【${cardData.name}】`);

    return true;
  }

  executeEffect(effect, targetIndex, cardData) {
    const p = this.game.player;
    const isAttack = effect.type === 'damage';
    const aliveEnemies = this.enemies.filter(e => e.hp > 0);

    switch (effect.type) {
      case 'damage': {
        if (effect.target === 'all_enemy') {
          let repeatCount = 1;
          if (effect.repeat === 'energy') {
            repeatCount = p.energy;
          }
          if (effect.modifier === 'exhaust_hand') {
            repeatCount = p.hand.length;
            const toExhaust = [...p.hand];
            p.hand = [];
            for (const c of toExhaust) {
              p.exhaustPile.push(c);
              this.events.emit('cardExhausted', { card: c, cardData: this.game.getCardData(c) });
            }
          }
          for (let r = 0; r < repeatCount; r++) {
            const dmg = this.calculateDamage(effect.value, isAttack);
            for (const e of aliveEnemies) {
              this.dealDamageToEnemy(e, dmg, isAttack);
            }
          }
        } else if (effect.target === 'enemy') {
          let repeatCount = 1;
          if (effect.repeat === 'energy') {
            repeatCount = p.energy;
          }
          if (effect.modifier === 'exhaust_hand') {
            repeatCount = p.hand.length;
            const toExhaust = [...p.hand];
            p.hand = [];
            for (const c of toExhaust) {
              p.exhaustPile.push(c);
              this.events.emit('cardExhausted', { card: c, cardData: this.game.getCardData(c) });
            }
          }
          if (effect.modifier === 'per_resonance') {
            repeatCount = p.resonance;
            p.resonance = 0;
          }
          if (effect.modifier === 'missing_hp_percent') {
            const missingHp = p.maxHp - p.hp;
            const dmg = Math.max(1, Math.floor(missingHp * effect.percent / 100));
            const target = this.getTarget(targetIndex, aliveEnemies);
            if (target) this.dealDamageToEnemy(target, dmg, isAttack);
            break;
          }
          for (let r = 0; r < repeatCount; r++) {
            const target = effect.target === 'enemy' && aliveEnemies.length > 1
              ? this.getTarget(targetIndex, aliveEnemies)
              : (aliveEnemies[0] || null);
            if (target) {
              const dmg = this.calculateDamage(effect.value, isAttack);
              this.dealDamageToEnemy(target, dmg, isAttack);
            }
          }
        } else if (effect.target === 'self') {
          const dmg = effect.value;
          p.hp = Math.max(0, p.hp - dmg);
          this.addLog(`失去${dmg}点生命`);
          if (p.hp <= 0) this.checkPlayerDeath();
        }
        break;
      }
      case 'block': {
        if (effect.modifier === 'double') {
          const doubled = p.block;
          p.block += doubled;
          this.addLog(`格挡翻倍，获得${doubled}点格挡`);
        } else {
          const block = this.calculateBlock(effect.value);
          p.block += block;
          this.addLog(`获得${block}点格挡`);
        }
        break;
      }
      case 'draw': {
        this.drawCards(effect.value);
        this.addLog(`抽${effect.value}张牌`);
        break;
      }
      case 'gain_energy': {
        const amt = effect.value;
        p.energy += amt;
        if (amt > 0) this.addLog(`获得${amt}点能量`);
        break;
      }
      case 'apply_power': {
        if (effect.target === 'self') {
          if (effect.modifier === 'double') {
            const current = p.powers[effect.power] || 0;
            p.powers[effect.power] = current + current;
            this.addLog(`${effect.power}翻倍`);
          } else {
            this.game.addPower(effect.power, effect.value);
            this.addLog(`获得${effect.value}层${effect.power}`);
          }
          if (effect.power === 'no_block') {
            p.powers.no_block = 1;
          }
        } else if (effect.target === 'enemy') {
          const target = this.getTarget(targetIndex, aliveEnemies);
          if (target) {
            if (effect.modifier === 'double') {
              const current = target.powers[effect.power] || 0;
              target.powers[effect.power] = current * 2;
              this.addLog(`${target.name}的${effect.power}翻倍`);
            } else if (effect.modifier === 'triple') {
              const current = target.powers[effect.power] || 0;
              target.powers[effect.power] = current * 3;
              this.addLog(`${target.name}的${effect.power}变为3倍`);
            } else {
              this.addEnemyPower(target, effect.power, effect.value);
            }
          }
        } else if (effect.target === 'all_enemy') {
          for (const e of aliveEnemies) {
            this.addEnemyPower(e, effect.power, effect.value);
          }
        }
        break;
      }
      case 'remove_power': {
        if (effect.target === 'self') {
          if (effect.delay === 'end_turn') {
            if (!p.powers._delayedRemovals) p.powers._delayedRemovals = [];
            p.powers._delayedRemovals.push({ power: effect.power, amount: effect.value });
          } else {
            if (p.powers[effect.power]) {
              p.powers[effect.power] -= effect.value;
              if (p.powers[effect.power] <= 0) delete p.powers[effect.power];
            }
          }
        }
        break;
      }
      case 'heal': {
        if (effect.modifier === 'damage_dealt') {
          // handled separately via lastDamageDealt tracking
        } else {
          const amt = effect.value;
          const healed = Math.min(amt, p.maxHp - p.hp);
          p.hp += healed;
          if (healed > 0) this.addLog(`恢复${healed}点生命`);
        }
        break;
      }
      case 'exhaust_card': {
        const filter = effect.filter;
        let targetCard = null;
        let targetIdx = -1;
        if (filter === 'status') {
          targetIdx = p.hand.findIndex(c => {
            const d = this.game.getCardData(c);
            return d && d.type === 'status';
          });
        } else if (filter === 'curse_or_status') {
          targetIdx = p.hand.findIndex(c => {
            const d = this.game.getCardData(c);
            return d && (d.type === 'curse' || d.type === 'status');
          });
        } else if (filter === 'non_attack') {
          targetIdx = p.hand.findIndex(c => {
            const d = this.game.getCardData(c);
            return d && d.type !== 'attack';
          });
        } else {
          targetIdx = 0;
        }
        if (targetIdx >= 0) {
          targetCard = p.hand.splice(targetIdx, 1)[0];
          p.exhaustPile.push(targetCard);
          const cd = this.game.getCardData(targetCard);
          this.events.emit('cardExhausted', { card: targetCard, cardData: cd });
          this.addLog(`消耗了${cd ? cd.name : '一张牌'}`);
          if (cd && (cd.type === 'curse' || cd.type === 'status')) {
            this.triggerRelicOnCurseExhaust();
          }
        }
        break;
      }
      case 'add_card_to_hand': {
        let filter = effect.filter;
        let upgraded = false;
        if (filter === 'random_attack_upgraded') {
          filter = 'random_attack';
          upgraded = true;
        } else if (filter === 'random_skill_upgraded') {
          filter = 'random_skill';
          upgraded = true;
        }
        const pool = CARDS.filter(c => {
          if (filter === 'random_attack') return c.type === 'attack';
          if (filter === 'random_skill') return c.type === 'skill';
          return true;
        });
        if (pool.length > 0) {
          const chosen = this.game.rng.nextChoice(pool);
          const newCard = {
            id: chosen.id,
            uuid: `${chosen.id}_${this.game.rng.nextInt(0, 999999)}`,
            upgraded: upgraded
          };
          p.hand.push(newCard);
          this.addLog(`加入${chosen.name}到手牌`);
        }
        break;
      }
      case 'add_card_to_deck': {
        const cardId = effect.card;
        const newCard = {
          id: cardId,
          uuid: `${cardId}_${this.game.rng.nextInt(0, 999999)}`,
          upgraded: false
        };
        p.discardPile.push(newCard);
        const cd = CARDS.find(c => c.id === cardId);
        this.addLog(`${cd ? cd.name : cardId}加入弃牌堆`);
        break;
      }
      case 'gain_fury': {
        p.fury += effect.value;
        this.addLog(`获得${effect.value}层战意`);
        break;
      }
      case 'gain_resonance': {
        p.resonance += effect.value;
        this.addLog(`获得${effect.value}层共鸣`);
        if (p.resonance >= 3) {
          this.addLog('共鸣触发！');
          if (p.powers.resonance_strength) {
            p.strength += p.powers.resonance_strength;
            this.addLog(`共鸣强化：获得${p.powers.resonance_strength}层力量`);
          }
          p.resonance -= 3;
        }
        break;
      }
      case 'trigger_resonance': {
        if (p.resonance >= 3) {
          this.addLog('共鸣触发！');
          if (p.powers.resonance_strength) {
            p.strength += p.powers.resonance_strength;
            this.addLog(`共鸣强化：获得${p.powers.resonance_strength}层力量`);
          }
          p.resonance -= 3;
        }
        break;
      }
      case 'gain_devotion': {
        p.devotion += effect.value;
        this.addLog(`获得${effect.value}层虔诚`);
        if (p.powers.divine_favor) {
          const handCards = p.hand.filter(c => {
            const d = this.game.getCardData(c);
            return d && d.cost > 0;
          });
          if (handCards.length > 0) {
            const target = this.game.rng.nextChoice(handCards);
            const td = this.game.getCardData(target);
            if (td) {
              td._costOverride = Math.max(0, (td.cost || 0) - 1);
              this.addLog('神恩：随机手牌消耗-1');
            }
          }
        }
        if (p.devotion >= 5) {
          const devotionSpend = Math.floor(p.devotion / 5) * 5;
          const pulses = devotionSpend / 5;
          for (let i = 0; i < pulses; i++) {
            for (const e of aliveEnemies) {
              this.dealDamageToEnemy(e, 8, false);
            }
            const healed = Math.min(3, p.maxHp - p.hp);
            p.hp += healed;
            this.addLog('虔诚之光：对所有敌人造成8点伤害，恢复3点生命');
          }
          p.devotion -= devotionSpend;
        }
        break;
      }
      case 'conditional': {
        const cond = effect.condition;
        let met = false;
        if (cond.stat === 'devotion') {
          met = cond.op === 'gt' ? p.devotion > cond.value : cond.op === 'gte' ? p.devotion >= cond.value : p.devotion < cond.value;
        } else if (cond.stat === 'resonance') {
          met = p.resonance >= cond.value;
        } else if (cond.stat === 'skills_played_this_turn') {
          met = this.skillsPlayedThisTurn >= cond.value;
        } else if (cond.stat === 'combo') {
          met = p.combo >= cond.value;
        }
        if (met) {
          this.executeEffect(effect.effect, targetIndex, cardData);
        }
        break;
      }
    }
  }

  getTarget(targetIndex, aliveEnemies) {
    if (targetIndex !== undefined && targetIndex !== null && targetIndex >= 0) {
      const enemy = this.enemies[targetIndex];
      if (enemy && enemy.hp > 0) return enemy;
    }
    return aliveEnemies[0] || null;
  }

  calculateDamage(baseDamage, isAttack) {
    const p = this.game.player;
    let damage = baseDamage + (p.strength || 0);

    if (isAttack && p.fury > 0 && p.characterId === 'ironclad') {
      damage += p.fury * 2;
    }

    if (isAttack && p.powers.accuracy) {
      damage += p.powers.accuracy;
    }

    if (isAttack && p.powers.focus) {
      damage += p.powers.focus;
    }

    return Math.max(0, damage);
  }

  calculateBlock(baseBlock) {
    const p = this.game.player;
    if (p.powers.no_block) return 0;
    let block = baseBlock + (p.dexterity || 0);
    return Math.max(0, block);
  }

  dealDamageToEnemy(enemy, baseDamage, isAttack) {
    if (enemy.hp <= 0) return 0;

    const p = this.game.player;
    let damage = baseDamage;

    if (isAttack) {
      if (this.game.hasRelic('pen_nib') && this.attackCounter % 10 === 0) {
        damage *= 2;
      }
    }

    if (enemy.powers.vulnerable && enemy.powers.vulnerable > 0) {
      damage = Math.floor(damage * 1.5);
    }

    if (p.powers.weak && p.powers.weak > 0) {
      damage = Math.floor(damage * 0.75);
    }

    if (enemy.powers.penitence && enemy.powers.penitence > 0) {
      damage += enemy.powers.penitence;
    }

    damage = Math.max(0, damage);

    let unblocked = damage;
    if (enemy.block > 0) {
      const absorbed = Math.min(enemy.block, unblocked);
      enemy.block -= absorbed;
      unblocked -= absorbed;
    }

    enemy.hp -= unblocked;
    if (unblocked > 0) {
      if (p.powers.envenom) {
        this.addEnemyPower(enemy, 'poison', p.powers.envenom);
      }
      if (this.game.hasRelic('viper_fang') && !this.firstAttackHitThisTurn && isAttack) {
        this.addEnemyPower(enemy, 'poison', 2);
        this.firstAttackHitThisTurn = true;
      }
    }

    this.addLog(`对${enemy.name}造成${unblocked}点伤害`);

    if (enemy.hp <= 0) {
      this.checkEnemyDeath(enemy);
    }

    this.events.emit('enemyDamaged', { enemy, damage });
    return damage;
  }

  addEnemyPower(enemy, powerId, amount) {
    if (!enemy.powers[powerId]) enemy.powers[powerId] = 0;
    enemy.powers[powerId] += amount;
    if (enemy.powers[powerId] <= 0) delete enemy.powers[powerId];
  }

  endPlayerTurn() {
    if (!this.isPlayerTurn || this.gameOver) return;
    this.isPlayerTurn = false;

    const p = this.game.player;

    if (p.powers._delayedRemovals) {
      for (const rem of p.powers._delayedRemovals) {
        if (p.powers[rem.power]) {
          p.powers[rem.power] -= rem.amount;
          if (p.powers[rem.power] <= 0) delete p.powers[rem.power];
        }
      }
      delete p.powers._delayedRemovals;
    }

    for (const card of [...p.hand]) {
      const cd = this.game.getCardData(card);
      if (cd && cd.type === 'curse') {
        if (card.id === 'curse_decay') {
          p.hp = Math.max(0, p.hp - 2);
          this.addLog('腐朽：受到2点伤害');
        }
        if (card.id === 'curse_delay') {
          this.drawReductionNext += 1;
          this.addLog('迟滞：下回合少抽1张牌');
        }
        if (card.id === 'curse_doubt') {
          this.energyLossNext += 1;
          this.addLog('疑虑：下回合失去1点能量');
        }
        if (card.id === 'curse_normality') {
          this.playLimitThisTurn = 3;
          this.addLog('常态：下回合最多打出3张牌');
        }
      }
      if (cd && cd.type === 'status') {
        if (card.id === 'status_void') {
          this.drawReductionNext += 1;
        }
      }
    }

    const handCopy = [...p.hand];
    for (const card of handCopy) {
      const cd = this.game.getCardData(card);
      if (cd && cd.exhaust && (cd.type === 'status')) {
        const idx = p.hand.indexOf(card);
        if (idx >= 0) {
          p.hand.splice(idx, 1);
          p.exhaustPile.push(card);
        }
      } else {
        const idx = p.hand.indexOf(card);
        if (idx >= 0) {
          p.hand.splice(idx, 1);
          p.discardPile.push(card);
        }
      }
    }
    p.hand = [];

    if (p.powers.metallicize) {
      const block = this.calculateBlock(p.powers.metallicize);
      p.block += block;
      this.addLog(`金属化：获得${block}点格挡`);
    }

    if (p.powers.creative_ai) {
      for (let i = 0; i < p.powers.creative_ai; i++) {
        const powerPool = CARDS.filter(c => c.type === 'power' && c.type !== 'curse' && c.type !== 'status');
        if (powerPool.length > 0) {
          const chosen = this.game.rng.nextChoice(powerPool);
          const newCard = {
            id: chosen.id,
            uuid: `${chosen.id}_cai_${this.game.rng.nextInt(0, 999999)}`,
            upgraded: false
          };
          p.hand.push(newCard);
          this.addLog(`创意AI：加入${chosen.name}到手牌`);
        }
      }
    }
    if (p.powers.creative_ai_plus) {
      for (let i = 0; i < p.powers.creative_ai_plus; i++) {
        const powerPool = CARDS.filter(c => c.type === 'power' && c.type !== 'curse' && c.type !== 'status');
        if (powerPool.length > 0) {
          const chosen = this.game.rng.nextChoice(powerPool);
          const newCard = {
            id: chosen.id,
            uuid: `${chosen.id}_cai_${this.game.rng.nextInt(0, 999999)}`,
            upgraded: true
          };
          p.hand.push(newCard);
          this.addLog(`创意AI+：加入${chosen.name}+到手牌`);
        }
      }
    }

    if (p.powers.sanctuary) {
      const block = this.calculateBlock(p.devotion * 2);
      p.block += block;
      this.addLog(`圣域：获得${block}点格挡`);
    }
    if (p.powers.sanctuary_plus) {
      const block = this.calculateBlock(p.devotion * 3);
      p.block += block;
      this.addLog(`圣域+：获得${block}点格挡`);
    }

    if (p.characterId === 'hierophant' && p.devotion >= 3) {
      const devotionSpend = Math.floor(p.devotion / 3) * 3;
      const heals = devotionSpend / 3;
      const healed = Math.min(heals, p.maxHp - p.hp);
      p.hp += healed;
      p.devotion -= devotionSpend;
      if (healed > 0) this.addLog(`虔诚治愈：恢复${healed}点生命`);
    }

    if (p.characterId === 'ironclad') {
      p.fury = Math.floor(p.fury / 2);
    }

    if (this.game.hasRelic('orichalcum') && p.block === 0) {
      p.block += 6;
      this.addLog('山铜：获得6点格挡');
    }

    if (p.powers.no_block) {
      delete p.powers.no_block;
    }
    if (p.powers.attack_cost_reduce) {
      delete p.powers.attack_cost_reduce;
    }
    if (p.powers.flame_barrier) {
      delete p.powers.flame_barrier;
    }
    if (p.powers.intangible) {
      p.powers.intangible--;
      if (p.powers.intangible <= 0) delete p.powers.intangible;
    }

    this.events.emit('turnEnd', { turn: this.turn });
    this.events.emit('playerTurnEnd', { turn: this.turn });

    if (this.isExtraTurn) {
      this.isExtraTurn = false;
      const dazedCard = {
        id: 'status_dazed',
        uuid: `status_dazed_${this.game.rng.nextInt(0, 999999)}`,
        upgraded: false
      };
      p.discardPile.push(dazedCard);
      this.addLog('时光沙漏：加入1张空虚');
      this.startPlayerTurn();
      return;
    }

    this.enemyTurn();
  }

  enemyTurn() {
    this.isPlayerTurn = false;
    this.events.emit('enemyTurnStart');

    const p = this.game.player;

    for (const enemy of this.enemies) {
      if (enemy.hp <= 0) continue;

      enemy.turnCount++;
      const intent = enemy.intent;
      if (!intent) continue;

      switch (intent.intent) {
        case 'attack': {
          let damage = intent.value + (enemy.powers.strength || 0);
          const ascMods = SaveSystem.getAscensionModifiers(this.game.ascension);
          if (ascMods.enemyDamageMultiplier && ascMods.enemyDamageMultiplier > 1) {
            damage = Math.floor(damage * ascMods.enemyDamageMultiplier);
          }
          if (p.powers.vulnerable && p.powers.vulnerable > 0) {
            damage = Math.floor(damage * 1.5);
          }
          if (enemy.powers.weak && enemy.powers.weak > 0) {
            damage = Math.floor(damage * 0.75);
          }
          if (enemy.powers.penitence && enemy.powers.penitence > 0) {
            // penitence only affects player attacks on enemy
          }
          damage = Math.max(0, damage);

          let remaining = damage;
          if (p.block > 0) {
            const absorbed = Math.min(p.block, remaining);
            p.block -= absorbed;
            remaining -= absorbed;
          }
          if (remaining > 0) {
            if (p.powers.intangible && p.powers.intangible > 0) {
              remaining = 1;
            }
            p.hp = Math.max(0, p.hp - remaining);
            this.addLog(`${enemy.name}使用${intent.name}，对你造成${remaining}点伤害`);

            if (p.powers.martyrdom) {
              p.devotion += 2;
              this.addLog('殉道：获得2层虔诚');
            }
            if (p.powers.martyrdom_plus) {
              p.devotion += 3;
              this.addLog('殉道+：获得3层虔诚');
            }

            if (p.hp <= 0) {
              if (p.powers.resurrection) {
                p.hp = Math.floor(p.maxHp * 0.5);
                delete p.powers.resurrection;
                this.addLog('复活：恢复50%生命');
              } else if (p.powers.resurrection_plus) {
                p.hp = Math.floor(p.maxHp * 0.75);
                delete p.powers.resurrection_plus;
                this.addLog('复活+：恢复75%生命');
              }
            }
          } else {
            this.addLog(`${enemy.name}使用${intent.name}，被格挡`);
          }

          if (p.powers.thorns && p.powers.thorns > 0) {
            const thornsDmg = p.powers.thorns;
            enemy.hp -= thornsDmg;
            this.addLog(`荆棘：对${enemy.name}造成${thornsDmg}点伤害`);
            if (enemy.hp <= 0) this.checkEnemyDeath(enemy);
          }
          if (p.powers.flame_barrier && p.powers.flame_barrier > 0) {
            const fbDmg = p.powers.flame_barrier;
            enemy.hp -= fbDmg;
            this.addLog(`火焰屏障：对${enemy.name}造成${fbDmg}点伤害`);
            if (enemy.hp <= 0) this.checkEnemyDeath(enemy);
          }

          if (intent.effect && intent.effect.type === 'heal_self') {
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + intent.effect.amount);
          }
          break;
        }
        case 'defend': {
          enemy.block += intent.value;
          this.addLog(`${enemy.name}使用${intent.name}，获得${intent.value}点格挡`);
          break;
        }
        case 'buff': {
          if (intent.effect) {
            if (intent.effect.type === 'apply_power') {
              this.addEnemyPower(enemy, intent.effect.power, intent.effect.amount);
              this.addLog(`${enemy.name}使用${intent.name}，获得${intent.effect.amount}层${intent.effect.power}`);
            } else if (intent.effect.type === 'heal_self') {
              enemy.hp = Math.min(enemy.maxHp, enemy.hp + intent.effect.amount);
              this.addLog(`${enemy.name}使用${intent.name}，恢复${intent.effect.amount}点生命`);
            }
          }
          break;
        }
        case 'debuff': {
          if (intent.effect) {
            if (intent.effect.type === 'apply_power') {
              this.game.addPower(intent.effect.power, intent.effect.amount);
              this.addLog(`${enemy.name}使用${intent.name}，你获得${intent.effect.amount}层${intent.effect.power}`);
            } else if (intent.effect.type === 'add_card_to_deck') {
              const cardId = intent.effect.card;
              const newCard = {
                id: cardId,
                uuid: `${cardId}_${this.game.rng.nextInt(0, 999999)}`,
                upgraded: false
              };
              p.discardPile.push(newCard);
              const cd = CARDS.find(c => c.id === cardId);
              this.addLog(`${enemy.name}使用${intent.name}，${cd ? cd.name : cardId}加入弃牌堆`);
            }
          }
          break;
        }
        case 'special': {
          if (intent.effect) {
            if (intent.effect.type === 'summon') {
              if (this.enemies.length >= BattleSystem.MAX_ENEMIES) {
                this.addLog(`${enemy.name}试图召唤但空间不足`);
                break;
              }
              const summonId = intent.effect.enemy;
              const summonHp = intent.effect.hp || 10;
              const summonTemplate = ENEMIES.find(e => e.id === summonId);
              if (summonTemplate) {
                const newEnemy = {
                  id: summonTemplate.id,
                  name: summonTemplate.name,
                  nameEn: summonTemplate.nameEn,
                  hp: summonHp,
                  maxHp: summonHp,
                  block: 0,
                  powers: {},
                  intent: null,
                  moves: summonTemplate.moves,
                  ai_pattern: summonTemplate.ai_pattern,
                  layer: summonTemplate.layer,
                  isElite: false,
                  isBoss: false,
                  onDeath: null,
                  onHit: null,
                  turnCount: 0,
                  index: this.enemies.length
                };
                this.selectEnemyIntent(newEnemy);
                this.enemies.push(newEnemy);
                this.addLog(`${enemy.name}召唤了${summonTemplate.name}`);
              }
            } else if (intent.effect.type === 'steal_gold') {
              const stolen = Math.min(p.gold, intent.effect.amount);
              p.gold -= stolen;
              this.addLog(`${enemy.name}偷走了${stolen}金币`);
            }
          }
          break;
        }
      }

      enemy.block = 0;
    }

    for (const enemy of this.enemies) {
      if (enemy.hp <= 0) continue;
      if (enemy.powers.poison && enemy.powers.poison > 0) {
        enemy.hp -= enemy.powers.poison;
        this.addLog(`${enemy.name}受到${enemy.powers.poison}点中毒伤害`);
        if (enemy.hp <= 0) {
          this.checkEnemyDeath(enemy);
        }
      }
      if (enemy.powers.ritual && enemy.powers.ritual > 0) {
        this.addEnemyPower(enemy, 'strength', enemy.powers.ritual);
      }
      if (enemy.powers.vulnerable && enemy.powers.vulnerable > 0) {
        enemy.powers.vulnerable--;
        if (enemy.powers.vulnerable <= 0) delete enemy.powers.vulnerable;
      }
      if (enemy.powers.weak && enemy.powers.weak > 0) {
        enemy.powers.weak--;
        if (enemy.powers.weak <= 0) delete enemy.powers.weak;
      }
      if (enemy.powers.penitence && enemy.powers.penitence > 0) {
        enemy.powers.penitence--;
        if (enemy.powers.penitence <= 0) delete enemy.powers.penitence;
      }
    }

    this.checkAllEnemyDeath();

    if (this.checkPlayerDeath()) return;

    const allDead = this.enemies.every(e => e.hp <= 0);
    if (allDead) {
      this.endBattle(true);
      return;
    }

    this.startPlayerTurn();
  }

  selectEnemyIntent(enemy) {
    const pattern = enemy.ai_pattern;
    if (!pattern || !enemy.moves || enemy.moves.length === 0) {
      enemy.intent = null;
      return;
    }

    let selectedMove = null;

    switch (pattern.type) {
      case 'weighted_random': {
        const totalWeight = enemy.moves.reduce((sum, m) => sum + (m.weight || 1), 0);
        let roll = this.game.rng.nextInt(1, totalWeight);
        for (const move of enemy.moves) {
          roll -= (move.weight || 1);
          if (roll <= 0) {
            selectedMove = move;
            break;
          }
        }
        if (!selectedMove) selectedMove = enemy.moves[0];
        break;
      }
      case 'aggressive': {
        const attacks = enemy.moves.filter(m => m.intent === 'attack');
        const others = enemy.moves.filter(m => m.intent !== 'attack');
        if (attacks.length > 0 && (others.length === 0 || this.game.rng.next() < 0.7)) {
          selectedMove = this.game.rng.nextChoice(attacks);
        } else {
          selectedMove = this.game.rng.nextChoice(others.length > 0 ? others : enemy.moves);
        }
        break;
      }
      case 'alternating': {
        const isOddTurn = enemy.turnCount % 2 === 0;
        const attacks = enemy.moves.filter(m => m.intent === 'attack');
        const debuffs = enemy.moves.filter(m => m.intent === 'debuff' || m.intent === 'buff');
        if (isOddTurn && attacks.length > 0) {
          selectedMove = this.game.rng.nextChoice(attacks);
        } else if (debuffs.length > 0) {
          selectedMove = this.game.rng.nextChoice(debuffs);
        } else {
          selectedMove = this.game.rng.nextChoice(enemy.moves);
        }
        break;
      }
      case 'pattern': {
        const rules = pattern.rules || [];
        const patternRule = rules.find(r => r.turn !== undefined);
        if (patternRule) {
          const cycleLen = rules.filter(r => r.turn !== undefined).length;
          const turnInCycle = ((enemy.turnCount - 1) % cycleLen) + 1;
          const rule = rules.find(r => r.turn === turnInCycle);
          if (rule) {
            selectedMove = enemy.moves.find(m => m.id === rule.move);
          }
        }
        if (!selectedMove) selectedMove = this.game.rng.nextChoice(enemy.moves);
        break;
      }
      case 'phase': {
        const rules = pattern.rules || [];
        const hpPct = enemy.hp / enemy.maxHp;
        let phaseMoves = null;
        if (hpPct > 0.5) {
          const phase1 = rules.find(r => r.phase === 1);
          if (phase1) phaseMoves = phase1.moves;
        } else {
          const phase2 = rules.find(r => r.phase === 2);
          if (phase2) phaseMoves = phase2.moves;
        }
        if (phaseMoves) {
          const moveId = this.game.rng.nextChoice(phaseMoves);
          selectedMove = enemy.moves.find(m => m.id === moveId);
        }
        if (!selectedMove) selectedMove = this.game.rng.nextChoice(enemy.moves);
        break;
      }
      case 'timed': {
        const rules = pattern.rules || [];
        let timed = false;
        for (const rule of rules) {
          if (rule.condition === 'every_2_turns' && enemy.turnCount % 2 === 0) {
            const move = enemy.moves.find(m => m.id === rule.action);
            if (move) { selectedMove = move; timed = true; break; }
          }
          if (rule.condition === 'every_3_turns' && enemy.turnCount % 3 === 0) {
            const move = enemy.moves.find(m => m.id === rule.action);
            if (move) { selectedMove = move; timed = true; break; }
          }
        }
        if (!timed) {
          selectedMove = this.game.rng.nextChoice(enemy.moves);
        }
        break;
      }
      case 'stealth': {
        if (enemy.turnCount === 0) {
          const defend = enemy.moves.find(m => m.intent === 'defend');
          selectedMove = defend || this.game.rng.nextChoice(enemy.moves);
        } else {
          const attacks = enemy.moves.filter(m => m.intent === 'attack');
          if (enemy.turnCount === 1 && attacks.length > 0) {
            const backstab = attacks.find(m => m.id === 'backstab') || attacks[0];
            selectedMove = backstab;
          } else {
            selectedMove = this.game.rng.nextChoice(enemy.moves);
          }
        }
        break;
      }
      case 'fast': {
        selectedMove = this.game.rng.nextChoice(enemy.moves);
        break;
      }
      case 'multi_unit': {
        selectedMove = this.game.rng.nextChoice(enemy.moves);
        break;
      }
      case 'multi_part': {
        selectedMove = this.game.rng.nextChoice(enemy.moves);
        break;
      }
      default: {
        selectedMove = this.game.rng.nextChoice(enemy.moves);
        break;
      }
    }

    enemy.intent = selectedMove || enemy.moves[0] || null;
  }

  checkEnemyDeath(enemy) {
    if (enemy.hp > 0) return;

    if (enemy.onDeath === 'split_into_small_slimes') {
      const maxToAdd = Math.min(2, BattleSystem.MAX_ENEMIES - this.enemies.length + 1);
      for (let i = 0; i < maxToAdd; i++) {
        const slimeHp = this.game.rng.nextInt(8, 12);
        const newEnemy = {
          id: 'slime_small',
          name: '小史莱姆',
          nameEn: 'Small Slime',
          hp: slimeHp,
          maxHp: slimeHp,
          block: 0,
          powers: {},
          intent: null,
          moves: ENEMIES.find(e => e.id === 'slime_small').moves,
          ai_pattern: ENEMIES.find(e => e.id === 'slime_small').ai_pattern,
          layer: 1,
          isElite: false,
          isBoss: false,
          onDeath: null,
          onHit: null,
          turnCount: 0,
          index: this.enemies.length
        };
        this.selectEnemyIntent(newEnemy);
        this.enemies.push(newEnemy);
      }
      this.addLog(`${enemy.name}分裂为2个小史莱姆`);
    }

    if (enemy.onDeath === 'deal_3_damage_to_player') {
      const p = this.game.player;
      let dmg = 3;
      if (p.block > 0) {
        const absorbed = Math.min(p.block, dmg);
        p.block -= absorbed;
        dmg -= absorbed;
      }
      if (dmg > 0) {
        p.hp = Math.max(0, p.hp - dmg);
      }
      this.addLog(`${enemy.name}死亡，对你造成3点伤害`);
    }

    if (enemy.powers.corpse_explosion && enemy.powers.corpse_explosion > 0) {
      const explosionDmg = enemy.maxHp;
      for (const e of this.enemies) {
        if (e !== enemy && e.hp > 0) {
          e.hp -= explosionDmg;
          this.addLog(`尸爆：对${e.name}造成${explosionDmg}点伤害`);
        }
      }
    }

    this.addLog(`${enemy.name}被击败`);
    this.events.emit('enemyKilled', { enemy });
  }

  checkAllEnemyDeath() {
    for (const enemy of [...this.enemies]) {
      if (enemy.hp <= 0) {
        const idx = this.enemies.indexOf(enemy);
        if (idx >= 0) {
          this.enemies.splice(idx, 1);
          for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].index = i;
          }
        }
      }
    }

    if (this.enemies.length === 0 && !this.victory && !this.gameOver) {
      this.endBattle(true);
    }
  }

  checkPlayerDeath() {
    const p = this.game.player;
    if (p.hp <= 0) {
      if (p.powers.resurrection) {
        p.hp = Math.floor(p.maxHp * 0.5);
        delete p.powers.resurrection;
        this.addLog('复活：恢复50%生命');
        return false;
      }
      if (p.powers.resurrection_plus) {
        p.hp = Math.floor(p.maxHp * 0.75);
        delete p.powers.resurrection_plus;
        this.addLog('复活+：恢复75%生命');
        return false;
      }
      this.gameOver = true;
      this.victory = false;
      this.endBattle(false);
      return true;
    }
    return false;
  }

  usePotion(potionIndex, targetIndex) {
    const p = this.game.player;
    if (potionIndex < 0 || potionIndex >= p.potions.length) return false;
    if (!this.isPlayerTurn || this.gameOver) return false;

    const potionInstance = p.potions[potionIndex];
    const potionData = POTIONS.find(pot => pot.id === potionInstance.id);
    if (!potionData || !potionData.usableInBattle) return false;

    const effect = potionData.effect;
    let value = effect.value;
    if (this.game.hasRelic('chemical_x')) {
      value = Math.floor(value * 1.5);
    }

    switch (effect.type) {
      case 'damage': {
        const aliveEnemies = this.enemies.filter(e => e.hp > 0);
        const target = this.getTarget(targetIndex, aliveEnemies);
        if (target) {
          this.dealDamageToEnemy(target, value, false);
        }
        break;
      }
      case 'block': {
        const block = this.calculateBlock(value);
        p.block += block;
        this.addLog(`获得${block}点格挡`);
        break;
      }
      case 'apply_power': {
        this.game.addPower(effect.power, value);
        this.addLog(`获得${value}层${effect.power}`);
        break;
      }
      case 'draw': {
        this.drawCards(value);
        this.addLog(`抽${value}张牌`);
        break;
      }
      case 'heal': {
        const healed = Math.min(value, p.maxHp - p.hp);
        p.hp += healed;
        this.addLog(`恢复${healed}点生命`);
        break;
      }
    }

    p.potions.splice(potionIndex, 1);
    this.addLog(`使用了${potionData.name}`);
    this.checkAllEnemyDeath();
    this.events.emit('potionUsed', { potionIndex, potionData });
    return true;
  }

  endBattle(victory) {
    this.victory = victory;
    this.gameOver = true;

    if (victory) {
      this.rewards = this.calculateRewards();
      this.addLog('战斗胜利！');

      if (this.game.hasRelic('burning_blood')) {
        this.game.heal(6);
        this.addLog('燃烧之血：恢复6点生命');
      }
    } else {
      this.addLog('战斗失败……');
    }

    this.game.endCombat();
    this.events.emit('battleEnd', { victory, rewards: this.rewards });
  }

  calculateRewards() {
    const enemies = this._originalEnemies.length > 0 ? this._originalEnemies : this.enemies;
    const isBoss = enemies.some(e => e.isBoss);
    const goldBase = enemies.reduce((sum, e) => {
      if (e.isBoss) return sum + 30;
      if (e.isElite) return sum + 20;
      return sum + 10;
    }, 0);
    const gold = goldBase + this.game.rng.nextInt(0, 10);

    const cards = this.getCardRewardChoices();

    const rewards = { gold, cards };

    if (isBoss) {
      const bossRelics = RELICS.filter(r => r.rarity === 'boss');
      const shuffled = this.game.rng.shuffle([...bossRelics]);
      rewards.relics = shuffled.slice(0, 3).map(r => ({
        id: r.id,
        name: r.name,
        nameEn: r.nameEn,
        description: r.description,
        rarity: r.rarity
      }));
    }

    return rewards;
  }

  getCardRewardChoices() {
    const p = this.game.player;
    const charData = CHARACTERS.find(c => c.id === p.characterId);
    const charPool = charData ? charData.cardPool : [];
    const commonPool = CARDS.filter(c => !c.character && c.type !== 'curse' && c.type !== 'status');

    const pool = [];
    for (const cid of charPool) {
      const card = CARDS.find(c => c.id === cid);
      if (card) pool.push(card);
    }
    for (const card of commonPool) {
      if (!pool.find(c => c.id === card.id)) pool.push(card);
    }

    const unlockedPool = pool.filter(c => SaveSystem.isCardUnlocked(c.id));

    let numChoices = 3;
    if (this.game.hasRelic('gambling_chip')) numChoices = 4;
    if (this.game.hasRelic('broken_crown')) numChoices = 2;

    const choices = [];
    const usedIds = new Set();
    const effectivePool = unlockedPool.length > 0 ? unlockedPool : pool;
    for (let i = 0; i < numChoices && effectivePool.length > 0; i++) {
      const roll = this.game.rng.next();
      let rarity;
      if (roll < 0.6) rarity = 'common';
      else if (roll < 0.9) rarity = 'uncommon';
      else rarity = 'rare';

      let filtered = effectivePool.filter(c => c.rarity === rarity && !usedIds.has(c.id));
      if (filtered.length === 0) filtered = effectivePool.filter(c => !usedIds.has(c.id));
      if (filtered.length === 0) break;

      const chosen = this.game.rng.nextChoice(filtered);
      usedIds.add(chosen.id);

      let upgraded = false;
      if (this.game.hasRelic('molten_egg') && chosen.rarity === 'common') {
        upgraded = true;
      }

      choices.push({
        id: chosen.id,
        name: chosen.name,
        nameEn: chosen.nameEn,
        type: chosen.type,
        cost: chosen.cost,
        rarity: chosen.rarity,
        description: chosen.description,
        effects: chosen.effects,
        upgraded
      });
    }

    return choices;
  }

  getRandomCardFromPool() {
    const pool = CARDS.filter(c => c.type !== 'curse' && c.type !== 'status');
    if (pool.length === 0) return null;
    const chosen = this.game.rng.nextChoice(pool);
    return {
      id: chosen.id,
      uuid: `${chosen.id}_${this.game.rng.nextInt(0, 999999)}`,
      upgraded: false
    };
  }

  triggerRelicOnCurseExhaust() {
    if (this.game.hasRelic('voodoo_doll')) {
      for (const e of this.enemies) {
        if (e.hp > 0) {
          this.dealDamageToEnemy(e, 8, false);
        }
      }
      this.addLog('巫毒娃娃：对所有敌人造成8点伤害');
    }
  }

  addLog(message) {
    this.battleLog.push(message);
    if (this.battleLog.length > 50) {
      this.battleLog.shift();
    }
    this.events.emit('battleLog', { message });
  }

  getEnemyById(enemyId) {
    return ENEMIES.find(e => e.id === enemyId);
  }

  getEnemiesForFloor(floor, act) {
    const layer = Math.min(act, 4);
    const pool = ENEMIES.filter(e => e.layer === layer && !e.isBoss);
    const normal = pool.filter(e => !e.isElite);
    const elite = pool.filter(e => e.isElite);
    return { normal, elite, boss: ENEMIES.find(e => e.layer === layer && e.isBoss) };
  }

  generateEncounter(floor, act) {
    const { normal, elite, boss } = this.getEnemiesForFloor(floor, act);
    if (floor % 15 === 0 && boss) {
      return [boss.id];
    }
    if (floor % 5 === 0 && elite) {
      const count = this.game.rng.nextInt(1, 2);
      const enemies = [];
      for (let i = 0; i < count; i++) {
        enemies.push(this.game.rng.nextChoice(elite).id);
      }
      return enemies;
    }
    const count = this.game.rng.nextInt(1, 3);
    const enemies = [];
    for (let i = 0; i < count; i++) {
      enemies.push(this.game.rng.nextChoice(normal).id);
    }
    return enemies;
  }
}
