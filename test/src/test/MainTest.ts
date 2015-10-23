/**
 * Created by shaorui on 15-1-26.
 */
class MainTest extends egret.DisplayObjectContainer
{
    /**测试用图*/
    private sky:egret.Bitmap;
    /**测试用图*/
    private icon:egret.Bitmap;
    /**测试按钮*/
    private btn:MyToggleButton;

    private startScaleValue:number;
    private startRotationValue:number;
    private startPoint:egret.Point;
    private isMultiMode:boolean = false;
    private txtLabel:egret.TextField;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        var sky: egret.Bitmap = util.createBitmapByName("bgImage");
        sky.name = "sky";
        sky.touchEnabled = true;
        this.addChild(sky);
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.sky = sky;
        //icon
        var icon: egret.Bitmap = util.createBitmapByName("egretIcon");
        icon.touchEnabled = true;
        icon.name = "icon";
        icon.anchorOffsetX = icon.width/2;
        icon.anchorOffsetY = icon.height/2;
        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 180;
        icon.scaleX = 1.2;
        icon.scaleY = 1.2;
        this.icon = icon;
        //ui
        if(egret.MainContext.deviceType == egret.MainContext.DEVICE_PC) {
            var btn:MyToggleButton = new MyToggleButton();
            btn.addEventListener(egret.TouchEvent.TOUCH_END,this.toggleButtonHandler,this);
            this.addChild(btn);
            this.btn = btn;
        }
        this.txtLabel = new egret.TextField();
        this.txtLabel.y = 40;
        this.addChild(this.txtLabel);
        //test
        this.testGesture();
    }
    /**test for egret native touch*/
    private toggleButtonHandler(evt:egret.TouchEvent):void {
        this.isMultiMode = !this.isMultiMode;
        this.btn.setLabel(this.isMultiMode?"多点模式":"单点模式");
        neoges.GestureManager.simulateMultitouch = this.isMultiMode;//PC端测试多点操作用，手机测试请设置false
    }
    /**测试手势*/
    private testGesture():void {
        //设置
        if(egret.MainContext.deviceType == egret.MainContext.DEVICE_PC) {
            neoges.GestureManager.showTouchPoint = true;//PC端测试多点操作用，手机测试请设置false
        }
        //Tap(点一下)
        var tap:neoges.TapGesture = new neoges.TapGesture(this.sky);
        tap.addEventListener(neoges.GestureEvent.ENDED,this.onTap,this);
        //Double Tap (双击)
        var tap2:neoges.DoubleTapGesture = new neoges.DoubleTapGesture(this.sky);
        tap2.addEventListener(neoges.GestureEvent.ENDED,this.onDoubleTap,this);
        //Pinch(二指往內或往外拨动，平时经常用到的缩放)
        var tap3:neoges.PinchGesture = new neoges.PinchGesture(this.icon);
        tap3.addEventListener(neoges.GestureEvent.BEGAN,this.onPinchBegan,this);
        tap3.addEventListener(neoges.GestureEvent.UPDATE,this.onPinchUpdate,this);
        tap3.addEventListener(neoges.GestureEvent.ENDED,this.onPinchEnd,this);
        console.log("tap3 here");
        //Rotation(旋转)
        var tap4:neoges.RotationGesture = new neoges.RotationGesture(this.icon);
        tap4.addEventListener(neoges.GestureEvent.BEGAN,this.onRotationBegan,this);
        tap4.addEventListener(neoges.GestureEvent.UPDATE,this.onRotationUpdate,this);
        tap4.addEventListener(neoges.GestureEvent.ENDED,this.onRotationEnd,this);
        //Swipe(滑动，快速移动)
        var tap5:neoges.SwipeGesture = new neoges.SwipeGesture(this.sky);
        tap5.addEventListener(neoges.GestureEvent.ENDED,this.onSwipeEnd,this);
        //Pan (拖移，慢速移动)
        var tap6:neoges.PanGesture = new neoges.PanGesture(this.icon);
        tap6.addEventListener(neoges.GestureEvent.BEGAN,this.onPanBegan,this);
        tap6.addEventListener(neoges.GestureEvent.UPDATE,this.onPanUpdate,this);
        tap6.addEventListener(neoges.GestureEvent.ENDED,this.onPanEnd,this);
        //LongPress(长按)
        var tap7:neoges.LongPressGesture = new neoges.LongPressGesture(this.sky);
        tap7.addEventListener(neoges.GestureEvent.ENDED,this.onLongPressEnd,this);
    }
    /**on tap*/
    private onTap(event:neoges.GestureEvent):void {
        this.showMsg("tap on "+event.host.name);
    }
    /**on double tap*/
    private onDoubleTap(event:neoges.GestureEvent):void {
        this.showMsg("double tap on "+event.host.name);
    }
    /**swipe*/
    private onSwipeEnd(event:neoges.GestureEvent):void {
        this.showMsg("swipe "+event.offsetX+","+event.offsetY);
    }
    /**long press*/
    private onLongPressEnd(event:neoges.GestureEvent):void {
        this.showMsg("long press on "+event.host.name);
    }

    /**pinch*/
    private onPinchBegan(event:neoges.GestureEvent):void {
        this.showMsg("pinch began on "+event.host.name);
        this.startScaleValue = this.icon.scaleX;
    }
    /**pinch*/
    private onPinchUpdate(event:neoges.GestureEvent):void {
        //console.log("pinch update "+event.value);
        this.icon.scaleX = this.startScaleValue*event.value;
        this.icon.scaleY = this.icon.scaleX;
    }
    /**pinch*/
    private onPinchEnd(event:neoges.GestureEvent):void {
        this.showMsg("pinch end on "+event.host.name);
    }
    /**rotation*/
    private onRotationBegan(event:neoges.GestureEvent):void {
        //console.log("rotation began on "+event.host.name);
        this.startRotationValue = this.icon.rotation;
    }
    /**rotation*/
    private onRotationUpdate(event:neoges.GestureEvent):void {
        //console.log("rotation update ",event.value);
        this.icon.rotation = this.startRotationValue+event.value;
    }
    /**rotation*/
    private onRotationEnd(event:neoges.GestureEvent):void {
        this.showMsg("rotation end on "+event.host.name);
    }
    /**pan*/
    private onPanBegan(event:neoges.GestureEvent):void {
        //console.log("pan began on "+event.host.name);
        this.startPoint = new egret.Point(event.host.x,event.host.y);
    }
    /**pan*/
    private onPanUpdate(event:neoges.GestureEvent):void {
        //console.log("rotation update ",event.value);
        event.host.x = this.startPoint.x+event.offsetX;
        event.host.y = this.startPoint.y+event.offsetY;
    }
    /**pan*/
    private onPanEnd(event:neoges.GestureEvent):void {
        //this.showMsg("pan end on "+event.host.name);
    }
    /**不需要手势的时候，可以清理手势*/
    private clearGesture(gestureInstance:neoges.IGesture):void {
        gestureInstance.dispose();
    }
    /**显示信息*/
    private showMsg(value:string):void {
        console.log(value);
        this.txtLabel.text = value;
    }
}
class MyToggleButton extends egret.Sprite
{
    private txt:egret.TextField;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.touchChildren = false;
        this.touchEnabled = true;
    }
    public setLabel(value:string):void {
        this.txt.text = value;
    }
    private onAddToStage(event: egret.Event) {
        var g:egret.Graphics = this.graphics;
        g.beginFill(0xFF0000,1);
        g.drawRoundRect(0,0,150,40,8,8);
        g.endFill();
        this.txt = new egret.TextField();
        this.txt.text = "单点模式";
        this.txt.x = 14;
        this.txt.y = 4;
        this.addChild(this.txt);
    }
}