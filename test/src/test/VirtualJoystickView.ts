class VirtualJoystickView extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.touchChildren = false;
        this.touchEnabled = true;
        this.width = 139;
        this.height = 137;
        
        this.createChildren();
    }
    
    private stick1:egret.Bitmap;
    private stick2:egret.Bitmap;
    private stickKnob:egret.Bitmap;
    private vjGesture:neoges.VirtualJoystickGesture;
    private stickKnobP:egret.Point;
    private centerP:egret.Point;
    public createChildren():void {
        var bm: egret.Bitmap = util.createBitmapByName("stick_1");
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
    }
    private vjBegan(e:neoges.GestureEvent):void {
        this.alpha = 1;
        this.stick2.visible = this.stickKnob.visible = true;
    }
    private vjUpdate(e:neoges.GestureEvent):void {
        this.stickKnob.x = this.stickKnobP.x + this.vjGesture.location.x - this.vjGesture.startP.x;
        this.stickKnob.y = this.stickKnobP.y + this.vjGesture.location.y - this.vjGesture.startP.y;
        egret.log(this.vjGesture.toString());
    }
    private vjEnded(e:neoges.GestureEvent):void {
        this.alpha = 0.4;
        this.stickKnob.x = this.stickKnobP.x;
        this.stickKnob.y = this.stickKnobP.y;
        this.stick2.visible = this.stickKnob.visible = false;
    }
}