export default class SeededRandom {
  constructor(seed) {
    if (typeof seed === 'string') {
      this.state = this._hashString(seed);
    } else if (typeof seed === 'number') {
      this.state = seed >>> 0;
    } else {
      this.state = (Date.now() ^ 0xDEADBEEF) >>> 0;
    }
    if (this.state === 0) this.state = 1;
  }

  _hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return hash >>> 0 || 1;
  }

  next() {
    this.state = ((this.state * 1664525) + 1013904223) & 0xFFFFFFFF;
    return (this.state >>> 0) / 0x100000000;
  }

  nextInt(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    const range = max - min + 1;
    return Math.floor(this.next() * range) + min;
  }

  nextChoice(array) {
    if (!array || array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  clone() {
    const copy = new SeededRandom(0);
    copy.state = this.state;
    return copy;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state >>> 0;
    if (this.state === 0) this.state = 1;
  }
}
