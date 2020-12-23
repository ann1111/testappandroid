/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Color } from 'tns-core-modules/color';
import { ShapeEnum } from './shape.enum';
import { Length } from 'tns-core-modules/ui/page/page';
import { isAndroid, screen } from "tns-core-modules/platform";
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
export { Shadow };
if (false) {
    /** @type {?} */
    Shadow.DEFAULT_SHAPE;
    /** @type {?} */
    Shadow.DEFAULT_BGCOLOR;
    /** @type {?} */
    Shadow.DEFAULT_SHADOW_COLOR;
    /** @type {?} */
    Shadow.DEFAULT_PRESSED_ELEVATION;
    /** @type {?} */
    Shadow.DEFAULT_PRESSED_Z;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmF0aXZlc2NyaXB0LW5neC1zaGFkb3cvIiwic291cmNlcyI6WyJuYXRpdmVzY3JpcHQtbmd4LXNoYWRvdy9jb21tb24vc2hhZG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFJL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN6QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFTOUQsSUFBSSxhQUFhLENBQUM7O0FBQ2xCLElBQUksV0FBVyxDQUFDO0FBRWhCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDZCxhQUFhLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuRSxXQUFXLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ3JFOztBQUVELElBQU0sVUFBVSxHQUEyRSxFQUFFLENBQUM7Ozs7OztBQUU5RixxQkFBcUIsS0FBYSxFQUFFLEtBQWE7O0lBQy9DLElBQU0sU0FBUyxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDekMsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDO0tB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QU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2xvciB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvY29sb3InO1xuXG5pbXBvcnQgeyBBbmRyb2lkRGF0YSB9IGZyb20gXCIuL2FuZHJvaWQtZGF0YS5tb2RlbFwiO1xuaW1wb3J0IHsgSU9TRGF0YSB9IGZyb20gXCIuL2lvcy1kYXRhLm1vZGVsXCI7XG5pbXBvcnQgeyBTaGFwZUVudW0gfSBmcm9tICcuL3NoYXBlLmVudW0nO1xuaW1wb3J0IHsgTGVuZ3RoIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9wYWdlL3BhZ2UnO1xuaW1wb3J0IHsgaXNBbmRyb2lkLCBzY3JlZW4gfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuXG5kZWNsYXJlIGNvbnN0IGFuZHJvaWQ6IGFueTtcbmRlY2xhcmUgY29uc3QgamF2YTogYW55O1xuZGVjbGFyZSBjb25zdCBDR1NpemVNYWtlOiBhbnk7XG5kZWNsYXJlIGNvbnN0IFVJU2NyZWVuOiBhbnk7XG5kZWNsYXJlIGNvbnN0IEFycmF5OiBhbnk7XG5kZWNsYXJlIGNvbnN0IFVJQmV6aWVyUGF0aDogYW55O1xuXG5sZXQgTGF5ZXJlZFNoYWRvdztcbmxldCBQbGFpblNoYWRvdztcblxuaWYgKGlzQW5kcm9pZCkge1xuICBMYXllcmVkU2hhZG93ID0gYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5MYXllckRyYXdhYmxlLmV4dGVuZCh7fSk7XG4gIFBsYWluU2hhZG93ID0gYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5HcmFkaWVudERyYXdhYmxlLmV4dGVuZCh7fSk7XG59XG5cbmNvbnN0IGNsYXNzQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiB7IGNsYXNzOiBhbnksIGZpZWxkQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiBudW1iZXIgfSB9IH0gPSB7fTtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9OYXRpdmVTY3JpcHQvYW5kcm9pZC1ydW50aW1lL2lzc3Vlcy8xMzMwXG5mdW5jdGlvbiBnZXRBbmRyb2lkUihydHlwZTogc3RyaW5nLCBmaWVsZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgY2xhc3NOYW1lID0gXCJhbmRyb2lkLlIkXCIgKyBydHlwZTtcbiAgaWYgKCFjbGFzc0NhY2hlLmhhc093blByb3BlcnR5KGNsYXNzTmFtZSkpIHtcbiAgICBjbGFzc0NhY2hlW2NsYXNzTmFtZV0gPSB7XG4gICAgICBjbGFzczogamF2YS5sYW5nLkNsYXNzLmZvck5hbWUoY2xhc3NOYW1lKSxcbiAgICAgIGZpZWxkQ2FjaGU6IHt9XG4gICAgfTtcbiAgfVxuICBpZighY2xhc3NDYWNoZVtjbGFzc05hbWVdLmZpZWxkQ2FjaGUuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgY2xhc3NDYWNoZVtjbGFzc05hbWVdLmZpZWxkQ2FjaGVbZmllbGRdID0gK2NsYXNzQ2FjaGVbY2xhc3NOYW1lXS5jbGFzcy5nZXRGaWVsZChmaWVsZCkuZ2V0KG51bGwpO1xuICB9XG4gIHJldHVybiBjbGFzc0NhY2hlW2NsYXNzTmFtZV0uZmllbGRDYWNoZVtmaWVsZF07XG59XG5cbmV4cG9ydCBjbGFzcyBTaGFkb3cge1xuICBzdGF0aWMgREVGQVVMVF9TSEFQRSA9IFNoYXBlRW51bS5SRUNUQU5HTEU7XG4gIHN0YXRpYyBERUZBVUxUX0JHQ09MT1IgPSAnI0ZGRkZGRic7XG4gIHN0YXRpYyBERUZBVUxUX1NIQURPV19DT0xPUiA9ICcjMDAwMDAwJztcbiAgc3RhdGljIERFRkFVTFRfUFJFU1NFRF9FTEVWQVRJT04gPSAyO1xuICBzdGF0aWMgREVGQVVMVF9QUkVTU0VEX1ogPSA0O1xuXG4gIHN0YXRpYyBhcHBseSh0bnNWaWV3OiBhbnksIGRhdGE6IElPU0RhdGEgfCBBbmRyb2lkRGF0YSkge1xuICAgIGNvbnN0IExPTExJUE9QID0gMjE7XG4gICAgaWYgKFxuICAgICAgdG5zVmlldy5hbmRyb2lkICYmXG4gICAgICBhbmRyb2lkLm9zLkJ1aWxkLlZFUlNJT04uU0RLX0lOVCA+PSBMT0xMSVBPUFxuICAgICkge1xuICAgICAgU2hhZG93LmFwcGx5T25BbmRyb2lkKHRuc1ZpZXcsIFNoYWRvdy5nZXREZWZhdWx0cyhkYXRhKSk7XG4gICAgfSBlbHNlIGlmICh0bnNWaWV3Lmlvcykge1xuICAgICAgU2hhZG93LmFwcGx5T25JT1ModG5zVmlldywgU2hhZG93LmdldERlZmF1bHRzKGRhdGEpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXREZWZhdWx0cyhkYXRhOiBJT1NEYXRhIHwgQW5kcm9pZERhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgZGF0YSxcbiAgICAgIHtcbiAgICAgICAgc2hhcGU6IChkYXRhIGFzIEFuZHJvaWREYXRhKS5zaGFwZSB8fCBTaGFkb3cuREVGQVVMVF9TSEFQRSxcbiAgICAgICAgcHJlc3NlZEVsZXZhdGlvbjogKGRhdGEgYXMgQW5kcm9pZERhdGEpLnByZXNzZWRFbGV2YXRpb24gfHwgU2hhZG93LkRFRkFVTFRfUFJFU1NFRF9FTEVWQVRJT04sXG4gICAgICAgIHByZXNzZWRUcmFuc2xhdGlvblo6IChkYXRhIGFzIEFuZHJvaWREYXRhKS5wcmVzc2VkVHJhbnNsYXRpb25aIHx8IFNoYWRvdy5ERUZBVUxUX1BSRVNTRURfRUxFVkFUSU9OLFxuICAgICAgICBzaGFkb3dDb2xvcjogKGRhdGEgYXMgSU9TRGF0YSkuc2hhZG93Q29sb3IgfHxcbiAgICAgICAgICBTaGFkb3cuREVGQVVMVF9TSEFET1dfQ09MT1IsXG4gICAgICAgIHVzZVNoYWRvd1BhdGg6ICgoZGF0YSBhcyBJT1NEYXRhKS51c2VTaGFkb3dQYXRoICE9PSB1bmRlZmluZWQgPyAoZGF0YSBhcyBJT1NEYXRhKS51c2VTaGFkb3dQYXRoIDogdHJ1ZSksXG4gICAgICAgIHJhc3Rlcml6ZTogKChkYXRhIGFzIElPU0RhdGEpLnJhc3Rlcml6ZSAhPT0gdW5kZWZpbmVkID8gKGRhdGEgYXMgSU9TRGF0YSkucmFzdGVyaXplIDogZmFsc2UpXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBpc1NoYWRvdyhkcmF3YWJsZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChkcmF3YWJsZSBpbnN0YW5jZW9mIExheWVyZWRTaGFkb3cgfHwgZHJhd2FibGUgaW5zdGFuY2VvZiBQbGFpblNoYWRvdyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBhcHBseU9uQW5kcm9pZCh0bnNWaWV3OiBhbnksIGRhdGE6IEFuZHJvaWREYXRhKSB7XG4gICAgY29uc3QgbmF0aXZlVmlldyA9IHRuc1ZpZXcuYW5kcm9pZDtcbiAgICBsZXQgc2hhcGU7XG4gICAgbGV0IG92ZXJyaWRlQmFja2dyb3VuZCA9IHRydWU7XG5cblxuICAgIGxldCBjdXJyZW50QmcgPSBuYXRpdmVWaWV3LmdldEJhY2tncm91bmQoKTtcblxuICAgIGlmIChjdXJyZW50QmcgaW5zdGFuY2VvZiBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLlJpcHBsZURyYXdhYmxlKSB7IC8vIHBsYXkgbmljZSBpZiBhIHJpcHBsZSBpcyB3cmFwcGluZyBhIHNoYWRvd1xuICAgICAgbGV0IHJpcHBsZUJnID0gY3VycmVudEJnLmdldERyYXdhYmxlKDApO1xuICAgICAgaWYgKHJpcHBsZUJnIGluc3RhbmNlb2YgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5JbnNldERyYXdhYmxlKSB7XG4gICAgICAgIG92ZXJyaWRlQmFja2dyb3VuZCA9IGZhbHNlOyAvLyB0aGlzIGlzIGEgYnV0dG9uIHdpdGggaXQncyBvd24gc2hhZG93XG4gICAgICB9IGVsc2UgaWYgKFNoYWRvdy5pc1NoYWRvdyhyaXBwbGVCZykpIHsgLy8gaWYgdGhlIHJpcHBsZSBpcyB3cmFwcGluZyBhIHNoYWRvdywgc3RyaXAgaXRcbiAgICAgICAgY3VycmVudEJnID0gcmlwcGxlQmc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvdmVycmlkZUJhY2tncm91bmQpIHtcbiAgICAgIGlmIChTaGFkb3cuaXNTaGFkb3coY3VycmVudEJnKSkgeyAvLyBtYWtlIHN1cmUgdG8gaGF2ZSB0aGUgcmlnaHQgYmFja2dyb3VuZFxuICAgICAgICBjdXJyZW50QmcgPSBjdXJyZW50QmcgaW5zdGFuY2VvZiBMYXllcmVkU2hhZG93ID8gLy8gaWYgbGF5ZXJlZCwgZ2V0IHRoZSBvcmlnaW5hbCBiYWNrZ3JvdW5kXG4gICAgICAgICAgY3VycmVudEJnLmdldERyYXdhYmxlKDEpIDogbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3V0ZXJSYWRpaSA9IEFycmF5LmNyZWF0ZShcImZsb2F0XCIsIDgpO1xuICAgICAgaWYgKGRhdGEuY29ybmVyUmFkaXVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3V0ZXJSYWRpaVswXSA9IG91dGVyUmFkaWlbMV0gPSBMZW5ndGgudG9EZXZpY2VQaXhlbHModG5zVmlldy5ib3JkZXJUb3BMZWZ0UmFkaXVzLCAwKTtcbiAgICAgICAgb3V0ZXJSYWRpaVsyXSA9IG91dGVyUmFkaWlbM10gPSBMZW5ndGgudG9EZXZpY2VQaXhlbHModG5zVmlldy5ib3JkZXJUb3BSaWdodFJhZGl1cywgMCk7XG4gICAgICAgIG91dGVyUmFkaWlbNF0gPSBvdXRlclJhZGlpWzVdID0gTGVuZ3RoLnRvRGV2aWNlUGl4ZWxzKHRuc1ZpZXcuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMsIDApO1xuICAgICAgICBvdXRlclJhZGlpWzZdID0gb3V0ZXJSYWRpaVs3XSA9IExlbmd0aC50b0RldmljZVBpeGVscyh0bnNWaWV3LmJvcmRlckJvdHRvbUxlZnRSYWRpdXMsIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgamF2YS51dGlsLkFycmF5cy5maWxsKG91dGVyUmFkaWksIFNoYWRvdy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLmNvcm5lclJhZGl1cyBhcyBudW1iZXIpKTtcbiAgICAgIH1cblxuICAgICAgLy8gdXNlIHRoZSB1c2VyIGRlZmluZWQgY29sb3Igb3IgdGhlIGRlZmF1bHQgaW4gY2FzZSB0aGUgY29sb3IgaXMgVFJBTlNQQVJFTlRcbiAgICAgIGNvbnN0IGJnQ29sb3IgPSBjdXJyZW50QmcgP1xuICAgICAgICAoY3VycmVudEJnIGluc3RhbmNlb2YgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5Db2xvckRyYXdhYmxlICYmIGN1cnJlbnRCZy5nZXRDb2xvcigpID9cbiAgICAgICAgICBjdXJyZW50QmcuZ2V0Q29sb3IoKSA6IGFuZHJvaWQuZ3JhcGhpY3MuQ29sb3IucGFyc2VDb2xvcihkYXRhLmJnY29sb3IgfHwgU2hhZG93LkRFRkFVTFRfQkdDT0xPUikpIDpcbiAgICAgICAgYW5kcm9pZC5ncmFwaGljcy5Db2xvci5wYXJzZUNvbG9yKGRhdGEuYmdjb2xvciB8fCBTaGFkb3cuREVGQVVMVF9CR0NPTE9SKTtcblxuICAgICAgbGV0IG5ld0JnO1xuXG4gICAgICBpZiAoZGF0YS5zaGFwZSAhPT0gU2hhcGVFbnVtLlJFQ1RBTkdMRSB8fCBkYXRhLmJnY29sb3IgfHwgIWN1cnJlbnRCZykgeyAvLyByZXBsYWNlIGJhY2tncm91bmRcbiAgICAgICAgc2hhcGUgPSBuZXcgUGxhaW5TaGFkb3coKTtcbiAgICAgICAgc2hhcGUuc2V0U2hhcGUoXG4gICAgICAgICAgYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5HcmFkaWVudERyYXdhYmxlW2RhdGEuc2hhcGVdLFxuICAgICAgICApO1xuICAgICAgICBzaGFwZS5zZXRDb3JuZXJSYWRpaShvdXRlclJhZGlpKTtcbiAgICAgICAgc2hhcGUuc2V0Q29sb3IoYmdDb2xvcik7XG4gICAgICAgIG5ld0JnID0gc2hhcGU7XG4gICAgICB9IGVsc2UgeyAvLyBhZGQgYSBsYXllclxuICAgICAgICBjb25zdCByID0gbmV3IGFuZHJvaWQuZ3JhcGhpY3MuZHJhd2FibGUuc2hhcGVzLlJvdW5kUmVjdFNoYXBlKG91dGVyUmFkaWksIG51bGwsIG51bGwpO1xuICAgICAgICBzaGFwZSA9IG5ldyBhbmRyb2lkLmdyYXBoaWNzLmRyYXdhYmxlLlNoYXBlRHJhd2FibGUocik7XG4gICAgICAgIHNoYXBlLmdldFBhaW50KCkuc2V0Q29sb3IoYmdDb2xvcik7XG4gICAgICAgIHZhciBhcnIgPSBBcnJheS5jcmVhdGUoYW5kcm9pZC5ncmFwaGljcy5kcmF3YWJsZS5EcmF3YWJsZSwgMik7XG4gICAgICAgIGFyclswXSA9IHNoYXBlO1xuICAgICAgICBhcnJbMV0gPSBjdXJyZW50Qmc7XG4gICAgICAgIGNvbnN0IGRyYXdhYmxlID0gbmV3IExheWVyZWRTaGFkb3coYXJyKTtcbiAgICAgICAgbmV3QmcgPSBkcmF3YWJsZTtcbiAgICAgIH1cblxuICAgICAgbmF0aXZlVmlldy5zZXRCYWNrZ3JvdW5kRHJhd2FibGUobmV3QmcpO1xuICAgIH1cblxuICAgIG5hdGl2ZVZpZXcuc2V0RWxldmF0aW9uKFxuICAgICAgU2hhZG93LmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEuZWxldmF0aW9uIGFzIG51bWJlciksXG4gICAgKTtcbiAgICBuYXRpdmVWaWV3LnNldFRyYW5zbGF0aW9uWihcbiAgICAgIFNoYWRvdy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLnRyYW5zbGF0aW9uWiBhcyBudW1iZXIpLFxuICAgICk7XG4gICAgaWYgKG5hdGl2ZVZpZXcuZ2V0U3RhdGVMaXN0QW5pbWF0b3IoKSB8fCBkYXRhLmZvcmNlUHJlc3NBbmltYXRpb24pIHtcbiAgICAgIHRoaXMub3ZlcnJpZGVEZWZhdWx0QW5pbWF0b3IobmF0aXZlVmlldywgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgb3ZlcnJpZGVEZWZhdWx0QW5pbWF0b3IobmF0aXZlVmlldzogYW55LCBkYXRhOiBBbmRyb2lkRGF0YSkge1xuICAgIGNvbnN0IHNsYSA9IG5ldyBhbmRyb2lkLmFuaW1hdGlvbi5TdGF0ZUxpc3RBbmltYXRvcigpO1xuXG4gICAgY29uc3QgT2JqZWN0QW5pbWF0b3IgPSBhbmRyb2lkLmFuaW1hdGlvbi5PYmplY3RBbmltYXRvcjtcbiAgICBjb25zdCBBbmltYXRvclNldCA9IGFuZHJvaWQuYW5pbWF0aW9uLkFuaW1hdG9yU2V0O1xuICAgIGNvbnN0IHNob3J0QW5pbVRpbWUgPSBnZXRBbmRyb2lkUihcImludGVnZXJcIiwgXCJjb25maWdfc2hvcnRBbmltVGltZVwiKTtcblxuICAgIGNvbnN0IGJ1dHRvbkR1cmF0aW9uID1cbiAgICAgIG5hdGl2ZVZpZXcuZ2V0Q29udGV4dCgpLmdldFJlc291cmNlcygpLmdldEludGVnZXIoc2hvcnRBbmltVGltZSkgLyAyO1xuICAgIGNvbnN0IHByZXNzZWRFbGV2YXRpb24gPSB0aGlzLmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEucHJlc3NlZEVsZXZhdGlvbik7XG4gICAgY29uc3QgcHJlc3NlZFogPSB0aGlzLmFuZHJvaWREaXBUb1B4KG5hdGl2ZVZpZXcsIGRhdGEucHJlc3NlZFRyYW5zbGF0aW9uWik7XG4gICAgY29uc3QgZWxldmF0aW9uID0gdGhpcy5hbmRyb2lkRGlwVG9QeChuYXRpdmVWaWV3LCBkYXRhLmVsZXZhdGlvbik7XG4gICAgY29uc3QgeiA9IHRoaXMuYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldywgZGF0YS50cmFuc2xhdGlvblogfHwgMCk7XG5cbiAgICBjb25zdCBwcmVzc2VkU2V0ID0gbmV3IEFuaW1hdG9yU2V0KCk7XG4gICAgY29uc3Qgbm90UHJlc3NlZFNldCA9IG5ldyBBbmltYXRvclNldCgpO1xuICAgIGNvbnN0IGRlZmF1bHRTZXQgPSBuZXcgQW5pbWF0b3JTZXQoKTtcblxuICAgIHByZXNzZWRTZXQucGxheVRvZ2V0aGVyKGphdmEudXRpbC5BcnJheXMuYXNMaXN0KFtcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJ0cmFuc2xhdGlvblpcIiwgW3ByZXNzZWRaXSlcbiAgICAgICAgLnNldER1cmF0aW9uKGJ1dHRvbkR1cmF0aW9uKSxcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJlbGV2YXRpb25cIiwgW3ByZXNzZWRFbGV2YXRpb25dKVxuICAgICAgICAuc2V0RHVyYXRpb24oMCksXG4gICAgXSkpO1xuICAgIG5vdFByZXNzZWRTZXQucGxheVRvZ2V0aGVyKGphdmEudXRpbC5BcnJheXMuYXNMaXN0KFtcbiAgICAgIE9iamVjdEFuaW1hdG9yLm9mRmxvYXQobmF0aXZlVmlldywgXCJ0cmFuc2xhdGlvblpcIiwgW3pdKVxuICAgICAgICAuc2V0RHVyYXRpb24oYnV0dG9uRHVyYXRpb24pLFxuICAgICAgT2JqZWN0QW5pbWF0b3Iub2ZGbG9hdChuYXRpdmVWaWV3LCBcImVsZXZhdGlvblwiLCBbZWxldmF0aW9uXSlcbiAgICAgICAgLnNldER1cmF0aW9uKDApLFxuICAgIF0pKTtcbiAgICBkZWZhdWx0U2V0LnBsYXlUb2dldGhlcihqYXZhLnV0aWwuQXJyYXlzLmFzTGlzdChbXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwidHJhbnNsYXRpb25aXCIsIFswXSkuc2V0RHVyYXRpb24oMCksXG4gICAgICBPYmplY3RBbmltYXRvci5vZkZsb2F0KG5hdGl2ZVZpZXcsIFwiZWxldmF0aW9uXCIsIFswXSkuc2V0RHVyYXRpb24oMCksXG4gICAgXSkpO1xuXG4gICAgc2xhLmFkZFN0YXRlKFxuICAgICAgW2dldEFuZHJvaWRSKFwiYXR0clwiLCBcInN0YXRlX3ByZXNzZWRcIiksIGdldEFuZHJvaWRSKFwiYXR0clwiLCBcInN0YXRlX2VuYWJsZWRcIildLFxuICAgICAgcHJlc3NlZFNldCxcbiAgICApO1xuICAgIHNsYS5hZGRTdGF0ZShbZ2V0QW5kcm9pZFIoXCJhdHRyXCIsIFwic3RhdGVfZW5hYmxlZFwiKV0sIG5vdFByZXNzZWRTZXQpO1xuICAgIHNsYS5hZGRTdGF0ZShbXSwgZGVmYXVsdFNldCk7XG4gICAgbmF0aXZlVmlldy5zZXRTdGF0ZUxpc3RBbmltYXRvcihzbGEpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgYXBwbHlPbklPUyh0bnNWaWV3OiBhbnksIGRhdGE6IElPU0RhdGEpIHtcbiAgICBjb25zdCBuYXRpdmVWaWV3ID0gdG5zVmlldy5pb3M7XG4gICAgY29uc3QgZWxldmF0aW9uID0gcGFyc2VGbG9hdCgoKGRhdGEuZWxldmF0aW9uIGFzIG51bWJlcikgLSAwKS50b0ZpeGVkKDIpKTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLm1hc2tUb0JvdW5kcyA9IGZhbHNlO1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93Q29sb3IgPSBuZXcgQ29sb3IoZGF0YS5zaGFkb3dDb2xvcikuaW9zLkNHQ29sb3I7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dPZmZzZXQgPVxuICAgICAgZGF0YS5zaGFkb3dPZmZzZXQgP1xuICAgICAgICBDR1NpemVNYWtlKDAsIHBhcnNlRmxvYXQoU3RyaW5nKGRhdGEuc2hhZG93T2Zmc2V0KSkpIDpcbiAgICAgICAgQ0dTaXplTWFrZSgwLCAwLjU0ICogZWxldmF0aW9uIC0gMC4xNCk7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaGFkb3dPcGFjaXR5ID1cbiAgICAgIGRhdGEuc2hhZG93T3BhY2l0eSA/XG4gICAgICAgIHBhcnNlRmxvYXQoU3RyaW5nKGRhdGEuc2hhZG93T3BhY2l0eSkpIDpcbiAgICAgICAgMC4wMDYgKiBlbGV2YXRpb24gKyAwLjI1O1xuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93UmFkaXVzID1cbiAgICAgIGRhdGEuc2hhZG93UmFkaXVzID9cbiAgICAgICAgcGFyc2VGbG9hdChTdHJpbmcoZGF0YS5zaGFkb3dSYWRpdXMpKSA6XG4gICAgICAgIDAuNjYgKiBlbGV2YXRpb24gLSAwLjU7XG4gICAgbmF0aXZlVmlldy5sYXllci5zaG91bGRSYXN0ZXJpemUgPSBkYXRhLnJhc3Rlcml6ZTtcbiAgICBuYXRpdmVWaWV3LmxheWVyLnJhc3Rlcml6YXRpb25TY2FsZSA9IHNjcmVlbi5tYWluU2NyZWVuLnNjYWxlO1xuICAgIGxldCBzaGFkb3dQYXRoID0gbnVsbDtcbiAgICBpZiAoZGF0YS51c2VTaGFkb3dQYXRoKSB7XG4gICAgICBzaGFkb3dQYXRoID0gVUlCZXppZXJQYXRoLmJlemllclBhdGhXaXRoUm91bmRlZFJlY3RDb3JuZXJSYWRpdXMobmF0aXZlVmlldy5ib3VuZHMsIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93UmFkaXVzKS5jZ1BhdGg7XG4gICAgfVxuICAgIG5hdGl2ZVZpZXcubGF5ZXIuc2hhZG93UGF0aCA9IHNoYWRvd1BhdGg7XG4gIH1cblxuICBzdGF0aWMgYW5kcm9pZERpcFRvUHgobmF0aXZlVmlldzogYW55LCBkaXA6IG51bWJlcikge1xuICAgIGNvbnN0IG1ldHJpY3MgPSBuYXRpdmVWaWV3LmdldENvbnRleHQoKS5nZXRSZXNvdXJjZXMoKS5nZXREaXNwbGF5TWV0cmljcygpO1xuICAgIHJldHVybiBhbmRyb2lkLnV0aWwuVHlwZWRWYWx1ZS5hcHBseURpbWVuc2lvbihcbiAgICAgIGFuZHJvaWQudXRpbC5UeXBlZFZhbHVlLkNPTVBMRVhfVU5JVF9ESVAsXG4gICAgICBkaXAsXG4gICAgICBtZXRyaWNzLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==