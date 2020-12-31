export default class AsyncStorage {
  static getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null> {
    return new Promise((resolve, reject) => {
      switch (key) {
        case 'keyThatExists':
          resolve('{ "name": "Awesome Object" }');
          break;
        case 'keyThatDoesNotExist':
          resolve(null);
          break;
        case 'keyWithInvalidJsonObject':
          resolve('bad json }');
          break;
      }
    });
  }

  static setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void> {
    return Promise.resolve();
  }
}
