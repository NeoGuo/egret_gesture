/**
 * Created by shaorui on 15-1-28.
 */
module neoges
{
    /**事件的对象池，避免重复创建对象*/
    export class EventPool
    {
        private _collection:egret.TouchEvent[];

        public constructor() {
            this._collection = [];
        }

        public clone(e:egret.TouchEvent):egret.TouchEvent {
            var evt:egret.TouchEvent = this._collection.pop();
            if (evt == null) {
                evt = new egret.TouchEvent(e.type);
            }
            for (var key in e) {
                evt[key] = e[key];
            }
            return evt;
        }
        public setProperties(e:egret.TouchEvent,resultEvent:egret.TouchEvent):egret.TouchEvent {
            for (var key in e) {
                resultEvent[key] = e[key];
            }
            return resultEvent;
        }

        public reclaim(e:egret.TouchEvent):void {
            if(this._collection.indexOf(e) != -1)
                return;
            this._collection.push(e);
        }
        public reclaimAll(arr:egret.TouchEvent[]):void {
            while(arr.length > 0) {
                this.reclaim(arr[0]);
                arr.shift();
            }
        }

    }
}