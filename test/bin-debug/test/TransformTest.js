/**
 * Created by shaorui on 15-1-26.
 */
var TransformTest = (function (_super) {
    __extends(TransformTest, _super);
    function TransformTest() {
        _super.call(this);
        this.isMultiMode = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=TransformTest;p=c.prototype;
    p.onAddToStage = function (event) {
        var sky = util.createBitmapByName("bgImage");
        sky.name = "sky";
        sky.touchEnabled = true;
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.sky = sky;
        //icon
        var icon = util.createBitmapByName("egretIcon");
        icon.touchEnabled = true;
        icon.name = "icon";
        this.addChild(icon);
        icon.x = stageW / 2 - icon.width / 2;
        icon.y = stageH / 2 - 180;
        this.icon = icon;
        //console.log(this.icon.scaleX);
        //ui
        if (egret.MainContext.deviceType == egret.MainContext.DEVICE_PC) {
            var btn = new MyToggleButton();
            btn.addEventListener(egret.TouchEvent.TOUCH_END, this.toggleButtonHandler, this);
            this.addChild(btn);
            this.btn = btn;
        }
        this.txtLabel = new egret.TextField();
        this.txtLabel.y = 40;
        this.addChild(this.txtLabel);
        //test
        this.testGesture();
    };
    /**test for egret native touch*/
    p.toggleButtonHandler = function (evt) {
        this.isMultiMode = !this.isMultiMode;
        this.btn.setLabel(this.isMultiMode ? "多点模式" : "单点模式");
        neoges.GestureManager.simulateMultitouch = this.isMultiMode; //PC端测试多点操作用，手机测试请设置false
    };
    /**测试手势*/
    p.testGesture = function () {
        //设置
        if (egret.MainContext.deviceType == egret.MainContext.DEVICE_PC) {
            neoges.GestureManager.showTouchPoint = true; //PC端测试多点操作用，手机测试请设置false
        }
        //Pan (拖移，慢速移动)
        var tap6 = new neoges.PanGesture(this.icon);
        tap6.addEventListener(neoges.GestureEvent.BEGAN, this.onPanBegan, this);
        tap6.addEventListener(neoges.GestureEvent.UPDATE, this.onPanUpdate, this);
        tap6.addEventListener(neoges.GestureEvent.ENDED, this.onPanEnd, this);
        //Transform(变换)
        var tap8 = new neoges.TransformGesture(this.icon);
        tap8.addEventListener(neoges.GestureEvent.BEGAN, this.onTransformBegan, this);
        tap8.addEventListener(neoges.GestureEvent.UPDATE, this.onTransformUpdate, this);
        tap8.addEventListener(neoges.GestureEvent.ENDED, this.onTransformEnd, this);
    };
    /**pan*/
    p.onPanBegan = function (event) {
        //console.log("pan began on "+event.host.name);
        this.startPoint = new egret.Point(event.host.x, event.host.y);
    };
    /**pan*/
    p.onPanUpdate = function (event) {
        //console.log("rotation update ",event.value);
        event.host.x = this.startPoint.x + event.offsetX;
        event.host.y = this.startPoint.y + event.offsetY;
    };
    /**pan*/
    p.onPanEnd = function (event) {
        this.showMsg("pan end on " + event.host.name);
    };
    /**Transform*/
    p.onTransformBegan = function (event) {
        //console.log("transform began on "+event.host.name);
        this.startAnchorOffsetX = this.icon.anchorOffsetX;
        this.startAnchorOffsetY = this.icon.anchorOffsetY;
        this.onTransformUpdate(event);
    };
    /**Transform*/
    p.onTransformUpdate = function (event) {
        //console.log("transform update ",event.value);
        // Panning
        if (event.scale != 1 || event.rotation != 0) {
            // Scale and rotation.
            var loc = event.currentTarget.location;
            var par = this.icon.parent;
            var p1 = this.icon.localToGlobal(0, 0);
            var transformPoint = this.icon.globalToLocal(loc.x, loc.y);
            this.icon.anchorOffsetX = transformPoint.x;
            this.icon.anchorOffsetY = transformPoint.y;
            var p2 = this.icon.localToGlobal(0, 0);
            var offsetX = (p2.x - p1.x);
            var offsetY = (p2.y - p1.y);
            this.icon.x -= offsetX;
            this.icon.y -= offsetY;
            this.icon.rotation += event.rotation * 180 / Math.PI;
            //console.log(event.rotation);
            this.icon.scaleX = event.scale;
            this.icon.scaleY = this.icon.scaleX;
        }
    };
    /**Transform*/
    p.onTransformEnd = function (event) {
        this.showMsg("transform end on " + event.host.name);
        var p1 = this.icon.localToGlobal(0, 0);
        this.icon.anchorOffsetX = this.startAnchorOffsetX;
        this.icon.anchorOffsetY = this.startAnchorOffsetY;
        var p2 = this.icon.localToGlobal(0, 0);
        var offsetX = (p2.x - p1.x);
        var offsetY = (p2.y - p1.y);
        this.icon.x -= offsetX;
        this.icon.y -= offsetY;
    };
    /**不需要手势的时候，可以清理手势*/
    p.clearGesture = function (gestureInstance) {
        gestureInstance.dispose();
    };
    /**显示信息*/
    p.showMsg = function (value) {
        console.log(value);
        this.txtLabel.text = value;
    };
    return TransformTest;
})(egret.DisplayObjectContainer);
egret.registerClass(TransformTest,"TransformTest");
