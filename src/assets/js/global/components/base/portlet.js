"use strict";
// plugin setup
var TFPortlet = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = TFUtil.get(elementId);
    var body = TFUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        bodyToggleSpeed: 400,
        tooltips: true,
        tools: {
            toggle: {
                collapse: 'Collapse',
                expand: 'Expand'
            },
            reload: 'Reload',
            remove: 'Remove',
            fullscreen: {
                on: 'Fullscreen',
                off: 'Exit Fullscreen'
            }
        },
        sticky: {
            offset: 300,
            zIndex: 101
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (TFUtil.data(element).has('portlet')) {
                the = TFUtil.data(element).get('portlet');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                TFUtil.data(element).set('portlet', the);
            }

            return the;
        },

        /**
         * Init portlet
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = TFUtil.deepExtend({}, defaultOptions, options);
            the.head = TFUtil.child(element, '.tf-portlet__head');
            the.foot = TFUtil.child(element, '.tf-portlet__foot');

            if (TFUtil.child(element, '.tf-portlet__body')) {
                the.body = TFUtil.child(element, '.tf-portlet__body');
            } else if (TFUtil.child(element, '.tf-form')) {
                the.body = TFUtil.child(element, '.tf-form');
            }
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Remove
            var remove = TFUtil.find(the.head, '[data-tfportlet-tool=remove]');
            if (remove) {
                TFUtil.addEvent(remove, 'click', function(e) {
                    e.preventDefault();
                    Plugin.remove();
                });
            }

            // Reload
            var reload = TFUtil.find(the.head, '[data-tfportlet-tool=reload]');
            if (reload) {
                TFUtil.addEvent(reload, 'click', function(e) {
                    e.preventDefault();
                    Plugin.reload();
                });
            }

            // Toggle
            var toggle = TFUtil.find(the.head, '[data-tfportlet-tool=toggle]');
            if (toggle) {
                TFUtil.addEvent(toggle, 'click', function(e) {
                    e.preventDefault();
                    Plugin.toggle();
                });
            }

            //== Fullscreen
            var fullscreen = TFUtil.find(the.head, '[data-tfportlet-tool=fullscreen]');
            if (fullscreen) {
                TFUtil.addEvent(fullscreen, 'click', function(e) {
                    e.preventDefault();
                    Plugin.fullscreen();
                });
            }

            Plugin.setupTooltips();
        },

        /**
         * Enable stickt mode
         */
        initSticky: function() {
            var lastScrollTop = 0;
            var offset = the.options.sticky.offset;

            if (!the.head) {
                return;
            }

	        window.addEventListener('scroll', Plugin.onScrollSticky);
        },

	    /**
	     * Window scroll handle event for sticky portlet
	     */
	    onScrollSticky: function(e) {
		    var offset = the.options.sticky.offset;

		    if(isNaN(offset)) return;

		    var st = TFUtil.getScrollTop();

		    if (st >= offset && TFUtil.hasClass(body, 'tf-portlet--sticky') === false) {
			    Plugin.eventTrigger('stickyOn');

			    TFUtil.addClass(body, 'tf-portlet--sticky');
			    TFUtil.addClass(element, 'tf-portlet--sticky');

			    Plugin.updateSticky();

		    } else if ((st*1.5) <= offset && TFUtil.hasClass(body, 'tf-portlet--sticky')) {
			    // back scroll mode
			    Plugin.eventTrigger('stickyOff');

			    TFUtil.removeClass(body, 'tf-portlet--sticky');
			    TFUtil.removeClass(element, 'tf-portlet--sticky');

			    Plugin.resetSticky();
		    }
	    },

        updateSticky: function() {
            if (!the.head) {
                return;
            }

            var top;

            if (TFUtil.hasClass(body, 'tf-portlet--sticky')) {
                if (the.options.sticky.position.top instanceof Function) {
                    top = parseInt(the.options.sticky.position.top.call(this, the));
                } else {
                    top = parseInt(the.options.sticky.position.top);
                }

                var left;
                if (the.options.sticky.position.left instanceof Function) {
                    left = parseInt(the.options.sticky.position.left.call(this, the));
                } else {
                    left = parseInt(the.options.sticky.position.left);
                }

                var right;
                if (the.options.sticky.position.right instanceof Function) {
                    right = parseInt(the.options.sticky.position.right.call(this, the));
                } else {
                    right = parseInt(the.options.sticky.position.right);
                }

                TFUtil.css(the.head, 'z-index', the.options.sticky.zIndex);
                TFUtil.css(the.head, 'top', top + 'px');
                TFUtil.css(the.head, 'left', left + 'px');
                TFUtil.css(the.head, 'right', right + 'px');
            }
        },

        resetSticky: function() {
            if (!the.head) {
                return;
            }

            if (TFUtil.hasClass(body, 'tf-portlet--sticky') === false) {
                TFUtil.css(the.head, 'z-index', '');
                TFUtil.css(the.head, 'top', '');
                TFUtil.css(the.head, 'left', '');
                TFUtil.css(the.head, 'right', '');
            }
        },

        /**
         * Remove portlet
         */
        remove: function() {
            if (Plugin.eventTrigger('beforeRemove') === false) {
                return;
            }

            if (TFUtil.hasClass(body, 'tf-portlet--fullscreen') && TFUtil.hasClass(element, 'tf-portlet--fullscreen')) {
                Plugin.fullscreen('off');
            }

            Plugin.removeTooltips();

            TFUtil.remove(element);

            Plugin.eventTrigger('afterRemove');
        },

        /**
         * Set content
         */
        setContent: function(html) {
            if (html) {
                the.body.innerHTML = html;
            }
        },

        /**
         * Get body
         */
        getBody: function() {
            return the.body;
        },

        /**
         * Get self
         */
        getSelf: function() {
            return element;
        },

        /**
         * Setup tooltips
         */
        setupTooltips: function() {
            if (the.options.tooltips) {
                var collapsed = TFUtil.hasClass(element, 'tf-portlet--collapse') || TFUtil.hasClass(element, 'tf-portlet--collapsed');
                var fullscreenOn = TFUtil.hasClass(body, 'tf-portlet--fullscreen') && TFUtil.hasClass(element, 'tf-portlet--fullscreen');

                //== Remove
                var remove = TFUtil.find(the.head, '[data-tfportlet-tool=remove]');
                if (remove) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(remove, {
                        title: the.options.tools.remove,
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    TFUtil.data(remove).set('tooltip', tip);
                }

                //== Reload
                var reload = TFUtil.find(the.head, '[data-tfportlet-tool=reload]');
                if (reload) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(reload, {
                        title: the.options.tools.reload,
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    TFUtil.data(reload).set('tooltip', tip);
                }

                //== Toggle
                var toggle = TFUtil.find(the.head, '[data-tfportlet-tool=toggle]');
                if (toggle) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(toggle, {
                        title: (collapsed ? the.options.tools.toggle.expand : the.options.tools.toggle.collapse),
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    TFUtil.data(toggle).set('tooltip', tip);
                }

                //== Fullscreen
                var fullscreen = TFUtil.find(the.head, '[data-tfportlet-tool=fullscreen]');
                if (fullscreen) {
                    var placement = (fullscreenOn ? 'bottom' : 'top');
                    var tip = new Tooltip(fullscreen, {
                        title: (fullscreenOn ? the.options.tools.fullscreen.off : the.options.tools.fullscreen.on),
                        placement: placement,
                        offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
                        trigger: 'hover',
                        template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
                            <div class="tooltip-arrow arrow"></div>\
                            <div class="tooltip-inner"></div>\
                        </div>'
                    });

                    TFUtil.data(fullscreen).set('tooltip', tip);
                }
            }
        },

        /**
         * Setup tooltips
         */
        removeTooltips: function() {
            if (the.options.tooltips) {
                //== Remove
                var remove = TFUtil.find(the.head, '[data-tfportlet-tool=remove]');
                if (remove && TFUtil.data(remove).has('tooltip')) {
                    TFUtil.data(remove).get('tooltip').dispose();
                }

                //== Reload
                var reload = TFUtil.find(the.head, '[data-tfportlet-tool=reload]');
                if (reload && TFUtil.data(reload).has('tooltip')) {
                    TFUtil.data(reload).get('tooltip').dispose();
                }

                //== Toggle
                var toggle = TFUtil.find(the.head, '[data-tfportlet-tool=toggle]');
                if (toggle && TFUtil.data(toggle).has('tooltip')) {
                    TFUtil.data(toggle).get('tooltip').dispose();
                }

                //== Fullscreen
                var fullscreen = TFUtil.find(the.head, '[data-tfportlet-tool=fullscreen]');
                if (fullscreen && TFUtil.data(fullscreen).has('tooltip')) {
                    TFUtil.data(fullscreen).get('tooltip').dispose();
                }
            }
        },

        /**
         * Reload
         */
        reload: function() {
            Plugin.eventTrigger('reload');
        },

        /**
         * Toggle
         */
        toggle: function() {
            if (TFUtil.hasClass(element, 'tf-portlet--collapse') || TFUtil.hasClass(element, 'tf-portlet--collapsed')) {
                Plugin.expand();
            } else {
                Plugin.collapse();
            }
        },

        /**
         * Collapse
         */
        collapse: function() {
            if (Plugin.eventTrigger('beforeCollapse') === false) {
                return;
            }

            TFUtil.slideUp(the.body, the.options.bodyToggleSpeed, function() {
                Plugin.eventTrigger('afterCollapse');
            });

            TFUtil.addClass(element, 'tf-portlet--collapse');

            var toggle = TFUtil.find(the.head, '[data-tfportlet-tool=toggle]');
            if (toggle && TFUtil.data(toggle).has('tooltip')) {
                TFUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.expand);
            }
        },

        /**
         * Expand
         */
        expand: function() {
            if (Plugin.eventTrigger('beforeExpand') === false) {
                return;
            }

            TFUtil.slideDown(the.body, the.options.bodyToggleSpeed, function() {
                Plugin.eventTrigger('afterExpand');
            });

            TFUtil.removeClass(element, 'tf-portlet--collapse');
            TFUtil.removeClass(element, 'tf-portlet--collapsed');

            var toggle = TFUtil.find(the.head, '[data-tfportlet-tool=toggle]');
            if (toggle && TFUtil.data(toggle).has('tooltip')) {
                TFUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.collapse);
            }
        },

        /**
         * fullscreen
         */
        fullscreen: function(mode) {
            var d = {};
            var speed = 300;

            if (mode === 'off' || (TFUtil.hasClass(body, 'tf-portlet--fullscreen') && TFUtil.hasClass(element, 'tf-portlet--fullscreen'))) {
                Plugin.eventTrigger('beforeFullscreenOff');

                TFUtil.removeClass(body, 'tf-portlet--fullscreen');
                TFUtil.removeClass(element, 'tf-portlet--fullscreen');

                Plugin.removeTooltips();
                Plugin.setupTooltips();

                if (the.foot) {
                    TFUtil.css(the.body, 'margin-bottom', '');
                    TFUtil.css(the.foot, 'margin-top', '');
                }

                Plugin.eventTrigger('afterFullscreenOff');
            } else {
                Plugin.eventTrigger('beforeFullscreenOn');

                TFUtil.addClass(element, 'tf-portlet--fullscreen');
                TFUtil.addClass(body, 'tf-portlet--fullscreen');

                Plugin.removeTooltips();
                Plugin.setupTooltips();


                if (the.foot) {
                    var height1 = parseInt(TFUtil.css(the.foot, 'height'));
                    var height2 = parseInt(TFUtil.css(the.foot, 'height')) + parseInt(TFUtil.css(the.head, 'height'));
                    TFUtil.css(the.body, 'margin-bottom', height1 + 'px');
                    TFUtil.css(the.foot, 'margin-top', '-' + height2 + 'px');
                }

                Plugin.eventTrigger('afterFullscreenOn');
            }
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //TFUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
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

            return the;
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
     * Remove portlet
     * @returns {TFPortlet}
     */
    the.remove = function() {
        return Plugin.remove(html);
    };

    /**
     * Remove portlet
     * @returns {TFPortlet}
     */
    the.initSticky = function() {
        return Plugin.initSticky();
    };

    /**
     * Remove portlet
     * @returns {TFPortlet}
     */
    the.updateSticky = function() {
        return Plugin.updateSticky();
    };

    /**
     * Remove portlet
     * @returns {TFPortlet}
     */
    the.resetSticky = function() {
        return Plugin.resetSticky();
    };

	/**
	 * Destroy sticky portlet
	 */
	the.destroySticky = function() {
		Plugin.resetSticky();
		window.removeEventListener('scroll', Plugin.onScrollSticky);
	};

    /**
     * Reload portlet
     * @returns {TFPortlet}
     */
    the.reload = function() {
        return Plugin.reload();
    };

    /**
     * Set portlet content
     * @returns {TFPortlet}
     */
    the.setContent = function(html) {
        return Plugin.setContent(html);
    };

    /**
     * Toggle portlet
     * @returns {TFPortlet}
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Collapse portlet
     * @returns {TFPortlet}
     */
    the.collapse = function() {
        return Plugin.collapse();
    };

    /**
     * Expand portlet
     * @returns {TFPortlet}
     */
    the.expand = function() {
        return Plugin.expand();
    };

    /**
     * Fullscreen portlet
     * @returns {MPortlet}
     */
    the.fullscreen = function() {
        return Plugin.fullscreen('on');
    };

    /**
     * Fullscreen portlet
     * @returns {MPortlet}
     */
    the.unFullscreen = function() {
        return Plugin.fullscreen('off');
    };

    /**
     * Get portletbody
     * @returns {jQuery}
     */
    the.getBody = function() {
        return Plugin.getBody();
    };

    /**
     * Get portletbody
     * @returns {jQuery}
     */
    the.getSelf = function() {
        return Plugin.getSelf();
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TFPortlet;
}
