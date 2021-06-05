import EventEmitter, { Listener } from "@luminoso/datafile-manager/lib/EventEmitter";
import { DatafileManager } from "./core/DatafileManager";
import { Di } from "./di";
import { User } from "./models/user/interfaces/User";
import { FeaturesEnabledByKey } from "./models/variations/interfaces/FlagsMap";
import { LuminosoOptions } from "./shared";

export class LuminosoInstance {
  private di: Di;

  private manager: DatafileManager;
  private listeners: EventEmitter = new EventEmitter();

  constructor(options: Partial<LuminosoOptions>, user?: User) {
    this.di = Di.instance(options.sdkKey!!);
    this.manager = new DatafileManager(options.sdkKey!!);

    if (user) {
      this.di.userService.postClientUser(user);
    }
  }

  public linkUser(userUuid: String, user: User) {}

  public setUser(user: User) {}

  public allFlags(key: string): FeaturesEnabledByKey {
    return {};
  }

  get datafile(): string {
    return this.manager.datafile;
  }

  public variation(experimentUuid: string, flagUuid: string, defaultValue: boolean): boolean {
    return true;
  }

  public flush() {}

  public track(event: string) {}

  public on(eventName: string, listener: Listener) {
    this.listeners.on(eventName, listener);
  }
}
