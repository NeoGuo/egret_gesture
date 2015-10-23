/**
 * Created by shaorui on 15-1-26.
 */
var MainTest = (function (_super) {
    __extends(MainTest, _super);
    function MainTest() {
        _super.call(this);
        this.isMultiMode = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=MainTest;p=c.prototype;
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
        icon.anchorOffsetX = icon.width / 2;
        icon.anchorOffsetY = icon.height / 2;
        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 180;
        icon.scaleX = 1.2;
        icon.scaleY = 1.2;
        this.icon = icon;
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
        //Tap(点一下)
        var tap = new neoges.TapGesture(this.sky);
        tap.addEventListener(neoges.GestureEvent.ENDED, this.onTap, this);
        //Double Tap (双击)
        var tap2 = new neoges.DoubleTapGesture(this.sky);
        tap2.addEventListener(neoges.GestureEvent.ENDED, this.onDoubleTap, this);
        //Pinch(二指往內或往外拨动，平时经常用到的缩放)
        var tap3 = new neoges.PinchGesture(this.icon);
        tap3.addEventListener(neoges.GestureEvent.BEGAN, this.onPinchBegan, this);
        tap3.addEventListener(neoges.GestureEvent.UPDATE, this.onPinchUpdate, this);
        tap3.addEventListener(neoges.GestureEvent.ENDED, this.onPinchEnd, this);
        console.log("tap3 here");
        //Rotation(旋转)
        var tap4 = new neoges.RotationGesture(this.icon);
        tap4.addEventListener(neoges.GestureEvent.BEGAN, this.onRotationBegan, this);
        tap4.addEventListener(neoges.GestureEvent.UPDATE, this.onRotationUpdate, this);
        tap4.addEventListener(neoges.GestureEvent.ENDED, this.onRotationEnd, this);
        //Swipe(滑动，快速移动)
        var tap5 = new neoges.SwipeGesture(this.sky);
        tap5.addEventListener(neoges.GestureEvent.ENDED, this.onSwipeEnd, this);
        //Pan (拖移，慢速移动)
        var tap6 = new neoges.PanGesture(this.icon);
        tap6.addEventListener(neoges.GestureEvent.BEGAN, this.onPanBegan, this);
        tap6.addEventListener(neoges.GestureEvent.UPDATE, this.onPanUpdate, this);
        tap6.addEventListener(neoges.GestureEvent.ENDED, this.onPanEnd, this);
        //LongPress(长按)
        var tap7 = new neoges.LongPressGesture(this.sky);
        tap7.addEventListener(neoges.GestureEvent.ENDED, this.onLongPressEnd, this);
    };
    /**on tap*/
    p.onTap = function (event) {
        this.showMsg("tap on " + event.host.name);
    };
    /**on double tap*/
    p.onDoubleTap = function (event) {
        this.showMsg("double tap on " + event.host.name);
    };
    /**swipe*/
    p.onSwipeEnd = function (event) {
        this.showMsg("swipe " + event.offsetX + "," + event.offsetY);
    };
    /**long press*/
    p.onLongPressEnd = function (event) {
        this.showMsg("long press on " + event.host.name);
    };
    /**pinch*/
    p.onPinchBegan = function (event) {
        this.showMsg("pinch began on " + event.host.name);
        this.startScaleValue = this.icon.scaleX;
    };
    /**pinch*/
    p.onPinchUpdate = function (event) {
        //console.log("pinch update "+event.value);
        this.icon.scaleX = this.startScaleValue * event.value;
        this.icon.scaleY = this.icon.scaleX;
    };
    /**pinch*/
    p.onPinchEnd = function (event) {
        this.showMsg("pinch end on " + event.host.name);
    };
    /**rotation*/
    p.onRotationBegan = function (event) {
        //console.log("rotation began on "+event.host.name);
        this.startRotationValue = this.icon.rotation;
    };
    /**rotation*/
    p.onRotationUpdate = function (event) {
        //console.log("rotation update ",event.value);
        this.icon.rotation = this.startRotationValue + event.value;
    };
    /**rotation*/
    p.onRotationEnd = function (event) {
        this.showMsg("rotation end on " + event.host.name);
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
        //this.showMsg("pan end on "+event.host.name);
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
    return MainTest;
})(egret.DisplayObjectContainer);
egret.registerClass(MainTest,"MainTest");
var MyToggleButton = (function (_super) {
    __extends(MyToggleButton, _super);
    function MyToggleButton() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.touchChildren = false;
        this.touchEnabled = true;
    }
    var d = __define,c=MyToggleButton;p=c.prototype;
    p.setLabel = function (value) {
        this.txt.text = value;
    };
    p.onAddToStage = function (event) {
        var g = this.graphics;
        g.beginFill(0xFF0000, 1);
        g.drawRoundRect(0, 0, 150, 40, 8, 8);
        g.endFill();
        this.txt = new egret.TextField();
        this.txt.text = "单点模式";
        this.txt.x = 14;
        this.txt.y = 4;
        this.addChild(this.txt);
    };
    return MyToggleButton;
})(egret.Sprite);
egret.registerClass(MyToggleButton,"MyToggleButton");
