export default class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = parseInt(localStorage.getItem('abyss_deck_volume') || '50') / 100;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not available');
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _playTone(frequency, duration, type = 'sine', gainValue = 0.3) {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    gain.gain.setValueAtTime(gainValue * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  playAttack() {
    this._playTone(200, 0.15, 'sawtooth', 0.2);
  }

  playBlock() {
    this._playTone(400, 0.1, 'sine', 0.15);
  }

  playPower() {
    this._playTone(600, 0.2, 'triangle', 0.2);
  }

  playHeal() {
    this._playTone(523, 0.15, 'sine', 0.2);
    setTimeout(() => this._playTone(659, 0.15, 'sine', 0.2), 100);
  }

  playDamage() {
    this._playTone(100, 0.2, 'sawtooth', 0.3);
  }

  playCardDraw() {
    this._playTone(800, 0.05, 'sine', 0.1);
  }

  playButtonClick() {
    this._playTone(500, 0.08, 'sine', 0.15);
  }

  playVictory() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this._playTone(f, 0.3, 'sine', 0.2), i * 150);
    });
  }

  playGameOver() {
    [400, 350, 300, 200].forEach((f, i) => {
      setTimeout(() => this._playTone(f, 0.4, 'sawtooth', 0.15), i * 200);
    });
  }
}
