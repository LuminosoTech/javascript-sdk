import PersistentKeyValueCache from "../@types/persistentKeyValueCache";

export class LocalStorageKeyValueCache implements PersistentKeyValueCache {
  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const item = localStorage.getItem(key);

      if (item) {
        resolve(item);
      }

      reject();
    });
  }
  set(key: string, val: string): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem(key, val);
      resolve();
    });
  }
  contains(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      const item = localStorage.getItem(key);

      if (item) {
        resolve(true);
      }

      resolve(false);
    });
  }
  remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  }
}
