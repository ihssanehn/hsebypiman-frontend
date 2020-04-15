"use strict";
var TFMenu = function(elementId, options) {
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
        // scrollable area with Perfect Scroll
        scroll: {
            rememberPosition: false
        },

        // accordion submenu mode
        accordion: {
            slideSpeed: 200, // accordion toggle slide speed in milliseconds
            autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
            autoScrollSpeed: 1200,
            expandAll: true // allow having multiple expanded accordions in the menu
        },

        // dropdown submenu mode
        dropdown: {
            timeout: 500 // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {TFMenu}
         */
        construct: function(options) {
            if (TFUtil.data(element).has('menu')) {
                the = TFUtil.data(element).get('menu');
            } else {
                // reset menu
                Plugin.init(options);

                // reset menu
                Plugin.reset();

                // build menu
                Plugin.build();

                TFUtil.data(element).set('menu', the);
            }

            return the;
        },

        /**
         * Handles submenu click toggle
         * @returns {TFMenu}
         */
        init: function(options) {
            the.events = [];

            the.eventHandlers = {};

            // merge default and user defined options
            the.options = TFUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            the.uid = TFUtil.getUniqueID();
        },

        update: function(options) {
            // merge default and user defined options
            the.options = TFUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

             // reset menu
            Plugin.reset();

            the.eventHandlers = {};

            // build menu
            Plugin.build();

            TFUtil.data(element).set('menu', the);
        },

        reload: function() {
             // reset menu
            Plugin.reset();

            // build menu
            Plugin.build();

            // reset submenu props
            Plugin.resetSubmenuProps();
        },

        /**
         * Reset menu
         * @returns {TFMenu}
         */
        build: function() {
            // General accordion submenu toggle
            the.eventHandlers['event_1'] = TFUtil.on( element, '.tf-menu__toggle', 'click', Plugin.handleSubmenuAccordion);

            // Dropdown mode(hoverable)
            if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {
                // dropdown submenu - hover toggle
                the.eventHandlers['event_2'] = TFUtil.on( element, '[data-tfmenu-submenu-toggle="hover"]', 'mouseover', Plugin.handleSubmenuDrodownHoverEnter);
                the.eventHandlers['event_3'] = TFUtil.on( element, '[data-tfmenu-submenu-toggle="hover"]', 'mouseout', Plugin.handleSubmenuDrodownHoverExit);

                // dropdown submenu - click toggle
                the.eventHandlers['event_4'] = TFUtil.on( element, '[data-tfmenu-submenu-toggle="click"] > .tf-menu__toggle, [data-tfmenu-submenu-toggle="click"] > .tf-menu__link .tf-menu__toggle', 'click', Plugin.handleSubmenuDropdownClick);
                the.eventHandlers['event_5'] = TFUtil.on( element, '[data-tfmenu-submenu-toggle="tab"] > .tf-menu__toggle, [data-tfmenu-submenu-toggle="tab"] > .tf-menu__link .tf-menu__toggle', 'click', Plugin.handleSubmenuDropdownTabClick);
            }

            // handle link click
            the.eventHandlers['event_6'] = TFUtil.on(element, '.tf-menu__item > .tf-menu__link:not(.tf-menu__toggle):not(.tf-menu__link--toggle-skip)', 'click', Plugin.handleLinkClick);

            // Init scrollable menu
            if (the.options.scroll && the.options.scroll.height) {
                Plugin.scrollInit();
            }
        },

        /**
         * Reset menu
         * @returns {TFMenu}
         */
        reset: function() {
            TFUtil.off( element, 'click', the.eventHandlers['event_1']);

            // dropdown submenu - hover toggle
            TFUtil.off( element, 'mouseover', the.eventHandlers['event_2']);
            TFUtil.off( element, 'mouseout', the.eventHandlers['event_3']);

            // dropdown submenu - click toggle
            TFUtil.off( element, 'click', the.eventHandlers['event_4']);
            TFUtil.off( element, 'click', the.eventHandlers['event_5']);

            // handle link click
            TFUtil.off(element, 'click', the.eventHandlers['event_6']);
        },

        /**
         * Init scroll menu
         *
        */
        scrollInit: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                TFUtil.scrollDestroy(element);
                TFUtil.scrollInit(element, {mobileNativeScroll: true, windowScroll: false, resetHeightOnDestroy: true, handleWindowResize: true, height: the.options.scroll.height, rememberPosition: the.options.scroll.rememberPosition});
            } else {
                TFUtil.scrollDestroy(element);
            }
        },

        /**
         * Update scroll menu
        */
        scrollUpdate: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                TFUtil.scrollUpdate(element);
            }
        },

        /**
         * Scroll top
        */
        scrollTop: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                TFUtil.scrollTop(element);
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {TFMenu}
         */
        getSubmenuMode: function(el) {
            if ( TFUtil.isInResponsiveRange('desktop') ) {
                if (el && TFUtil.hasAttr(el, 'data-tfmenu-submenu-toggle') && TFUtil.attr(el, 'data-tfmenu-submenu-toggle') == 'hover') {
                    return 'dropdown';
                }

                if ( TFUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                    if ( TFUtil.hasClasses(body, the.options.submenu.desktop.state.body) ) {
                        return the.options.submenu.desktop.state.mode;
                    } else {
                        return the.options.submenu.desktop.default;
                    }
                } else if ( TFUtil.isset(the.options.submenu, 'desktop') ) {
                    return the.options.submenu.desktop;
                }
            } else if ( TFUtil.isInResponsiveRange('tablet') && TFUtil.isset(the.options.submenu, 'tablet') ) {
                return the.options.submenu.tablet;
            } else if ( TFUtil.isInResponsiveRange('mobile') && TFUtil.isset(the.options.submenu, 'mobile') ) {
                return the.options.submenu.mobile;
            } else {
                return false;
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {TFMenu}
         */
        isConditionalSubmenuDropdown: function() {
            if ( TFUtil.isInResponsiveRange('desktop') && TFUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * Reset submenu attributes
         * @returns {TFMenu}
         */
        resetSubmenuProps: function(e) {
            var submenus = TFUtil.findAll(element, '.tf-menu__submenu');
            if ( submenus ) {
                for (var i = 0, len = submenus.length; i < len; i++) {
                    TFUtil.css(submenus[0], 'display', '');
                    TFUtil.css(submenus[0], 'overflow', '');
                }
            }
        },

        /**
         * Handles submenu hover toggle
         * @returns {TFMenu}
         */
        handleSubmenuDrodownHoverEnter: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            var item = this;

            if ( item.getAttribute('data-hover') == '1' ) {
                item.removeAttribute('data-hover');
                clearTimeout( item.getAttribute('data-timeout') );
                item.removeAttribute('data-timeout');
            }

            Plugin.showSubmenuDropdown(item);
        },

        /**
         * Handles submenu hover toggle
         * @returns {TFMenu}
         */
        handleSubmenuDrodownHoverExit: function(e) {
            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this;
            var time = the.options.dropdown.timeout;

            var timeout = setTimeout(function() {
                if ( item.getAttribute('data-hover') == '1' ) {
                    Plugin.hideSubmenuDropdown(item, true);
                }
            }, time);

            item.setAttribute('data-hover', '1');
            item.setAttribute('data-timeout', timeout);
        },

        /**
         * Handles submenu click toggle
         * @returns {TFMenu}
         */
        handleSubmenuDropdownClick: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this.closest('.tf-menu__item');

            if ( item.getAttribute('data-tfmenu-submenu-mode') == 'accordion' ) {
                return;
            }

            if ( TFUtil.hasClass(item, 'tf-menu__item--hover') === false ) {
                TFUtil.addClass(item, 'tf-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            } else {
                TFUtil.removeClass(item, 'tf-menu__item--open-dropdown' );
                Plugin.hideSubmenuDropdown(item, true);
            }

            e.preventDefault();
        },

        /**
         * Handles tab click toggle
         * @returns {TFMenu}
         */
        handleSubmenuDropdownTabClick: function(e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            var item = this.closest('.tf-menu__item');

            if (item.getAttribute('data-tfmenu-submenu-mode') == 'accordion') {
                return;
            }

            if (TFUtil.hasClass(item, 'tf-menu__item--hover') == false) {
                TFUtil.addClass(item, 'tf-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            }

            e.preventDefault();
        },

        /**
         * Handles link click
         * @returns {TFMenu}
         */
        handleLinkClick: function(e) {
            var submenu = this.closest('.tf-menu__item.tf-menu__item--submenu'); //

            var result = Plugin.eventTrigger('linkClick', this, e);
            if (result === false) {
                return;
            }

            if ( submenu && Plugin.getSubmenuMode(submenu) === 'dropdown' ) {
                Plugin.hideSubmenuDropdowns();
            }
        },

        /**
         * Handles submenu dropdown close on link click
         * @returns {TFMenu}
         */
        handleSubmenuDropdownClose: function(e, el) {
            // exit if its not submenu dropdown mode
            if (Plugin.getSubmenuMode(el) === 'accordion') {
                return;
            }

            var shown = element.querySelectorAll('.tf-menu__item.tf-menu__item--submenu.tf-menu__item--hover:not(.tf-menu__item--tabs)');

            // check if currently clicked link's parent item ha
            if (shown.length > 0 && TFUtil.hasClass(el, 'tf-menu__toggle') === false && el.querySelectorAll('.tf-menu__toggle').length === 0) {
                // close opened dropdown menus
                for (var i = 0, len = shown.length; i < len; i++) {
                    Plugin.hideSubmenuDropdown(shown[0], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {TFMenu}
         */
        handleSubmenuAccordion: function(e, el) {
            var query;
            var item = el ? el : this;

            if ( Plugin.getSubmenuMode(el) === 'dropdown' && (query = item.closest('.tf-menu__item') ) ) {
                if (query.getAttribute('data-tfmenu-submenu-mode') != 'accordion' ) {
                    e.preventDefault();
                    return;
                }
            }

            var li = item.closest('.tf-menu__item');
            var submenu = TFUtil.child(li, '.tf-menu__submenu, .tf-menu__inner');

            if (TFUtil.hasClass(item.closest('.tf-menu__item'), 'tf-menu__item--open-always')) {
                return;
            }

            if ( li && submenu ) {
                e.preventDefault();
                var speed = the.options.accordion.slideSpeed;
                var hasClosables = false;

                if ( TFUtil.hasClass(li, 'tf-menu__item--open') === false ) {
                    // hide other accordions
                    if ( the.options.accordion.expandAll === false ) {
                        var subnav = item.closest('.tf-menu__nav, .tf-menu__subnav');
                        var closables = TFUtil.children(subnav, '.tf-menu__item.tf-menu__item--open.tf-menu__item--submenu:not(.tf-menu__item--here):not(.tf-menu__item--open-always)');

                        if ( subnav && closables ) {
                            for (var i = 0, len = closables.length; i < len; i++) {
                                var el_ = closables[0];
                                var submenu_ = TFUtil.child(el_, '.tf-menu__submenu');
                                if ( submenu_ ) {
                                    TFUtil.slideUp(submenu_, speed, function() {
                                        Plugin.scrollUpdate();
                                        TFUtil.removeClass(el_, 'tf-menu__item--open');
                                    });
                                }
                            }
                        }
                    }

                    TFUtil.slideDown(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.scrollUpdate();

                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    TFUtil.addClass(li, 'tf-menu__item--open');

                } else {
                    TFUtil.slideUp(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    TFUtil.removeClass(li, 'tf-menu__item--open');
                }
            }
        },

        /**
         * scroll to item function
         * @returns {TFMenu}
         */
        scrollToItem: function(item) {
            // handle auto scroll for accordion submenus
            if ( TFUtil.isInResponsiveRange('desktop') && the.options.accordion.autoScroll && element.getAttribute('data-tfmenu-scroll') !== '1' ) {
                TFUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
            }
        },

        /**
         * Hide submenu dropdown
         * @returns {TFMenu}
         */
        hideSubmenuDropdown: function(item, classAlso) {
            // remove submenu activation class
            if ( classAlso ) {
                TFUtil.removeClass(item, 'tf-menu__item--hover');
                TFUtil.removeClass(item, 'tf-menu__item--active-tab');
            }

            // clear timeout
            item.removeAttribute('data-hover');

            if ( item.getAttribute('data-tfmenu-dropdown-toggle-class') ) {
                TFUtil.removeClass(body, item.getAttribute('data-tfmenu-dropdown-toggle-class'));
            }

            var timeout = item.getAttribute('data-timeout');
            item.removeAttribute('data-timeout');
            clearTimeout(timeout);
        },

        /**
         * Hide submenu dropdowns
         * @returns {TFMenu}
         */
        hideSubmenuDropdowns: function() {
            var items;
            if ( items = element.querySelectorAll('.tf-menu__item--submenu.tf-menu__item--hover:not(.tf-menu__item--tabs):not([data-tfmenu-submenu-toggle="tab"])') ) {
                for (var j = 0, cnt = items.length; j < cnt; j++) {
                    Plugin.hideSubmenuDropdown(items[j], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {TFMenu}
         */
        showSubmenuDropdown: function(item) {
            // close active submenus
            var list = element.querySelectorAll('.tf-menu__item--submenu.tf-menu__item--hover, .tf-menu__item--submenu.tf-menu__item--active-tab');

            if ( list ) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var el = list[i];
                    if ( item !== el && el.contains(item) === false && item.contains(el) === false ) {
                        Plugin.hideSubmenuDropdown(el, true);
                    }
                }
            }

            // add submenu activation class
            TFUtil.addClass(item, 'tf-menu__item--hover');

            if ( item.getAttribute('data-tfmenu-dropdown-toggle-class') ) {
                TFUtil.addClass(body, item.getAttribute('data-tfmenu-dropdown-toggle-class'));
            }
        },

        /**
         * Handles submenu slide toggle
         * @returns {TFMenu}
         */
        createSubmenuDropdownClickDropoff: function(el) {
            var query;
            var zIndex = (query = TFUtil.child(el, '.tf-menu__submenu') ? TFUtil.css(query, 'z-index') : 0) - 1;

            var dropoff = document.createElement('<div class="tf-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');

            body.appendChild(dropoff);

            TFUtil.addEvent(dropoff, 'click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                TFUtil.remove(this);
                Plugin.hideSubmenuDropdown(el, true);
            });
        },

        /**
         * Handles submenu hover toggle
         * @returns {TFMenu}
         */
        pauseDropdownHover: function(time) {
            var date = new Date();

            the.pauseDropdownHoverTime = date.getTime() + time;
        },

        /**
         * Handles submenu hover toggle
         * @returns {TFMenu}
         */
        resumeDropdownHover: function() {
            var date = new Date();

            return (date.getTime() > the.pauseDropdownHoverTime ? true : false);
        },

        /**
         * Reset menu's current active item
         * @returns {TFMenu}
         */
        resetActiveItem: function(item) {
            var list;
            var parents;

            list = element.querySelectorAll('.tf-menu__item--active');

            for (var i = 0, len = list.length; i < len; i++) {
                var el = list[0];
                TFUtil.removeClass(el, 'tf-menu__item--active');
                TFUtil.hide( TFUtil.child(el, '.tf-menu__submenu') );
                parents = TFUtil.parents(el, '.tf-menu__item--submenu') || [];

                for (var i_ = 0, len_ = parents.length; i_ < len_; i_++) {
                    var el_ = parents[i];
                    TFUtil.removeClass(el_, 'tf-menu__item--open');
                    TFUtil.hide( TFUtil.child(el_, '.tf-menu__submenu') );
                }
            }

            // close open submenus
            if ( the.options.accordion.expandAll === false ) {
                if ( list = element.querySelectorAll('.tf-menu__item--open') ) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        TFUtil.removeClass(parents[0], 'tf-menu__item--open');
                    }
                }
            }
        },

        /**
         * Sets menu's active item
         * @returns {TFMenu}
         */
        setActiveItem: function(item) {
            // reset current active item
            Plugin.resetActiveItem();

            var parents = TFUtil.parents(item, '.tf-menu__item--submenu') || [];
            for (var i = 0, len = parents.length; i < len; i++) {
                TFUtil.addClass(TFUtil.get(parents[i]), 'tf-menu__item--open');
            }

            TFUtil.addClass(TFUtil.get(item), 'tf-menu__item--active');
        },

        /**
         * Returns page breadcrumbs for the menu's active item
         * @returns {TFMenu}
         */
        getBreadcrumbs: function(item) {
            var query;
            var breadcrumbs = [];
            var link = TFUtil.child(item, '.tf-menu__link');

            breadcrumbs.push({
                text: (query = TFUtil.child(link, '.tf-menu__link-text') ? query.innerHTML : ''),
                title: link.getAttribute('title'),
                href: link.getAttribute('href')
            });

            var parents = TFUtil.parents(item, '.tf-menu__item--submenu');
            for (var i = 0, len = parents.length; i < len; i++) {
                var submenuLink = TFUtil.child(parents[i], '.tf-menu__link');

                breadcrumbs.push({
                    text: (query = TFUtil.child(submenuLink, '.tf-menu__link-text') ? query.innerHTML : ''),
                    title: submenuLink.getAttribute('title'),
                    href: submenuLink.getAttribute('href')
                });
            }

            return  breadcrumbs.reverse();
        },

        /**
         * Returns page title for the menu's active item
         * @returns {TFMenu}
         */
        getPageTitle: function(item) {
            var query;

            return (query = TFUtil.child(item, '.tf-menu__link-text') ? query.innerHTML : '');
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, target, e) {
            for (var i = 0; i < the.events.length; i++ ) {
                var event = the.events[i];
                if ( event.name == name ) {
                    if ( event.one == true ) {
                        if ( event.fired == false ) {
                            the.events[i].fired = true;
                            return event.handler.call(this, target, e);
                        }
                    } else {
                        return event.handler.call(this, target, e);
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
        },

        removeEvent: function(name) {
            if (the.events[name]) {
                delete the.events[name];
            }
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
     * Update scroll
     */
    the.scrollUpdate = function() {
        return Plugin.scrollUpdate();
    };

    /**
     * Re-init scroll
     */
    the.scrollReInit = function() {
        return Plugin.scrollInit();
    };

    /**
     * Scroll top
     */
    the.scrollTop = function() {
        return Plugin.scrollTop();
    };

    /**
     * Set active menu item
     */
    the.setActiveItem = function(item) {
        return Plugin.setActiveItem(item);
    };

    the.reload = function() {
        return Plugin.reload();
    };

    the.update = function(options) {
        return Plugin.update(options);
    };

    /**
     * Set breadcrumb for menu item
     */
    the.getBreadcrumbs = function(item) {
        return Plugin.getBreadcrumbs(item);
    };

    /**
     * Set page title for menu item
     */
    the.getPageTitle = function(item) {
        return Plugin.getPageTitle(item);
    };

    /**
     * Get submenu mode
     */
    the.getSubmenuMode = function(el) {
        return Plugin.getSubmenuMode(el);
    };

    /**
     * Hide dropdown
     * @returns {Object}
     */
    the.hideDropdown = function(item) {
        Plugin.hideSubmenuDropdown(item, true);
    };

    /**
     * Hide dropdowns
     * @returns {Object}
     */
    the.hideDropdowns = function() {
        Plugin.hideSubmenuDropdowns();
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.pauseDropdownHover = function(time) {
        Plugin.pauseDropdownHover(time);
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.resumeDropdownHover = function() {
        return Plugin.resumeDropdownHover();
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.off = function(name) {
        return Plugin.removeEvent(name);
    };

    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Handle plugin on window resize
    TFUtil.addResizeHandler(function() {
        if (init) {
            the.reload();
        }
    });

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TFMenu;
}

// Plugin global lazy initialization
document.addEventListener("click", function (e) {
    var body = TFUtil.get('body');
    var query;
    if ( query = body.querySelectorAll('.tf-menu__nav .tf-menu__item.tf-menu__item--submenu.tf-menu__item--hover:not(.tf-menu__item--tabs)[data-tfmenu-submenu-toggle="click"]') ) {
        for (var i = 0, len = query.length; i < len; i++) {
            var element = query[i].closest('.tf-menu__nav').parentNode;

            if ( element ) {
                var the = TFUtil.data(element).get('menu');

                if ( !the ) {
                    break;
                }

                if ( !the || the.getSubmenuMode() !== 'dropdown' ) {
                    break;
                }

                if ( e.target !== element && element.contains(e.target) === false ) {
                    the.hideDropdowns();
                }
            }
        }
    }
});
