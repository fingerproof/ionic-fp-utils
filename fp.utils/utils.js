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

  /**
   * Push error messages.
   * @constant
   * @type {object}
   */
  var FP_UTILS_ERRORS = {
    MISSING_GLOBALS: 'missing ionic or lodash'
  };

  module.constant('MODULES_PATH', MODULES_PATH);
  module.constant('MODULE_NAME_SEPARATOR', MODULE_NAME_SEPARATOR);
  module.constant('FP_UTILS_ERRORS', FP_UTILS_ERRORS);

}(angular.module('fp.utils', ['ionic', 'ngCordova', 'angular-cache'])));
