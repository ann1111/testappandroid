/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { Shadow } from './common/shadow';
import { View } from 'tns-core-modules/ui/page/page';
import { addWeakEventListener, removeWeakEventListener } from "tns-core-modules/ui/core/weak-event-listener";
export class NativeShadowDirective {
    /**
     * @param {?} el
     * @param {?} render
     */
    constructor(el, render) {
        this.el = el;
        this.render = render;
        this.loaded = false;
        this.initialized = false;
        this.eventsBound = false;
        this.monkeyPatch = val => {
            this.previousNSFn.call(this.el.nativeElement, val);
            this.applyShadow();
        };
        if (isAndroid) {
            this.originalNSFn = this.el.nativeElement._redrawNativeBackground; //always store the original method
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.initialized) {
            this.unbindEvents();
            this.initialized = false;
        }
    }
    /**
     * @return {?}
     */
    bindEvents() {
        if (!this.eventsBound) {
            addWeakEventListener(this.el.nativeElement, View.loadedEvent, this.onLoaded, this);
            addWeakEventListener(this.el.nativeElement, View.unloadedEvent, this.onUnloaded, this);
            this.eventsBound = true;
            // in some cases, the element is already loaded by time of binding
            if (this.el.nativeElement.isLoaded) {
                this.onLoaded();
            }
        }
    }
    /**
     * @return {?}
     */
    unbindEvents() {
        if (this.eventsBound) {
            removeWeakEventListener(this.el.nativeElement, View.loadedEvent, this.onLoaded, this);
            removeWeakEventListener(this.el.nativeElement, View.unloadedEvent, this.onUnloaded, this);
            this.eventsBound = false;
        }
    }
    /**
     * @return {?}
     */
    onLoaded() {
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
    }
    /**
     * @return {?}
     */
    addIosWrapper() {
        if (isIOS) {
            /** @type {?} */
            const originalElement = /** @type {?} */ (this.el.nativeElement);
            this.iosShadowRapper = /** @type {?} */ (this.render.createElement('StackLayout'));
            /** @type {?} */
            const parent = originalElement.parentNode;
            this.render.insertBefore(parent, this.iosShadowRapper, originalElement);
            this.render.removeChild(parent, originalElement);
            this.render.appendChild(this.iosShadowRapper, originalElement);
        }
    }
    /**
     * @return {?}
     */
    onUnloaded() {
        this.loaded = false;
        if (isAndroid) {
            this.el.nativeElement._redrawNativeBackground = this.originalNSFn; // always revert to the original method
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.addIosWrapper();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
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
    }
    /**
     * @return {?}
     */
    applyShadow() {
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
        const viewToApplyShadowTo = isIOS
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
    }
    /**
     * @return {?}
     */
    initializeCommonData() {
        /** @type {?} */
        const tShadow = typeof this.shadow;
        if ((tShadow === 'string' || tShadow === 'number') && !this.elevation) {
            this.elevation = this.shadow ? parseInt(/** @type {?} */ (this.shadow), 10) : 2;
        }
        /** @type {?} */
        const tElevation = typeof this.elevation;
        if (tElevation === 'string' || tElevation === 'number') {
            this.elevation = this.elevation
                ? parseInt(/** @type {?} */ (this.elevation), 10)
                : 2;
        }
    }
    /**
     * @return {?}
     */
    initializeAndroidData() {
        if (typeof this.cornerRadius === 'string') {
            this.cornerRadius = parseInt(this.cornerRadius, 10);
        }
        if (typeof this.translationZ === 'string') {
            this.translationZ = parseInt(this.translationZ, 10);
        }
    }
    /**
     * @return {?}
     */
    initializeIOSData() {
        if (typeof this.shadowOffset === 'string') {
            this.shadowOffset = parseFloat(this.shadowOffset);
        }
        if (typeof this.shadowOpacity === 'string') {
            this.shadowOpacity = parseFloat(this.shadowOpacity);
        }
        if (typeof this.shadowRadius === 'string') {
            this.shadowRadius = parseFloat(this.shadowRadius);
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    loadFromAndroidData(data) {
        this.elevation = data.elevation || this.elevation;
        this.shape = data.shape || this.shape;
        this.bgcolor = data.bgcolor || this.bgcolor;
        this.cornerRadius = data.cornerRadius || this.cornerRadius;
        this.translationZ = data.translationZ || this.translationZ;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    loadFromIOSData(data) {
        this.maskToBounds = data.maskToBounds || this.maskToBounds;
        this.shadowColor = data.shadowColor || this.shadowColor;
        this.shadowOffset = data.shadowOffset || this.shadowOffset;
        this.shadowOpacity = data.shadowOpacity || this.shadowOpacity;
        this.shadowRadius = data.shadowRadius || this.shadowRadius;
        this.rasterize = data.rasterize || this.rasterize;
        this.useShadowPath = data.useShadowPath || this.useShadowPath;
    }
}
NativeShadowDirective.decorators = [
    { type: Directive, args: [{ selector: '[shadow]' },] },
];
/** @nocollapse */
NativeShadowDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2hhZG93LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25hdGl2ZXNjcmlwdC1uZ3gtc2hhZG93LyIsInNvdXJjZXMiOlsibmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvbmctc2hhZG93LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUlMLFNBQVMsRUFHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBSTdELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFckQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLHVCQUF1QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFJN0csTUFBTTs7Ozs7SUF5QkosWUFBb0IsRUFBYyxFQUFVLE1BQWlCO1FBQXpDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFXO3NCQVA1QyxLQUFLOzJCQUNBLEtBQUs7MkJBSUwsS0FBSzsyQkFnSkwsR0FBRyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO1FBaEpDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDO1NBQ25FO0tBQ0Y7Ozs7SUFFRCxRQUFROztRQUNOLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7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bXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBSZW5kZXJlcjIsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzQW5kcm9pZCwgaXNJT1MgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3BsYXRmb3JtJztcblxuaW1wb3J0IHsgQW5kcm9pZERhdGEgfSBmcm9tICcuL2NvbW1vbi9hbmRyb2lkLWRhdGEubW9kZWwnO1xuaW1wb3J0IHsgSU9TRGF0YSB9IGZyb20gJy4vY29tbW9uL2lvcy1kYXRhLm1vZGVsJztcbmltcG9ydCB7IFNoYWRvdyB9IGZyb20gJy4vY29tbW9uL3NoYWRvdyc7XG5pbXBvcnQgeyBTaGFwZSwgU2hhcGVFbnVtIH0gZnJvbSAnLi9jb21tb24vc2hhcGUuZW51bSc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9wYWdlL3BhZ2UnO1xuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2xheW91dHMvc3RhY2stbGF5b3V0JztcbmltcG9ydCB7IGFkZFdlYWtFdmVudExpc3RlbmVyLCByZW1vdmVXZWFrRXZlbnRMaXN0ZW5lciB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2NvcmUvd2Vhay1ldmVudC1saXN0ZW5lclwiO1xuZGVjbGFyZSBjb25zdCBhbmRyb2lkOiBhbnk7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tzaGFkb3ddJyB9KVxuZXhwb3J0IGNsYXNzIE5hdGl2ZVNoYWRvd0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBzaGFkb3c6IHN0cmluZyB8IEFuZHJvaWREYXRhIHwgSU9TRGF0YTtcbiAgQElucHV0KCkgZWxldmF0aW9uPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBwcmVzc2VkRWxldmF0aW9uPzogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBzaGFwZT86IFNoYXBlO1xuICBASW5wdXQoKSBiZ2NvbG9yPzogc3RyaW5nO1xuICBASW5wdXQoKSBjb3JuZXJSYWRpdXM/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHRyYW5zbGF0aW9uWj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgcHJlc3NlZFRyYW5zbGF0aW9uWj86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgZm9yY2VQcmVzc0FuaW1hdGlvbj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1hc2tUb0JvdW5kcz86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNoYWRvd0NvbG9yPzogc3RyaW5nO1xuICBASW5wdXQoKSBzaGFkb3dPZmZzZXQ/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHNoYWRvd09wYWNpdHk/OiBudW1iZXIgfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHNoYWRvd1JhZGl1cz86IG51bWJlciB8IHN0cmluZztcbiAgQElucHV0KCkgdXNlU2hhZG93UGF0aD86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJhc3Rlcml6ZT86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBsb2FkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBwcml2YXRlIG9yaWdpbmFsTlNGbjogYW55O1xuICBwcml2YXRlIHByZXZpb3VzTlNGbjogYW55O1xuICBwcml2YXRlIGlvc1NoYWRvd1JhcHBlcjogVmlldztcbiAgcHJpdmF0ZSBldmVudHNCb3VuZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyOiBSZW5kZXJlcjIpIHtcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICB0aGlzLm9yaWdpbmFsTlNGbiA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5fcmVkcmF3TmF0aXZlQmFja2dyb3VuZDsgLy9hbHdheXMgc3RvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkgeyAvLyBSYWRMaXN0VmlldyBjYWxscyB0aGlzIG11bHRpcGxlIHRpbWVzIGZvciB0aGUgc2FtZSB2aWV3XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbW1vbkRhdGEoKTtcbiAgICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQW5kcm9pZERhdGEoKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSU9TRGF0YSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2hhZG93ICYmICh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSB8IElPU0RhdGEpLmVsZXZhdGlvbikge1xuICAgICAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUFuZHJvaWREYXRhKHRoaXMuc2hhZG93IGFzIEFuZHJvaWREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0lPUykge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21JT1NEYXRhKHRoaXMuc2hhZG93IGFzIElPU0RhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy51bmJpbmRFdmVudHMoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBOUyBMaXN0Vmlld3MgY3JlYXRlIGVsZW1lbnRzIGR5bmFtaWNhbGx5XG4gIC8vIGxvYWRlZCBhbmQgdW5sb2FkZWQgYXJlIGNhbGxlZCBiZWZvcmUgYW5ndWxhciBpcyBcInJlYWR5XCJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL05hdGl2ZVNjcmlwdC9uYXRpdmVzY3JpcHQtYW5ndWxhci9pc3N1ZXMvMTIyMSNpc3N1ZWNvbW1lbnQtNDIyODEzMTExXG4gIC8vIFNvIHdlIGVuc3VyZSB3ZSdyZSBydW5uaW5nIGxvYWRlZC91bmxvYWRlZCBldmVudHMgb3V0c2lkZSBvZiBhbmd1bGFyXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50c0JvdW5kKSB7XG4gICAgICBhZGRXZWFrRXZlbnRMaXN0ZW5lcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFZpZXcubG9hZGVkRXZlbnQsIHRoaXMub25Mb2FkZWQsIHRoaXMpO1xuICAgICAgYWRkV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LnVubG9hZGVkRXZlbnQsIHRoaXMub25VbmxvYWRlZCwgdGhpcyk7XG4gICAgICB0aGlzLmV2ZW50c0JvdW5kID0gdHJ1ZTtcbiAgICAgIC8vIGluIHNvbWUgY2FzZXMsIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgbG9hZGVkIGJ5IHRpbWUgb2YgYmluZGluZ1xuICAgICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudC5pc0xvYWRlZCkge1xuICAgICAgICB0aGlzLm9uTG9hZGVkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5iaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmV2ZW50c0JvdW5kKSB7XG4gICAgICByZW1vdmVXZWFrRXZlbnRMaXN0ZW5lcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFZpZXcubG9hZGVkRXZlbnQsIHRoaXMub25Mb2FkZWQsIHRoaXMpO1xuICAgICAgcmVtb3ZlV2Vha0V2ZW50TGlzdGVuZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBWaWV3LnVubG9hZGVkRXZlbnQsIHRoaXMub25VbmxvYWRlZCwgdGhpcyk7XG4gICAgICB0aGlzLmV2ZW50c0JvdW5kID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgb25Mb2FkZWQoKSB7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIC8vIFdlaXJkbHkgbmdPbkluaXQgaXNuJ3QgY2FsbGVkIG9uIGlPUyBvbiBkZW1vIGFwcFxuICAgIC8vIE1hbmFnZWQgdG8gZ2V0IGl0IHdvcmtpbmcgb24gaU9TIHdoZW4gYXBwbHlpbmcgdG9cbiAgICAvLyBGbGV4Ym94TGF5b3V0LCBidXQgb24gdGhlIGRlbW8gYXBwLCB3ZSBhcHBseSB0byBhXG4gICAgLy8gTGFiZWwsIGFuZCwgZm9yIHRoYXQgY2FzZSwgbmdPbkluaXQgaXNuJ3QgY2FsbGVkXG5cbiAgICAvLyBUaGlzIGlzIGp1c3QgZW5mb3JjaW5nIHRoZSBEaXJlY3RpdmUgaXMgaW5pdGlhbGl6ZWRcbiAgICAvLyBiZWZvcmUgY2FsbGluZyB0aGlzLmFwcGx5U2hhZG93KClcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMubmdPbkluaXQoKTtcbiAgICB9XG4gICAgdGhpcy5hcHBseVNoYWRvdygpO1xuICAgIGlmIChpc0FuZHJvaWQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNOU0ZuID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Ll9yZWRyYXdOYXRpdmVCYWNrZ3JvdW5kOyAvLyBqdXN0IHRvIG1haW50YWluIGNvbXBhdGliaWxpdHkgd2l0aCBvdGhlciBwYXRjaGVzXG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuX3JlZHJhd05hdGl2ZUJhY2tncm91bmQgPSB0aGlzLm1vbmtleVBhdGNoO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkSW9zV3JhcHBlcigpIHtcbiAgICBpZiAoaXNJT1MpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudCBhcyBWaWV3O1xuXG4gICAgICB0aGlzLmlvc1NoYWRvd1JhcHBlciA9IHRoaXMucmVuZGVyLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdTdGFja0xheW91dCdcbiAgICAgICkgYXMgU3RhY2tMYXlvdXQ7XG5cbiAgICAgIC8vIHdyYXBwaW5nRWxlbWVudC5jc3NDbGFzc2VzID0gbWFpbkVsZW1lbnQuY3NzQ2xhc3NlcztcbiAgICAgIGNvbnN0IHBhcmVudCA9IG9yaWdpbmFsRWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgdGhpcy5yZW5kZXIuaW5zZXJ0QmVmb3JlKHBhcmVudCwgdGhpcy5pb3NTaGFkb3dSYXBwZXIsIG9yaWdpbmFsRWxlbWVudCk7XG4gICAgICB0aGlzLnJlbmRlci5yZW1vdmVDaGlsZChwYXJlbnQsIG9yaWdpbmFsRWxlbWVudCk7XG4gICAgICB0aGlzLnJlbmRlci5hcHBlbmRDaGlsZCh0aGlzLmlvc1NoYWRvd1JhcHBlciwgb3JpZ2luYWxFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBvblVubG9hZGVkKCkge1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuX3JlZHJhd05hdGl2ZUJhY2tncm91bmQgPSB0aGlzLm9yaWdpbmFsTlNGbjsgLy8gYWx3YXlzIHJldmVydCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kXG4gICAgfVxuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmFkZElvc1dyYXBwZXIoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmxvYWRlZCAmJlxuICAgICAgISFjaGFuZ2VzICYmXG4gICAgICAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZWxldmF0aW9uJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgncHJlc3NlZEVsZXZhdGlvbicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYXBlJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnYmdjb2xvcicpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Nvcm5lclJhZGl1cycpIHx8XG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3ByZXNzZWRUcmFuc2xhdGlvblonKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdmb3JjZVByZXNzQW5pbWF0aW9uJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgndHJhbnNsYXRpb25aJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnbWFza1RvQm91bmRzJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93Q29sb3InKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFkb3dPZmZzZXQnKSB8fFxuICAgICAgICBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdzaGFkb3dPcGFjaXR5JykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc2hhZG93UmFkaXVzJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgncmFzdGVyaXplJykgfHxcbiAgICAgICAgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgndXNlU2hhZG93TWFwJykpXG4gICAgKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3NoYWRvdycpICYmXG4gICAgICAgICFjaGFuZ2VzLmhhc093blByb3BlcnR5KCdlbGV2YXRpb24nKSAmJlxuICAgICAgICB0eXBlb2YgY2hhbmdlcy5zaGFkb3cuY3VycmVudFZhbHVlID09PSAnbnVtYmVyJ1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZWxldmF0aW9uID0gY2hhbmdlcy5zaGFkb3cuY3VycmVudFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXMuc2hhZG93ICYmIGNoYW5nZXMuc2hhZG93LmN1cnJlbnRWYWx1ZS5lbGV2YXRpb24pIHtcbiAgICAgICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21BbmRyb2lkRGF0YSh0aGlzLnNoYWRvdyBhcyBBbmRyb2lkRGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSU9TRGF0YSh0aGlzLnNoYWRvdyBhcyBJT1NEYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hcHBseVNoYWRvdygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbW9ua2V5UGF0Y2ggPSB2YWwgPT4ge1xuICAgIHRoaXMucHJldmlvdXNOU0ZuLmNhbGwodGhpcy5lbC5uYXRpdmVFbGVtZW50LCB2YWwpO1xuICAgIHRoaXMuYXBwbHlTaGFkb3coKTtcbiAgfTtcblxuICBwcml2YXRlIGFwcGx5U2hhZG93KCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuc2hhZG93ID09PSBudWxsIHx8XG4gICAgICB0aGlzLnNoYWRvdyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAodGhpcy5zaGFkb3cgPT09ICcnICYmICF0aGlzLmVsZXZhdGlvbilcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGb3Igc2hhZG93cyB0byBiZSBzaG93biBvbiBBbmRyb2lkIHRoZSBTREsgaGFzIHRvIGJlIGdyZWF0ZXJcbiAgICAvLyBvciBlcXVhbCB0aGFuIDIxLCBsb3dlciBTREsgbWVhbnMgbm8gc2V0RWxldmF0aW9uIG1ldGhvZCBpcyBhdmFpbGFibGVcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICBpZiAoYW5kcm9pZC5vcy5CdWlsZC5WRVJTSU9OLlNES19JTlQgPCAyMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgdmlld1RvQXBwbHlTaGFkb3dUbyA9IGlzSU9TXG4gICAgICA/IHRoaXMuaW9zU2hhZG93UmFwcGVyXG4gICAgICA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICh2aWV3VG9BcHBseVNoYWRvd1RvKSB7XG4gICAgICBTaGFkb3cuYXBwbHkodmlld1RvQXBwbHlTaGFkb3dUbywge1xuICAgICAgICBlbGV2YXRpb246IHRoaXMuZWxldmF0aW9uIGFzIG51bWJlcixcbiAgICAgICAgcHJlc3NlZEVsZXZhdGlvbjogdGhpcy5wcmVzc2VkRWxldmF0aW9uIGFzIG51bWJlcixcbiAgICAgICAgc2hhcGU6IHRoaXMuc2hhcGUsXG4gICAgICAgIGJnY29sb3I6IHRoaXMuYmdjb2xvcixcbiAgICAgICAgY29ybmVyUmFkaXVzOiB0aGlzLmNvcm5lclJhZGl1cyxcbiAgICAgICAgdHJhbnNsYXRpb25aOiB0aGlzLnRyYW5zbGF0aW9uWixcbiAgICAgICAgcHJlc3NlZFRyYW5zbGF0aW9uWjogdGhpcy5wcmVzc2VkVHJhbnNsYXRpb25aLFxuICAgICAgICBmb3JjZVByZXNzQW5pbWF0aW9uOiB0aGlzLmZvcmNlUHJlc3NBbmltYXRpb24sXG4gICAgICAgIG1hc2tUb0JvdW5kczogdGhpcy5tYXNrVG9Cb3VuZHMsXG4gICAgICAgIHNoYWRvd0NvbG9yOiB0aGlzLnNoYWRvd0NvbG9yLFxuICAgICAgICBzaGFkb3dPZmZzZXQ6IHRoaXMuc2hhZG93T2Zmc2V0IGFzIG51bWJlcixcbiAgICAgICAgc2hhZG93T3BhY2l0eTogdGhpcy5zaGFkb3dPcGFjaXR5IGFzIG51bWJlcixcbiAgICAgICAgc2hhZG93UmFkaXVzOiB0aGlzLnNoYWRvd1JhZGl1cyBhcyBudW1iZXIsXG4gICAgICAgIHJhc3Rlcml6ZTogdGhpcy5yYXN0ZXJpemUsXG4gICAgICAgIHVzZVNoYWRvd1BhdGg6IHRoaXMudXNlU2hhZG93UGF0aFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQ29tbW9uRGF0YSgpIHtcbiAgICBjb25zdCB0U2hhZG93ID0gdHlwZW9mIHRoaXMuc2hhZG93O1xuICAgIGlmICgodFNoYWRvdyA9PT0gJ3N0cmluZycgfHwgdFNoYWRvdyA9PT0gJ251bWJlcicpICYmICF0aGlzLmVsZXZhdGlvbikge1xuICAgICAgdGhpcy5lbGV2YXRpb24gPSB0aGlzLnNoYWRvdyA/IHBhcnNlSW50KHRoaXMuc2hhZG93IGFzIHN0cmluZywgMTApIDogMjtcbiAgICB9XG4gICAgY29uc3QgdEVsZXZhdGlvbiA9IHR5cGVvZiB0aGlzLmVsZXZhdGlvbjtcbiAgICBpZiAodEVsZXZhdGlvbiA9PT0gJ3N0cmluZycgfHwgdEVsZXZhdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuZWxldmF0aW9uID0gdGhpcy5lbGV2YXRpb25cbiAgICAgICAgPyBwYXJzZUludCh0aGlzLmVsZXZhdGlvbiBhcyBzdHJpbmcsIDEwKVxuICAgICAgICA6IDI7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQW5kcm9pZERhdGEoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNvcm5lclJhZGl1cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuY29ybmVyUmFkaXVzID0gcGFyc2VJbnQodGhpcy5jb3JuZXJSYWRpdXMsIDEwKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnRyYW5zbGF0aW9uWiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMudHJhbnNsYXRpb25aID0gcGFyc2VJbnQodGhpcy50cmFuc2xhdGlvblosIDEwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVJT1NEYXRhKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zaGFkb3dPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNoYWRvd09mZnNldCA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dPZmZzZXQpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMuc2hhZG93T3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc2hhZG93T3BhY2l0eSA9IHBhcnNlRmxvYXQodGhpcy5zaGFkb3dPcGFjaXR5KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNoYWRvd1JhZGl1cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc2hhZG93UmFkaXVzID0gcGFyc2VGbG9hdCh0aGlzLnNoYWRvd1JhZGl1cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkRnJvbUFuZHJvaWREYXRhKGRhdGE6IEFuZHJvaWREYXRhKSB7XG4gICAgdGhpcy5lbGV2YXRpb24gPSBkYXRhLmVsZXZhdGlvbiB8fCB0aGlzLmVsZXZhdGlvbjtcbiAgICB0aGlzLnNoYXBlID0gZGF0YS5zaGFwZSB8fCB0aGlzLnNoYXBlO1xuICAgIHRoaXMuYmdjb2xvciA9IGRhdGEuYmdjb2xvciB8fCB0aGlzLmJnY29sb3I7XG4gICAgdGhpcy5jb3JuZXJSYWRpdXMgPSBkYXRhLmNvcm5lclJhZGl1cyB8fCB0aGlzLmNvcm5lclJhZGl1cztcbiAgICB0aGlzLnRyYW5zbGF0aW9uWiA9IGRhdGEudHJhbnNsYXRpb25aIHx8IHRoaXMudHJhbnNsYXRpb25aO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkRnJvbUlPU0RhdGEoZGF0YTogSU9TRGF0YSkge1xuICAgIHRoaXMubWFza1RvQm91bmRzID0gZGF0YS5tYXNrVG9Cb3VuZHMgfHwgdGhpcy5tYXNrVG9Cb3VuZHM7XG4gICAgdGhpcy5zaGFkb3dDb2xvciA9IGRhdGEuc2hhZG93Q29sb3IgfHwgdGhpcy5zaGFkb3dDb2xvcjtcbiAgICB0aGlzLnNoYWRvd09mZnNldCA9IGRhdGEuc2hhZG93T2Zmc2V0IHx8IHRoaXMuc2hhZG93T2Zmc2V0O1xuICAgIHRoaXMuc2hhZG93T3BhY2l0eSA9IGRhdGEuc2hhZG93T3BhY2l0eSB8fCB0aGlzLnNoYWRvd09wYWNpdHk7XG4gICAgdGhpcy5zaGFkb3dSYWRpdXMgPSBkYXRhLnNoYWRvd1JhZGl1cyB8fCB0aGlzLnNoYWRvd1JhZGl1cztcbiAgICB0aGlzLnJhc3Rlcml6ZSA9IGRhdGEucmFzdGVyaXplIHx8IHRoaXMucmFzdGVyaXplO1xuICAgIHRoaXMudXNlU2hhZG93UGF0aCA9IGRhdGEudXNlU2hhZG93UGF0aCB8fCB0aGlzLnVzZVNoYWRvd1BhdGg7XG4gIH1cbn1cbiJdfQ==