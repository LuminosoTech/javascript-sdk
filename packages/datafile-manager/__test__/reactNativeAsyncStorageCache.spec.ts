import ReactNativeAsyncStorageCache from '../src/reactNativeAsyncStorageCache';

describe('reactNativeAsyncStorageCache', () => {
  let cacheInstance: ReactNativeAsyncStorageCache;

  beforeEach(() => {
    cacheInstance = new ReactNativeAsyncStorageCache();
  });

  describe('get', function() {
    it('should return correct string when item is found in cache', function() {
      return cacheInstance.get('keyThatExists').then(v => expect(JSON.parse(v)).toEqual({ name: 'Awesome Object' }));
    });

    it('should return empty string if item is not found in cache', function() {
      return cacheInstance.get('keyThatDoesNotExist').then(v => expect(v).toEqual(''));
    });
  });

  describe('set', function() {
    it('should resolve promise if item was successfully set in the cache', function() {
      const testObj = { name: 'Awesome Object' };
      return cacheInstance.set('testKey', JSON.stringify(testObj));
    });
  });

  describe('contains', function() {
    it('should return true if value with key exists', function() {
      return cacheInstance.contains('keyThatExists').then(v => expect(v).toBeTruthy());
    });

    it('should return false if value with key does not exist', function() {
      return cacheInstance.contains('keyThatDoesNotExist').then(v => expect(v).toBeFalsy());
    });
  });
});
