(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tns-core-modules/color'), require('tns-core-modules/ui/page/page'), require('tns-core-modules/platform'), require('@angular/core'), require('tns-core-modules/ui/core/weak-event-listener')) :
    typeof define === 'function' && define.amd ? define('nativescript-ngx-shadow', ['exports', 'tns-core-modules/color', 'tns-core-modules/ui/page/page', 'tns-core-modules/platform', '@angular/core', 'tns-core-modules/ui/core/weak-event-listener'], factory) :
    (factory((global['nativescript-ngx-shadow'] = {}),null,null,null,global.ng.core,null));
}(this, (function (exports,color,page,platform,core,weakEventListener) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var ShapeEnum = {
        RECTANGLE: 'RECTANGLE',
        OVAL: 'OVAL',
        RING: 'RING',
        LINE: 'LINE',
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var LayeredShadow;
    /** @type {?} */
    var PlainShadow;
    if (platform.isAndroid) {
        LayeredShadow = android.graphics.drawable.LayerDrawable.extend({});
        PlainShadow = android.graphics.drawable.GradientDrawable.extend({});
    }
    /** @type {?} */
    var classCache = {};
    /**
     * @param {?} rtype
     * @param {?} field
     * @return {?}
     */
    function getAndroidR(rtype, field) {
        /** @type {?} */
        var className = "android.R$" + rtype;
        if (!classCache.hasOwnProperty(className)) {
            classCache[className] = {
                class: java.lang.Class.forName(className),
                fieldCache: {}
            };
        }
        if (!classCache[className].fieldCache.hasOwnProperty(field)) {
            classCache[className].fieldCache[field] = +classCache[className].class.getField(field).get(null);
        }
        return classCache[className].fieldCache[field];
    }
    var Shadow = (function () {
        function Shadow() {
        }
        /**
         * @param {?} tnsView
         * @param {?} data
         * @return {?}
         */
        Shadow.apply = /**
         * @param {?} tnsView
         * @param {?} data
         * @return {?}
         */
            function (tnsView, data) {
                /** @type {?} */
                var LOLLIPOP = 21;
                if (tnsView.android &&
                    android.os.Build.VERSION.SDK_INT >= LOLLIPOP) {
                    Shadow.applyOnAndroid(tnsView, Shadow.getDefaults(data));
                }
                else if (tnsView.ios) {
                    Shadow.applyOnIOS(tnsView, Shadow.getDefaults(data));
                }
            };
        /**
         * @param {?} data
         * @return {?}
         */
        Shadow.getDefaults = /**
         * @param {?} data
         * @return {?}
         */
            function (data) {
                return Object.assign({}, data, {
                    shape: ((data)).shape || Shadow.DEFAULT_SHAPE,
                    pressedElevation: ((data)).pressedElevation || Shadow.DEFAULT_PRESSED_ELEVATION,
                    pressedTranslationZ: ((data)).pressedTranslationZ || Shadow.DEFAULT_PRESSED_ELEVATION,
                    shadowColor: ((data)).shadowColor ||
                        Shadow.DEFAULT_SHADOW_COLOR,
                    useShadowPath: (((data)).useShadowPath !== undefined ? ((data)).useShadowPath : true),
                    rasterize: (((data)).rasterize !== undefined ? ((data)).rasterize : false)
                });
            };
        /**
         * @param {?} drawable
         * @return {?}
         */
        Shadow.isShadow = /**
         * @param {?} drawable
         * @return {?}
         */
            function (drawable) {
                return (drawable instanceof LayeredShadow || drawable instanceof PlainShadow);
            };
        /**
         * @param {?} tnsView
         * @param {?} data
         * @return {?}
         */
        Shadow.applyOnAndroid = /**
         * @param {?} tnsView
         * @param {?} data
         * @return {?}
         */
            function (tnsView, data) {
                /** @type {?} */
                var nativeView = tnsView.android;
                /** @type {?} */
                var shape;
                /** @type {?} */
                var overrideBackground = true;
                /** @type {?} */
                var currentBg = nativeView.getBackground();
                if (currentBg instanceof android.graphics.drawable.RippleDrawable) {
                    /** @type {?} */
                    var rippleBg = currentBg.getDrawable(0);
                    if (rippleBg instanceof android.graphics.drawable.InsetDrawable) {
                        overrideBackground = false; // this is a button with it's own shadow
                    }
                    else if (Shadow.isShadow(rippleBg)) {
                        // if the ripple is wrapping a shadow, strip it
                        currentBg = rippleBg;
                    }
                }
                if (overrideBackground) {
                    if (Shadow.isShadow(currentBg)) {
                        // make sure to have the right background
                        currentBg = currentBg instanceof LayeredShadow ? // if layered, get the original background
                            currentBg.getDrawable(1) : null;
                    }
                    /** @type {?} */
                    var outerRadii = Array.create("float", 8);
                    if (data.cornerRadius === undefined) {
                        outerRadii[0] = outerRadii[1] = page.Length.toDevicePixels(tnsView.borderTopLeftRadius, 0);
                        outerRadii[2] = outerRadii[3] = page.Length.toDevicePixels(tnsView.borderTopRightRadius, 0);
                        outerRadii[4] = outerRadii[5] = page.Length.toDevicePixels(tnsView.borderBottomRightRadius, 0);
                        outerRadii[6] = outerRadii[7] = page.Length.toDevicePixels(tnsView.borderBottomLeftRadius, 0);
                    }
                    else {
                        java.util.Arrays.fill(outerRadii, Shadow.androidDipToPx(nativeView, /** @type {?} */ (data.cornerRadius)));
                    }
                    /** @type {?} */
                    var bgColor = currentBg ?
                        (currentBg instanceof android.graphics.drawable.ColorDrawable && currentBg.getColor() ?
                            currentBg.getColor() : android.graphics.Color.parseColor(data.bgcolor || Shadow.DEFAULT_BGCOLOR)) :
                        android.graphics.Color.parseColor(data.bgcolor || Shadow.DEFAULT_BGCOLOR);
                    /** @type {?} */
                    var newBg = void 0;
                    if (data.shape !== ShapeEnum.RECTANGLE || data.bgcolor || !currentBg) {
                        // replace background
                        shape = new PlainShadow();
                        shape.setShape(android.graphics.drawable.GradientDrawable[data.shape]);
                        shape.setCornerRadii(outerRadii);
                        shape.setColor(bgColor);
                        newBg = shape;
                    }
                    else {
                        /** @type {?} */
                        var r = new android.graphics.drawable.shapes.RoundRectShape(outerRadii, null, null);
                        shape = new android.graphics.drawable.ShapeDrawable(r);
                        shape.getPaint().setColor(bgColor);
                        /** @type {?} */
                        var arr = Array.create(android.graphics.drawable.Drawable, 2);
                        arr[0] = shape;
                        arr[1] = currentBg;
                        /** @type {?} */
                        var drawable = new LayeredShadow(arr);
                        newBg = drawable;
                    }
                    nativeView.setBackgroundDrawable(newBg);
                }
                nativeView.setElevation(Shadow.androidDipToPx(nativeView, /** @type {?} */ (data.elevation)));
                nativeView.setTranslationZ(Shadow.androidDipToPx(nativeView, /** @type {?} */ (data.translationZ)));
                if (nativeView.getStateListAnimator() || data.forcePressAnimation) {
                    this.overrideDefaultAnimator(nativeView, data);
                }
            };
        /**
         * @param {?} nativeView
         * @param {?} data
         * @return {?}
         */
        Shadow.overrideDefaultAnimator = /**
         * @param {?} nativeView
         * @param {?} data
         * @return {?}
         */
            function (nativeView, data) {
                /** @type {?} */
                var sla = new android.animation.StateListAnimator();
                /** @type {?} */
                var ObjectAnimator = android.animation.ObjectAnimator;
                /** @type {?} */
                var AnimatorSet = android.animation.AnimatorSet;
                /** @type {?} */
                var shortAnimTime = getAndroidR("integer", "config_shortAnimTime");
                /** @type {?} */
                var buttonDuration = nativeView.getContext().getResources().getInteger(shortAnimTime) / 2;
                /** @type {?} */
                var pressedElevation = this.androidDipToPx(nativeView, data.pressedElevation);
                /** @type {?} */
                var pressedZ = this.androidDipToPx(nativeView, data.pressedTranslationZ);
                /** @type {?} */
                var elevation = this.androidDipToPx(nativeView, data.elevation);
                /** @type {?} */
                var z = this.androidDipToPx(nativeView, data.translationZ || 0);
                /** @type {?} */
                var pressedSet = new AnimatorSet();
                /** @type {?} */
                var notPressedSet = new AnimatorSet();
                /** @type {?} */
                var defaultSet = new AnimatorSet();
                pressedSet.playTogether(java.util.Arrays.asList([
                    ObjectAnimator.ofFloat(nativeView, "translationZ", [pressedZ])
                        .setDuration(buttonDuration),
                    ObjectAnimator.ofFloat(nativeView, "elevation", [pressedElevation])
                        .setDuration(0),
                ]));
                notPressedSet.playTogether(java.util.Arrays.asList([
                    ObjectAnimator.ofFloat(nativeView, "translationZ", [z])
                        .setDuration(buttonDuration),
                    ObjectAnimator.ofFloat(nativeView, "elevation", [elevation])
                        .setDuration(0),
                ]));
                defaultSet.playTogether(java.util.Arrays.asList([
                    ObjectAnimator.ofFloat(nativeView, "translationZ", [0]).setDuration(0),
                    ObjectAnimator.ofFloat(nativeView, "elevation", [0]).setDuration(0),
                ]));
                sla.addState([getAndroidR("attr", "state_pressed"), getAndroidR("attr", "state_enabled")], pressedSet);
                sla.addState([getAndroidR("attr", "state_enabled")], notPressedSet);
                sla.addState([], defaultSet);
                nativeView.setStateListAnimator(sla);
            };
        /**
         * @param {?} tnsView
         * @param {?} data
         * @return {?}
         */
        Shadow.applyOnIOS = /**
         * @param {?} tnsView
         * @param {?} data
         * @return {?}
         */
            function (tnsView, data) {
                /** @type {?} */
                var nativeView = tnsView.ios;
                /** @type {?} */
                var elevation = parseFloat((((data.elevation)) - 0).toFixed(2));
                nativeView.layer.maskToBounds = false;
                nativeView.layer.shadowColor = new color.Color(data.shadowColor).ios.CGColor;
                nativeView.layer.shadowOffset =
                    data.shadowOffset ?
                        CGSizeMake(0, parseFloat(String(data.shadowOffset))) :
                        CGSizeMake(0, 0.54 * elevation - 0.14);
                nativeView.layer.shadowOpacity =
                    data.shadowOpacity ?
                        parseFloat(String(data.shadowOpacity)) :
                        0.006 * elevation + 0.25;
                nativeView.layer.shadowRadius =
                    data.shadowRadius ?
                        parseFloat(String(data.shadowRadius)) :
                        0.66 * elevation - 0.5;
                nativeView.layer.shouldRasterize = data.rasterize;
                nativeView.layer.rasterizationScale = platform.screen.mainScreen.scale;
                /** @type {?} */
                var shadowPath = null;
                if (data.useShadowPath) {
                    shadowPath = UIBezierPath.bezierPathWithRoundedRectCornerRadius(nativeView.bounds, nativeView.layer.shadowRadius).cgPath;
                }
                nativeView.layer.shadowPath = shadowPath;
            };
        /**
         * @param {?} nativeView
         * @param {?} dip
         * @return {?}
         */
        Shadow.androidDipToPx = /**
         * @param {?} nativeView
         * @param {?} dip
         * @return {?}
         */
            function (nativeView, dip) {
                /** @type {?} */
                var metrics = nativeView.getContext().getResources().getDisplayMetrics();
                return android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_DIP, dip, metrics);
            };
        Shadow.DEFAULT_SHAPE = ShapeEnum.RECTANGLE;
        Shadow.DEFAULT_BGCOLOR = '#FFFFFF';
        Shadow.DEFAULT_SHADOW_COLOR = '#000000';
        Shadow.DEFAULT_PRESSED_ELEVATION = 2;
        Shadow.DEFAULT_PRESSED_Z = 4;
        return Shadow;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NativeShadowDirective = (function () {
        function NativeShadowDirective(el, render) {
            var _this = this;
            this.el = el;
            this.render = render;
            this.loaded = false;
            this.initialized = false;
            this.eventsBound = false;
            this.monkeyPatch = function (val) {
                _this.previousNSFn.call(_this.el.nativeElement, val);
                _this.applyShadow();
            };
            if (platform.isAndroid) {
                this.originalNSFn = this.el.nativeElement._redrawNativeBackground; //always store the original method
            }
        }
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                // RadListView calls this multiple times for the same view
                if (!this.initialized) {
                    this.initialized = true;
                    this.initializeCommonData();
                    if (platform.isAndroid) {
                        this.initializeAndroidData();
                    }
                    else if (platform.isIOS) {
                        this.initializeIOSData();
                    }
                    if (this.shadow && ((this.shadow)).elevation) {
                        if (platform.isAndroid) {
                            this.loadFromAndroidData(/** @type {?} */ (this.shadow));
                        }
                        else if (platform.isIOS) {
                            this.loadFromIOSData(/** @type {?} */ (this.shadow));
                        }
                    }
                    this.bindEvents();
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.initialized) {
                    this.unbindEvents();
                    this.initialized = false;
                }
            };
        // NS ListViews create elements dynamically
        // loaded and unloaded are called before angular is "ready"
        // https://github.com/NativeScript/nativescript-angular/issues/1221#issuecomment-422813111
        // So we ensure we're running loaded/unloaded events outside of angular
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.bindEvents = /**
         * @return {?}
         */
            function () {
                if (!this.eventsBound) {
                    weakEventListener.addWeakEventListener(this.el.nativeElement, page.View.loadedEvent, this.onLoaded, this);
                    weakEventListener.addWeakEventListener(this.el.nativeElement, page.View.unloadedEvent, this.onUnloaded, this);
                    this.eventsBound = true;
                    // in some cases, the element is already loaded by time of binding
                    if (this.el.nativeElement.isLoaded) {
                        this.onLoaded();
                    }
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.unbindEvents = /**
         * @return {?}
         */
            function () {
                if (this.eventsBound) {
                    weakEventListener.removeWeakEventListener(this.el.nativeElement, page.View.loadedEvent, this.onLoaded, this);
                    weakEventListener.removeWeakEventListener(this.el.nativeElement, page.View.unloadedEvent, this.onUnloaded, this);
                    this.eventsBound = false;
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.onLoaded = /**
         * @return {?}
         */
            function () {
                this.loaded = true;
                // Weirdly ngOnInit isn't called on iOS on demo app
                // Managed to get it working on iOS when applying to
                // FlexboxLayout, but on the demo app, we apply to a
                // Label, and, for that case, ngOnInit isn't called
                // This is just enforcing the Directive is initialized
                // before calling this.applyShadow()
                if (!this.initialized) {
                    this.ngOnInit();
                }
                this.applyShadow();
                if (platform.isAndroid) {
                    this.previousNSFn = this.el.nativeElement._redrawNativeBackground; // just to maintain compatibility with other patches
                    this.el.nativeElement._redrawNativeBackground = this.monkeyPatch;
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.addIosWrapper = /**
         * @return {?}
         */
            function () {
                if (platform.isIOS) {
                    /** @type {?} */
                    var originalElement = (this.el.nativeElement);
                    this.iosShadowRapper = /** @type {?} */ (this.render.createElement('StackLayout'));
                    /** @type {?} */
                    var parent_1 = originalElement.parentNode;
                    this.render.insertBefore(parent_1, this.iosShadowRapper, originalElement);
                    this.render.removeChild(parent_1, originalElement);
                    this.render.appendChild(this.iosShadowRapper, originalElement);
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.onUnloaded = /**
         * @return {?}
         */
            function () {
                this.loaded = false;
                if (platform.isAndroid) {
                    this.el.nativeElement._redrawNativeBackground = this.originalNSFn; // always revert to the original method
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                this.addIosWrapper();
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        NativeShadowDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (this.loaded &&
                    !!changes &&
                    (changes.hasOwnProperty('shadow') ||
                        changes.hasOwnProperty('elevation') ||
                        changes.hasOwnProperty('pressedElevation') ||
                        changes.hasOwnProperty('shape') ||
                        changes.hasOwnProperty('bgcolor') ||
                        changes.hasOwnProperty('cornerRadius') ||
                        changes.hasOwnProperty('pressedTranslationZ') ||
                        changes.hasOwnProperty('forcePressAnimation') ||
                        changes.hasOwnProperty('translationZ') ||
                        changes.hasOwnProperty('maskToBounds') ||
                        changes.hasOwnProperty('shadowColor') ||
                        changes.hasOwnProperty('shadowOffset') ||
                        changes.hasOwnProperty('shadowOpacity') ||
                        changes.hasOwnProperty('shadowRadius') ||
                        changes.hasOwnProperty('rasterize') ||
                        changes.hasOwnProperty('useShadowMap'))) {
                    if (changes.hasOwnProperty('shadow') &&
                        !changes.hasOwnProperty('elevation') &&
                        typeof changes["shadow"].currentValue === 'number') {
                        this.elevation = changes["shadow"].currentValue;
                    }
                    if (changes["shadow"] && changes["shadow"].currentValue.elevation) {
                        if (platform.isAndroid) {
                            this.loadFromAndroidData(/** @type {?} */ (this.shadow));
                        }
                        else if (platform.isIOS) {
                            this.loadFromIOSData(/** @type {?} */ (this.shadow));
                        }
                    }
                    this.applyShadow();
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.applyShadow = /**
         * @return {?}
         */
            function () {
                if (this.shadow === null ||
                    this.shadow === undefined ||
                    (this.shadow === '' && !this.elevation)) {
                    return;
                }
                // For shadows to be shown on Android the SDK has to be greater
                // or equal than 21, lower SDK means no setElevation method is available
                if (platform.isAndroid) {
                    if (android.os.Build.VERSION.SDK_INT < 21) {
                        return;
                    }
                }
                /** @type {?} */
                var viewToApplyShadowTo = platform.isIOS
                    ? this.iosShadowRapper
                    : this.el.nativeElement;
                if (viewToApplyShadowTo) {
                    Shadow.apply(viewToApplyShadowTo, {
                        elevation: /** @type {?} */ (this.elevation),
                        pressedElevation: /** @type {?} */ (this.pressedElevation),
                        shape: this.shape,
                        bgcolor: this.bgcolor,
                        cornerRadius: this.cornerRadius,
                        translationZ: this.translationZ,
                        pressedTranslationZ: this.pressedTranslationZ,
                        forcePressAnimation: this.forcePressAnimation,
                        maskToBounds: this.maskToBounds,
                        shadowColor: this.shadowColor,
                        shadowOffset: /** @type {?} */ (this.shadowOffset),
                        shadowOpacity: /** @type {?} */ (this.shadowOpacity),
                        shadowRadius: /** @type {?} */ (this.shadowRadius),
                        rasterize: this.rasterize,
                        useShadowPath: this.useShadowPath
                    });
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.initializeCommonData = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var tShadow = typeof this.shadow;
                if ((tShadow === 'string' || tShadow === 'number') && !this.elevation) {
                    this.elevation = this.shadow ? parseInt(/** @type {?} */ (this.shadow), 10) : 2;
                }
                /** @type {?} */
                var tElevation = typeof this.elevation;
                if (tElevation === 'string' || tElevation === 'number') {
                    this.elevation = this.elevation
                        ? parseInt(/** @type {?} */ (this.elevation), 10)
                        : 2;
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.initializeAndroidData = /**
         * @return {?}
         */
            function () {
                if (typeof this.cornerRadius === 'string') {
                    this.cornerRadius = parseInt(this.cornerRadius, 10);
                }
                if (typeof this.translationZ === 'string') {
                    this.translationZ = parseInt(this.translationZ, 10);
                }
            };
        /**
         * @return {?}
         */
        NativeShadowDirective.prototype.initializeIOSData = /**
         * @return {?}
         */
            function () {
                if (typeof this.shadowOffset === 'string') {
                    this.shadowOffset = parseFloat(this.shadowOffset);
                }
                if (typeof this.shadowOpacity === 'string') {
                    this.shadowOpacity = parseFloat(this.shadowOpacity);
                }
                if (typeof this.shadowRadius === 'string') {
                    this.shadowRadius = parseFloat(this.shadowRadius);
                }
            };
        /**
         * @param {?} data
         * @return {?}
         */
        NativeShadowDirective.prototype.loadFromAndroidData = /**
         * @param {?} data
         * @return {?}
         */
            function (data) {
                this.elevation = data.elevation || this.elevation;
                this.shape = data.shape || this.shape;
                this.bgcolor = data.bgcolor || this.bgcolor;
                this.cornerRadius = data.cornerRadius || this.cornerRadius;
                this.translationZ = data.translationZ || this.translationZ;
            };
        /**
         * @param {?} data
         * @return {?}
         */
        NativeShadowDirective.prototype.loadFromIOSData = /**
         * @param {?} data
         * @return {?}
         */
            function (data) {
                this.maskToBounds = data.maskToBounds || this.maskToBounds;
                this.shadowColor = data.shadowColor || this.shadowColor;
                this.shadowOffset = data.shadowOffset || this.shadowOffset;
                this.shadowOpacity = data.shadowOpacity || this.shadowOpacity;
                this.shadowRadius = data.shadowRadius || this.shadowRadius;
                this.rasterize = data.rasterize || this.rasterize;
                this.useShadowPath = data.useShadowPath || this.useShadowPath;
            };
        NativeShadowDirective.decorators = [
            { type: core.Directive, args: [{ selector: '[shadow]' },] },
        ];
        /** @nocollapse */
        NativeShadowDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 }
            ];
        };
        NativeShadowDirective.propDecorators = {
            shadow: [{ type: core.Input }],
            elevation: [{ type: core.Input }],
            pressedElevation: [{ type: core.Input }],
            shape: [{ type: core.Input }],
            bgcolor: [{ type: core.Input }],
            cornerRadius: [{ type: core.Input }],
            translationZ: [{ type: core.Input }],
            pressedTranslationZ: [{ type: core.Input }],
            forcePressAnimation: [{ type: core.Input }],
            maskToBounds: [{ type: core.Input }],
            shadowColor: [{ type: core.Input }],
            shadowOffset: [{ type: core.Input }],
            shadowOpacity: [{ type: core.Input }],
            shadowRadius: [{ type: core.Input }],
            useShadowPath: [{ type: core.Input }],
            rasterize: [{ type: core.Input }]
        };
        return NativeShadowDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgShadowModule = (function () {
        function NgShadowModule() {
        }
        NgShadowModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [],
                        declarations: [
                            NativeShadowDirective,
                        ],
                        exports: [
                            NativeShadowDirective,
                        ],
                        providers: [],
                    },] },
        ];
        return NgShadowModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var AndroidData = (function () {
        function AndroidData() {
        }
        return AndroidData;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @enum {number} */
    var Elevation = {
        SWITCH: 1,
        CARD_RESTING: 2,
        RAISED_BUTTON_RESTING: 2,
        SEARCH_BAR_RESTING: 2,
        REFRESH_INDICADOR: 3,
        SEARCH_BAR_SCROLLED: 3,
        APPBAR: 4,
        FAB_RESTING: 6,
        SNACKBAR: 6,
        BOTTOM_NAVIGATION_BAR: 8,
        MENU: 8,
        CARD_PICKED_UP: 8,
        RAISED_BUTTON_PRESSED: 8,
        SUBMENU_LEVEL1: 9,
        SUBMENU_LEVEL2: 10,
        SUBMENU_LEVEL3: 11,
        SUBMENU_LEVEL4: 12,
        SUBMENU_LEVEL5: 13,
        FAB_PRESSED: 12,
        NAV_DRAWER: 16,
        RIGHT_DRAWER: 16,
        MODAL_BOTTOM_SHEET: 16,
        DIALOG: 24,
        PICKER: 24,
    };
    Elevation[Elevation.SWITCH] = 'SWITCH';
    Elevation[Elevation.CARD_RESTING] = 'CARD_RESTING';
    Elevation[Elevation.RAISED_BUTTON_RESTING] = 'RAISED_BUTTON_RESTING';
    Elevation[Elevation.SEARCH_BAR_RESTING] = 'SEARCH_BAR_RESTING';
    Elevation[Elevation.REFRESH_INDICADOR] = 'REFRESH_INDICADOR';
    Elevation[Elevation.SEARCH_BAR_SCROLLED] = 'SEARCH_BAR_SCROLLED';
    Elevation[Elevation.APPBAR] = 'APPBAR';
    Elevation[Elevation.FAB_RESTING] = 'FAB_RESTING';
    Elevation[Elevation.SNACKBAR] = 'SNACKBAR';
    Elevation[Elevation.BOTTOM_NAVIGATION_BAR] = 'BOTTOM_NAVIGATION_BAR';
    Elevation[Elevation.MENU] = 'MENU';
    Elevation[Elevation.CARD_PICKED_UP] = 'CARD_PICKED_UP';
    Elevation[Elevation.RAISED_BUTTON_PRESSED] = 'RAISED_BUTTON_PRESSED';
    Elevation[Elevation.SUBMENU_LEVEL1] = 'SUBMENU_LEVEL1';
    Elevation[Elevation.SUBMENU_LEVEL2] = 'SUBMENU_LEVEL2';
    Elevation[Elevation.SUBMENU_LEVEL3] = 'SUBMENU_LEVEL3';
    Elevation[Elevation.SUBMENU_LEVEL4] = 'SUBMENU_LEVEL4';
    Elevation[Elevation.SUBMENU_LEVEL5] = 'SUBMENU_LEVEL5';
    Elevation[Elevation.FAB_PRESSED] = 'FAB_PRESSED';
    Elevation[Elevation.NAV_DRAWER] = 'NAV_DRAWER';
    Elevation[Elevation.RIGHT_DRAWER] = 'RIGHT_DRAWER';
    Elevation[Elevation.MODAL_BOTTOM_SHEET] = 'MODAL_BOTTOM_SHEET';
    Elevation[Elevation.DIALOG] = 'DIALOG';
    Elevation[Elevation.PICKER] = 'PICKER';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var IOSData = (function () {
        function IOSData() {
        }
        return IOSData;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.NgShadowModule = NgShadowModule;
    exports.AndroidData = AndroidData;
    exports.Elevation = Elevation;
    exports.IOSData = IOSData;
    exports.Shadow = Shadow;
    exports.ShapeEnum = ShapeEnum;
    exports.ɵa = NativeShadowDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlc2NyaXB0LW5neC1zaGFkb3cudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9jb21tb24vc2hhcGUuZW51bS50cyIsIm5nOi8vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvY29tbW9uL3NoYWRvdy50cyIsIm5nOi8vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmctc2hhZG93LmRpcmVjdGl2ZS50cyIsIm5nOi8vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbGliLm1vZHVsZS50cyIsIm5nOi8vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvY29tbW9uL2FuZHJvaWQtZGF0YS5tb2RlbC50cyIsIm5nOi8vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvY29tbW9uL2VsZXZhdGlvbi5lbnVtLnRzIiwibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9jb21tb24vaW9zLWRhdGEubW9kZWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZW51bSBTaGFwZUVudW0ge1xuICBSRUNUQU5HTEUgPSAnUkVDVEFOR0xFJyxcbiAgT1ZBTCA9ICdPVkFMJyxcbiAgUklORyA9ICdSSU5HJyxcbiAgTElORSA9ICdMSU5FJyxcbn1cblxuZXhwb3J0IHR5cGUgU2hhcGUgPSAnUkVDVEFOR0xFJyB8ICdPVkFMJyB8ICdSSU5HJyB8ICdMSU5FJztcbiIsImltcG9ydCB7IENvbG9yIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9jb2xvcic7XG5cbmltcG9ydCB7IEFuZHJvaWREYXRhIH0gZnJvbSBcIi4vYW5kcm9pZC1kYXRhLm1vZGVsXCI7XG5pbXBvcnQgeyBJT1NEYXRhIH0gZnJvbSBcIi4vaW9zLWRhdGEubW9kZWxcIjtcbmltcG9ydCB7IFNoYXBlRW51bSB9IGZyb20gJy4vc2hhcGUuZW51bSc7XG5pbXBvcnQgeyBMZW5ndGggfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2UvcGFnZSc7XG5pbXBvcnQgeyBpc0FuZHJvaWQsIHNjcmVlbiB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtXCI7XG5cbmRlY2xhcmUgY29uc3QgYW5kcm9pZDogYW55O1xuZGVjbGFyZSBjb25zdCBqYXZhOiBhbnk7XG5kZWNsYXJlIGNvbnN0IENHU2l6ZU1ha2U6IGFueTtcbmRlY2xhcmUgY29uc3QgVUlTY3JlZW46IGFueTtcbmRlY2xhcmUgY29uc3QgQXJyYXk6IGFueTtcbmRlY2xhcmUgY29uc3QgVUlCZXppZXJQYXRoOiBhbnk7XG5cbmxldCBMYXllcmVkU2hhZG93O1xubGV0IFBsYWluU2hhZG93O1xuXG5pZiAoaXNBbmRyb2lkKSB7XG4gIExheWVyZWRTaGFkb3cgPSBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkxheWVyRHJhd2FibGUuZXh0ZW5kKHt9KTtcbiAgUGxhaW5TaGFkb3cgPSBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkdyYWRpZW50RHJhd2FibGUuZXh0ZW5kKHt9KTtcbn1cblxuY29uc3QgY2xhc3NDYWNoZTogeyBbaWQ6IHN0cmluZ106IHsgY2xhc3M6IGFueSwgZmllbGRDYWNoZTogeyBbaWQ6IHN0cmluZ106IG51bWJlciB9IH0gfSA9IHt9O1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL05hdGl2ZVNjcmlwdC9hbmRyb2lkLXJ1bnRpbWUvaXNzdWVzLzEzMzBcbmZ1bmN0aW9uIGdldEFuZHJvaWRSKHJ0eXBlOiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBjbGFzc05hbWUgPSBcImFuZHJvaWQuUiRcIiArIHJ0eXBlO1xuICBpZiAoIWNsYXNzQ2FjaGUuaGFzT3duUHJvcGVydHkoY2xhc3NOYW1lKSkge1xuICAgIGNsYXNzQ2FjaGVbY2xhc3NOYW1lXSA9IHtcbiAgICAgIGNsYXNzOiBqYXZhLmxhbmcuQ2xhc3MuZm9yTmFtZShjbGFzc05hbWUpLFxuICAgICAgZmllbGRDYWNoZToge31cbiAgICB9O1xuICB9XG4gIGlmKCFjbGFzc0NhY2hlW2NsYXNzTmFtZV0uZmllbGRDYWNoZS5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICBjbGFzc0NhY2hlW2NsYXNzTmFtZV0uZmllbGRDYWNoZVtmaWVsZF0gPSArY2xhc3NDYWNoZVtjbGFzc05hbWVdLmNsYXNzLmdldEZpZWxkKGZpZWxkKS5nZXQobnVsbCk7XG4gIH1cbiAgcmV0dXJuIGNsYXNzQ2FjaGVbY2xhc3NOYW1lXS5maWVsZENhY2hlW2ZpZWxkXTtcbn1cblxuZXhwb3J0IGNsYXNzIFNoYWRvdyB7XG4gIHN0YXRpYyBERUZBVUxUX1NIQVBFID0gU2hhcGVFbnVtLlJFQ1RBTkdMRTtcbiAgc3RhdGljIERFRkFVTFRfQkdDT0xPUiA9ICcjRkZGRkZGJztcbiAgc3RhdGljIERFRkFVTFRfU0hBRE9XX0NPTE9SID0gJyMwMDAwMDAnO1xuICBzdGF0aWMgREVGQVVMVF9QUkVTU0VEX0VMRVZBVElPTiA9IDI7XG4gIHN0YXRpYyBERUZBVUxUX1BSRVNTRURfWiA9IDQ7XG5cbiAgc3RhdGljIGFwcGx5KHRuc1ZpZXc6IGFueSwgZGF0YTogSU9TRGF0YSB8IEFuZHJvaWREYXRhKSB7XG4gICAgY29uc3QgTE9MTElQT1AgPSAyMTtcbiAgICBpZiAoXG4gICAgICB0bnNWaWV3LmFuZHJvaWQgJiZcbiAgICAgIGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UID49IExPTExJUE9QXG4gICAgKSB7XG4gICAgICBTaGFkb3cuYXBwbHlPbkFuZHJvaWQodG5zVmlldywgU2hhZG93LmdldERlZmF1bHRzKGRhdGEpKTtcbiAgICB9IGVsc2UgaWYgKHRuc1ZpZXcuaW9zKSB7XG4gICAgICBTaGFkb3cuYXBwbHlPbklPUyh0bnNWaWV3LCBTaGFkb3cuZ2V0RGVmYXVsdHMoZGF0YSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldERlZmF1bHRzKGRhdGE6IElPU0RhdGEgfCBBbmRyb2lkRGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICBkYXRhLFxuICAgICAge1xuICAgICAgICBzaGFwZTogKGRhdGEgYXMgQW5kcm9pZERhdGEpLnNoYXBlIHx8IFNoYWRvdy5ERUZBVUxUX1NIQVBFLFxuICAgICAgICBwcmVzc2VkRWxldmF0aW9uOiAoZGF0YSBhcyBBbmRyb2lkRGF0YSkucHJlc3NlZEVsZXZhdGlvbiB8fCBTaGFkb3cuREVGQVVMVF9QUkVTU0VEX0VMRVZBVElPTixcbiAgICAgICAgcHJlc3NlZFRyYW5zbGF0aW9uWjogKGRhdGEgYXMgQW5kcm9pZERhdGEpLnByZXNzZWRUcmFuc2xhdGlvblogfHwgU2hhZG93LkRFRkFVTFRfUFJFU1NFRF9FTEVWQVRJT04sXG4gICAgICAgIHNoYWRvd0NvbG9yOiAoZGF0YSBhcyBJT1NEYXRhKS5zaGFkb3dDb2xvciB8fFxuICAgICAgICAgIFNoYWRvdy5ERUZBVUxUX1NIQURPV19DT0xPUixcbiAgICAgICAgdXNlU2hhZG93UGF0aDogKChkYXRhIGFzIElPU0RhdGEpLnVzZVNoYWRvd1BhdGggIT09IHVuZGVmaW5lZCA/IChkYXRhIGFzIElPU0RhdGEpLnVzZVNoYWRvd1BhdGggOiB0cnVlKSxcbiAgICAgICAgcmFzdGVyaXplOiAoKGRhdGEgYXMgSU9TRGF0YSkucmFzdGVyaXplICE9PSB1bmRlZmluZWQgPyAoZGF0YSBhcyBJT1NEYXRhKS5yYXN0ZXJpemUgOiBmYWxzZSlcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGlzU2hhZG93KGRyYXdhYmxlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKGRyYXdhYmxlIGluc3RhbmNlb2YgTGF5ZXJlZFNoYWRvdyB8fCBkcmF3YWJsZSBpbnN0YW5jZW9mIFBsYWluU2hhZG93KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGFwcGx5T25BbmRyb2lkKHRuc1ZpZXc6IGFueSwgZGF0YTogQW5kcm9pZERhdGEpIHtcbiAgICBjb25zdCBuYXRpdmVWaWV3ID0gdG5zVmlldy5hbmRyb2lkO1xuICAgIGxldCBzaGFwZTtcbiAgICBsZXQgb3ZlcnJpZGVCYWNrZ3JvdW5kID0gdHJ1ZTtcblxuXG4gICAgbGV0IGN1cnJlbnRCZyA9IG5hdGl2ZVZpZXcuZ2V0QmFja2dyb3VuZCgpO1xuXG4gICAgaWYgKGN1cnJlbnRCZyBpbnN0YW5jZW9mIGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuUmlwcGxlRHJhd2FibGUpIHsgLy8gcGxheSBuaWNlIGlmIGEgcmlwcGxlIGlzIHdyYXBwaW5nIGEgc2hhZG93XG4gICAgICBsZXQgcmlwcGxlQmcgPSBjdXJyZW50QmcuZ2V0RHJhd2FibGUoMCk7XG4gICAgICBpZiAocmlwcGxlQmcgaW5zdGFuY2VvZiBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkluc2V0RHJhd2FibGUpIHtcbiAgICAgICAgb3ZlcnJpZGVCYWNrZ3JvdW5kID0gZmFsc2U7IC8vIHRoaXMgaXMgYSBidXR0b24gd2l0aCBpdCdzIG93biBzaGFkb3dcbiAgICAgIH0gZWxzZSBpZiAoU2hhZG93LmlzU2hhZG93KHJpcHBsZUJnKSkgeyAvLyBpZiB0aGUgcmlwcGxlIGlzIHdyYXBwaW5nIGEgc2hhZG93LCBzdHJpcCBpdFxuICAgICAgICBjdXJyZW50QmcgPSByaXBwbGVCZztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG92ZXJyaWRlQmFja2dyb3VuZCkge1xuICAgICAgaWYgKFNoYWRvdy5pc1NoYWRvdyhjdXJyZW50QmcpKSB7IC8vIG1ha2Ugc3VyZSB0byBoYXZlIHRoZSByaWdodCBiYWNrZ3JvdW5kXG4gICAgICAgIGN1cnJlbnRCZyA9IGN1cnJlbnRCZyBpbnN0YW5jZW9mIExheWVyZWRTaGFkb3cgPyAvLyBpZiBsYXllcmVkLCBnZXQgdGhlIG9yaWdpbmFsIGJhY2tncm91bmRcbiAgICAgICAgICBjdXJyZW50QmcuZ2V0RHJhd2FibGUoMSkgOiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXRlclJhZGlpID0gQXJyYXkuY3JlYXRlKFwiZmxvYXRcIiwgOCk7XG4gICAgICBpZiAoZGF0YS5jb3JuZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvdXRlclJhZGlpWzBdID0gb3V0ZXJSYWRpaVsxXSA9IExlbmd0aC50b0RldmljZVBpeGVscyh0bnNWaWV3LmJvcmRlclRvcExlZnRSYWRpdXMsIDApO1xuICAgICAgICBvdXRlclJhZGlpWzJdID0gb3V0ZXJSYWRpaVszXSA9IExlbmd0aC50b0RldmljZVBpeGVscyh0bnNWaWV3LmJvcmRlclRvcFJpZ2h0UmFkaXVzLCAwKTtcbiAgICAgICAgb3V0ZXJSYWRpaVs0XSA9IG91dGVyUmFkaWlbNV0gPSBMZW5ndGgudG9EZXZpY2VQaXhlbHModG5zVmlldy5ib3JkZXJCb3R0b21SaWdodFJhZGl1cywgMCk7XG4gICAgICAgIG91dGVyUmFkaWlbNl0gPSBvdXRlclJhZGlpWzddID0gTGVuZ3RoLnRvRGV2aWNlUGl4ZWxzKHRuc1ZpZXcuYm9yZGVyQm90dG9tTGVmdFJhZGl1cywgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqYXZhLnV0aWwuQXJyYXlzLmZpbGwob3V0ZXJSYWRpaSwgU2hhZG93LmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEuY29ybmVyUmFkaXVzIGFzIG51bWJlcikpO1xuICAgICAgfVxuXG4gICAgICAvLyB1c2UgdGhlIHVzZXIgZGVmaW5lZCBjb2xvciBvciB0aGUgZGVmYXVsdCBpbiBjYXNlIHRoZSBjb2xvciBpcyBUUkFOU1BBUkVOVFxuICAgICAgY29uc3QgYmdDb2xvciA9IGN1cnJlbnRCZyA/XG4gICAgICAgIChjdXJyZW50QmcgaW5zdGFuY2VvZiBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkNvbG9yRHJhd2FibGUgJiYgY3VycmVudEJnLmdldENvbG9yKCkgP1xuICAgICAgICAgIGN1cnJlbnRCZy5nZXRDb2xvcigpIDogYW5kcm9pZC5ncmFwaGljcy5Db2xvci5wYXJzZUNvbG9yKGRhdGEuYmdjb2xvciB8fCBTaGFkb3cuREVGQVVMVF9CR0NPTE9SKSkgOlxuICAgICAgICBhbmRyb2lkLmdyYXBoaWNzLkNvbG9yLnBhcnNlQ29sb3IoZGF0YS5iZ2NvbG9yIHx8IFNoYWRvdy5ERUZBVUxUX0JHQ09MT1IpO1xuXG4gICAgICBsZXQgbmV3Qmc7XG5cbiAgICAgIGlmIChkYXRhLnNoYXBlICE9PSBTaGFwZUVudW0uUkVDVEFOR0xFIHx8IGRhdGEuYmdjb2xvciB8fCAhY3VycmVudEJnKSB7IC8vIHJlcGxhY2UgYmFja2dyb3VuZFxuICAgICAgICBzaGFwZSA9IG5ldyBQbGFpblNoYWRvdygpO1xuICAgICAgICBzaGFwZS5zZXRTaGFwZShcbiAgICAgICAgICBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkdyYWRpZW50RHJhd2FibGVbZGF0YS5zaGFwZV0sXG4gICAgICAgICk7XG4gICAgICAgIHNoYXBlLnNldENvcm5lclJhZGlpKG91dGVyUmFkaWkpO1xuICAgICAgICBzaGFwZS5zZXRDb2xvcihiZ0NvbG9yKTtcbiAgICAgICAgbmV3QmcgPSBzaGFwZTtcbiAgICAgIH0gZWxzZSB7IC8vIGFkZCBhIGxheWVyXG4gICAgICAgIGNvbnN0IHIgPSBuZXcgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5zaGFwZXMuUm91bmRSZWN0U2hhcGUob3V0ZXJSYWRpaSwgbnVsbCwgbnVsbCk7XG4gICAgICAgIHNoYXBlID0gbmV3IGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuU2hhcGVEcmF3YWJsZShyKTtcbiAgICAgICAgc2hhcGUuZ2V0UGFpbnQoKS5zZXRDb2xvcihiZ0NvbG9yKTtcbiAgICAgICAgdmFyIGFyciA9IEFycmF5LmNyZWF0ZShhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLkRyYXdhYmxlLCAyKTtcbiAgICAgICAgYXJyWzBdID0gc2hhcGU7XG4gICAgICAgIGFyclsxXSA9IGN1cnJlbnRCZztcbiAgICAgICAgY29uc3QgZHJhd2FibGUgPSBuZXcgTGF5ZXJlZFNoYWRvdyhhcnIpO1xuICAgICAgICBuZXdCZyA9IGRyYXdhYmxlO1xuICAgICAgfVxuXG4gICAgICBuYXRpdmVWaWV3LnNldEJhY2tncm91bmREcmF3YWJsZShuZXdCZyk7XG4gICAgfVxuXG4gICAgbmF0aXZlVmlldy5zZXRFbGV2YXRpb24oXG4gICAgICBTaGFkb3cuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5lbGV2YXRpb24gYXMgbnVtYmVyKSxcbiAgICApO1xuICAgIG5hdGl2ZVZpZXcuc2V0VHJhbnNsYXRpb25aKFxuICAgICAgU2hhZG93LmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEudHJhbnNsYXRpb25aIGFzIG51bWJlciksXG4gICAgKTtcbiAgICBpZiAobmF0aXZlVmlldy5nZXRTdGF0ZUxpc3RBbmltYXRvcigpIHx8IGRhdGEuZm9yY2VQcmVzc0FuaW1hdGlvbikge1xuICAgICAgdGhpcy5vdmVycmlkZURlZmF1bHRBbmltYXRvcihuYXRpdmVWaWV3LCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBvdmVycmlkZURlZmF1bHRBbmltYXRvcihuYXRpdmVWaWV3OiBhbnksIGRhdGE6IEFuZHJvaWREYXRhKSB7XG4gICAgY29uc3Qgc2xhID0gbmV3IGFuZHJvaWQuYW5pbWF0aW9uLlN0YXRlTGlzdEFuaW1hdG9yKCk7XG5cbiAgICBjb25zdCBPYmplY3RBbmltYXRvciA9IGFuZHJvaWQuYW5pbWF0aW9uLk9iamVjdEFuaW1hdG9yO1xuICAgIGNvbnN0IEFuaW1hdG9yU2V0ID0gYW5kcm9pZC5hbmltYXRpb24uQW5pbWF0b3JTZXQ7XG4gICAgY29uc3Qgc2hvcnRBbmltVGltZSA9IGdldEFuZHJvaWRSKFwiaW50ZWdlclwiLCBcImNvbmZpZ19zaG9ydEFuaW1UaW1lXCIpO1xuXG4gICAgY29uc3QgYnV0dG9uRHVyYXRpb24gPVxuICAgICAgbmF0aXZlVmlldy5nZXRDb250ZXh0KCkuZ2V0UmVzb3VyY2VzKCkuZ2V0SW50ZWdlcihzaG9ydEFuaW1UaW1lKSAvIDI7XG4gICAgY29uc3QgcHJlc3NlZEVsZXZhdGlvbiA9IHRoaXMuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5wcmVzc2VkRWxldmF0aW9uKTtcbiAgICBjb25zdCBwcmVzc2VkWiA9IHRoaXMuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5wcmVzc2VkVHJhbnNsYXRpb25aKTtcbiAgICBjb25zdCBlbGV2YXRpb24gPSB0aGlzLmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEuZWxldmF0aW9uKTtcbiAgICBjb25zdCB6ID0gdGhpcy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLnRyYW5zbGF0aW9uWiB8fCAwKTtcblxuICAgIGNvbnN0IHByZXNzZWRTZXQgPSBuZXcgQW5pbWF0b3JTZXQoKTtcbiAgICBjb25zdCBub3RQcmVzc2VkU2V0ID0gbmV3IEFuaW1hdG9yU2V0KCk7XG4gICAgY29uc3QgZGVmYXVsdFNldCA9IG5ldyBBbmltYXRvclNldCgpO1xuXG4gICAgcHJlc3NlZFNldC5wbGF5VG9nZXRoZXIoamF2YS51dGlsLkFycmF5cy5hc0xpc3QoW1xuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcInRyYW5zbGF0aW9uWlwiLCBbcHJlc3NlZFpdKVxuICAgICAgICAuc2V0RHVyYXRpb24oYnV0dG9uRHVyYXRpb24pLFxuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcImVsZXZhdGlvblwiLCBbcHJlc3NlZEVsZXZhdGlvbl0pXG4gICAgICAgIC5zZXREdXJhdGlvbigwKSxcbiAgICBdKSk7XG4gICAgbm90UHJlc3NlZFNldC5wbGF5VG9nZXRoZXIoamF2YS51dGlsLkFycmF5cy5hc0xpc3QoW1xuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcInRyYW5zbGF0aW9uWlwiLCBbel0pXG4gICAgICAgIC5zZXREdXJhdGlvbihidXR0b25EdXJhdGlvbiksXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwiZWxldmF0aW9uXCIsIFtlbGV2YXRpb25dKVxuICAgICAgICAuc2V0RHVyYXRpb24oMCksXG4gICAgXSkpO1xuICAgIGRlZmF1bHRTZXQucGxheVRvZ2V0aGVyKGphdmEudXRpbC5BcnJheXMuYXNMaXN0KFtcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJ0cmFuc2xhdGlvblpcIiwgWzBdKS5zZXREdXJhdGlvbigwKSxcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJlbGV2YXRpb25cIiwgWzBdKS5zZXREdXJhdGlvbigwKSxcbiAgICBdKSk7XG5cbiAgICBzbGEuYWRkU3RhdGUoXG4gICAgICBbZ2V0QW5kcm9pZFIoXCJhdHRyXCIsIFwic3RhdGVfcHJlc3NlZFwiKSwgZ2V0QW5kcm9pZFIoXCJhdHRyXCIsIFwic3RhdGVfZW5hYmxlZFwiKV0sXG4gICAgICBwcmVzc2VkU2V0LFxuICAgICk7XG4gICAgc2xhLmFkZFN0YXRlKFtnZXRBbmRyb2lkUihcImF0dHJcIiwgXCJzdGF0ZV9lbmFibGVkXCIpXSwgbm90UHJlc3NlZFNldCk7XG4gICAgc2xhLmFkZFN0YXRlKFtdLCBkZWZhdWx0U2V0KTtcbiAgICBuYXRpdmVWaWV3LnNldFN0YXRlTGlzdEFuaW1hdG9yKHNsYSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBhcHBseU9uSU9TKHRuc1ZpZXc6IGFueSwgZGF0YTogSU9TRGF0YSkge1xuICAgIGNvbnN0IG5hdGl2ZVZpZXcgPSB0bnNWaWV3LmlvcztcbiAgICBjb25zdCBlbGV2YXRpb24gPSBwYXJzZUZsb2F0KCgoZGF0YS5lbGV2YXRpb24gYXMgbnVtYmVyKSAtIDApLnRvRml4ZWQoMikpO1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIubWFza1RvQm91bmRzID0gZmFsc2U7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dDb2xvciA9IG5ldyBDb2xvcihkYXRhLnNoYWRvd0NvbG9yKS5pb3MuQ0dDb2xvcjtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd09mZnNldCA9XG4gICAgICBkYXRhLnNoYWRvd09mZnNldCA/XG4gICAgICAgIENHU2l6ZU1ha2UoMCwgcGFyc2VGbG9hdChTdHJpbmcoZGF0YS5zaGFkb3dPZmZzZXQpKSkgOlxuICAgICAgICBDR1NpemVNYWtlKDAsIDAuNTQgKiBlbGV2YXRpb24gLSAwLjE0KTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd09wYWNpdHkgPVxuICAgICAgZGF0YS5zaGFkb3dPcGFjaXR5ID9cbiAgICAgICAgcGFyc2VGbG9hdChTdHJpbmcoZGF0YS5zaGFkb3dPcGFjaXR5KSkgOlxuICAgICAgICAwLjAwNiAqIGVsZXZhdGlvbiArIDAuMjU7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dSYWRpdXMgPVxuICAgICAgZGF0YS5zaGFkb3dSYWRpdXMgP1xuICAgICAgICBwYXJzZUZsb2F0KFN0cmluZyhkYXRhLnNoYWRvd1JhZGl1cykpIDpcbiAgICAgICAgMC42NiAqIGVsZXZhdGlvbiAtIDAuNTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnNob3VsZFJhc3Rlcml6ZSA9IGRhdGEucmFzdGVyaXplO1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIucmFzdGVyaXphdGlvblNjYWxlID0gc2NyZWVuLm1haW5TY3JlZW4uc2NhbGU7XG4gICAgbGV0IHNoYWRvd1BhdGggPSBudWxsO1xuICAgIGlmIChkYXRhLnVzZVNoYWRvd1BhdGgpIHtcbiAgICAgIHNoYWRvd1BhdGggPSBVSUJlemllclBhdGguYmV6aWVyUGF0aFdpdGhSb3VuZGVkUmVjdENvcm5lclJhZGl1cyhuYXRpdmVWaWV3LmJvdW5kcywgbmF0aXZlVmlldy5sYXllci5zaGFkb3dSYWRpdXMpLmNnUGF0aDtcbiAgICB9XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dQYXRoID0gc2hhZG93UGF0aDtcbiAgfVxuXG4gIHN0YXRpYyBhbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3OiBhbnksIGRpcDogbnVtYmVyKSB7XG4gICAgY29uc3QgbWV0cmljcyA9IG5hdGl2ZVZpZXcuZ2V0Q29udGV4dCgpLmdldFJlc291cmNlcygpLmdldERpc3BsYXlNZXRyaWNzKCk7XG4gICAgcmV0dXJuIGFuZHJvaWQudXRpbC5UeXBlZFZhbHVlLmFwcGx5RGltZW5zaW9uKFxuICAgICAgYW5kcm9pZC51dGlsLlR5cGVkVmFsdWUuQ09NUExFWF9VTklUX0RJUCxcbiAgICAgIGRpcCxcbiAgICAgIG1ldHJpY3MsXG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgUmVuZGVyZXIyLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc0FuZHJvaWQsIGlzSU9TIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybSc7XG5cbmltcG9ydCB7IEFuZHJvaWREYXRhIH0gZnJvbSAnLi9jb21tb24vYW5kcm9pZC1kYXRhLm1vZGVsJztcbmltcG9ydCB7IElPU0RhdGEgfSBmcm9tICcuL2NvbW1vbi9pb3MtZGF0YS5tb2RlbCc7XG5pbXBvcnQgeyBTaGFkb3cgfSBmcm9tICcuL2NvbW1vbi9zaGFkb3cnO1xuaW1wb3J0IHsgU2hhcGUsIFNoYXBlRW51bSB9IGZyb20gJy4vY29tbW9uL3NoYXBlLmVudW0nO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvcGFnZS9wYWdlJztcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9sYXlvdXRzL3N0YWNrLWxheW91dCc7XG5pbXBvcnQgeyBhZGRXZWFrRXZlbnRMaXN0ZW5lciwgcmVtb3ZlV2Vha0V2ZW50TGlzdGVuZXIgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9jb3JlL3dlYWstZXZlbnQtbGlzdGVuZXJcIjtcbmRlY2xhcmUgY29uc3QgYW5kcm9pZDogYW55O1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbc2hhZG93XScgfSlcbmV4cG9ydCBjbGFzcyBOYXRpdmVTaGFkb3dEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgc2hhZG93OiBzdHJpbmcgfCBBbmRyb2lkRGF0YSB8IElPU0RhdGE7XG4gIEBJbnB1dCgpIGVsZXZhdGlvbj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgcHJlc3NlZEVsZXZhdGlvbj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgc2hhcGU/OiBTaGFwZTtcbiAgQElucHV0KCkgYmdjb2xvcj86IHN0cmluZztcbiAgQElucHV0KCkgY29ybmVyUmFkaXVzPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSB0cmFuc2xhdGlvblo/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHByZXNzZWRUcmFuc2xhdGlvblo/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIGZvcmNlUHJlc3NBbmltYXRpb24/OiBib29sZWFuO1xuICBASW5wdXQoKSBtYXNrVG9Cb3VuZHM/OiBib29sZWFuO1xuICBASW5wdXQoKSBzaGFkb3dDb2xvcj86IHN0cmluZztcbiAgQElucHV0KCkgc2hhZG93T2Zmc2V0PzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dPcGFjaXR5PzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dSYWRpdXM/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHVzZVNoYWRvd1BhdGg/OiBib29sZWFuO1xuICBASW5wdXQoKSByYXN0ZXJpemU/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgbG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBvcmlnaW5hbE5TRm46IGFueTtcbiAgcHJpdmF0ZSBwcmV2aW91c05TRm46IGFueTtcbiAgcHJpdmF0ZSBpb3NTaGFkb3dSYXBwZXI6IFZpZXc7XG4gIHByaXZhdGUgZXZlbnRzQm91bmQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcjogUmVuZGVyZXIyKSB7XG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgdGhpcy5vcmlnaW5hbE5TRm4gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuX3JlZHJhd05hdGl2ZUJhY2tncm91bmQ7IC8vYWx3YXlzIHN0b3JlIHRoZSBvcmlnaW5hbCBtZXRob2RcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHsgLy8gUmFkTGlzdFZpZXcgY2FsbHMgdGhpcyBtdWx0aXBsZSB0aW1lcyBmb3IgdGhlIHNhbWUgdmlld1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB0aGlzLmluaXRpYWxpemVDb21tb25EYXRhKCk7XG4gICAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUFuZHJvaWREYXRhKCk7XG4gICAgICB9IGVsc2UgaWYgKGlzSU9TKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlPU0RhdGEoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNoYWRvdyAmJiAodGhpcy5zaGFkb3cgYXMgQW5kcm9pZERhdGEgfCBJT1NEYXRhKS5lbGV2YXRpb24pIHtcbiAgICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21BbmRyb2lkRGF0YSh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSU9TRGF0YSh0aGlzLnNoYWRvdyBhcyBJT1NEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gTlMgTGlzdFZpZXdzIGNyZWF0ZSBlbGVtZW50cyBkeW5hbWljYWxseVxuICAvLyBsb2FkZWQgYW5kIHVubG9hZGVkIGFyZSBjYWxsZWQgYmVmb3JlIGFuZ3VsYXIgaXMgXCJyZWFkeVwiXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9OYXRpdmVTY3JpcHQvbmF0aXZlc2NyaXB0LWFuZ3VsYXIvaXNzdWVzLzEyMjEjaXNzdWVjb21tZW50LTQyMjgxMzExMVxuICAvLyBTbyB3ZSBlbnN1cmUgd2UncmUgcnVubmluZyBsb2FkZWQvdW5sb2FkZWQgZXZlbnRzIG91dHNpZGUgb2YgYW5ndWxhclxuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICghdGhpcy5ldmVudHNCb3VuZCkge1xuICAgICAgYWRkV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LmxvYWRlZEV2ZW50LCB0aGlzLm9uTG9hZGVkLCB0aGlzKTtcbiAgICAgIGFkZFdlYWtFdmVudExpc3RlbmVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgVmlldy51bmxvYWRlZEV2ZW50LCB0aGlzLm9uVW5sb2FkZWQsIHRoaXMpO1xuICAgICAgdGhpcy5ldmVudHNCb3VuZCA9IHRydWU7XG4gICAgICAvLyBpbiBzb21lIGNhc2VzLCB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGxvYWRlZCBieSB0aW1lIG9mIGJpbmRpbmdcbiAgICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaXNMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5vbkxvYWRlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVuYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5ldmVudHNCb3VuZCkge1xuICAgICAgcmVtb3ZlV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LmxvYWRlZEV2ZW50LCB0aGlzLm9uTG9hZGVkLCB0aGlzKTtcbiAgICAgIHJlbW92ZVdlYWtFdmVudExpc3RlbmVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgVmlldy51bmxvYWRlZEV2ZW50LCB0aGlzLm9uVW5sb2FkZWQsIHRoaXMpO1xuICAgICAgdGhpcy5ldmVudHNCb3VuZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9uTG9hZGVkKCkge1xuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAvLyBXZWlyZGx5IG5nT25Jbml0IGlzbid0IGNhbGxlZCBvbiBpT1Mgb24gZGVtbyBhcHBcbiAgICAvLyBNYW5hZ2VkIHRvIGdldCBpdCB3b3JraW5nIG9uIGlPUyB3aGVuIGFwcGx5aW5nIHRvXG4gICAgLy8gRmxleGJveExheW91dCwgYnV0IG9uIHRoZSBkZW1vIGFwcCwgd2UgYXBwbHkgdG8gYVxuICAgIC8vIExhYmVsLCBhbmQsIGZvciB0aGF0IGNhc2UsIG5nT25Jbml0IGlzbid0IGNhbGxlZFxuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGVuZm9yY2luZyB0aGUgRGlyZWN0aXZlIGlzIGluaXRpYWxpemVkXG4gICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcy5hcHBseVNoYWRvdygpXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLm5nT25Jbml0KCk7XG4gICAgfVxuICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICB0aGlzLnByZXZpb3VzTlNGbiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5fcmVkcmF3TmF0aXZlQmFja2dyb3VuZDsgLy8ganVzdCB0byBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggb3RoZXIgcGF0Y2hlc1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50Ll9yZWRyYXdOYXRpdmVCYWNrZ3JvdW5kID0gdGhpcy5tb25rZXlQYXRjaDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZElvc1dyYXBwZXIoKSB7XG4gICAgaWYgKGlzSU9TKSB7XG4gICAgICBjb25zdCBvcmlnaW5hbEVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgYXMgVmlldztcblxuICAgICAgdGhpcy5pb3NTaGFkb3dSYXBwZXIgPSB0aGlzLnJlbmRlci5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnU3RhY2tMYXlvdXQnXG4gICAgICApIGFzIFN0YWNrTGF5b3V0O1xuXG4gICAgICAvLyB3cmFwcGluZ0VsZW1lbnQuY3NzQ2xhc3NlcyA9IG1haW5FbGVtZW50LmNzc0NsYXNzZXM7XG4gICAgICBjb25zdCBwYXJlbnQgPSBvcmlnaW5hbEVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIHRoaXMucmVuZGVyLmluc2VydEJlZm9yZShwYXJlbnQsIHRoaXMuaW9zU2hhZG93UmFwcGVyLCBvcmlnaW5hbEVsZW1lbnQpO1xuICAgICAgdGhpcy5yZW5kZXIucmVtb3ZlQ2hpbGQocGFyZW50LCBvcmlnaW5hbEVsZW1lbnQpO1xuICAgICAgdGhpcy5yZW5kZXIuYXBwZW5kQ2hpbGQodGhpcy5pb3NTaGFkb3dSYXBwZXIsIG9yaWdpbmFsRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgb25VbmxvYWRlZCgpIHtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50Ll9yZWRyYXdOYXRpdmVCYWNrZ3JvdW5kID0gdGhpcy5vcmlnaW5hbE5TRm47IC8vIGFsd2F5cyByZXZlcnQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIH1cbiAgfVxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5hZGRJb3NXcmFwcGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5sb2FkZWQgJiZcbiAgICAgICEhY2hhbmdlcyAmJlxuICAgICAgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvdycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2VsZXZhdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3ByZXNzZWRFbGV2YXRpb24nKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFwZScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2JnY29sb3InKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdjb3JuZXJSYWRpdXMnKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdwcmVzc2VkVHJhbnNsYXRpb25aJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9yY2VQcmVzc0FuaW1hdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RyYW5zbGF0aW9uWicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ21hc2tUb0JvdW5kcycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvd0NvbG9yJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93T2Zmc2V0JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93T3BhY2l0eScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvd1JhZGl1cycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3Jhc3Rlcml6ZScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3VzZVNoYWRvd01hcCcpKVxuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFkb3cnKSAmJlxuICAgICAgICAhY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZWxldmF0aW9uJykgJiZcbiAgICAgICAgdHlwZW9mIGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZSA9PT0gJ251bWJlcidcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVsZXZhdGlvbiA9IGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzLnNoYWRvdyAmJiBjaGFuZ2VzLnNoYWRvdy5jdXJyZW50VmFsdWUuZWxldmF0aW9uKSB7XG4gICAgICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tQW5kcm9pZERhdGEodGhpcy5zaGFkb3cgYXMgQW5kcm9pZERhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSU9TKSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUlPU0RhdGEodGhpcy5zaGFkb3cgYXMgSU9TRGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1vbmtleVBhdGNoID0gdmFsID0+IHtcbiAgICB0aGlzLnByZXZpb3VzTlNGbi5jYWxsKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdmFsKTtcbiAgICB0aGlzLmFwcGx5U2hhZG93KCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhcHBseVNoYWRvdygpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNoYWRvdyA9PT0gbnVsbCB8fFxuICAgICAgdGhpcy5zaGFkb3cgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgKHRoaXMuc2hhZG93ID09PSAnJyAmJiAhdGhpcy5lbGV2YXRpb24pXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRm9yIHNoYWRvd3MgdG8gYmUgc2hvd24gb24gQW5kcm9pZCB0aGUgU0RLIGhhcyB0byBiZSBncmVhdGVyXG4gICAgLy8gb3IgZXF1YWwgdGhhbiAyMSwgbG93ZXIgU0RLIG1lYW5zIG5vIHNldEVsZXZhdGlvbiBtZXRob2QgaXMgYXZhaWxhYmxlXG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgaWYgKGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UIDwgMjEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHZpZXdUb0FwcGx5U2hhZG93VG8gPSBpc0lPU1xuICAgICAgPyB0aGlzLmlvc1NoYWRvd1JhcHBlclxuICAgICAgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAodmlld1RvQXBwbHlTaGFkb3dUbykge1xuICAgICAgU2hhZG93LmFwcGx5KHZpZXdUb0FwcGx5U2hhZG93VG8sIHtcbiAgICAgICAgZWxldmF0aW9uOiB0aGlzLmVsZXZhdGlvbiBhcyBudW1iZXIsXG4gICAgICAgIHByZXNzZWRFbGV2YXRpb246IHRoaXMucHJlc3NlZEVsZXZhdGlvbiBhcyBudW1iZXIsXG4gICAgICAgIHNoYXBlOiB0aGlzLnNoYXBlLFxuICAgICAgICBiZ2NvbG9yOiB0aGlzLmJnY29sb3IsXG4gICAgICAgIGNvcm5lclJhZGl1czogdGhpcy5jb3JuZXJSYWRpdXMsXG4gICAgICAgIHRyYW5zbGF0aW9uWjogdGhpcy50cmFuc2xhdGlvblosXG4gICAgICAgIHByZXNzZWRUcmFuc2xhdGlvblo6IHRoaXMucHJlc3NlZFRyYW5zbGF0aW9uWixcbiAgICAgICAgZm9yY2VQcmVzc0FuaW1hdGlvbjogdGhpcy5mb3JjZVByZXNzQW5pbWF0aW9uLFxuICAgICAgICBtYXNrVG9Cb3VuZHM6IHRoaXMubWFza1RvQm91bmRzLFxuICAgICAgICBzaGFkb3dDb2xvcjogdGhpcy5zaGFkb3dDb2xvcixcbiAgICAgICAgc2hhZG93T2Zmc2V0OiB0aGlzLnNoYWRvd09mZnNldCBhcyBudW1iZXIsXG4gICAgICAgIHNoYWRvd09wYWNpdHk6IHRoaXMuc2hhZG93T3BhY2l0eSBhcyBudW1iZXIsXG4gICAgICAgIHNoYWRvd1JhZGl1czogdGhpcy5zaGFkb3dSYWRpdXMgYXMgbnVtYmVyLFxuICAgICAgICByYXN0ZXJpemU6IHRoaXMucmFzdGVyaXplLFxuICAgICAgICB1c2VTaGFkb3dQYXRoOiB0aGlzLnVzZVNoYWRvd1BhdGhcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUNvbW1vbkRhdGEoKSB7XG4gICAgY29uc3QgdFNoYWRvdyA9IHR5cGVvZiB0aGlzLnNoYWRvdztcbiAgICBpZiAoKHRTaGFkb3cgPT09ICdzdHJpbmcnIHx8IHRTaGFkb3cgPT09ICdudW1iZXInKSAmJiAhdGhpcy5lbGV2YXRpb24pIHtcbiAgICAgIHRoaXMuZWxldmF0aW9uID0gdGhpcy5zaGFkb3cgPyBwYXJzZUludCh0aGlzLnNoYWRvdyBhcyBzdHJpbmcsIDEwKSA6IDI7XG4gICAgfVxuICAgIGNvbnN0IHRFbGV2YXRpb24gPSB0eXBlb2YgdGhpcy5lbGV2YXRpb247XG4gICAgaWYgKHRFbGV2YXRpb24gPT09ICdzdHJpbmcnIHx8IHRFbGV2YXRpb24gPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLmVsZXZhdGlvbiA9IHRoaXMuZWxldmF0aW9uXG4gICAgICAgID8gcGFyc2VJbnQodGhpcy5lbGV2YXRpb24gYXMgc3RyaW5nLCAxMClcbiAgICAgICAgOiAyO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUFuZHJvaWREYXRhKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jb3JuZXJSYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmNvcm5lclJhZGl1cyA9IHBhcnNlSW50KHRoaXMuY29ybmVyUmFkaXVzLCAxMCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy50cmFuc2xhdGlvblogPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0aW9uWiA9IHBhcnNlSW50KHRoaXMudHJhbnNsYXRpb25aLCAxMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplSU9TRGF0YSgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2hhZG93T2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zaGFkb3dPZmZzZXQgPSBwYXJzZUZsb2F0KHRoaXMuc2hhZG93T2Zmc2V0KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNoYWRvd09wYWNpdHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd09wYWNpdHkgPSBwYXJzZUZsb2F0KHRoaXMuc2hhZG93T3BhY2l0eSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5zaGFkb3dSYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd1JhZGl1cyA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dSYWRpdXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZEZyb21BbmRyb2lkRGF0YShkYXRhOiBBbmRyb2lkRGF0YSkge1xuICAgIHRoaXMuZWxldmF0aW9uID0gZGF0YS5lbGV2YXRpb24gfHwgdGhpcy5lbGV2YXRpb247XG4gICAgdGhpcy5zaGFwZSA9IGRhdGEuc2hhcGUgfHwgdGhpcy5zaGFwZTtcbiAgICB0aGlzLmJnY29sb3IgPSBkYXRhLmJnY29sb3IgfHwgdGhpcy5iZ2NvbG9yO1xuICAgIHRoaXMuY29ybmVyUmFkaXVzID0gZGF0YS5jb3JuZXJSYWRpdXMgfHwgdGhpcy5jb3JuZXJSYWRpdXM7XG4gICAgdGhpcy50cmFuc2xhdGlvblogPSBkYXRhLnRyYW5zbGF0aW9uWiB8fCB0aGlzLnRyYW5zbGF0aW9uWjtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZEZyb21JT1NEYXRhKGRhdGE6IElPU0RhdGEpIHtcbiAgICB0aGlzLm1hc2tUb0JvdW5kcyA9IGRhdGEubWFza1RvQm91bmRzIHx8IHRoaXMubWFza1RvQm91bmRzO1xuICAgIHRoaXMuc2hhZG93Q29sb3IgPSBkYXRhLnNoYWRvd0NvbG9yIHx8IHRoaXMuc2hhZG93Q29sb3I7XG4gICAgdGhpcy5zaGFkb3dPZmZzZXQgPSBkYXRhLnNoYWRvd09mZnNldCB8fCB0aGlzLnNoYWRvd09mZnNldDtcbiAgICB0aGlzLnNoYWRvd09wYWNpdHkgPSBkYXRhLnNoYWRvd09wYWNpdHkgfHwgdGhpcy5zaGFkb3dPcGFjaXR5O1xuICAgIHRoaXMuc2hhZG93UmFkaXVzID0gZGF0YS5zaGFkb3dSYWRpdXMgfHwgdGhpcy5zaGFkb3dSYWRpdXM7XG4gICAgdGhpcy5yYXN0ZXJpemUgPSBkYXRhLnJhc3Rlcml6ZSB8fCB0aGlzLnJhc3Rlcml6ZTtcbiAgICB0aGlzLnVzZVNoYWRvd1BhdGggPSBkYXRhLnVzZVNoYWRvd1BhdGggfHwgdGhpcy51c2VTaGFkb3dQYXRoO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOYXRpdmVTaGFkb3dEaXJlY3RpdmUgfSBmcm9tICcuL25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93L25nLXNoYWRvdy5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmF0aXZlU2hhZG93RGlyZWN0aXZlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTmF0aXZlU2hhZG93RGlyZWN0aXZlLFxuICBdLFxuICBwcm92aWRlcnM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ1NoYWRvd01vZHVsZSB7IH1cbiIsImltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi9zaGFwZS5lbnVtJztcblxuZXhwb3J0IGNsYXNzIEFuZHJvaWREYXRhIHtcbiAgZWxldmF0aW9uOiBudW1iZXI7XG4gIHByZXNzZWRFbGV2YXRpb24/OiBudW1iZXI7XG4gIHNoYXBlPzogU2hhcGU7XG4gIGJnY29sb3I/OiBzdHJpbmc7XG4gIGNvcm5lclJhZGl1cz86IG51bWJlcjtcbiAgdHJhbnNsYXRpb25aPzogbnVtYmVyO1xuICBwcmVzc2VkVHJhbnNsYXRpb25aPzogbnVtYmVyO1xuICBmb3JjZVByZXNzQW5pbWF0aW9uPzogYm9vbGVhbjtcbn1cbiIsImV4cG9ydCBlbnVtIEVsZXZhdGlvbiB7XG4gIFNXSVRDSCA9IDEsXG4gIENBUkRfUkVTVElORyA9IDIsXG4gIFJBSVNFRF9CVVRUT05fUkVTVElORyA9IDIsXG4gIFNFQVJDSF9CQVJfUkVTVElORyA9IDIsXG4gIFJFRlJFU0hfSU5ESUNBRE9SID0gMyxcbiAgU0VBUkNIX0JBUl9TQ1JPTExFRCA9IDMsXG4gIEFQUEJBUiA9IDQsXG4gIEZBQl9SRVNUSU5HID0gNixcbiAgU05BQ0tCQVIgPSA2LFxuICBCT1RUT01fTkFWSUdBVElPTl9CQVIgPSA4LFxuICBNRU5VID0gOCxcbiAgQ0FSRF9QSUNLRURfVVAgPSA4LFxuICBSQUlTRURfQlVUVE9OX1BSRVNTRUQgPSA4LFxuICBTVUJNRU5VX0xFVkVMMSA9IDksXG4gIFNVQk1FTlVfTEVWRUwyID0gMTAsXG4gIFNVQk1FTlVfTEVWRUwzID0gMTEsXG4gIFNVQk1FTlVfTEVWRUw0ID0gMTIsXG4gIFNVQk1FTlVfTEVWRUw1ID0gMTMsXG4gIEZBQl9QUkVTU0VEID0gMTIsXG4gIE5BVl9EUkFXRVIgPSAxNixcbiAgUklHSFRfRFJBV0VSID0gMTYsXG4gIE1PREFMX0JPVFRPTV9TSEVFVCA9IDE2LFxuICBESUFMT0cgPSAyNCxcbiAgUElDS0VSID0gMjQsXG59XG4iLCJleHBvcnQgY2xhc3MgSU9TRGF0YSB7XG4gIGVsZXZhdGlvbjogbnVtYmVyO1xuICBtYXNrVG9Cb3VuZHM/OiBib29sZWFuO1xuICBzaGFkb3dDb2xvcj86IHN0cmluZztcbiAgc2hhZG93T2Zmc2V0PzogbnVtYmVyO1xuICBzaGFkb3dPcGFjaXR5PzogbnVtYmVyO1xuICBzaGFkb3dSYWRpdXM/OiBudW1iZXI7XG4gIHJhc3Rlcml6ZT86IGJvb2xlYW47XG4gIHVzZVNoYWRvd1BhdGg/OiBib29sZWFuO1xufVxuIl0sIm5hbWVzIjpbImlzQW5kcm9pZCIsIkxlbmd0aCIsIkNvbG9yIiwic2NyZWVuIiwiaXNJT1MiLCJhZGRXZWFrRXZlbnRMaXN0ZW5lciIsIlZpZXciLCJyZW1vdmVXZWFrRXZlbnRMaXN0ZW5lciIsIkRpcmVjdGl2ZSIsIkVsZW1lbnRSZWYiLCJSZW5kZXJlcjIiLCJJbnB1dCIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7UUFFRSxXQUFZLFdBQVc7UUFDdkIsTUFBTyxNQUFNO1FBQ2IsTUFBTyxNQUFNO1FBQ2IsTUFBTyxNQUFNOzs7Ozs7O0FDTGY7SUFlQSxJQUFJLGFBQWEsQ0FBQzs7SUFDbEIsSUFBSSxXQUFXLENBQUM7SUFFaEIsSUFBSUEsa0JBQVMsRUFBRTtRQUNiLGFBQWEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDckU7O0lBRUQsSUFBTSxVQUFVLEdBQTJFLEVBQUUsQ0FBQzs7Ozs7O0lBRTlGLHFCQUFxQixLQUFhLEVBQUUsS0FBYTs7UUFDL0MsSUFBTSxTQUFTLEdBQUcsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN6QyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUc7Z0JBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUN6QyxVQUFVLEVBQUUsRUFBRTthQUNmLENBQUM7U0FDSDtRQUNELElBQUcsQ0FBQyxVQUFVLENB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