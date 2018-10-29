/**
 * @memberOf fp.utils
 */
(function (module) {
  'use strict';

  var camelCasedName = _.camelCase(module.name);

  /**
   * The loading interceptor.
   * Broadcasts 'fpUtils.loading.'-prefixed 'show' and 'hide' events
   * on the root scope when dealing with external requests.
   * @constructor
   * @param {object} $q - The Angular $q service.
   * @param {object} $rootScope - The Angular root scope.
   */
  function LoadingInterceptor($q, $rootScope) {
    var service = this;

    /**
     * Broadcast a given event (passing the request config object)
     * only when dealing with API requests that do not have
     * a truthy skipFPLoadingInterceptor setup in config.
     * @private
     * @function
     * @param {string} event
     * @param {object} config - Angular $http config object.
     */
    function broadcast(event, config) {
      var out = /^(:?http(:?s)?:)?\/\//.test(config.url);
      if (!out || config.skipFPLoadingInterceptor) { return; }
      $rootScope.$broadcast(camelCasedName + '.loading.' + event, config);
    }

    /**
     * To be called when a request is being made.
     * @param {object} config - Angular $http config object.
     * @return {object}
     */
    service.request = function (config) {
      broadcast('show', config);
      return config;
    };

    /**
     * To be called when a request got a response.
     * @param {object} response - Angular $http response object.
     * @return {object}
     */
    service.response = function (response) {
      broadcast('hide', response.config);
      return response;
    };

    /**
     * To be called when a request encountered an error.
     * @param {object} config - Angular $http config object.
     * @return {Promise}
     */
    service.requestError = function (config) {
      return $q.reject(service.response(config));
    };

    /**
     * To be called when a response is an error.
     * @param {object} response - Angular $http response object.
     * @return {Promise}
     */
    service.responseError = function (response) {
      return service.requestError(response);
    };
  }

  module.service('loadingInterceptor', [
    '$q',
    '$rootScope',
    LoadingInterceptor
  ]);

}(angular.module('fp.utils')));
