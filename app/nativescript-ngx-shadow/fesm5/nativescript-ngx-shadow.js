import { Color } from 'tns-core-modules/color';
import { Length, View } from 'tns-core-modules/ui/page/page';
import { isAndroid, screen, isIOS } from 'tns-core-modules/platform';
import { Directive, ElementRef, Input, Renderer2, NgModule } from '@angular/core';
import { addWeakEventListener, removeWeakEventListener } from 'tns-core-modules/ui/core/weak-event-listener';

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
if (isAndroid) {
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
var Shadow = /** @class */ (function () {
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
            shape: (/** @type {?} */ (data)).shape || Shadow.DEFAULT_SHAPE,
            pressedElevation: (/** @type {?} */ (data)).pressedElevation || Shadow.DEFAULT_PRESSED_ELEVATION,
            pressedTranslationZ: (/** @type {?} */ (data)).pressedTranslationZ || Shadow.DEFAULT_PRESSED_ELEVATION,
            shadowColor: (/** @type {?} */ (data)).shadowColor ||
                Shadow.DEFAULT_SHADOW_COLOR,
            useShadowPath: ((/** @type {?} */ (data)).useShadowPath !== undefined ? (/** @type {?} */ (data)).useShadowPath : true),
            rasterize: ((/** @type {?} */ (data)).rasterize !== undefined ? (/** @type {?} */ (data)).rasterize : false)
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
                outerRadii[0] = outerRadii[1] = Length.toDevicePixels(tnsView.borderTopLeftRadius, 0);
                outerRadii[2] = outerRadii[3] = Length.toDevicePixels(tnsView.borderTopRightRadius, 0);
                outerRadii[4] = outerRadii[5] = Length.toDevicePixels(tnsView.borderBottomRightRadius, 0);
                outerRadii[6] = outerRadii[7] = Length.toDevicePixels(tnsView.borderBottomLeftRadius, 0);
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
        var elevation = parseFloat(((/** @type {?} */ (data.elevation)) - 0).toFixed(2));
        nativeView.layer.maskToBounds = false;
        nativeView.layer.shadowColor = new Color(data.shadowColor).ios.CGColor;
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
        nativeView.layer.rasterizationScale = screen.mainScreen.scale;
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
var NativeShadowDirective = /** @class */ (function () {
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
        if (isAndroid) {
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
            if (isAndroid) {
                this.initializeAndroidData();
            }
            else if (isIOS) {
                this.initializeIOSData();
            }
            if (this.shadow && (/** @type {?} */ (this.shadow)).elevation) {
                if (isAndroid) {
                    this.loadFromAndroidData(/** @type {?} */ (this.shadow));
                }
                else if (isIOS) {
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
            addWeakEventListener(this.el.nativeElement, View.loadedEvent, this.onLoaded, this);
            addWeakEventListener(this.el.nativeElement, View.unloadedEvent, this.onUnloaded, this);
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
            removeWeakEventListener(this.el.nativeElement, View.loadedEvent, this.onLoaded, this);
            removeWeakEventListener(this.el.nativeElement, View.unloadedEvent, this.onUnloaded, this);
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
        if (isAndroid) {
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
        if (isIOS) {
            /** @type {?} */
            var originalElement = /** @type {?} */ (this.el.nativeElement);
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
        if (isAndroid) {
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
                if (isAndroid) {
                    this.loadFromAndroidData(/** @type {?} */ (this.shadow));
                }
                else if (isIOS) {
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
        if (isAndroid) {
            if (android.os.Build.VERSION.SDK_INT < 21) {
                return;
            }
        }
        /** @type {?} */
        var viewToApplyShadowTo = isIOS
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
        { type: Directive, args: [{ selector: '[shadow]' },] },
    ];
    /** @nocollapse */
    NativeShadowDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    NativeShadowDirective.propDecorators = {
        shadow: [{ type: Input }],
        elevation: [{ type: Input }],
        pressedElevation: [{ type: Input }],
        shape: [{ type: Input }],
        bgcolor: [{ type: Input }],
        cornerRadius: [{ type: Input }],
        translationZ: [{ type: Input }],
        pressedTranslationZ: [{ type: Input }],
        forcePressAnimation: [{ type: Input }],
        maskToBounds: [{ type: Input }],
        shadowColor: [{ type: Input }],
        shadowOffset: [{ type: Input }],
        shadowOpacity: [{ type: Input }],
        shadowRadius: [{ type: Input }],
        useShadowPath: [{ type: Input }],
        rasterize: [{ type: Input }]
    };
    return NativeShadowDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgShadowModule = /** @class */ (function () {
    function NgShadowModule() {
    }
    NgShadowModule.decorators = [
        { type: NgModule, args: [{
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
var AndroidData = /** @class */ (function () {
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
var IOSData = /** @class */ (function () {
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

export { NgShadowModule, AndroidData, Elevation, IOSData, Shadow, ShapeEnum, NativeShadowDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlc2NyaXB0LW5neC1zaGFkb3cuanMubWFwIiwic291cmNlcyI6WyJuZzovL25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93L25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93L2NvbW1vbi9zaGFwZS5lbnVtLnRzIiwibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9jb21tb24vc2hhZG93LnRzIiwibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uZy1zaGFkb3cuZGlyZWN0aXZlLnRzIiwibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9saWIubW9kdWxlLnRzIiwibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9jb21tb24vYW5kcm9pZC1kYXRhLm1vZGVsLnRzIiwibmc6Ly9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9uYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9jb21tb24vZWxldmF0aW9uLmVudW0udHMiLCJuZzovL25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93L25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93L2NvbW1vbi9pb3MtZGF0YS5tb2RlbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBlbnVtIFNoYXBlRW51bSB7XG4gIFJFQ1RBTkdMRSA9ICdSRUNUQU5HTEUnLFxuICBPVkFMID0gJ09WQUwnLFxuICBSSU5HID0gJ1JJTkcnLFxuICBMSU5FID0gJ0xJTkUnLFxufVxuXG5leHBvcnQgdHlwZSBTaGFwZSA9ICdSRUNUQU5HTEUnIHwgJ09WQUwnIHwgJ1JJTkcnIHwgJ0xJTkUnO1xuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL2NvbG9yJztcblxuaW1wb3J0IHsgQW5kcm9pZERhdGEgfSBmcm9tIFwiLi9hbmRyb2lkLWRhdGEubW9kZWxcIjtcbmltcG9ydCB7IElPU0RhdGEgfSBmcm9tIFwiLi9pb3MtZGF0YS5tb2RlbFwiO1xuaW1wb3J0IHsgU2hhcGVFbnVtIH0gZnJvbSAnLi9zaGFwZS5lbnVtJztcbmltcG9ydCB7IExlbmd0aCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvcGFnZS9wYWdlJztcbmltcG9ydCB7IGlzQW5kcm9pZCwgc2NyZWVuIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcblxuZGVjbGFyZSBjb25zdCBhbmRyb2lkOiBhbnk7XG5kZWNsYXJlIGNvbnN0IGphdmE6IGFueTtcbmRlY2xhcmUgY29uc3QgQ0dTaXplTWFrZTogYW55O1xuZGVjbGFyZSBjb25zdCBVSVNjcmVlbjogYW55O1xuZGVjbGFyZSBjb25zdCBBcnJheTogYW55O1xuZGVjbGFyZSBjb25zdCBVSUJlemllclBhdGg6IGFueTtcblxubGV0IExheWVyZWRTaGFkb3c7XG5sZXQgUGxhaW5TaGFkb3c7XG5cbmlmIChpc0FuZHJvaWQpIHtcbiAgTGF5ZXJlZFNoYWRvdyA9IGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuTGF5ZXJEcmF3YWJsZS5leHRlbmQoe30pO1xuICBQbGFpblNoYWRvdyA9IGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuR3JhZGllbnREcmF3YWJsZS5leHRlbmQoe30pO1xufVxuXG5jb25zdCBjbGFzc0NhY2hlOiB7IFtpZDogc3RyaW5nXTogeyBjbGFzczogYW55LCBmaWVsZENhY2hlOiB7IFtpZDogc3RyaW5nXTogbnVtYmVyIH0gfSB9ID0ge307XG4vLyBodHRwczovL2dpdGh1Yi5jb20vTmF0aXZlU2NyaXB0L2FuZHJvaWQtcnVudGltZS9pc3N1ZXMvMTMzMFxuZnVuY3Rpb24gZ2V0QW5kcm9pZFIocnR5cGU6IHN0cmluZywgZmllbGQ6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IFwiYW5kcm9pZC5SJFwiICsgcnR5cGU7XG4gIGlmICghY2xhc3NDYWNoZS5oYXNPd25Qcm9wZXJ0eShjbGFzc05hbWUpKSB7XG4gICAgY2xhc3NDYWNoZVtjbGFzc05hbWVdID0ge1xuICAgICAgY2xhc3M6IGphdmEubGFuZy5DbGFzcy5mb3JOYW1lKGNsYXNzTmFtZSksXG4gICAgICBmaWVsZENhY2hlOiB7fVxuICAgIH07XG4gIH1cbiAgaWYoIWNsYXNzQ2FjaGVbY2xhc3NOYW1lXS5maWVsZENhY2hlLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgIGNsYXNzQ2FjaGVbY2xhc3NOYW1lXS5maWVsZENhY2hlW2ZpZWxkXSA9ICtjbGFzc0NhY2hlW2NsYXNzTmFtZV0uY2xhc3MuZ2V0RmllbGQoZmllbGQpLmdldChudWxsKTtcbiAgfVxuICByZXR1cm4gY2xhc3NDYWNoZVtjbGFzc05hbWVdLmZpZWxkQ2FjaGVbZmllbGRdO1xufVxuXG5leHBvcnQgY2xhc3MgU2hhZG93IHtcbiAgc3RhdGljIERFRkFVTFRfU0hBUEUgPSBTaGFwZUVudW0uUkVDVEFOR0xFO1xuICBzdGF0aWMgREVGQVVMVF9CR0NPTE9SID0gJyNGRkZGRkYnO1xuICBzdGF0aWMgREVGQVVMVF9TSEFET1dfQ09MT1IgPSAnIzAwMDAwMCc7XG4gIHN0YXRpYyBERUZBVUxUX1BSRVNTRURfRUxFVkFUSU9OID0gMjtcbiAgc3RhdGljIERFRkFVTFRfUFJFU1NFRF9aID0gNDtcblxuICBzdGF0aWMgYXBwbHkodG5zVmlldzogYW55LCBkYXRhOiBJT1NEYXRhIHwgQW5kcm9pZERhdGEpIHtcbiAgICBjb25zdCBMT0xMSVBPUCA9IDIxO1xuICAgIGlmIChcbiAgICAgIHRuc1ZpZXcuYW5kcm9pZCAmJlxuICAgICAgYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPj0gTE9MTElQT1BcbiAgICApIHtcbiAgICAgIFNoYWRvdy5hcHBseU9uQW5kcm9pZCh0bnNWaWV3LCBTaGFkb3cuZ2V0RGVmYXVsdHMoZGF0YSkpO1xuICAgIH0gZWxzZSBpZiAodG5zVmlldy5pb3MpIHtcbiAgICAgIFNoYWRvdy5hcHBseU9uSU9TKHRuc1ZpZXcsIFNoYWRvdy5nZXREZWZhdWx0cyhkYXRhKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0RGVmYXVsdHMoZGF0YTogSU9TRGF0YSB8IEFuZHJvaWREYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIGRhdGEsXG4gICAgICB7XG4gICAgICAgIHNoYXBlOiAoZGF0YSBhcyBBbmRyb2lkRGF0YSkuc2hhcGUgfHwgU2hhZG93LkRFRkFVTFRfU0hBUEUsXG4gICAgICAgIHByZXNzZWRFbGV2YXRpb246IChkYXRhIGFzIEFuZHJvaWREYXRhKS5wcmVzc2VkRWxldmF0aW9uIHx8IFNoYWRvdy5ERUZBVUxUX1BSRVNTRURfRUxFVkFUSU9OLFxuICAgICAgICBwcmVzc2VkVHJhbnNsYXRpb25aOiAoZGF0YSBhcyBBbmRyb2lkRGF0YSkucHJlc3NlZFRyYW5zbGF0aW9uWiB8fCBTaGFkb3cuREVGQVVMVF9QUkVTU0VEX0VMRVZBVElPTixcbiAgICAgICAgc2hhZG93Q29sb3I6IChkYXRhIGFzIElPU0RhdGEpLnNoYWRvd0NvbG9yIHx8XG4gICAgICAgICAgU2hhZG93LkRFRkFVTFRfU0hBRE9XX0NPTE9SLFxuICAgICAgICB1c2VTaGFkb3dQYXRoOiAoKGRhdGEgYXMgSU9TRGF0YSkudXNlU2hhZG93UGF0aCAhPT0gdW5kZWZpbmVkID8gKGRhdGEgYXMgSU9TRGF0YSkudXNlU2hhZG93UGF0aCA6IHRydWUpLFxuICAgICAgICByYXN0ZXJpemU6ICgoZGF0YSBhcyBJT1NEYXRhKS5yYXN0ZXJpemUgIT09IHVuZGVmaW5lZCA/IChkYXRhIGFzIElPU0RhdGEpLnJhc3Rlcml6ZSA6IGZhbHNlKVxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaXNTaGFkb3coZHJhd2FibGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoZHJhd2FibGUgaW5zdGFuY2VvZiBMYXllcmVkU2hhZG93IHx8IGRyYXdhYmxlIGluc3RhbmNlb2YgUGxhaW5TaGFkb3cpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgYXBwbHlPbkFuZHJvaWQodG5zVmlldzogYW55LCBkYXRhOiBBbmRyb2lkRGF0YSkge1xuICAgIGNvbnN0IG5hdGl2ZVZpZXcgPSB0bnNWaWV3LmFuZHJvaWQ7XG4gICAgbGV0IHNoYXBlO1xuICAgIGxldCBvdmVycmlkZUJhY2tncm91bmQgPSB0cnVlO1xuXG5cbiAgICBsZXQgY3VycmVudEJnID0gbmF0aXZlVmlldy5nZXRCYWNrZ3JvdW5kKCk7XG5cbiAgICBpZiAoY3VycmVudEJnIGluc3RhbmNlb2YgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5SaXBwbGVEcmF3YWJsZSkgeyAvLyBwbGF5IG5pY2UgaWYgYSByaXBwbGUgaXMgd3JhcHBpbmcgYSBzaGFkb3dcbiAgICAgIGxldCByaXBwbGVCZyA9IGN1cnJlbnRCZy5nZXREcmF3YWJsZSgwKTtcbiAgICAgIGlmIChyaXBwbGVCZyBpbnN0YW5jZW9mIGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuSW5zZXREcmF3YWJsZSkge1xuICAgICAgICBvdmVycmlkZUJhY2tncm91bmQgPSBmYWxzZTsgLy8gdGhpcyBpcyBhIGJ1dHRvbiB3aXRoIGl0J3Mgb3duIHNoYWRvd1xuICAgICAgfSBlbHNlIGlmIChTaGFkb3cuaXNTaGFkb3cocmlwcGxlQmcpKSB7IC8vIGlmIHRoZSByaXBwbGUgaXMgd3JhcHBpbmcgYSBzaGFkb3csIHN0cmlwIGl0XG4gICAgICAgIGN1cnJlbnRCZyA9IHJpcHBsZUJnO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3ZlcnJpZGVCYWNrZ3JvdW5kKSB7XG4gICAgICBpZiAoU2hhZG93LmlzU2hhZG93KGN1cnJlbnRCZykpIHsgLy8gbWFrZSBzdXJlIHRvIGhhdmUgdGhlIHJpZ2h0IGJhY2tncm91bmRcbiAgICAgICAgY3VycmVudEJnID0gY3VycmVudEJnIGluc3RhbmNlb2YgTGF5ZXJlZFNoYWRvdyA/IC8vIGlmIGxheWVyZWQsIGdldCB0aGUgb3JpZ2luYWwgYmFja2dyb3VuZFxuICAgICAgICAgIGN1cnJlbnRCZy5nZXREcmF3YWJsZSgxKSA6IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91dGVyUmFkaWkgPSBBcnJheS5jcmVhdGUoXCJmbG9hdFwiLCA4KTtcbiAgICAgIGlmIChkYXRhLmNvcm5lclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG91dGVyUmFkaWlbMF0gPSBvdXRlclJhZGlpWzFdID0gTGVuZ3RoLnRvRGV2aWNlUGl4ZWxzKHRuc1ZpZXcuYm9yZGVyVG9wTGVmdFJhZGl1cywgMCk7XG4gICAgICAgIG91dGVyUmFkaWlbMl0gPSBvdXRlclJhZGlpWzNdID0gTGVuZ3RoLnRvRGV2aWNlUGl4ZWxzKHRuc1ZpZXcuYm9yZGVyVG9wUmlnaHRSYWRpdXMsIDApO1xuICAgICAgICBvdXRlclJhZGlpWzRdID0gb3V0ZXJSYWRpaVs1XSA9IExlbmd0aC50b0RldmljZVBpeGVscyh0bnNWaWV3LmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLCAwKTtcbiAgICAgICAgb3V0ZXJSYWRpaVs2XSA9IG91dGVyUmFkaWlbN10gPSBMZW5ndGgudG9EZXZpY2VQaXhlbHModG5zVmlldy5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGphdmEudXRpbC5BcnJheXMuZmlsbChvdXRlclJhZGlpLCBTaGFkb3cuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5jb3JuZXJSYWRpdXMgYXMgbnVtYmVyKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHVzZSB0aGUgdXNlciBkZWZpbmVkIGNvbG9yIG9yIHRoZSBkZWZhdWx0IGluIGNhc2UgdGhlIGNvbG9yIGlzIFRSQU5TUEFSRU5UXG4gICAgICBjb25zdCBiZ0NvbG9yID0gY3VycmVudEJnID9cbiAgICAgICAgKGN1cnJlbnRCZyBpbnN0YW5jZW9mIGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuQ29sb3JEcmF3YWJsZSAmJiBjdXJyZW50QmcuZ2V0Q29sb3IoKSA/XG4gICAgICAgICAgY3VycmVudEJnLmdldENvbG9yKCkgOiBhbmRyb2lkLmdyYXBoaWNzLkNvbG9yLnBhcnNlQ29sb3IoZGF0YS5iZ2NvbG9yIHx8IFNoYWRvdy5ERUZBVUxUX0JHQ09MT1IpKSA6XG4gICAgICAgIGFuZHJvaWQuZ3JhcGhpY3MuQ29sb3IucGFyc2VDb2xvcihkYXRhLmJnY29sb3IgfHwgU2hhZG93LkRFRkFVTFRfQkdDT0xPUik7XG5cbiAgICAgIGxldCBuZXdCZztcblxuICAgICAgaWYgKGRhdGEuc2hhcGUgIT09IFNoYXBlRW51bS5SRUNUQU5HTEUgfHwgZGF0YS5iZ2NvbG9yIHx8ICFjdXJyZW50QmcpIHsgLy8gcmVwbGFjZSBiYWNrZ3JvdW5kXG4gICAgICAgIHNoYXBlID0gbmV3IFBsYWluU2hhZG93KCk7XG4gICAgICAgIHNoYXBlLnNldFNoYXBlKFxuICAgICAgICAgIGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuR3JhZGllbnREcmF3YWJsZVtkYXRhLnNoYXBlXSxcbiAgICAgICAgKTtcbiAgICAgICAgc2hhcGUuc2V0Q29ybmVyUmFkaWkob3V0ZXJSYWRpaSk7XG4gICAgICAgIHNoYXBlLnNldENvbG9yKGJnQ29sb3IpO1xuICAgICAgICBuZXdCZyA9IHNoYXBlO1xuICAgICAgfSBlbHNlIHsgLy8gYWRkIGEgbGF5ZXJcbiAgICAgICAgY29uc3QgciA9IG5ldyBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLnNoYXBlcy5Sb3VuZFJlY3RTaGFwZShvdXRlclJhZGlpLCBudWxsLCBudWxsKTtcbiAgICAgICAgc2hhcGUgPSBuZXcgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5TaGFwZURyYXdhYmxlKHIpO1xuICAgICAgICBzaGFwZS5nZXRQYWludCgpLnNldENvbG9yKGJnQ29sb3IpO1xuICAgICAgICB2YXIgYXJyID0gQXJyYXkuY3JlYXRlKGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuRHJhd2FibGUsIDIpO1xuICAgICAgICBhcnJbMF0gPSBzaGFwZTtcbiAgICAgICAgYXJyWzFdID0gY3VycmVudEJnO1xuICAgICAgICBjb25zdCBkcmF3YWJsZSA9IG5ldyBMYXllcmVkU2hhZG93KGFycik7XG4gICAgICAgIG5ld0JnID0gZHJhd2FibGU7XG4gICAgICB9XG5cbiAgICAgIG5hdGl2ZVZpZXcuc2V0QmFja2dyb3VuZERyYXdhYmxlKG5ld0JnKTtcbiAgICB9XG5cbiAgICBuYXRpdmVWaWV3LnNldEVsZXZhdGlvbihcbiAgICAgIFNoYWRvdy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLmVsZXZhdGlvbiBhcyBudW1iZXIpLFxuICAgICk7XG4gICAgbmF0aXZlVmlldy5zZXRUcmFuc2xhdGlvblooXG4gICAgICBTaGFkb3cuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS50cmFuc2xhdGlvblogYXMgbnVtYmVyKSxcbiAgICApO1xuICAgIGlmIChuYXRpdmVWaWV3LmdldFN0YXRlTGlzdEFuaW1hdG9yKCkgfHwgZGF0YS5mb3JjZVByZXNzQW5pbWF0aW9uKSB7XG4gICAgICB0aGlzLm92ZXJyaWRlRGVmYXVsdEFuaW1hdG9yKG5hdGl2ZVZpZXcsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIG92ZXJyaWRlRGVmYXVsdEFuaW1hdG9yKG5hdGl2ZVZpZXc6IGFueSwgZGF0YTogQW5kcm9pZERhdGEpIHtcbiAgICBjb25zdCBzbGEgPSBuZXcgYW5kcm9pZC5hbmltYXRpb24uU3RhdGVMaXN0QW5pbWF0b3IoKTtcblxuICAgIGNvbnN0IE9iamVjdEFuaW1hdG9yID0gYW5kcm9pZC5hbmltYXRpb24uT2JqZWN0QW5pbWF0b3I7XG4gICAgY29uc3QgQW5pbWF0b3JTZXQgPSBhbmRyb2lkLmFuaW1hdGlvbi5BbmltYXRvclNldDtcbiAgICBjb25zdCBzaG9ydEFuaW1UaW1lID0gZ2V0QW5kcm9pZFIoXCJpbnRlZ2VyXCIsIFwiY29uZmlnX3Nob3J0QW5pbVRpbWVcIik7XG5cbiAgICBjb25zdCBidXR0b25EdXJhdGlvbiA9XG4gICAgICBuYXRpdmVWaWV3LmdldENvbnRleHQoKS5nZXRSZXNvdXJjZXMoKS5nZXRJbnRlZ2VyKHNob3J0QW5pbVRpbWUpIC8gMjtcbiAgICBjb25zdCBwcmVzc2VkRWxldmF0aW9uID0gdGhpcy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLnByZXNzZWRFbGV2YXRpb24pO1xuICAgIGNvbnN0IHByZXNzZWRaID0gdGhpcy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLnByZXNzZWRUcmFuc2xhdGlvblopO1xuICAgIGNvbnN0IGVsZXZhdGlvbiA9IHRoaXMuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS5lbGV2YXRpb24pO1xuICAgIGNvbnN0IHogPSB0aGlzLmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEudHJhbnNsYXRpb25aIHx8IDApO1xuXG4gICAgY29uc3QgcHJlc3NlZFNldCA9IG5ldyBBbmltYXRvclNldCgpO1xuICAgIGNvbnN0IG5vdFByZXNzZWRTZXQgPSBuZXcgQW5pbWF0b3JTZXQoKTtcbiAgICBjb25zdCBkZWZhdWx0U2V0ID0gbmV3IEFuaW1hdG9yU2V0KCk7XG5cbiAgICBwcmVzc2VkU2V0LnBsYXlUb2dldGhlcihqYXZhLnV0aWwuQXJyYXlzLmFzTGlzdChbXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwidHJhbnNsYXRpb25aXCIsIFtwcmVzc2VkWl0pXG4gICAgICAgIC5zZXREdXJhdGlvbihidXR0b25EdXJhdGlvbiksXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwiZWxldmF0aW9uXCIsIFtwcmVzc2VkRWxldmF0aW9uXSlcbiAgICAgICAgLnNldER1cmF0aW9uKDApLFxuICAgIF0pKTtcbiAgICBub3RQcmVzc2VkU2V0LnBsYXlUb2dldGhlcihqYXZhLnV0aWwuQXJyYXlzLmFzTGlzdChbXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwidHJhbnNsYXRpb25aXCIsIFt6XSlcbiAgICAgICAgLnNldER1cmF0aW9uKGJ1dHRvbkR1cmF0aW9uKSxcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJlbGV2YXRpb25cIiwgW2VsZXZhdGlvbl0pXG4gICAgICAgIC5zZXREdXJhdGlvbigwKSxcbiAgICBdKSk7XG4gICAgZGVmYXVsdFNldC5wbGF5VG9nZXRoZXIoamF2YS51dGlsLkFycmF5cy5hc0xpc3QoW1xuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcInRyYW5zbGF0aW9uWlwiLCBbMF0pLnNldER1cmF0aW9uKDApLFxuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcImVsZXZhdGlvblwiLCBbMF0pLnNldER1cmF0aW9uKDApLFxuICAgIF0pKTtcblxuICAgIHNsYS5hZGRTdGF0ZShcbiAgICAgIFtnZXRBbmRyb2lkUihcImF0dHJcIiwgXCJzdGF0ZV9wcmVzc2VkXCIpLCBnZXRBbmRyb2lkUihcImF0dHJcIiwgXCJzdGF0ZV9lbmFibGVkXCIpXSxcbiAgICAgIHByZXNzZWRTZXQsXG4gICAgKTtcbiAgICBzbGEuYWRkU3RhdGUoW2dldEFuZHJvaWRSKFwiYXR0clwiLCBcInN0YXRlX2VuYWJsZWRcIildLCBub3RQcmVzc2VkU2V0KTtcbiAgICBzbGEuYWRkU3RhdGUoW10sIGRlZmF1bHRTZXQpO1xuICAgIG5hdGl2ZVZpZXcuc2V0U3RhdGVMaXN0QW5pbWF0b3Ioc2xhKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGFwcGx5T25JT1ModG5zVmlldzogYW55LCBkYXRhOiBJT1NEYXRhKSB7XG4gICAgY29uc3QgbmF0aXZlVmlldyA9IHRuc1ZpZXcuaW9zO1xuICAgIGNvbnN0IGVsZXZhdGlvbiA9IHBhcnNlRmxvYXQoKChkYXRhLmVsZXZhdGlvbiBhcyBudW1iZXIpIC0gMCkudG9GaXhlZCgyKSk7XG4gICAgbmF0aXZlVmlldy5sYXllci5tYXNrVG9Cb3VuZHMgPSBmYWxzZTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd0NvbG9yID0gbmV3IENvbG9yKGRhdGEuc2hhZG93Q29sb3IpLmlvcy5DR0NvbG9yO1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93T2Zmc2V0ID1cbiAgICAgIGRhdGEuc2hhZG93T2Zmc2V0ID9cbiAgICAgICAgQ0dTaXplTWFrZSgwLCBwYXJzZUZsb2F0KFN0cmluZyhkYXRhLnNoYWRvd09mZnNldCkpKSA6XG4gICAgICAgIENHU2l6ZU1ha2UoMCwgMC41NCAqIGVsZXZhdGlvbiAtIDAuMTQpO1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93T3BhY2l0eSA9XG4gICAgICBkYXRhLnNoYWRvd09wYWNpdHkgP1xuICAgICAgICBwYXJzZUZsb2F0KFN0cmluZyhkYXRhLnNoYWRvd09wYWNpdHkpKSA6XG4gICAgICAgIDAuMDA2ICogZWxldmF0aW9uICsgMC4yNTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd1JhZGl1cyA9XG4gICAgICBkYXRhLnNoYWRvd1JhZGl1cyA/XG4gICAgICAgIHBhcnNlRmxvYXQoU3RyaW5nKGRhdGEuc2hhZG93UmFkaXVzKSkgOlxuICAgICAgICAwLjY2ICogZWxldmF0aW9uIC0gMC41O1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hvdWxkUmFzdGVyaXplID0gZGF0YS5yYXN0ZXJpemU7XG4gICAgbmF0aXZlVmlldy5sYXllci5yYXN0ZXJpemF0aW9uU2NhbGUgPSBzY3JlZW4ubWFpblNjcmVlbi5zY2FsZTtcbiAgICBsZXQgc2hhZG93UGF0aCA9IG51bGw7XG4gICAgaWYgKGRhdGEudXNlU2hhZG93UGF0aCkge1xuICAgICAgc2hhZG93UGF0aCA9IFVJQmV6aWVyUGF0aC5iZXppZXJQYXRoV2l0aFJvdW5kZWRSZWN0Q29ybmVyUmFkaXVzKG5hdGl2ZVZpZXcuYm91bmRzLCBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd1JhZGl1cykuY2dQYXRoO1xuICAgIH1cbiAgICBuYXRpdmVWaWV3LmxheWVyLnNoYWRvd1BhdGggPSBzaGFkb3dQYXRoO1xuICB9XG5cbiAgc3RhdGljIGFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXc6IGFueSwgZGlwOiBudW1iZXIpIHtcbiAgICBjb25zdCBtZXRyaWNzID0gbmF0aXZlVmlldy5nZXRDb250ZXh0KCkuZ2V0UmVzb3VyY2VzKCkuZ2V0RGlzcGxheU1ldHJpY3MoKTtcbiAgICByZXR1cm4gYW5kcm9pZC51dGlsLlR5cGVkVmFsdWUuYXBwbHlEaW1lbnNpb24oXG4gICAgICBhbmRyb2lkLnV0aWwuVHlwZWRWYWx1ZS5DT01QTEVYX1VOSVRfRElQLFxuICAgICAgZGlwLFxuICAgICAgbWV0cmljcyxcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBSZW5kZXJlcjIsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzQW5kcm9pZCwgaXNJT1MgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtJztcblxuaW1wb3J0IHsgQW5kcm9pZERhdGEgfSBmcm9tICcuL2NvbW1vbi9hbmRyb2lkLWRhdGEubW9kZWwnO1xuaW1wb3J0IHsgSU9TRGF0YSB9IGZyb20gJy4vY29tbW9uL2lvcy1kYXRhLm1vZGVsJztcbmltcG9ydCB7IFNoYWRvdyB9IGZyb20gJy4vY29tbW9uL3NoYWRvdyc7XG5pbXBvcnQgeyBTaGFwZSwgU2hhcGVFbnVtIH0gZnJvbSAnLi9jb21tb24vc2hhcGUuZW51bSc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9wYWdlL3BhZ2UnO1xuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2xheW91dHMvc3RhY2stbGF5b3V0JztcbmltcG9ydCB7IGFkZFdlYWtFdmVudExpc3RlbmVyLCByZW1vdmVXZWFrRXZlbnRMaXN0ZW5lciB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvd2Vhay1ldmVudC1saXN0ZW5lclwiO1xuZGVjbGFyZSBjb25zdCBhbmRyb2lkOiBhbnk7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tzaGFkb3ddJyB9KVxuZXhwb3J0IGNsYXNzIE5hdGl2ZVNoYWRvd0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBzaGFkb3c6IHN0cmluZyB8IEFuZHJvaWREYXRhIHwgSU9TRGF0YTtcbiAgQElucHV0KCkgZWxldmF0aW9uPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBwcmVzc2VkRWxldmF0aW9uPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBzaGFwZT86IFNoYXBlO1xuICBASW5wdXQoKSBiZ2NvbG9yPzogc3RyaW5nO1xuICBASW5wdXQoKSBjb3JuZXJSYWRpdXM/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHRyYW5zbGF0aW9uWj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgcHJlc3NlZFRyYW5zbGF0aW9uWj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgZm9yY2VQcmVzc0FuaW1hdGlvbj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1hc2tUb0JvdW5kcz86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNoYWRvd0NvbG9yPzogc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dPZmZzZXQ/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHNoYWRvd09wYWNpdHk/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHNoYWRvd1JhZGl1cz86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgdXNlU2hhZG93UGF0aD86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJhc3Rlcml6ZT86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBwcml2YXRlIG9yaWdpbmFsTlNGbjogYW55O1xuICBwcml2YXRlIHByZXZpb3VzTlNGbjogYW55O1xuICBwcml2YXRlIGlvc1NoYWRvd1JhcHBlcjogVmlldztcbiAgcHJpdmF0ZSBldmVudHNCb3VuZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyOiBSZW5kZXJlcjIpIHtcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICB0aGlzLm9yaWdpbmFsTlNGbiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5fcmVkcmF3TmF0aXZlQmFja2dyb3VuZDsgLy9hbHdheXMgc3RvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkgeyAvLyBSYWRMaXN0VmlldyBjYWxscyB0aGlzIG11bHRpcGxlIHRpbWVzIGZvciB0aGUgc2FtZSB2aWV3XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbW1vbkRhdGEoKTtcbiAgICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQW5kcm9pZERhdGEoKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSU9TRGF0YSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2hhZG93ICYmICh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSB8IElPU0RhdGEpLmVsZXZhdGlvbikge1xuICAgICAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUFuZHJvaWREYXRhKHRoaXMuc2hhZG93IGFzIEFuZHJvaWREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0lPUykge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21JT1NEYXRhKHRoaXMuc2hhZG93IGFzIElPU0RhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy51bmJpbmRFdmVudHMoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBOUyBMaXN0Vmlld3MgY3JlYXRlIGVsZW1lbnRzIGR5bmFtaWNhbGx5XG4gIC8vIGxvYWRlZCBhbmQgdW5sb2FkZWQgYXJlIGNhbGxlZCBiZWZvcmUgYW5ndWxhciBpcyBcInJlYWR5XCJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL05hdGl2ZVNjcmlwdC9uYXRpdmVzY3JpcHQtYW5ndWxhci9pc3N1ZXMvMTIyMSNpc3N1ZWNvbW1lbnQtNDIyODEzMTExXG4gIC8vIFNvIHdlIGVuc3VyZSB3ZSdyZSBydW5uaW5nIGxvYWRlZC91bmxvYWRlZCBldmVudHMgb3V0c2lkZSBvZiBhbmd1bGFyXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50c0JvdW5kKSB7XG4gICAgICBhZGRXZWFrRXZlbnRMaXN0ZW5lcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFZpZXcubG9hZGVkRXZlbnQsIHRoaXMub25Mb2FkZWQsIHRoaXMpO1xuICAgICAgYWRkV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LnVubG9hZGVkRXZlbnQsIHRoaXMub25VbmxvYWRlZCwgdGhpcyk7XG4gICAgICB0aGlzLmV2ZW50c0JvdW5kID0gdHJ1ZTtcbiAgICAgIC8vIGluIHNvbWUgY2FzZXMsIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgbG9hZGVkIGJ5IHRpbWUgb2YgYmluZGluZ1xuICAgICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudC5pc0xvYWRlZCkge1xuICAgICAgICB0aGlzLm9uTG9hZGVkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5iaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmV2ZW50c0JvdW5kKSB7XG4gICAgICByZW1vdmVXZWFrRXZlbnRMaXN0ZW5lcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFZpZXcubG9hZGVkRXZlbnQsIHRoaXMub25Mb2FkZWQsIHRoaXMpO1xuICAgICAgcmVtb3ZlV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LnVubG9hZGVkRXZlbnQsIHRoaXMub25VbmxvYWRlZCwgdGhpcyk7XG4gICAgICB0aGlzLmV2ZW50c0JvdW5kID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgb25Mb2FkZWQoKSB7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIC8vIFdlaXJkbHkgbmdPbkluaXQgaXNuJ3QgY2FsbGVkIG9uIGlPUyBvbiBkZW1vIGFwcFxuICAgIC8vIE1hbmFnZWQgdG8gZ2V0IGl0IHdvcmtpbmcgb24gaU9TIHdoZW4gYXBwbHlpbmcgdG9cbiAgICAvLyBGbGV4Ym94TGF5b3V0LCBidXQgb24gdGhlIGRlbW8gYXBwLCB3ZSBhcHBseSB0byBhXG4gICAgLy8gTGFiZWwsIGFuZCwgZm9yIHRoYXQgY2FzZSwgbmdPbkluaXQgaXNuJ3QgY2FsbGVkXG5cbiAgICAvLyBUaGlzIGlzIGp1c3QgZW5mb3JjaW5nIHRoZSBEaXJlY3RpdmUgaXMgaW5pdGlhbGl6ZWRcbiAgICAvLyBiZWZvcmUgY2FsbGluZyB0aGlzLmFwcGx5U2hhZG93KClcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMubmdPbkluaXQoKTtcbiAgICB9XG4gICAgdGhpcy5hcHBseVNoYWRvdygpO1xuICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNOU0ZuID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Ll9yZWRyYXdOYXRpdmVCYWNrZ3JvdW5kOyAvLyBqdXN0IHRvIG1haW50YWluIGNvbXBhdGliaWxpdHkgd2l0aCBvdGhlciBwYXRjaGVzXG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuX3JlZHJhd05hdGl2ZUJhY2tncm91bmQgPSB0aGlzLm1vbmtleVBhdGNoO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkSW9zV3JhcHBlcigpIHtcbiAgICBpZiAoaXNJT1MpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudCBhcyBWaWV3O1xuXG4gICAgICB0aGlzLmlvc1NoYWRvd1JhcHBlciA9IHRoaXMucmVuZGVyLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdTdGFja0xheW91dCdcbiAgICAgICkgYXMgU3RhY2tMYXlvdXQ7XG5cbiAgICAgIC8vIHdyYXBwaW5nRWxlbWVudC5jc3NDbGFzc2VzID0gbWFpbkVsZW1lbnQuY3NzQ2xhc3NlcztcbiAgICAgIGNvbnN0IHBhcmVudCA9IG9yaWdpbmFsRWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgdGhpcy5yZW5kZXIuaW5zZXJ0QmVmb3JlKHBhcmVudCwgdGhpcy5pb3NTaGFkb3dSYXBwZXIsIG9yaWdpbmFsRWxlbWVudCk7XG4gICAgICB0aGlzLnJlbmRlci5yZW1vdmVDaGlsZChwYXJlbnQsIG9yaWdpbmFsRWxlbWVudCk7XG4gICAgICB0aGlzLnJlbmRlci5hcHBlbmRDaGlsZCh0aGlzLmlvc1NoYWRvd1JhcHBlciwgb3JpZ2luYWxFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBvblVubG9hZGVkKCkge1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuX3JlZHJhd05hdGl2ZUJhY2tncm91bmQgPSB0aGlzLm9yaWdpbmFsTlNGbjsgLy8gYWx3YXlzIHJldmVydCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kXG4gICAgfVxuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmFkZElvc1dyYXBwZXIoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmxvYWRlZCAmJlxuICAgICAgISFjaGFuZ2VzICYmXG4gICAgICAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZWxldmF0aW9uJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgncHJlc3NlZEVsZXZhdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYXBlJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnYmdjb2xvcicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Nvcm5lclJhZGl1cycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3ByZXNzZWRUcmFuc2xhdGlvblonKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdmb3JjZVByZXNzQW5pbWF0aW9uJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgndHJhbnNsYXRpb25aJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnbWFza1RvQm91bmRzJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93Q29sb3InKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFkb3dPZmZzZXQnKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFkb3dPcGFjaXR5JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93UmFkaXVzJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgncmFzdGVyaXplJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgndXNlU2hhZG93TWFwJykpXG4gICAgKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvdycpICYmXG4gICAgICAgICFjaGFuZ2VzLmhhc093blByb3BlcnR5KCdlbGV2YXRpb24nKSAmJlxuICAgICAgICB0eXBlb2YgY2hhbmdlcy5zaGFkb3cuY3VycmVudFZhbHVlID09PSAnbnVtYmVyJ1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZWxldmF0aW9uID0gY2hhbmdlcy5zaGFkb3cuY3VycmVudFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXMuc2hhZG93ICYmIGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZS5lbGV2YXRpb24pIHtcbiAgICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21BbmRyb2lkRGF0YSh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSU9TRGF0YSh0aGlzLnNoYWRvdyBhcyBJT1NEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hcHBseVNoYWRvdygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbW9ua2V5UGF0Y2ggPSB2YWwgPT4ge1xuICAgIHRoaXMucHJldmlvdXNOU0ZuLmNhbGwodGhpcy5lbC5uYXRpdmVFbGVtZW50LCB2YWwpO1xuICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgfTtcblxuICBwcml2YXRlIGFwcGx5U2hhZG93KCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuc2hhZG93ID09PSBudWxsIHx8XG4gICAgICB0aGlzLnNoYWRvdyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAodGhpcy5zaGFkb3cgPT09ICcnICYmICF0aGlzLmVsZXZhdGlvbilcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGb3Igc2hhZG93cyB0byBiZSBzaG93biBvbiBBbmRyb2lkIHRoZSBTREsgaGFzIHRvIGJlIGdyZWF0ZXJcbiAgICAvLyBvciBlcXVhbCB0aGFuIDIxLCBsb3dlciBTREsgbWVhbnMgbm8gc2V0RWxldmF0aW9uIG1ldGhvZCBpcyBhdmFpbGFibGVcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICBpZiAoYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPCAyMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgdmlld1RvQXBwbHlTaGFkb3dUbyA9IGlzSU9TXG4gICAgICA/IHRoaXMuaW9zU2hhZG93UmFwcGVyXG4gICAgICA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICh2aWV3VG9BcHBseVNoYWRvd1RvKSB7XG4gICAgICBTaGFkb3cuYXBwbHkodmlld1RvQXBwbHlTaGFkb3dUbywge1xuICAgICAgICBlbGV2YXRpb246IHRoaXMuZWxldmF0aW9uIGFzIG51bWJlcixcbiAgICAgICAgcHJlc3NlZEVsZXZhdGlvbjogdGhpcy5wcmVzc2VkRWxldmF0aW9uIGFzIG51bWJlcixcbiAgICAgICAgc2hhcGU6IHRoaXMuc2hhcGUsXG4gICAgICAgIGJnY29sb3I6IHRoaXMuYmdjb2xvcixcbiAgICAgICAgY29ybmVyUmFkaXVzOiB0aGlzLmNvcm5lclJhZGl1cyxcbiAgICAgICAgdHJhbnNsYXRpb25aOiB0aGlzLnRyYW5zbGF0aW9uWixcbiAgICAgICAgcHJlc3NlZFRyYW5zbGF0aW9uWjogdGhpcy5wcmVzc2VkVHJhbnNsYXRpb25aLFxuICAgICAgICBmb3JjZVByZXNzQW5pbWF0aW9uOiB0aGlzLmZvcmNlUHJlc3NBbmltYXRpb24sXG4gICAgICAgIG1hc2tUb0JvdW5kczogdGhpcy5tYXNrVG9Cb3VuZHMsXG4gICAgICAgIHNoYWRvd0NvbG9yOiB0aGlzLnNoYWRvd0NvbG9yLFxuICAgICAgICBzaGFkb3dPZmZzZXQ6IHRoaXMuc2hhZG93T2Zmc2V0IGFzIG51bWJlcixcbiAgICAgICAgc2hhZG93T3BhY2l0eTogdGhpcy5zaGFkb3dPcGFjaXR5IGFzIG51bWJlcixcbiAgICAgICAgc2hhZG93UmFkaXVzOiB0aGlzLnNoYWRvd1JhZGl1cyBhcyBudW1iZXIsXG4gICAgICAgIHJhc3Rlcml6ZTogdGhpcy5yYXN0ZXJpemUsXG4gICAgICAgIHVzZVNoYWRvd1BhdGg6IHRoaXMudXNlU2hhZG93UGF0aFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQ29tbW9uRGF0YSgpIHtcbiAgICBjb25zdCB0U2hhZG93ID0gdHlwZW9mIHRoaXMuc2hhZG93O1xuICAgIGlmICgodFNoYWRvdyA9PT0gJ3N0cmluZycgfHwgdFNoYWRvdyA9PT0gJ251bWJlcicpICYmICF0aGlzLmVsZXZhdGlvbikge1xuICAgICAgdGhpcy5lbGV2YXRpb24gPSB0aGlzLnNoYWRvdyA/IHBhcnNlSW50KHRoaXMuc2hhZG93IGFzIHN0cmluZywgMTApIDogMjtcbiAgICB9XG4gICAgY29uc3QgdEVsZXZhdGlvbiA9IHR5cGVvZiB0aGlzLmVsZXZhdGlvbjtcbiAgICBpZiAodEVsZXZhdGlvbiA9PT0gJ3N0cmluZycgfHwgdEVsZXZhdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuZWxldmF0aW9uID0gdGhpcy5lbGV2YXRpb25cbiAgICAgICAgPyBwYXJzZUludCh0aGlzLmVsZXZhdGlvbiBhcyBzdHJpbmcsIDEwKVxuICAgICAgICA6IDI7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQW5kcm9pZERhdGEoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNvcm5lclJhZGl1cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuY29ybmVyUmFkaXVzID0gcGFyc2VJbnQodGhpcy5jb3JuZXJSYWRpdXMsIDEwKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnRyYW5zbGF0aW9uWiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMudHJhbnNsYXRpb25aID0gcGFyc2VJbnQodGhpcy50cmFuc2xhdGlvblosIDEwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVJT1NEYXRhKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zaGFkb3dPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd09mZnNldCA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dPZmZzZXQpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMuc2hhZG93T3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc2hhZG93T3BhY2l0eSA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dPcGFjaXR5KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNoYWRvd1JhZGl1cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc2hhZG93UmFkaXVzID0gcGFyc2VGbG9hdCh0aGlzLnNoYWRvd1JhZGl1cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkRnJvbUFuZHJvaWREYXRhKGRhdGE6IEFuZHJvaWREYXRhKSB7XG4gICAgdGhpcy5lbGV2YXRpb24gPSBkYXRhLmVsZXZhdGlvbiB8fCB0aGlzLmVsZXZhdGlvbjtcbiAgICB0aGlzLnNoYXBlID0gZGF0YS5zaGFwZSB8fCB0aGlzLnNoYXBlO1xuICAgIHRoaXMuYmdjb2xvciA9IGRhdGEuYmdjb2xvciB8fCB0aGlzLmJnY29sb3I7XG4gICAgdGhpcy5jb3JuZXJSYWRpdXMgPSBkYXRhLmNvcm5lclJhZGl1cyB8fCB0aGlzLmNvcm5lclJhZGl1cztcbiAgICB0aGlzLnRyYW5zbGF0aW9uWiA9IGRhdGEudHJhbnNsYXRpb25aIHx8IHRoaXMudHJhbnNsYXRpb25aO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkRnJvbUlPU0RhdGEoZGF0YTogSU9TRGF0YSkge1xuICAgIHRoaXMubWFza1RvQm91bmRzID0gZGF0YS5tYXNrVG9Cb3VuZHMgfHwgdGhpcy5tYXNrVG9Cb3VuZHM7XG4gICAgdGhpcy5zaGFkb3dDb2xvciA9IGRhdGEuc2hhZG93Q29sb3IgfHwgdGhpcy5zaGFkb3dDb2xvcjtcbiAgICB0aGlzLnNoYWRvd09mZnNldCA9IGRhdGEuc2hhZG93T2Zmc2V0IHx8IHRoaXMuc2hhZG93T2Zmc2V0O1xuICAgIHRoaXMuc2hhZG93T3BhY2l0eSA9IGRhdGEuc2hhZG93T3BhY2l0eSB8fCB0aGlzLnNoYWRvd09wYWNpdHk7XG4gICAgdGhpcy5zaGFkb3dSYWRpdXMgPSBkYXRhLnNoYWRvd1JhZGl1cyB8fCB0aGlzLnNoYWRvd1JhZGl1cztcbiAgICB0aGlzLnJhc3Rlcml6ZSA9IGRhdGEucmFzdGVyaXplIHx8IHRoaXMucmFzdGVyaXplO1xuICAgIHRoaXMudXNlU2hhZG93UGF0aCA9IGRhdGEudXNlU2hhZG93UGF0aCB8fCB0aGlzLnVzZVNoYWRvd1BhdGg7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE5hdGl2ZVNoYWRvd0RpcmVjdGl2ZSB9IGZyb20gJy4vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmctc2hhZG93LmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOYXRpdmVTaGFkb3dEaXJlY3RpdmUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBOYXRpdmVTaGFkb3dEaXJlY3RpdmUsXG4gIF0sXG4gIHByb3ZpZGVyczogW10sXG59KVxuZXhwb3J0IGNsYXNzIE5nU2hhZG93TW9kdWxlIHsgfVxuIiwiaW1wb3J0IHsgU2hhcGUgfSBmcm9tICcuL3NoYXBlLmVudW0nO1xuXG5leHBvcnQgY2xhc3MgQW5kcm9pZERhdGEge1xuICBlbGV2YXRpb246IG51bWJlcjtcbiAgcHJlc3NlZEVsZXZhdGlvbj86IG51bWJlcjtcbiAgc2hhcGU/OiBTaGFwZTtcbiAgYmdjb2xvcj86IHN0cmluZztcbiAgY29ybmVyUmFkaXVzPzogbnVtYmVyO1xuICB0cmFuc2xhdGlvblo/OiBudW1iZXI7XG4gIHByZXNzZWRUcmFuc2xhdGlvblo/OiBudW1iZXI7XG4gIGZvcmNlUHJlc3NBbmltYXRpb24/OiBib29sZWFuO1xufVxuIiwiZXhwb3J0IGVudW0gRWxldmF0aW9uIHtcbiAgU1dJVENIID0gMSxcbiAgQ0FSRF9SRVNUSU5HID0gMixcbiAgUkFJU0VEX0JVVFRPTl9SRVNUSU5HID0gMixcbiAgU0VBUkNIX0JBUl9SRVNUSU5HID0gMixcbiAgUkVGUkVTSF9JTkRJQ0FET1IgPSAzLFxuICBTRUFSQ0hfQkFSX1NDUk9MTEVEID0gMyxcbiAgQVBQQkFSID0gNCxcbiAgRkFCX1JFU1RJTkcgPSA2LFxuICBTTkFDS0JBUiA9IDYsXG4gIEJPVFRPTV9OQVZJR0FUSU9OX0JBUiA9IDgsXG4gIE1FTlUgPSA4LFxuICBDQVJEX1BJQ0tFRF9VUCA9IDgsXG4gIFJBSVNFRF9CVVRUT05fUFJFU1NFRCA9IDgsXG4gIFNVQk1FTlVfTEVWRUwxID0gOSxcbiAgU1VCTUVOVV9MRVZFTDIgPSAxMCxcbiAgU1VCTUVOVV9MRVZFTDMgPSAxMSxcbiAgU1VCTUVOVV9MRVZFTDQgPSAxMixcbiAgU1VCTUVOVV9MRVZFTDUgPSAxMyxcbiAgRkFCX1BSRVNTRUQgPSAxMixcbiAgTkFWX0RSQVdFUiA9IDE2LFxuICBSSUdIVF9EUkFXRVIgPSAxNixcbiAgTU9EQUxfQk9UVE9NX1NIRUVUID0gMTYsXG4gIERJQUxPRyA9IDI0LFxuICBQSUNLRVIgPSAyNCxcbn1cbiIsImV4cG9ydCBjbGFzcyBJT1NEYXRhIHtcbiAgZWxldmF0aW9uOiBudW1iZXI7XG4gIG1hc2tUb0JvdW5kcz86IGJvb2xlYW47XG4gIHNoYWRvd0NvbG9yPzogc3RyaW5nO1xuICBzaGFkb3dPZmZzZXQ/OiBudW1iZXI7XG4gIHNoYWRvd09wYWNpdHk/OiBudW1iZXI7XG4gIHNoYWRvd1JhZGl1cz86IG51bWJlcjtcbiAgcmFzdGVyaXplPzogYm9vbGVhbjtcbiAgdXNlU2hhZG93UGF0aD86IGJvb2xlYW47XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBRUUsV0FBWSxXQUFXO0lBQ3ZCLE1BQU8sTUFBTTtJQUNiLE1BQU8sTUFBTTtJQUNiLE1BQU8sTUFBTTs7Ozs7OztBQ0xmO0FBZUEsSUFBSSxhQUFhLENBQUM7O0FBQ2xCLElBQUksV0FBVyxDQUFDO0FBRWhCLElBQUksU0FBUyxFQUFFO0lBQ2IsYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkUsV0FBVyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNyRTs7QUFFRCxJQUFNLFVBQVUsR0FBMkUsRUFBRSxDQUFDOzs7Ozs7QUFFOUYscUJBQXFCLEtBQWEsRUFBRSxLQUFhOztJQUMvQyxJQUFNLFNBQVMsR0FBRyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3pDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRztZQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUN6QyxVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUM7S0FDSDtJQUNELElBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMxRCxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxD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