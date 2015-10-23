/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**缩放手势*/
    export class PinchGesture extends neoges.AbstractGesture
    {
        private startLen:number = 0;
        private currentLen:number = 0;

        /**构造方法*/
        public constructor(host:egret.DisplayObject=null) {
            super(host);
            this._useMultiPoints = true;
        }
        /**收到事件*/
        public onTouch(eventCollection:neoges.TouchData[]):void {
            var ec:neoges.TouchData[] = eventCollection;
            var evt1:neoges.TouchData;
            var evt2:neoges.TouchData;
            if(neoges.GestureManager.simulateMultitouch) {
                evt1 = eventCollection[0];
                evt2 = this.reverseEvent(evt1);
                neoges.GestureManager.simulatePoints = [evt2];
                ec = [evt1,evt2];
            }
            if(ec.length<2) {
                return;
            }
            evt1 = ec[0];
            evt2 = ec[1];
            if(evt2.type == egret.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this.startLen = egret.Point.distance(new egret.Point(evt1.stageX,evt1.stageY),new egret.Point(evt2.stageX,evt2.stageY));
            }
            else if(evt1.type == egret.TouchEvent.TOUCH_END || evt2.type == egret.TouchEvent.TOUCH_END) {
                this.gestureEnded();
            }
            else if(evt1.type == egret.TouchEvent.TOUCH_MOVE || evt2.type == egret.TouchEvent.TOUCH_MOVE) {
                this.currentLen = egret.Point.distance(new egret.Point(evt1.stageX,evt1.stageY),new egret.Point(evt2.stageX,evt2.stageY));
                this.gestureUpdate();
            }
        }
        /**触点更新*/
        public gestureEnded():void {
            neoges.GestureManager.simulatePoints = [];
            super.gestureEnded();
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.value = this.currentLen/this.startLen;
            evt.host = this.target;
            this.dispatchEvent(evt);
        }
        /**获取一个事件的映像副本(for test)*/
        private reverseEvent(evt1:neoges.TouchData):neoges.TouchData {
            var globalX:number = evt1.stageX;
            var globalY:number = evt1.stageY;
            var t:egret.DisplayObject = this.target;
            var op:egret.Point = t.localToGlobal(t.anchorOffsetX,t.anchorOffsetY);
            var dix:number = globalX-op.x;
            var diy:number = globalY-op.y;
            var tp:egret.Point = new egret.Point(op.x-dix,op.y-diy);
            var evt2:neoges.TouchData = new neoges.TouchData(evt1.type);
            evt2.stageX = tp.x;
            evt2.stageY = tp.y;
            return evt2;
        }
    }
}