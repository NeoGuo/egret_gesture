/**
 * Created by shaorui on 15-1-26.
 */
module neoges
{
    /**手势事件*/
    export class GestureEvent extends egret.Event
    {
        public static BEGAN:string = "began";
        public static UPDATE:string = "update";
        public static ENDED:string = "ended";
        public static FAILED:string = "failed";

        public host:any;
        public value:number;
        public offsetX:number;
        public offsetY:number;

        public rotation:number = 0;
        public scale:number = 1;

        public constructor(type:string) {
            super(type);
        }
    }
}