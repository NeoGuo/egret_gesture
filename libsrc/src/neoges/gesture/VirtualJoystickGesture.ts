module neoges {
    /** point math */
	export function distance(p1:egret.Point, p2:egret.Point):number {
		var dx:number = p2.x - p1.x;
		var dy:number = p2.y - p1.y;
	
		return Math.sqrt((dx * dx) + (dy * dy));
	}
	export function angle(p1:egret.Point, p2:egret.Point):number {
		var dx = p2.x - p1.x;
		var dy = p2.y - p1.y;
	
		return degrees(Math.atan2(dy, dx));
	}
	export function findCoord(p:egret.Point, d:number, a:number):egret.Point {
		var b:egret.Point = new egret.Point();
		a = radians(a);
		b.x = p.x - d * Math.cos(a);
		b.y = p.y - d * Math.sin(a);
		return b;
	}
	export function radians(a:number):number {
		return a * (Math.PI / 180);
	}
	export function degrees(a:number):number {
		return a * (180 / Math.PI);
	}
	export class GestureDir {
		/** same with number area of keyboard */
		public static LEFT_DOWN:number = 1;
		public static DOWN:number = 2;
		public static RIGHT_DOWN:number = 3;
		public static LEFT:number = 4;
		public static CENTER:number = 5;
		public static RIGHT:number = 6;
		public static LEFT_UP:number = 7;
		public static UP:number = 8;
		public static RIGHT_UP:number = 9;
		
		public static dir(deg:number, dis:number, minDis:number = 0):number {
			if(dis > minDis) {
				var gap:number = 45;
				var i:number = 22;
				if(deg > i && deg <= i + gap) {
					return GestureDir.LEFT_UP;
				}
				i += gap;
				if(deg > i && deg <= i + gap) {
					return GestureDir.UP;
				}
				i += gap;
				if(deg > i && deg <= i + gap) {
					return GestureDir.RIGHT_UP;
				}
				i += gap;
				if(deg > i && deg <= i + gap) {
					return GestureDir.RIGHT;
				}
				i += gap;
				if(deg > i && deg <= i + gap) {
					return GestureDir.RIGHT_DOWN;
				}
				i += gap;
				if(deg > i && deg <= i + gap) {
					return GestureDir.DOWN;
				}
				i += gap;
				if(deg > i && deg <= i + gap) {
					return GestureDir.LEFT_DOWN;
				}
				
				return GestureDir.LEFT;
			}
			return GestureDir.CENTER;
		}
        
        public dir:number = GestureDir.CENTER;
        //左开始 顺时针0-360度
        public degrees:number = 0;
        public distance:number = 0;
        
        public toString():string {
            return "[GestureDir] dir:" + this.dir + ", degrees:" + this.degrees + ", distance:" + this.distance;
        }
        public clone(v:GestureDir = null):GestureDir {
            v = v || new GestureDir();
            v.dir = this.dir;
            v.degrees = this.degrees;
            v.distance = this.distance;
            return v;
        }
        public reset():void {
            this.dir = GestureDir.CENTER;
            this.degrees = 0;
            this.distance = 0;
        }
	}
	export class VirtualJoystickGesture extends neoges.AbstractGesture {
		public minDistance:number = 20;
		protected _evtBegan:neoges.TouchData;
		protected _centerP:egret.Point;
		protected _startP:egret.Point;
		protected _dir:GestureDir = new GestureDir();
		/**收到事件*/
        public onTouch(eventCollection:neoges.TouchData[]):void {
			if(eventCollection.length > 1) return;
			
			var evt:neoges.TouchData;
			var i:number = 0;
			var tmpE:neoges.TouchData;
			for(i; i < eventCollection.length; i++) {
				tmpE = eventCollection[i];
				if(null == this._evtBegan && tmpE.type == egret.TouchEvent.TOUCH_BEGIN) {
					evt = tmpE;
					break;
				}
				if(this._evtBegan && tmpE.touchPointID == this._evtBegan.touchPointID) {
					evt = tmpE;
					break;
				}
			}
			if(null == evt) return;
			
			if(evt.type == egret.TouchEvent.TOUCH_BEGIN) {
				this._evtBegan = evt;
				this._location = new egret.Point(evt.localX, evt.localY);
				this._startP = this._centerP || this._location.clone();
                this.gestureBegan();
				this.gestureUpdate();
			}
			else if(evt.type == egret.TouchEvent.TOUCH_MOVE) {
				this._location.x = evt.localX;
				this._location.y = evt.localY;
				this.gestureUpdate();
			}
			else if(evt.type == egret.TouchEvent.TOUCH_END) {
				this._evtBegan = null;
                this._location = this._startP;
                this.gestureUpdate();
				this.gestureEnded();
			}
		}
		
		public gestureUpdate():void {
			this._dir.distance = distance(this._startP, this._location);
			//左开始 顺时针0-360度
			this._dir.degrees = 180 + angle(this._startP, this._location);
			this._dir.dir = GestureDir.dir(this._dir.degrees, this._dir.distance, this.minDistance);
			super.gestureUpdate();
		}
		
		public get centerP():egret.Point {
			return this._centerP;
		}
		public set centerP(v:egret.Point) {
			this._centerP = v;
		}
		public get startP():egret.Point {
			return this._startP;
		}
		public get dir():GestureDir {
			return this._dir;
		}
		
		public toString():string {
			return "[VirtualJoystickGesture] dir:" + this.dir.toString();
		}
	}
}