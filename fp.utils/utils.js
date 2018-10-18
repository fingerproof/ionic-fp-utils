/**
 * @module fp.utils
 */
(function (module) {
  'use strict';

  /**
   * The default modules path.
   * @constant
   * @type {string}
   */
  var MODULES_PATH = 'modules/';

  /**
   * The default module name separator.
   * @constant
   * @type {string}
   */
  var MODULE_NAME_SEPARATOR = '.';

  module.constant('MODULES_PATH', MODULES_PATH);
  module.constant('MODULE_NAME_SEPARATOR', MODULE_NAME_SEPARATOR);

}(angular.module('fp.utils', ['ionic', 'ngCordova', 'angular-cache'])));
