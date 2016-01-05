var VirtualJoystickView = (function (_super) {
    __extends(VirtualJoystickView, _super);
    function VirtualJoystickView() {
        _super.call(this);
        this.touchChildren = false;
        this.touchEnabled = true;
        this.width = 139;
        this.height = 137;
        this.createChildren();
    }
    var d = __define,c=VirtualJoystickView,p=c.prototype;
    p.createChildren = function () {
        var bm = util.createBitmapByName("stick_1");
        bm.x = 0;
        bm.y = 0;
        this.addChild(bm);
        this.stick1 = bm;
        bm = util.createBitmapByName("stick_2");
        bm.x = 17;
        bm.y = 18;
        this.addChild(bm);
        this.stick2 = bm;
        bm = util.createBitmapByName("stick_knob");
        bm.x = 26;
        bm.y = 28;
        this.addChild(bm);
        this.stickKnob = bm;
        this.centerP = new egret.Point();
        this.centerP.setTo(this.width / 2, this.height / 2);
        this.stickKnobP = new egret.Point();
        this.stickKnobP.setTo(this.stickKnob.x, this.stickKnob.y);
        this.vjEnded(null);
        this.vjGesture = new neoges.VirtualJoystickGesture(this);
        this.vjGesture.centerP = this.centerP;
        this.vjGesture.addEventListener(neoges.GestureEvent.BEGAN, this.vjBegan, this);
        this.vjGesture.addEventListener(neoges.GestureEvent.UPDATE, this.vjUpdate, this);
        this.vjGesture.addEventListener(neoges.GestureEvent.ENDED, this.vjEnded, this);
    };
    p.vjBegan = function (e) {
        this.alpha = 1;
        this.stick2.visible = this.stickKnob.visible = true;
    };
    p.vjUpdate = function (e) {
        this.stickKnob.x = this.stickKnobP.x + this.vjGesture.location.x - this.vjGesture.startP.x;
        this.stickKnob.y = this.stickKnobP.y + this.vjGesture.location.y - this.vjGesture.startP.y;
        egret.log(this.vjGesture.toString());
    };
    p.vjEnded = function (e) {
        this.alpha = 0.4;
        this.stickKnob.x = this.stickKnobP.x;
        this.stickKnob.y = this.stickKnobP.y;
        this.stick2.visible = this.stickKnob.visible = false;
    };
    return VirtualJoystickView;
})(egret.DisplayObjectContainer);
egret.registerClass(VirtualJoystickView,'VirtualJoystickView');
