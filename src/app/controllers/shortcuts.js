/* eslint guard-for-in: 0 */

/**
 * Shortcuts controller
 * @class
 * @example
 *
 * Shortcuts.on('CTRL+C', () => {
 *
 *   console.log('CTRL+C');
 *
 * });
 *
 */

import ee from 'event-emitter';
import { State } from 'quantizer';

const codes = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  27: 'escape',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'delete',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  65: 'a',
  66: 'b',
  67: 'c',
  68: 'd',
  69: 'e',
  70: 'f',
  71: 'g',
  72: 'h',
  73: 'i',
  74: 'j',
  75: 'k',
  76: 'l',
  77: 'm',
  78: 'n',
  79: 'o',
  80: 'p',
  81: 'q',
  82: 'r',
  83: 's',
  84: 't',
  85: 'u',
  86: 'v',
  87: 'w',
  88: 'x',
  89: 'y',
  90: 'z',
  91: 'command',
  93: 'select key',
  186: ';',
  187: 'equal sign',
  188: 'comma',
  189: 'dash',
  190: 'period',
  191: 'forward slash',
  192: 'grave accent',
  219: 'open bracket',
  220: 'back slash',
  221: 'close braket',
  222: 'single quote',
  224: 'command',
};

class Shortcuts {

  constructor() {
    ee(this);

    this.pressed = new State.List();

    window.addEventListener('keydown', ::this.handleKeyDown);
    window.addEventListener('keyup', ::this.handleKeyUp);
    window.addEventListener('blur', ::this.handleBlur);
  }

  static keysHas(array, key) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] === key) {
        return true;
      }
    }
    return false;
  }

  register(shortcut) {
    const keys = shortcut.split('+');

    this.find('registred').add(keys);
  }

  add(key) {
    const inList = this.pressed.where({ id: key.id });

    if (!inList) {
      this.pressed.push(key);
    }
  }

  static compare(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i += 1) {
      const aKey = a[i];
      const state = Shortcuts.keysHas(b, aKey);
      if (state) {
        result.push(true);
      }
    }
    if (b.length === result.length) {
      return true;
    }
    return false;
  }

  findMatches(keys, event) {
    const prevented = Object.keys(this.__ee__ || {}).filter(k => k.charAt(0) === '!');
    if (prevented.length) {
      for (const l in prevented) {
        const shortcut = prevented[l].substr(1, prevented[l].length - 1).split('+');
        const match = Shortcuts.compare(keys, shortcut);
        if (match) {
          event.preventDefault();
          this.emit(prevented[l], event);
        }
      }
    }
    for (const l in this.__ee__) {
      const shortcut = l.split('+');
      const match = Shortcuts.compare(keys, shortcut);

      if (match) {
        event.preventDefault();
        this.emit(l, event);
      }
    }
  }

  remove(key) {
    const inList = this.pressed.where({ id: key.id });
    if (inList) {
      this.pressed.remove(inList);
    }
  }

  handleKeyDown(e) {
    this.add({ id: e.keyCode, name: codes[e.keyCode] });
    this.getPressedKeys(e);
  }

  handleKeyUp(e) {
    const name = codes[e.keyCode];
    if (name === 'command') {
      this.pressed.set([]);
    }
    this.remove({ id: e.keyCode, name });
    const prevented = Object.keys(this.__ee__ || {}).filter(k => k.charAt(0) === '!');
    if (prevented.length) {
      this.emit(`!UP:${name ? name.toUpperCase() : ''}`);
    } else {
      this.emit(`UP:${name ? name.toUpperCase() : ''}`);
    }
  }

  handleBlur() {
    const prevented = Object.keys(this.__ee__ || {}).filter(k => k.charAt(0) === '!');
    this.pressed.map((k) => {
      const name = k.get('name') ? k.get('name').toUpperCase() : '';
      if (prevented.length) {
        this.emit(`!UP:${name}`);
      } else {
        this.emit(`UP:${name}`);
      }
      return true;
    });
    this.pressed.set([]);
  }

  getPressedKeys(event) {
    const keys = this.pressed.get('name').map((n) => {
      if (n) {
        return n.toUpperCase();
      }
      return true;
    });
    this.findMatches(keys, event);
  }

}

export default new Shortcuts();
