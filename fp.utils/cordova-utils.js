/**
 * @memberOf fp.utils
 */
(function (module) {
  'use strict';

  var camelCasedName = _.camelCase(module.name);

  /**
   * Some Cordova utilities.
   * @constructor
   * @param {object} $q - The Angular $q service.
   * @param {object} $log - The Angular $log service.
   * @param {object} $window - The Angular $window service.
   * @param {object} $rootScope - The Angular root scope object.
   * @param {object} $ionicPlatform - The Ionic $ionicPlatform service.
   * @param {object} $cordovaToast - The ngCordova $cordovaToast service.
   * @param {object} interceptorUtils - The interceptorUtils service.
   * @param {object} ERRORS - Error messages.
   */
  function CordovaUtils(
    $q,
    $log,
    $window,
    $rootScope,
    $ionicPlatform,
    $cordovaToast,
    interceptorUtils,
    ERRORS
  ) {
    var service = this;

    var ionic = $window.ionic;
    var _ = $window._;

    if (!ionic || !_) { return $log.error(ERRORS.MISSING_GLOBALS); }

    var platformReady = $ionicPlatform.ready();

    /**
     * Get root scope broadcaters given event names.
     * @private
     * @function
     * @param {string|string[]} name
     * @return {Function|object}
     */
    function getBroadcaster(name) {
      var isArray = _.isArray(name);
      if (isArray) { return _.zipObject(name, _.map(name, getBroadcaster)); }
      name = camelCasedName + '.cordova.' + name;
      return _.bind($rootScope.$broadcast, $rootScope, name);
    }

    /**
     * Check whether the app is running in a WebView or not.
     * @return {boolean}
     */
    service.isCordova = function () { return ionic.Platform.isWebView(); };

    /**
     * Check whether the app is running on a given platform or not.
     * @param {string|string[]} name
     * @return {boolean}
     */
    service.isPlatform = function (name) {
      function checkPlatform(name) { return $ionicPlatform.is(name); }
      return _.some(interceptorUtils.toArray(name), checkPlatform);
    }

    /**
     * Call a given callback when Cordova is available and ready.
     * @param {Function} cb
     * @return {Promise}
     */
    service.callWhenReady = function (cb) {
      if (service.isCordova()) { return platformReady.then(cb); }
      return $q.reject(new Error('App not running inside Cordova'));
    };

    /**
     * Get a callback that would be called when Cordova is available and ready.
     * @param {Function} cb
     * @return {Function}
     */
    service.whenReady = function (cb) {
      return function () {
        var bound = _.bind.apply(_, [cb, this].concat(_.toArray(arguments)));
        return service.callWhenReady(bound);
      };
    };

    /**
     * Get a callback that would be called when Cordova is available and ready,
     * only if the current platform matches the one given as a parameter
     * otherwise just pass an optional fallback value.
     * @param {string|string[]} platform
     * @param {Function} cb
     * @param {any} [fallback]
     * @return {Function}
     */
    service.ifPlatformWhenReady = function (platform, cb, fallback) {
      // var nok = !service.isPlatform(platform);
      // if (nok) { cb = _.isUndefined(no) ? _.noop : _.partial(_.identity, no); }
      // return service.whenReady(cb);
      var matches = service.isPlatform(platform);
      return service.whenReady(matches ? cb : _.partial(_.identity, fallback));
    }

    /**
     * Show a toast at the center of the screen for a short duration.
     * @param {string} message
     * @return {Promise}
     */
    service.showToast = service.whenReady(function (message) {
      return $cordovaToast.showShortCenter(message);
    });

    // Broadcast 'fpUtils.cordova.'-prefixed 'paused' and 'resumed'
    // events on the root scope when the app runs in Cordova.
    service.callWhenReady(function () {
      var broadcast = getBroadcaster(['paused', 'resumed']);
      $ionicPlatform.on('resume', broadcast.resumed);
      $ionicPlatform.on('pause', broadcast.paused);
      if (!service.isPlatform('ios')) { return; }
      $ionicPlatform.on('active', broadcast.resumed);
      $ionicPlatform.on('resign', broadcast.paused);
    });
  }

  module.service('cordovaUtils', [
    '$q',
    '$log',
    '$window',
    '$rootScope',
    '$ionicPlatform',
    '$cordovaToast',
    'interceptorUtils',
    'FP_UTILS_ERRORS',
    CordovaUtils
  ]);

}(angular.module('fp.utils')));
