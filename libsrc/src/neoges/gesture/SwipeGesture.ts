/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**横扫*/
    export class SwipeGesture extends neoges.AbstractGesture
    {
        public static SWIPE_DISTANCE:number = 200;

        private isBegan:boolean = false;
        private callID:number;
        private _startPoint:egret.Point;
        private _endPoint:egret.Point;
        private disX:number;
        private disY:number;
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
            if(evt.type == egret.TouchEvent.TOUCH_BEGIN){
                this.isBegan = true;
                this.gestureBegan();
                this._startPoint = new egret.Point(evt.stageX,evt.stageY);
                egret.clearTimeout(this.callID);
                this.callID = egret.setTimeout(this.checkSwipeHandler,this,500);
            }
            else if(evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                //判断一下释放点和起始点的距离
                this._endPoint = new egret.Point(evt.stageX,evt.stageY);
                this.disX = Math.abs(this._endPoint.x-this._startPoint.x);
                this.disY = Math.abs(this._endPoint.y-this._startPoint.y);
                if((this.disX>neoges.SwipeGesture.SWIPE_DISTANCE || this.disY>neoges.SwipeGesture.SWIPE_DISTANCE) && this._stats==1)
                    this.gestureEnded();
                else
                    this.gestureFailed();
            }
        }
        /**触点更新*/
        public gestureEnded():void {
            this._stats = 3;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.ENDED);
            var directX:number = 0;
            var directY:number = 0;
            if(this.disX>neoges.SwipeGesture.SWIPE_DISTANCE) {
                directX = this._endPoint.x>this._startPoint.x?1:-1;
            }
            if(this.disY>neoges.SwipeGesture.SWIPE_DISTANCE) {
                directY = this._endPoint.y>this._startPoint.y?1:-1;
            }
            evt.offsetX = directX;
            evt.offsetY = directY;
            evt.host = this.target;
            this.dispatchEvent(evt);
            this._stats = -1;
        }
        /**检测超时*/
        private checkSwipeHandler():void {
            this.isBegan = false;
            this.gestureFailed();
        }
    }
}