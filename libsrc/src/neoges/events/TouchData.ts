/**
 * Created by shaoruiguo on 15/10/23.
 */
module neoges
{
    export function cloneTouchEvent(evt:egret.TouchEvent):neoges.TouchData
    {
        var data:neoges.TouchData = new neoges.TouchData(evt.type);
        data.stageX = evt.stageX;
        data.stageY = evt.stageY;
        data.localX = evt.localX;
        data.localY = evt.localY;
        data.touchPointID = evt.touchPointID;
        data.target = evt.target;
        data.touchDown = evt.touchDown;
        return data;
    }
    export function setTouchProperties(evt:egret.TouchEvent,data:neoges.TouchData):void
    {
        data.type = evt.type;
        data.stageX = evt.stageX;
        data.stageY = evt.stageY;
        data.localX = evt.localX;
        data.localY = evt.localY;
        data.touchPointID = evt.touchPointID;
        data.target = evt.target;
        data.touchDown = evt.touchDown;
    }
    /**Touch事件的数据记录*/
    export class TouchData
    {
        public constructor(type:string) {
            this.type = type;
        }

        public type:string;
        public stageX:number;
        public stageY:number;
        public localX:number;
        public localY:number;
        public touchPointID:number;
        public target:any;
        public touchDown:boolean;
    }
}