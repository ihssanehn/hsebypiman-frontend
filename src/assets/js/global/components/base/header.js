"use strict";
var TFHeader = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = TFUtil.get(elementId);
    var body = TFUtil.get('body');

    if (element === undefined) {
        return;
    }

    // Default options
    var defaultOptions = {
        classic: false,
        offset: {
            mobile: 150,
            desktop: 200
        },
        minimize: {
            mobile: false,
            desktop: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {TFHeader}
         */
        construct: function(options) {
            if (TFUtil.data(element).has('header')) {
                the = TFUtil.data(element).get('header');
            } else {
                // reset header
                Plugin.init(options);

                // build header
                Plugin.build();

                TFUtil.data(element).set('header', the);
            }

            return the;
        },

        /**
         * Handles subheader click toggle
         * @returns {TFHeader}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = TFUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Reset header
         * @returns {TFHeader}
         */
        build: function() {
            var lastScrollTop = 0;
            var eventTriggerState = true;
            var viewportHeight = TFUtil.getViewPort().height;
            var documentHeight = TFUtil.getDocumentHeight();

            if (the.options.minimize.mobile === false && the.options.minimize.desktop === false) {
                return;
            }

            window.addEventListener('scroll', function() {
                var offset = 0, on, off, st;

                if (TFUtil.isInResponsiveRange('desktop')) {
                    offset = the.options.offset.desktop;
                    on = the.options.minimize.desktop.on;
                    off = the.options.minimize.desktop.off;
                } else if (TFUtil.isInResponsiveRange('tablet-and-mobile')) {
                    offset = the.options.offset.mobile;
                    on = the.options.minimize.mobile.on;
                    off = the.options.minimize.mobile.off;
                }

                st = TFUtil.getScrollTop();

                if (
                    (TFUtil.isInResponsiveRange('tablet-and-mobile') && the.options.classic && the.options.classic.mobile) ||
                    (TFUtil.isInResponsiveRange('desktop') && the.options.classic && the.options.classic.desktop)
                ) {
                    if (st > offset) { // down scroll mode
                        TFUtil.addClass(body, on);
                        TFUtil.removeClass(body, off);

                        if (eventTriggerState) {
                            Plugin.eventTrigger('minimizeOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        TFUtil.addClass(body, off);
                        TFUtil.removeClass(body, on);

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('minimizeOff', the);
                            eventTriggerState = true;
                        }
                    }
                } else {
                    if (st > offset && lastScrollTop < st) { // down scroll mode
                        TFUtil.addClass(body, on);
                        TFUtil.removeClass(body, off);

                        if (eventTriggerState) {
                            Plugin.eventTrigger('minimizeOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        TFUtil.addClass(body, off);
                        TFUtil.removeClass(body, on);

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('minimizeOff', the);
                            eventTriggerState = true;
                        }
                    }

                    lastScrollTop = st;
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                        return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TFHeader;
}
