import PersistentKeyValueCache from "./persistentKeyValueCache";

export interface DatafileUpdate {
  datafile: string;
}

export interface DatafileUpdateListener {
  (datafileUpdate: DatafileUpdate): void;
}

// TODO: Replace this with the one from js-sdk-models
interface Managed {
  start(): void;
  stop(): Promise<any>;
}

export interface DatafileManager extends Managed {
  get: () => string;
  on: (eventName: string, listener: DatafileUpdateListener) => () => void;
  onReady: () => Promise<void>;
}

export interface DatafileManagerConfig {
  autoUpdate?: boolean;
  datafile?: string;
  sdkKey?: string;
  updateInterval?: number;
  urlTemplate?: string;
  cache?: PersistentKeyValueCache;
}

export interface NodeDatafileManagerConfig extends DatafileManagerConfig {
  datafileAccessToken?: string;
}
