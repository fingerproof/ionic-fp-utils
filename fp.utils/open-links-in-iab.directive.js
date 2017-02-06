/**
 * @module fp.open-links-in-iab
 */
(function (module) {
  'use strict';

  /**
   * The fpOpenLinksInIab directive.
   * @function openLinksInIab
   * @param {Object} $q - Angular's $q service.
   * @param {Object} $cordovaEmailComposer - ngCordova's $cordovaEmailComposer.
   * @param {Object} $cordovaInAppBrowser - ngCordova's $cordovaInAppBrowser.
   * @param {Object} cordovaUtils - Some Cordova utilities.
   * @return {Object}
   */
  function openLinksInIab(
    $q,
    $cordovaEmailComposer,
    $cordovaInAppBrowser,
    cordovaUtils
  ) {

    /**
     * Prevent the default browser behavior.
     * @private
     * @function noop
     * @param {Object} event - A DOM click event object.
     */
    function noop(event) { event.preventDefault(); }

    /**
     * Get the attribute value given a name that can be prefixed with 'data-'.
     * @param {Element} el
     * @param {String} name
     * @return {String|null}
     */
    function getAttribute(el, name) {
      return el.getAttribute(name) || el.getAttribute('data-' + name) || null;
    }

    /**
     * Open a link via the In App Browser plugin.
     * @private
     * @function open
     * @param {String} target - A valid In App Browser target value.
     */
    function open(target) {
      // Allow the target to be overridden using a (data-)iab-target attribute.
      var iabTarget = getAttribute(this, 'iab-target') || target;
      $cordovaInAppBrowser.open(this.href, iabTarget);
    }

    /**
     * Open a link via the Email Composer plugin.
     * @private
     * @function compose
     */
    function compose() {
      $cordovaEmailComposer.open({ to: this.href.split(':').pop() });
    }

    /**
     * Open a link in the In App Browser with system as the target.
     * @private
     * @function system
     */
    var system = _.partial(open, '_system');

    /**
     * Open a link in the In App Browser with blank as the target.
     * @private
     * @function system
     */
    var blank = _.partial(open, '_blank');

    /**
     * Open a link via the Email Composer plugin or the system browser.
     * @private
     * @function mail
     * @param {Object} event - A DOM click event object.
     */
    function mail(event) {
      var promise = null;
      try { promise = $cordovaEmailComposer.isAvailable(); }
      catch (error) { promise = $q.reject(error); }
      var usePlugin = _.bind(compose, this, event);
      var useSystem = _.bind(system, this, event);
      promise.then(usePlugin).catch(useSystem);
    }

    var events = {
      'a[href^="http://"],a[href^="https://"]': blank,
      'a[href^="mailto:"]': mail,
      'a[href^="tel:"]': system
    };

    return {
      restrict: 'A',
      scope: false,
      link: cordovaUtils.whenReady(function (scope, element) {
        /*eslint new-cap:0 */
        var gator = Gator(element[0]);
        gator.on('click', _.keys(events).join(','), noop);
        _.each(events, function (handler, selector) {
          gator.on('click', selector, handler);
        });
        element.on('$destroy', function () { gator.off(); });
      })
    };
  }

  module.directive('fpOpenLinksInIab', [
    '$q',
    '$cordovaEmailComposer',
    '$cordovaInAppBrowser',
    'cordovaUtils',
    openLinksInIab
  ]);

}(angular.module('fp.utils')));
