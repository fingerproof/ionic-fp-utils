/**
 * @memberOf fp.utils
 */
(function (module) {
  'use strict';

  /**
   * Some caching utilities.
   * @constructor
   * @param {object} $q - The Angular $q service.
   * @param {object} cacheFactory - The Angular Cache CacheFactory service.
   */
  function CacheUtils($q, cacheFactory) {
    var service = this;

    /**
     * Get or create a cache.
     * @param {string} name - The cache name.
     * @param {object|number} [options] - A CacheFactory options object or
     * the cache validity duration in minutes.
     * @param {string} [options.storageMode='localStorage']
     * @param {string} [options.deleteOnExpire='passive']
     * @return {object}
     */
    service.getCache = function (name, options) {
      var cache = cacheFactory.get(name);
      if (cache) { return cache; }
      if (_.isNumber(options)) { options = { maxAge: options * 60 * 1000 }; }
      else if (!_.isObject(options)) { options = null; }
      return cacheFactory.createCache(name, _.extend({ // TODO: max size ?
          storageMode: 'localStorage',
          deleteOnExpire: 'passive'
      }, options));
    };

    /**
     * Get or create a cache associated to a given module.
     * @param {object} module - An angular module object.
     * @param {object|number} [options] - A CacheFactory options object or
     * the cache validity duration in minutes.
     * @param {string} [options.storageMode='localStorage']
     * @param {string} [options.deleteOnExpire='passive']
     * @return {object}
     */
    service.getModuleCache = function (module, options) {
      return service.getCache(module.name, options);
    };

    /**
     * Resolve a cached value if any.
     * @param {object} cache - The cache object potentially storing the value.
     * @param {string} key - The key associated to the cached value.
     * @return {Promise|undefined} - Undefined if not cached.
     */
    service.resolveCachedValue = function (cache, key) {
      var value = cache && cache.get(key);
      if (value) { return $q.when(value); }
    };
  }

  module.service('cacheUtils', ['$q', 'CacheFactory', CacheUtils]);

}(angular.module('fp.utils')));
