/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**拖动*/
    export class PanGesture extends neoges.AbstractGesture
    {
        private _startPoint:egret.Point;
        private _endPoint:egret.Point;
        /**构造方法*/
        public constructor(host:egret.DisplayObject=null) {
            super(host);
            this._useMultiPoints = false;
        }
        /**收到事件*/
        public onTouch(eventCollection:neoges.TouchData[]):void {
            if(eventCollection.length>1 || neoges.GestureManager.simulateMultitouch)
                return;
            var evt:neoges.TouchData = eventCollection[0];
            if(evt.type == egret.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this._startPoint = new egret.Point(evt.stageX,evt.stageY);
            }
            else if(evt.type == egret.TouchEvent.TOUCH_MOVE) {
                this._endPoint = new egret.Point(evt.stageX,evt.stageY);
                this.gestureUpdate();
            }
            else if(evt.type == egret.TouchEvent.TOUCH_END) {
                this.gestureEnded();
            }
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.host = this.target;
            evt.offsetX = this._endPoint.x-this._startPoint.x;
            evt.offsetY = this._endPoint.y-this._startPoint.y;
            this.dispatchEvent(evt);
        }
    }
}