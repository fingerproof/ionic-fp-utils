/**
 * @memberOf fp.utils
 */
(function (module) {
  'use strict';

  /**
   * The template utils service provider.
   * @constructor
   * @param {string} MODULES_PATH - The default modules path.
   * @param {string} MODULE_NAME_SEPARATOR - The default module name separator.
   */
  function TemplateUtilsProvider(MODULES_PATH, MODULE_NAME_SEPARATOR) {
    var provider = this;

    var modulesPath = MODULES_PATH;
    var moduleNameSeparator = MODULE_NAME_SEPARATOR;

    /**
     * Get the modules path prefix.
     * @return {string}
     */
    provider.getModulesPath = function () { return modulesPath; };

    /**
     * Set the modules path prefix.
     * @param {string} path
     */
    provider.setModulesPath = function (path) {
      if (_.isString(path)) { modulesPath = path; }
    };

    /**
     * Get the module name separator.
     * @return {string}
     */
    provider.getModuleNameSeparator = function () {
      return moduleNameSeparator;
    };

    /**
     * Set the module name separator.
     * @param {string} separator
     */
    provider.setModuleNameSeparator = function (separator) {
      if (_.isString(separator)) { moduleNameSeparator = separator; }
    };

    /**
     * Get the URL of a given Angular module.
     * @param {object} module
     * @return {string}
     */
    provider.getModuleUrl = function (module) {
      return modulesPath + module.name + '/';
    };

    /**
     * Get the last part of the given module name.
     * @param {object} module
     * @return {string}
     */
    provider.getLastModuleNamePart = function (module) {
      return module.name.split(moduleNameSeparator).pop();
    };

    /**
     * Get a template URL from a given Angular module.
     * @param {object} module
     * @param {string} [file] - Last part of the module name by default.
     *   If the value ends with a forward slash, the last part
     *   of the module name will be added.
     * @return {string}
     */
    provider.getUrlFromModule = function (module, file) {
      if (!_.isString(file)) { file = ''; }
      var useDefault = !file || /\/$/.test(file);
      if (useDefault) { file += provider.getLastModuleNamePart(module); }
      return provider.getModuleUrl(module) + file + '.html';
    };

    /**
     * The template utils service.
     * @constructor
     */
    function TemplateUtils() {
      var service = this;

      /**
       * Get the modules path prefix.
       * @return {string}
       */
      service.getModulesPath = provider.getModulesPath;

      /**
       * Get the module name separator.
       * @return {string}
       */
      service.getModuleNameSeparator = provider.getModuleNameSeparator;

      /**
       * Get the URL of a given Angular module.
       * @param {object} module
       * @return {string}
       */
      service.getModuleUrl = provider.getModuleUrl;

      /**
       * Get the last part of the given module name.
       * @param {object} module
       * @return {string}
       */
      service.getLastModuleNamePart = provider.getLastModuleNamePart;

      /**
       * Get a template URL from a given Angular module.
       * @param {object} module
       * @param {string} [file] - Last part of the module name by default.
       * @return {string}
       */
      service.getUrlFromModule = provider.getUrlFromModule;
    }

    provider.$get = [function () { return new TemplateUtils(); }];
  }

  module.provider('templateUtils', [
    'MODULES_PATH',
    'MODULE_NAME_SEPARATOR',
    TemplateUtilsProvider
  ]);

}(angular.module('fp.utils')));
