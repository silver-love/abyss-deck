export default class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
    return this;
  }

  off(event, callback) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    if (this._listeners[event].length === 0) {
      delete this._listeners[event];
    }
    return this;
  }

  emit(event, ...args) {
    if (!this._listeners[event]) return this;
    const listeners = this._listeners[event].slice();
    for (const cb of listeners) {
      try {
        cb(...args);
      } catch (e) {
        console.error(`EventEmitter error on "${event}":`, e);
      }
    }
    return this;
  }

  once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      callback(...args);
    };
    wrapper._original = callback;
    return this.on(event, wrapper);
  }

  removeAllListeners(event) {
    if (event !== undefined) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }
    return this;
  }

  listenerCount(event) {
    return this._listeners[event] ? this._listeners[event].length : 0;
  }

  eventNames() {
    return Object.keys(this._listeners);
  }
}
