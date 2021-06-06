import { HttpPollingDatafileManager, LocalStorageKeyValueCache } from "@luminoso/datafile-manager";
import { LuminosoOptions } from "../shared";

export class DatafileManager {
  private manager: HttpPollingDatafileManager;

  constructor(sdkKey: string) {
    this.manager = new HttpPollingDatafileManager({ sdkKey, cache: new LocalStorageKeyValueCache(), autoUpdate: true });
    this.manager.start();

    console.log("START");
  }

  get datafile(): string {
    return this.manager.get();
  }
}
