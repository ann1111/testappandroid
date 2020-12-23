/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { Shadow } from './common/shadow';
import { View } from 'tns-core-modules/ui/page/page';
import { addWeakEventListener, removeWeakEventListener } from "tns-core-modules/ui/core/weak-event-listener";
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
export { NativeShadowDirective };
if (false) {
    /** @type {?} */
    NativeShadowDirective.prototype.shadow;
    /** @type {?} */
    NativeShadowDirective.prototype.elevation;
    /** @type {?} */
    NativeShadowDirective.prototype.pressedElevation;
    /** @type {?} */
    NativeShadowDirective.prototype.shape;
    /** @type {?} */
    NativeShadowDirective.prototype.bgcolor;
    /** @type {?} */
    NativeShadowDirective.prototype.cornerRadius;
    /** @type {?} */
    NativeShadowDirective.prototype.translationZ;
    /** @type {?} */
    NativeShadowDirective.prototype.pressedTranslationZ;
    /** @type {?} */
    NativeShadowDirective.prototype.forcePressAnimation;
    /** @type {?} */
    NativeShadowDirective.prototype.maskToBounds;
    /** @type {?} */
    NativeShadowDirective.prototype.shadowColor;
    /** @type {?} */
    NativeShadowDirective.prototype.shadowOffset;
    /** @type {?} */
    NativeShadowDirective.prototype.shadowOpacity;
    /** @type {?} */
    NativeShadowDirective.prototype.shadowRadius;
    /** @type {?} */
    NativeShadowDirective.prototype.useShadowPath;
    /** @type {?} */
    NativeShadowDirective.prototype.rasterize;
    /** @type {?} */
    NativeShadowDirective.prototype.loaded;
    /** @type {?} */
    NativeShadowDirective.prototype.initialized;
    /** @type {?} */
    NativeShadowDirective.prototype.originalNSFn;
    /** @type {?} */
    NativeShadowDirective.prototype.previousNSFn;
    /** @type {?} */
    NativeShadowDirective.prototype.iosShadowRapper;
    /** @type {?} */
    NativeShadowDirective.prototype.eventsBound;
    /** @type {?} */
    NativeShadowDirective.prototype.monkeyPatch;
    /** @type {?} */
    NativeShadowDirective.prototype.el;
    /** @type {?} */
    NativeShadowDirective.prototype.render;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2hhZG93LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93LyIsInNvdXJjZXMiOlsibmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmctc2hhZG93LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUlMLFNBQVMsRUFHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBSTdELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFckQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7O0lBNkIzRywrQkFBb0IsRUFBYyxFQUFVLE1BQWlCO1FBQTdELGlCQUlDO1FBSm1CLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFXO3NCQVA1QyxLQUFLOzJCQUNBLEtBQUs7MkJBSUwsS0FBSzsyQkFnSkwsVUFBQSxHQUFHO1lBQ3ZCLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtRQWhKQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQztTQUNuRTtLQUNGOzs7O0lBRUQsd0NBQVE7OztJQUFSOztRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENB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TCxLQUFLOytCQUNMLEtBQUs7c0NBQ0wsS0FBSztzQ0FDTCxLQUFLOytCQUNMLEtBQUs7OEJBQ0wsS0FBSzsrQkFDTCxLQUFLO2dDQUNMLEtBQUs7K0JBQ0wsS0FBSztnQ0FDTCxLQUFLOzRCQUNMLEtBQUs7O2dDQXhDUjs7U0F3QmEscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgUmVuZGVyZXIyLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc0FuZHJvaWQsIGlzSU9TIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybSc7XG5cbmltcG9ydCB7IEFuZHJvaWREYXRhIH0gZnJvbSAnLi9jb21tb24vYW5kcm9pZC1kYXRhLm1vZGVsJztcbmltcG9ydCB7IElPU0RhdGEgfSBmcm9tICcuL2NvbW1vbi9pb3MtZGF0YS5tb2RlbCc7XG5pbXBvcnQgeyBTaGFkb3cgfSBmcm9tICcuL2NvbW1vbi9zaGFkb3cnO1xuaW1wb3J0IHsgU2hhcGUsIFNoYXBlRW51bSB9IGZyb20gJy4vY29tbW9uL3NoYXBlLmVudW0nO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvcGFnZS9wYWdlJztcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9sYXlvdXRzL3N0YWNrLWxheW91dCc7XG5pbXBvcnQgeyBhZGRXZWFrRXZlbnRMaXN0ZW5lciwgcmVtb3ZlV2Vha0V2ZW50TGlzdGVuZXIgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9jb3JlL3dlYWstZXZlbnQtbGlzdGVuZXJcIjtcbmRlY2xhcmUgY29uc3QgYW5kcm9pZDogYW55O1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbc2hhZG93XScgfSlcbmV4cG9ydCBjbGFzcyBOYXRpdmVTaGFkb3dEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgc2hhZG93OiBzdHJpbmcgfCBBbmRyb2lkRGF0YSB8IElPU0RhdGE7XG4gIEBJbnB1dCgpIGVsZXZhdGlvbj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgcHJlc3NlZEVsZXZhdGlvbj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgc2hhcGU/OiBTaGFwZTtcbiAgQElucHV0KCkgYmdjb2xvcj86IHN0cmluZztcbiAgQElucHV0KCkgY29ybmVyUmFkaXVzPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSB0cmFuc2xhdGlvblo/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHByZXNzZWRUcmFuc2xhdGlvblo/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIGZvcmNlUHJlc3NBbmltYXRpb24/OiBib29sZWFuO1xuICBASW5wdXQoKSBtYXNrVG9Cb3VuZHM/OiBib29sZWFuO1xuICBASW5wdXQoKSBzaGFkb3dDb2xvcj86IHN0cmluZztcbiAgQElucHV0KCkgc2hhZG93T2Zmc2V0PzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dPcGFjaXR5PzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dSYWRpdXM/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHVzZVNoYWRvd1BhdGg/OiBib29sZWFuO1xuICBASW5wdXQoKSByYXN0ZXJpemU/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgbG9hZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBvcmlnaW5hbE5TRm46IGFueTtcbiAgcHJpdmF0ZSBwcmV2aW91c05TRm46IGFueTtcbiAgcHJpdmF0ZSBpb3NTaGFkb3dSYXBwZXI6IFZpZXc7XG4gIHByaXZhdGUgZXZlbnRzQm91bmQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcjogUmVuZGVyZXIyKSB7XG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgdGhpcy5vcmlnaW5hbE5TRm4gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuX3JlZHJhd05hdGl2ZUJhY2tncm91bmQ7IC8vYWx3YXlzIHN0b3JlIHRoZSBvcmlnaW5hbCBtZXRob2RcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHsgLy8gUmFkTGlzdFZpZXcgY2FsbHMgdGhpcyBtdWx0aXBsZSB0aW1lcyBmb3IgdGhlIHNhbWUgdmlld1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB0aGlzLmluaXRpYWxpemVDb21tb25EYXRhKCk7XG4gICAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUFuZHJvaWREYXRhKCk7XG4gICAgICB9IGVsc2UgaWYgKGlzSU9TKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUlPU0RhdGEoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNoYWRvdyAmJiAodGhpcy5zaGFkb3cgYXMgQW5kcm9pZERhdGEgfCBJT1NEYXRhKS5lbGV2YXRpb24pIHtcbiAgICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21BbmRyb2lkRGF0YSh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSU9TRGF0YSh0aGlzLnNoYWRvdyBhcyBJT1NEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gTlMgTGlzdFZpZXdzIGNyZWF0ZSBlbGVtZW50cyBkeW5hbWljYWxseVxuICAvLyBsb2FkZWQgYW5kIHVubG9hZGVkIGFyZSBjYWxsZWQgYmVmb3JlIGFuZ3VsYXIgaXMgXCJyZWFkeVwiXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9OYXRpdmVTY3JpcHQvbmF0aXZlc2NyaXB0LWFuZ3VsYXIvaXNzdWVzLzEyMjEjaXNzdWVjb21tZW50LTQyMjgxMzExMVxuICAvLyBTbyB3ZSBlbnN1cmUgd2UncmUgcnVubmluZyBsb2FkZWQvdW5sb2FkZWQgZXZlbnRzIG91dHNpZGUgb2YgYW5ndWxhclxuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICghdGhpcy5ldmVudHNCb3VuZCkge1xuICAgICAgYWRkV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LmxvYWRlZEV2ZW50LCB0aGlzLm9uTG9hZGVkLCB0aGlzKTtcbiAgICAgIGFkZFdlYWtFdmVudExpc3RlbmVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgVmlldy51bmxvYWRlZEV2ZW50LCB0aGlzLm9uVW5sb2FkZWQsIHRoaXMpO1xuICAgICAgdGhpcy5ldmVudHNCb3VuZCA9IHRydWU7XG4gICAgICAvLyBpbiBzb21lIGNhc2VzLCB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGxvYWRlZCBieSB0aW1lIG9mIGJpbmRpbmdcbiAgICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaXNMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5vbkxvYWRlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVuYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5ldmVudHNCb3VuZCkge1xuICAgICAgcmVtb3ZlV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LmxvYWRlZEV2ZW50LCB0aGlzLm9uTG9hZGVkLCB0aGlzKTtcbiAgICAgIHJlbW92ZVdlYWtFdmVudExpc3RlbmVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgVmlldy51bmxvYWRlZEV2ZW50LCB0aGlzLm9uVW5sb2FkZWQsIHRoaXMpO1xuICAgICAgdGhpcy5ldmVudHNCb3VuZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9uTG9hZGVkKCkge1xuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAvLyBXZWlyZGx5IG5nT25Jbml0IGlzbid0IGNhbGxlZCBvbiBpT1Mgb24gZGVtbyBhcHBcbiAgICAvLyBNYW5hZ2VkIHRvIGdldCBpdCB3b3JraW5nIG9uIGlPUyB3aGVuIGFwcGx5aW5nIHRvXG4gICAgLy8gRmxleGJveExheW91dCwgYnV0IG9uIHRoZSBkZW1vIGFwcCwgd2UgYXBwbHkgdG8gYVxuICAgIC8vIExhYmVsLCBhbmQsIGZvciB0aGF0IGNhc2UsIG5nT25Jbml0IGlzbid0IGNhbGxlZFxuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGVuZm9yY2luZyB0aGUgRGlyZWN0aXZlIGlzIGluaXRpYWxpemVkXG4gICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcy5hcHBseVNoYWRvdygpXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLm5nT25Jbml0KCk7XG4gICAgfVxuICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICB0aGlzLnByZXZpb3VzTlNGbiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5fcmVkcmF3TmF0aXZlQmFja2dyb3VuZDsgLy8ganVzdCB0byBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggb3RoZXIgcGF0Y2hlc1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50Ll9yZWRyYXdOYXRpdmVCYWNrZ3JvdW5kID0gdGhpcy5tb25rZXlQYXRjaDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZElvc1dyYXBwZXIoKSB7XG4gICAgaWYgKGlzSU9TKSB7XG4gICAgICBjb25zdCBvcmlnaW5hbEVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgYXMgVmlldztcblxuICAgICAgdGhpcy5pb3NTaGFkb3dSYXBwZXIgPSB0aGlzLnJlbmRlci5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnU3RhY2tMYXlvdXQnXG4gICAgICApIGFzIFN0YWNrTGF5b3V0O1xuXG4gICAgICAvLyB3cmFwcGluZ0VsZW1lbnQuY3NzQ2xhc3NlcyA9IG1haW5FbGVtZW50LmNzc0NsYXNzZXM7XG4gICAgICBjb25zdCBwYXJlbnQgPSBvcmlnaW5hbEVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIHRoaXMucmVuZGVyLmluc2VydEJlZm9yZShwYXJlbnQsIHRoaXMuaW9zU2hhZG93UmFwcGVyLCBvcmlnaW5hbEVsZW1lbnQpO1xuICAgICAgdGhpcy5yZW5kZXIucmVtb3ZlQ2hpbGQocGFyZW50LCBvcmlnaW5hbEVsZW1lbnQpO1xuICAgICAgdGhpcy5yZW5kZXIuYXBwZW5kQ2hpbGQodGhpcy5pb3NTaGFkb3dSYXBwZXIsIG9yaWdpbmFsRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgb25VbmxvYWRlZCgpIHtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50Ll9yZWRyYXdOYXRpdmVCYWNrZ3JvdW5kID0gdGhpcy5vcmlnaW5hbE5TRm47IC8vIGFsd2F5cyByZXZlcnQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIH1cbiAgfVxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5hZGRJb3NXcmFwcGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5sb2FkZWQgJiZcbiAgICAgICEhY2hhbmdlcyAmJlxuICAgICAgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvdycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2VsZXZhdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3ByZXNzZWRFbGV2YXRpb24nKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFwZScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2JnY29sb3InKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdjb3JuZXJSYWRpdXMnKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdwcmVzc2VkVHJhbnNsYXRpb25aJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9yY2VQcmVzc0FuaW1hdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RyYW5zbGF0aW9uWicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ21hc2tUb0JvdW5kcycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvd0NvbG9yJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93T2Zmc2V0JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93T3BhY2l0eScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvd1JhZGl1cycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3Jhc3Rlcml6ZScpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3VzZVNoYWRvd01hcCcpKVxuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFkb3cnKSAmJlxuICAgICAgICAhY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZWxldmF0aW9uJykgJiZcbiAgICAgICAgdHlwZW9mIGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZSA9PT0gJ251bWJlcidcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVsZXZhdGlvbiA9IGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzLnNoYWRvdyAmJiBjaGFuZ2VzLnNoYWRvdy5jdXJyZW50VmFsdWUuZWxldmF0aW9uKSB7XG4gICAgICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tQW5kcm9pZERhdGEodGhpcy5zaGFkb3cgYXMgQW5kcm9pZERhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSU9TKSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUlPU0RhdGEodGhpcy5zaGFkb3cgYXMgSU9TRGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1vbmtleVBhdGNoID0gdmFsID0+IHtcbiAgICB0aGlzLnByZXZpb3VzTlNGbi5jYWxsKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdmFsKTtcbiAgICB0aGlzLmFwcGx5U2hhZG93KCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhcHBseVNoYWRvdygpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNoYWRvdyA9PT0gbnVsbCB8fFxuICAgICAgdGhpcy5zaGFkb3cgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgKHRoaXMuc2hhZG93ID09PSAnJyAmJiAhdGhpcy5lbGV2YXRpb24pXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRm9yIHNoYWRvd3MgdG8gYmUgc2hvd24gb24gQW5kcm9pZCB0aGUgU0RLIGhhcyB0byBiZSBncmVhdGVyXG4gICAgLy8gb3IgZXF1YWwgdGhhbiAyMSwgbG93ZXIgU0RLIG1lYW5zIG5vIHNldEVsZXZhdGlvbiBtZXRob2QgaXMgYXZhaWxhYmxlXG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgaWYgKGFuZHJvaWQub3MuQnVpbGQuVkVSU0lPTi5TREtfSU5UIDwgMjEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHZpZXdUb0FwcGx5U2hhZG93VG8gPSBpc0lPU1xuICAgICAgPyB0aGlzLmlvc1NoYWRvd1JhcHBlclxuICAgICAgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAodmlld1RvQXBwbHlTaGFkb3dUbykge1xuICAgICAgU2hhZG93LmFwcGx5KHZpZXdUb0FwcGx5U2hhZG93VG8sIHtcbiAgICAgICAgZWxldmF0aW9uOiB0aGlzLmVsZXZhdGlvbiBhcyBudW1iZXIsXG4gICAgICAgIHByZXNzZWRFbGV2YXRpb246IHRoaXMucHJlc3NlZEVsZXZhdGlvbiBhcyBudW1iZXIsXG4gICAgICAgIHNoYXBlOiB0aGlzLnNoYXBlLFxuICAgICAgICBiZ2NvbG9yOiB0aGlzLmJnY29sb3IsXG4gICAgICAgIGNvcm5lclJhZGl1czogdGhpcy5jb3JuZXJSYWRpdXMsXG4gICAgICAgIHRyYW5zbGF0aW9uWjogdGhpcy50cmFuc2xhdGlvblosXG4gICAgICAgIHByZXNzZWRUcmFuc2xhdGlvblo6IHRoaXMucHJlc3NlZFRyYW5zbGF0aW9uWixcbiAgICAgICAgZm9yY2VQcmVzc0FuaW1hdGlvbjogdGhpcy5mb3JjZVByZXNzQW5pbWF0aW9uLFxuICAgICAgICBtYXNrVG9Cb3VuZHM6IHRoaXMubWFza1RvQm91bmRzLFxuICAgICAgICBzaGFkb3dDb2xvcjogdGhpcy5zaGFkb3dDb2xvcixcbiAgICAgICAgc2hhZG93T2Zmc2V0OiB0aGlzLnNoYWRvd09mZnNldCBhcyBudW1iZXIsXG4gICAgICAgIHNoYWRvd09wYWNpdHk6IHRoaXMuc2hhZG93T3BhY2l0eSBhcyBudW1iZXIsXG4gICAgICAgIHNoYWRvd1JhZGl1czogdGhpcy5zaGFkb3dSYWRpdXMgYXMgbnVtYmVyLFxuICAgICAgICByYXN0ZXJpemU6IHRoaXMucmFzdGVyaXplLFxuICAgICAgICB1c2VTaGFkb3dQYXRoOiB0aGlzLnVzZVNoYWRvd1BhdGhcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUNvbW1vbkRhdGEoKSB7XG4gICAgY29uc3QgdFNoYWRvdyA9IHR5cGVvZiB0aGlzLnNoYWRvdztcbiAgICBpZiAoKHRTaGFkb3cgPT09ICdzdHJpbmcnIHx8IHRTaGFkb3cgPT09ICdudW1iZXInKSAmJiAhdGhpcy5lbGV2YXRpb24pIHtcbiAgICAgIHRoaXMuZWxldmF0aW9uID0gdGhpcy5zaGFkb3cgPyBwYXJzZUludCh0aGlzLnNoYWRvdyBhcyBzdHJpbmcsIDEwKSA6IDI7XG4gICAgfVxuICAgIGNvbnN0IHRFbGV2YXRpb24gPSB0eXBlb2YgdGhpcy5lbGV2YXRpb247XG4gICAgaWYgKHRFbGV2YXRpb24gPT09ICdzdHJpbmcnIHx8IHRFbGV2YXRpb24gPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLmVsZXZhdGlvbiA9IHRoaXMuZWxldmF0aW9uXG4gICAgICAgID8gcGFyc2VJbnQodGhpcy5lbGV2YXRpb24gYXMgc3RyaW5nLCAxMClcbiAgICAgICAgOiAyO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUFuZHJvaWREYXRhKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jb3JuZXJSYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmNvcm5lclJhZGl1cyA9IHBhcnNlSW50KHRoaXMuY29ybmVyUmFkaXVzLCAxMCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy50cmFuc2xhdGlvblogPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0aW9uWiA9IHBhcnNlSW50KHRoaXMudHJhbnNsYXRpb25aLCAxMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplSU9TRGF0YSgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2hhZG93T2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zaGFkb3dPZmZzZXQgPSBwYXJzZUZsb2F0KHRoaXMuc2hhZG93T2Zmc2V0KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNoYWRvd09wYWNpdHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd09wYWNpdHkgPSBwYXJzZUZsb2F0KHRoaXMuc2hhZG93T3BhY2l0eSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy5zaGFkb3dSYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd1JhZGl1cyA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dSYWRpdXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZEZyb21BbmRyb2lkRGF0YShkYXRhOiBBbmRyb2lkRGF0YSkge1xuICAgIHRoaXMuZWxldmF0aW9uID0gZGF0YS5lbGV2YXRpb24gfHwgdGhpcy5lbGV2YXRpb247XG4gICAgdGhpcy5zaGFwZSA9IGRhdGEuc2hhcGUgfHwgdGhpcy5zaGFwZTtcbiAgICB0aGlzLmJnY29sb3IgPSBkYXRhLmJnY29sb3IgfHwgdGhpcy5iZ2NvbG9yO1xuICAgIHRoaXMuY29ybmVyUmFkaXVzID0gZGF0YS5jb3JuZXJSYWRpdXMgfHwgdGhpcy5jb3JuZXJSYWRpdXM7XG4gICAgdGhpcy50cmFuc2xhdGlvblogPSBkYXRhLnRyYW5zbGF0aW9uWiB8fCB0aGlzLnRyYW5zbGF0aW9uWjtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZEZyb21JT1NEYXRhKGRhdGE6IElPU0RhdGEpIHtcbiAgICB0aGlzLm1hc2tUb0JvdW5kcyA9IGRhdGEubWFza1RvQm91bmRzIHx8IHRoaXMubWFza1RvQm91bmRzO1xuICAgIHRoaXMuc2hhZG93Q29sb3IgPSBkYXRhLnNoYWRvd0NvbG9yIHx8IHRoaXMuc2hhZG93Q29sb3I7XG4gICAgdGhpcy5zaGFkb3dPZmZzZXQgPSBkYXRhLnNoYWRvd09mZnNldCB8fCB0aGlzLnNoYWRvd09mZnNldDtcbiAgICB0aGlzLnNoYWRvd09wYWNpdHkgPSBkYXRhLnNoYWRvd09wYWNpdHkgfHwgdGhpcy5zaGFkb3dPcGFjaXR5O1xuICAgIHRoaXMuc2hhZG93UmFkaXVzID0gZGF0YS5zaGFkb3dSYWRpdXMgfHwgdGhpcy5zaGFkb3dSYWRpdXM7XG4gICAgdGhpcy5yYXN0ZXJpemUgPSBkYXRhLnJhc3Rlcml6ZSB8fCB0aGlzLnJhc3Rlcml6ZTtcbiAgICB0aGlzLnVzZVNoYWRvd1BhdGggPSBkYXRhLnVzZVNoYWRvd1BhdGggfHwgdGhpcy51c2VTaGFkb3dQYXRoO1xuICB9XG59XG4iXX0=