import ee from 'event-emitter';

class Network {

  constructor() {
    this.onLine = window.navigator.onLine;
    ee(this);

    window.addEventListener('online', ::this.onOnline);
    window.addEventListener('offline', ::this.onOffline);
  }

  onOnline() {
    this.onLine = true;
    this.emit('change', true);
    this.emit('online');
  }

  onOffline() {
    this.onLine = false;
    this.emit('change', false);
    this.emit('offline');
  }

  getContext() {
    const self = this;
    return {
      on: self.on.bind(self),
      off: self.off.bind(self),
      get onLine() { return self.onLine; },
    };
  }

}

export default new Network();
