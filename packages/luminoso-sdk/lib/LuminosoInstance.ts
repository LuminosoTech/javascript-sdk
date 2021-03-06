import EventEmitter, { Listener } from "@luminoso/datafile-manager/lib/EventEmitter";
import { DatafileManager } from "./core/DatafileManager";
import { Di } from "./di";
import { LuminosoOptions } from "./shared";

export class LuminosoInstance {
  private di: Di;

  private manager: DatafileManager;
  private listeners: EventEmitter = new EventEmitter();

  constructor(options: Partial<LuminosoOptions>) {
    this.di = Di.instance(options.sdkKey!!);
    this.manager = new DatafileManager(options.sdkKey!!);

    this.di.userService.postClientUser({
      key: "test",
      email: "test@test.com",
      firstName: "Fabrizio",
      lastName: "Rodin-Miron",
    });
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
