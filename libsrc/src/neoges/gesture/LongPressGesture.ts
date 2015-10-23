/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**长按*/
    export class LongPressGesture extends neoges.AbstractGesture
    {
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
                this.isBegan = true;
                this.gestureBegan();
                egret.clearTimeout(this.callID);
                this.callID = egret.setTimeout(this.checkTimeHandler,this,2000);
            }
            else if(evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                egret.clearTimeout(this.callID);
                this.isBegan = false;
                this.gestureFailed();
            }
        }
        /**手势结束*/
        public gestureEnded():void {
            egret.clearTimeout(this.callID);
            this.isBegan = false;
            super.gestureEnded();
        }
        /**检测超时*/
        private checkTimeHandler():void {
            this.gestureEnded();
        }
    }
}