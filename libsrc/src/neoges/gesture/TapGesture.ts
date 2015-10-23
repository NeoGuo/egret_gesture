/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**点一下*/
    export class TapGesture extends neoges.AbstractGesture
    {
        public static TAP_DISTANCE:number = 20;

        private isBegan:boolean = false;
        private callID:number;
        private _startPoint:egret.Point;
        private _endPoint:egret.Point;
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
                this.gestureBegan();
                this.isBegan = true;
                this._startPoint = new egret.Point(evt.stageX,evt.stageY);
                egret.clearTimeout(this.callID);
                this.callID = egret.setTimeout(this.checkTimeHandler,this,500);
            }
            else if(evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                //判断一下释放点和起始点的距离
                egret.clearTimeout(this.callID);
                this._endPoint = new egret.Point(evt.stageX,evt.stageY);
                var distance:number = egret.Point.distance(this._startPoint,this._endPoint);
                if(distance<neoges.TapGesture.TAP_DISTANCE && this._stats==1)
                    this.gestureEnded();
                else
                    this.gestureFailed();
            }
        }
        /**检测超时*/
        private checkTimeHandler():void {
            this.isBegan = false;
            this.gestureFailed();
        }
    }
}