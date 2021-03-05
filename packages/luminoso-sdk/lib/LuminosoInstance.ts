import EventEmitter, { Listener } from "@luminoso/datafile-manager/lib/EventEmitter";
import { DatafileManager } from "./core/DatafileManager";
import { LuminosoOptions } from "./shared";

export class LuminosoInstance {
  private manager: DatafileManager;
  private listeners: EventEmitter = new EventEmitter();

  constructor(options: Partial<LuminosoOptions>) {
    this.manager = new DatafileManager(options.sdkKey!!);
  }

  get datafile(): string {
    return this.manager.datafile;
  }

  public variation(key: string): string {
    return "";
  }

  public track(event: string) {}

  public on(eventName: string, listener: Listener) {
    this.listeners.on(eventName, listener);
  }
}
