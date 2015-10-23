/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**双击*/
    export class DoubleTapGesture extends neoges.AbstractGesture
    {
        private touchCount:number = 0;
        private isBegan:boolean = false;
        private callID:number;
        /**构造方法*/
        public constructor(host:egret.DisplayObject=null) {
            super(host);
            this._useMultiPoints = false;
        }
        /**收到事件*/
        public onTouch(eventCollection:neoges.TouchData[]):void {
            if(eventCollection.length>1)
                return;
            var evt:neoges.TouchData = eventCollection[0];
            if(evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                if(!this.isBegan) {
                    this.touchCount = 0;
                    this.isBegan = true;
                    this.gestureBegan();
                    egret.clearTimeout(this.callID);
                    this.callID = egret.setTimeout(this.checkDoubleTapHandler,this,500);
                }
            }
            else if(evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                this.touchCount++;
                if(this.touchCount >= 2) {
                    this.gestureEnded();
                }
            }
        }
        /**手势结束*/
        public gestureEnded():void {
            egret.clearTimeout(this.callID);
            this.touchCount = 0;
            this.isBegan = false;
            super.gestureEnded();
        }
        /**检测超时*/
        private checkDoubleTapHandler():void {
            this.touchCount = 0;
            this.isBegan = false;
            this.gestureFailed();
        }
    }
}