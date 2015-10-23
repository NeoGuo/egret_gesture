/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**旋转手势
     * TODO:目前实现的很简陋，并非真正的两点判断，算法还需要继续优化
     **/
    export class RotationGesture extends neoges.AbstractGesture
    {
        private _transformVector:egret.Point;
        private _rotationStart:number = 0;
        private _rotation:number = 0;

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
            if(ec.length<2)
                return;
            evt1 = ec[0];
            evt2 = ec[1];
            var p1:egret.Point = new egret.Point(evt1.stageX,evt1.stageY);
            var p2:egret.Point = new egret.Point(evt2.stageX,evt2.stageY);
            var dy:number;
            var dx:number;
            if(evt2.type == egret.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this._transformVector = this.getCenterPoint(p1,p2);
                dy = p2.x - this._transformVector.x;
                dx = p2.y - this._transformVector.y;
                this._rotationStart = Math.atan2(dy, dx) * 180 / Math.PI;
            }
            else if(evt1.type == egret.TouchEvent.TOUCH_MOVE || evt2.type == egret.TouchEvent.TOUCH_MOVE) {
                if(this._stats != -1) {
                    dy = p2.x - this._transformVector.x;
                    dx = p2.y - this._transformVector.y;
                    this._rotation = this._rotationStart-Math.atan2(dy, dx) * 180 / Math.PI;
                    this.gestureUpdate();
                }
            }
            else if(evt1.type == egret.TouchEvent.TOUCH_END || evt2.type == egret.TouchEvent.TOUCH_END) {
                neoges.GestureManager.simulatePoints = [];
                this.gestureEnded();
            }
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.value = this._rotation;
            evt.host = this.target;
            this.dispatchEvent(evt);
        }
        /**实现Flash中Point的subtract方法*/
        private getCenterPoint(p1:egret.Point,p2:egret.Point):egret.Point {
            var p:egret.Point = new egret.Point();
            p.x = p1.x+(p2.x-p1.x)/2;
            p.y = p1.y+(p2.y-p1.y)/2;
            return p;
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