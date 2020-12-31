export type Disposer = () => void;

export type Listener = (arg?: any) => void;

interface Listeners {
  [index: string]: {
    // index is event name
    [index: string]: Listener; // index is listener id
  };
}

export default class EventEmitter {
  private listeners: Listeners = {};

  private listenerId = 1;

  on(eventName: string, listener: Listener): Disposer {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = {};
    }
    const currentListenerId = String(this.listenerId);
    this.listenerId++;
    this.listeners[eventName][currentListenerId] = listener;
    return (): void => {
      if (this.listeners[eventName]) {
        delete this.listeners[eventName][currentListenerId];
      }
    };
  }

  emit(eventName: string, arg?: any): void {
    const listeners = this.listeners[eventName];
    if (listeners) {
      Object.keys(listeners).forEach((listenerId) => {
        const listener = listeners[listenerId];
        listener(arg);
      });
    }
  }

  removeAllListeners(): void {
    this.listeners = {};
  }
}
