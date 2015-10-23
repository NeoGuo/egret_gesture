/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**手势事件*/
    var GestureEvent = (function (_super) {
        __extends(GestureEvent, _super);
        function GestureEvent(type) {
            _super.call(this, type);
            this.rotation = 0;
            this.scale = 1;
        }
        var d = __define,c=GestureEvent;p=c.prototype;
        GestureEvent.BEGAN = "began";
        GestureEvent.UPDATE = "update";
        GestureEvent.ENDED = "ended";
        GestureEvent.FAILED = "failed";
        return GestureEvent;
    })(egret.Event);
    neoges.GestureEvent = GestureEvent;
    egret.registerClass(GestureEvent,"neoges.GestureEvent");
})(neoges || (neoges = {}));

/**
 * Created by shaoruiguo on 15/10/23.
 */
var neoges;
(function (neoges) {
    function cloneTouchEvent(evt) {
        var data = new neoges.TouchData(evt.type);
        data.stageX = evt.stageX;
        data.stageY = evt.stageY;
        data.localX = evt.localX;
        data.localY = evt.localY;
        data.touchPointID = evt.touchPointID;
        data.target = evt.target;
        data.touchDown = evt.touchDown;
        return data;
    }
    neoges.cloneTouchEvent = cloneTouchEvent;
    function setTouchProperties(evt, data) {
        data.type = evt.type;
        data.stageX = evt.stageX;
        data.stageY = evt.stageY;
        data.localX = evt.localX;
        data.localY = evt.localY;
        data.touchPointID = evt.touchPointID;
        data.target = evt.target;
        data.touchDown = evt.touchDown;
    }
    neoges.setTouchProperties = setTouchProperties;
    /**Touch事件的数据记录*/
    var TouchData = (function () {
        function TouchData(type) {
            this.type = type;
        }
        var d = __define,c=TouchData;p=c.prototype;
        return TouchData;
    })();
    neoges.TouchData = TouchData;
    egret.registerClass(TouchData,"neoges.TouchData");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**手势的抽象类*/
    var AbstractGesture = (function (_super) {
        __extends(AbstractGesture, _super);
        /**构造方法*/
        function AbstractGesture(target) {
            if (target === void 0) { target = null; }
            _super.call(this);
            /**手势是否需要多点判断*/
            this._useMultiPoints = false;
            /**状态,1代表手势开始,2代表手势更新,3代表手势结束*/
            this._stats = -1;
            /**位置*/
            this._location = new egret.Point();
            this._target = target;
            if (this._target != null)
                this.addHostToManager();
        }
        var d = __define,c=AbstractGesture;p=c.prototype;
        d(p, "target"
            /**getter and setter*/
            ,function () {
                return this._target;
            }
            ,function (value) {
                if (this._target == value)
                    return;
                this._stats = -1;
                if (this._target != null)
                    this.removeHostFromManager();
                this._target = value;
                if (this._target != null)
                    this.addHostToManager();
            }
        );
        d(p, "location"
            ,function () {
                return this._location.clone();
            }
        );
        /**通知Manager来管理这个显示对象*/
        p.addHostToManager = function () {
            neoges.GestureManager.addHost(this);
        };
        /**通知Manager删除这个显示对象*/
        p.removeHostFromManager = function () {
            neoges.GestureManager.removeHost(this);
        };
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            //console.log(eventCollection);
            //override by subclasses
        };
        /**手势开始*/
        p.gestureBegan = function () {
            this._stats = 1;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.BEGAN);
            evt.host = this._target;
            this.dispatchEvent(evt);
        };
        /**触点更新*/
        p.gestureUpdate = function () {
            this._stats = 2;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.host = this._target;
            this.dispatchEvent(evt);
        };
        /**手势结束*/
        p.gestureEnded = function () {
            this._stats = 3;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.ENDED);
            evt.host = this._target;
            this.dispatchEvent(evt);
            this._stats = -1;
        };
        /**手势失败*/
        p.gestureFailed = function () {
            var evt = new neoges.GestureEvent(neoges.GestureEvent.FAILED);
            evt.host = this._target;
            this.dispatchEvent(evt);
            this._stats = -1;
        };
        /**实现Flash中Point的subtract方法*/
        p.subtract = function (p1, p2) {
            var p = new egret.Point();
            p.x = p1.x - p2.x;
            p.y = p1.y - p2.y;
            return p;
        };
        /**实现Flash中Point的length*/
        p.getPointLength = function (p) {
            var len = 0;
            var p0 = new egret.Point(0, 0);
            len = egret.Point.distance(p, p0);
            return len;
        };
        /**释放*/
        p.dispose = function () {
            this._stats = -1;
            neoges.GestureManager.removeHost(this);
            this._target = null;
        };
        return AbstractGesture;
    })(egret.EventDispatcher);
    neoges.AbstractGesture = AbstractGesture;
    egret.registerClass(AbstractGesture,"neoges.AbstractGesture",["neoges.IGesture","egret.IEventDispatcher"]);
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**双击*/
    var DoubleTapGesture = (function (_super) {
        __extends(DoubleTapGesture, _super);
        /**构造方法*/
        function DoubleTapGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this.touchCount = 0;
            this.isBegan = false;
            this._useMultiPoints = false;
        }
        var d = __define,c=DoubleTapGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            if (eventCollection.length > 1)
                return;
            var evt = eventCollection[0];
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                if (!this.isBegan) {
                    this.touchCount = 0;
                    this.isBegan = true;
                    this.gestureBegan();
                    egret.clearTimeout(this.callID);
                    this.callID = egret.setTimeout(this.checkDoubleTapHandler, this, 500);
                }
            }
            else if (evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                this.touchCount++;
                if (this.touchCount >= 2) {
                    this.gestureEnded();
                }
            }
        };
        /**手势结束*/
        p.gestureEnded = function () {
            egret.clearTimeout(this.callID);
            this.touchCount = 0;
            this.isBegan = false;
            _super.prototype.gestureEnded.call(this);
        };
        /**检测超时*/
        p.checkDoubleTapHandler = function () {
            this.touchCount = 0;
            this.isBegan = false;
            this.gestureFailed();
        };
        return DoubleTapGesture;
    })(neoges.AbstractGesture);
    neoges.DoubleTapGesture = DoubleTapGesture;
    egret.registerClass(DoubleTapGesture,"neoges.DoubleTapGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**长按*/
    var LongPressGesture = (function (_super) {
        __extends(LongPressGesture, _super);
        /**构造方法*/
        function LongPressGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this.isBegan = false;
            this._useMultiPoints = false;
        }
        var d = __define,c=LongPressGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            if (eventCollection.length > 1)
                return;
            var evt = eventCollection[0];
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.isBegan = true;
                this.gestureBegan();
                egret.clearTimeout(this.callID);
                this.callID = egret.setTimeout(this.checkTimeHandler, this, 2000);
            }
            else if (evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                egret.clearTimeout(this.callID);
                this.isBegan = false;
                this.gestureFailed();
            }
        };
        /**手势结束*/
        p.gestureEnded = function () {
            egret.clearTimeout(this.callID);
            this.isBegan = false;
            _super.prototype.gestureEnded.call(this);
        };
        /**检测超时*/
        p.checkTimeHandler = function () {
            this.gestureEnded();
        };
        return LongPressGesture;
    })(neoges.AbstractGesture);
    neoges.LongPressGesture = LongPressGesture;
    egret.registerClass(LongPressGesture,"neoges.LongPressGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**拖动*/
    var PanGesture = (function (_super) {
        __extends(PanGesture, _super);
        /**构造方法*/
        function PanGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this._useMultiPoints = false;
        }
        var d = __define,c=PanGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            if (eventCollection.length > 1 || neoges.GestureManager.simulateMultitouch)
                return;
            var evt = eventCollection[0];
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.gestureBegan();
                this._startPoint = new egret.Point(evt.stageX, evt.stageY);
            }
            else if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
                this._endPoint = new egret.Point(evt.stageX, evt.stageY);
                this.gestureUpdate();
            }
            else if (evt.type == egret.TouchEvent.TOUCH_END) {
                this.gestureEnded();
            }
        };
        /**触点更新*/
        p.gestureUpdate = function () {
            this._stats = 2;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.host = this.target;
            evt.offsetX = this._endPoint.x - this._startPoint.x;
            evt.offsetY = this._endPoint.y - this._startPoint.y;
            this.dispatchEvent(evt);
        };
        return PanGesture;
    })(neoges.AbstractGesture);
    neoges.PanGesture = PanGesture;
    egret.registerClass(PanGesture,"neoges.PanGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**缩放手势*/
    var PinchGesture = (function (_super) {
        __extends(PinchGesture, _super);
        /**构造方法*/
        function PinchGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this.startLen = 0;
            this.currentLen = 0;
            this._useMultiPoints = true;
        }
        var d = __define,c=PinchGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            var ec = eventCollection;
            var evt1;
            var evt2;
            if (neoges.GestureManager.simulateMultitouch) {
                evt1 = eventCollection[0];
                evt2 = this.reverseEvent(evt1);
                neoges.GestureManager.simulatePoints = [evt2];
                ec = [evt1, evt2];
            }
            if (ec.length < 2) {
                return;
            }
            evt1 = ec[0];
            evt2 = ec[1];
            if (evt2.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.gestureBegan();
                this.startLen = egret.Point.distance(new egret.Point(evt1.stageX, evt1.stageY), new egret.Point(evt2.stageX, evt2.stageY));
            }
            else if (evt1.type == egret.TouchEvent.TOUCH_END || evt2.type == egret.TouchEvent.TOUCH_END) {
                this.gestureEnded();
            }
            else if (evt1.type == egret.TouchEvent.TOUCH_MOVE || evt2.type == egret.TouchEvent.TOUCH_MOVE) {
                this.currentLen = egret.Point.distance(new egret.Point(evt1.stageX, evt1.stageY), new egret.Point(evt2.stageX, evt2.stageY));
                this.gestureUpdate();
            }
        };
        /**触点更新*/
        p.gestureEnded = function () {
            neoges.GestureManager.simulatePoints = [];
            _super.prototype.gestureEnded.call(this);
        };
        /**触点更新*/
        p.gestureUpdate = function () {
            this._stats = 2;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.value = this.currentLen / this.startLen;
            evt.host = this.target;
            this.dispatchEvent(evt);
        };
        /**获取一个事件的映像副本(for test)*/
        p.reverseEvent = function (evt1) {
            var globalX = evt1.stageX;
            var globalY = evt1.stageY;
            var t = this.target;
            var op = t.localToGlobal(t.anchorOffsetX, t.anchorOffsetY);
            var dix = globalX - op.x;
            var diy = globalY - op.y;
            var tp = new egret.Point(op.x - dix, op.y - diy);
            var evt2 = new neoges.TouchData(evt1.type);
            evt2.stageX = tp.x;
            evt2.stageY = tp.y;
            return evt2;
        };
        return PinchGesture;
    })(neoges.AbstractGesture);
    neoges.PinchGesture = PinchGesture;
    egret.registerClass(PinchGesture,"neoges.PinchGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**旋转手势
     * TODO:目前实现的很简陋，并非真正的两点判断，算法还需要继续优化
     **/
    var RotationGesture = (function (_super) {
        __extends(RotationGesture, _super);
        /**构造方法*/
        function RotationGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this._rotationStart = 0;
            this._rotation = 0;
            this._useMultiPoints = true;
        }
        var d = __define,c=RotationGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            var ec = eventCollection;
            var evt1;
            var evt2;
            if (neoges.GestureManager.simulateMultitouch) {
                evt1 = eventCollection[0];
                evt2 = this.reverseEvent(evt1);
                neoges.GestureManager.simulatePoints = [evt2];
                ec = [evt1, evt2];
            }
            if (ec.length < 2)
                return;
            evt1 = ec[0];
            evt2 = ec[1];
            var p1 = new egret.Point(evt1.stageX, evt1.stageY);
            var p2 = new egret.Point(evt2.stageX, evt2.stageY);
            var dy;
            var dx;
            if (evt2.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.gestureBegan();
                this._transformVector = this.getCenterPoint(p1, p2);
                dy = p2.x - this._transformVector.x;
                dx = p2.y - this._transformVector.y;
                this._rotationStart = Math.atan2(dy, dx) * 180 / Math.PI;
            }
            else if (evt1.type == egret.TouchEvent.TOUCH_MOVE || evt2.type == egret.TouchEvent.TOUCH_MOVE) {
                if (this._stats != -1) {
                    dy = p2.x - this._transformVector.x;
                    dx = p2.y - this._transformVector.y;
                    this._rotation = this._rotationStart - Math.atan2(dy, dx) * 180 / Math.PI;
                    this.gestureUpdate();
                }
            }
            else if (evt1.type == egret.TouchEvent.TOUCH_END || evt2.type == egret.TouchEvent.TOUCH_END) {
                neoges.GestureManager.simulatePoints = [];
                this.gestureEnded();
            }
        };
        /**触点更新*/
        p.gestureUpdate = function () {
            this._stats = 2;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.value = this._rotation;
            evt.host = this.target;
            this.dispatchEvent(evt);
        };
        /**实现Flash中Point的subtract方法*/
        p.getCenterPoint = function (p1, p2) {
            var p = new egret.Point();
            p.x = p1.x + (p2.x - p1.x) / 2;
            p.y = p1.y + (p2.y - p1.y) / 2;
            return p;
        };
        /**获取一个事件的映像副本(for test)*/
        p.reverseEvent = function (evt1) {
            var globalX = evt1.stageX;
            var globalY = evt1.stageY;
            var t = this.target;
            var op = t.localToGlobal(t.anchorOffsetX, t.anchorOffsetY);
            var dix = globalX - op.x;
            var diy = globalY - op.y;
            var tp = new egret.Point(op.x - dix, op.y - diy);
            var evt2 = new neoges.TouchData(evt1.type);
            evt2.stageX = tp.x;
            evt2.stageY = tp.y;
            return evt2;
        };
        return RotationGesture;
    })(neoges.AbstractGesture);
    neoges.RotationGesture = RotationGesture;
    egret.registerClass(RotationGesture,"neoges.RotationGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**横扫*/
    var SwipeGesture = (function (_super) {
        __extends(SwipeGesture, _super);
        /**构造方法*/
        function SwipeGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this.isBegan = false;
            this._useMultiPoints = false;
        }
        var d = __define,c=SwipeGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            if (eventCollection.length > 1)
                return;
            var evt = eventCollection[0];
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.isBegan = true;
                this.gestureBegan();
                this._startPoint = new egret.Point(evt.stageX, evt.stageY);
                egret.clearTimeout(this.callID);
                this.callID = egret.setTimeout(this.checkSwipeHandler, this, 500);
            }
            else if (evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                //判断一下释放点和起始点的距离
                this._endPoint = new egret.Point(evt.stageX, evt.stageY);
                this.disX = Math.abs(this._endPoint.x - this._startPoint.x);
                this.disY = Math.abs(this._endPoint.y - this._startPoint.y);
                if ((this.disX > neoges.SwipeGesture.SWIPE_DISTANCE || this.disY > neoges.SwipeGesture.SWIPE_DISTANCE) && this._stats == 1)
                    this.gestureEnded();
                else
                    this.gestureFailed();
            }
        };
        /**触点更新*/
        p.gestureEnded = function () {
            this._stats = 3;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.ENDED);
            var directX = 0;
            var directY = 0;
            if (this.disX > neoges.SwipeGesture.SWIPE_DISTANCE) {
                directX = this._endPoint.x > this._startPoint.x ? 1 : -1;
            }
            if (this.disY > neoges.SwipeGesture.SWIPE_DISTANCE) {
                directY = this._endPoint.y > this._startPoint.y ? 1 : -1;
            }
            evt.offsetX = directX;
            evt.offsetY = directY;
            evt.host = this.target;
            this.dispatchEvent(evt);
            this._stats = -1;
        };
        /**检测超时*/
        p.checkSwipeHandler = function () {
            this.isBegan = false;
            this.gestureFailed();
        };
        SwipeGesture.SWIPE_DISTANCE = 200;
        return SwipeGesture;
    })(neoges.AbstractGesture);
    neoges.SwipeGesture = SwipeGesture;
    egret.registerClass(SwipeGesture,"neoges.SwipeGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**点一下*/
    var TapGesture = (function (_super) {
        __extends(TapGesture, _super);
        /**构造方法*/
        function TapGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this.isBegan = false;
            this._useMultiPoints = false;
        }
        var d = __define,c=TapGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            if (eventCollection.length > 1)
                return;
            var evt = eventCollection[0];
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.gestureBegan();
                this.isBegan = true;
                this._startPoint = new egret.Point(evt.stageX, evt.stageY);
                egret.clearTimeout(this.callID);
                this.callID = egret.setTimeout(this.checkTimeHandler, this, 500);
            }
            else if (evt.type == egret.TouchEvent.TOUCH_END && this.isBegan) {
                //判断一下释放点和起始点的距离
                egret.clearTimeout(this.callID);
                this._endPoint = new egret.Point(evt.stageX, evt.stageY);
                var distance = egret.Point.distance(this._startPoint, this._endPoint);
                if (distance < neoges.TapGesture.TAP_DISTANCE && this._stats == 1)
                    this.gestureEnded();
                else
                    this.gestureFailed();
            }
        };
        /**检测超时*/
        p.checkTimeHandler = function () {
            this.isBegan = false;
            this.gestureFailed();
        };
        TapGesture.TAP_DISTANCE = 20;
        return TapGesture;
    })(neoges.AbstractGesture);
    neoges.TapGesture = TapGesture;
    egret.registerClass(TapGesture,"neoges.TapGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**变换(缩放+旋转)手势
     **/
    var TransformGesture = (function (_super) {
        __extends(TransformGesture, _super);
        /**构造方法*/
        function TransformGesture(host) {
            if (host === void 0) { host = null; }
            _super.call(this, host);
            this.slop = Math.round(20 / 252 * 240);
            this._offsetX = 0;
            this._offsetY = 0;
            this._rotation = 0;
            this._scale = 1;
            this.distance = 0;
            this.startScale = 1;
            this._useMultiPoints = true;
        }
        var d = __define,c=TransformGesture;p=c.prototype;
        /**收到事件*/
        p.onTouch = function (eventCollection) {
            var ec = eventCollection;
            var evt1;
            var evt2;
            if (neoges.GestureManager.simulateMultitouch) {
                evt1 = eventCollection[0];
                evt2 = this.reverseEvent(evt1);
                neoges.GestureManager.simulatePoints = [evt2];
                ec = [evt1, evt2];
            }
            if (ec.length < 2)
                return;
            evt1 = ec[0];
            evt2 = ec[1];
            var p1 = new egret.Point(evt1.stageX, evt1.stageY);
            var p2 = new egret.Point(evt2.stageX, evt2.stageY);
            var pR;
            var dy;
            var dx;
            if (evt2.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.gestureBegan();
                this._transformVector = this.subtract(p2, p1);
                this.updateLocation(p1, p2);
                this.distance = egret.Point.distance(p2, p1);
                //console.log("for",this.target.scaleX);
                this.startScale = this.target.scaleX;
            }
            else if (evt1.type == egret.TouchEvent.TOUCH_MOVE || evt2.type == egret.TouchEvent.TOUCH_MOVE) {
                var prevLocation = this._location.clone();
                this.updateLocation(p1, p2);
                var currTransformVector;
                currTransformVector = this.subtract(p2, p1);
                this._offsetX = this._location.x - prevLocation.x;
                this._offsetY = this._location.y - prevLocation.y;
                this._rotation = Math.atan2(currTransformVector.y, currTransformVector.x) - Math.atan2(this._transformVector.y, this._transformVector.x);
                //this._scale = this.getPointLength(currTransformVector) / this.getPointLength(this._transformVector);
                var currentDistance = egret.Point.distance(p2, p1);
                //console.log(this.startScale,currentDistance,this.distance);
                this._scale = this.startScale * (currentDistance / this.distance);
                this._transformVector = this.subtract(p2, p1);
                this.gestureUpdate();
            }
            else if (evt1.type == egret.TouchEvent.TOUCH_END || evt2.type == egret.TouchEvent.TOUCH_END) {
                neoges.GestureManager.simulatePoints = [];
                this.gestureEnded();
            }
        };
        /**触点更新*/
        p.gestureUpdate = function () {
            this._stats = 2;
            var evt = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.rotation = this._rotation;
            evt.scale = this._scale;
            evt.offsetX = this._offsetX;
            evt.offsetY = this._offsetY;
            evt.host = this.target;
            this.dispatchEvent(evt);
        };
        /**计算中心点*/
        p.updateLocation = function (p1, p2) {
            var p = new egret.Point();
            p.x = (p1.x + p2.x) / 2;
            p.y = (p1.y + p2.y) / 2;
            this._location = p;
        };
        /**获取一个事件的映像副本(for test)*/
        p.reverseEvent = function (evt1) {
            var globalX = evt1.stageX;
            var globalY = evt1.stageY;
            var t = this.target;
            var op = t.localToGlobal(0.5 * t.width, 0.5 * t.height);
            var dix = globalX - op.x;
            var diy = globalY - op.y;
            var tp = new egret.Point(op.x - dix, op.y - diy);
            var evt2 = new neoges.TouchData(evt1.type);
            //var tp:egret.Point = new egret.Point(op.x+dix/2,op.y+diy/2);
            evt2.stageX = tp.x;
            evt2.stageY = tp.y;
            return evt2;
        };
        return TransformGesture;
    })(neoges.AbstractGesture);
    neoges.TransformGesture = TransformGesture;
    egret.registerClass(TransformGesture,"neoges.TransformGesture");
})(neoges || (neoges = {}));

/**
 * Created by shaorui on 15-1-26.
 */
var neoges;
(function (neoges) {
    /**手势管理*/
    var GestureManager = (function () {
        function GestureManager() {
        }
        var d = __define,c=GestureManager;p=c.prototype;
        /**添加一个手势实例*/
        GestureManager.addHost = function (value) {
            var hc = neoges.GestureManager.hostCollection;
            if (hc.indexOf(value) != -1) {
                console.warn("不要重复添加手势实例");
                return;
            }
            neoges.GestureManager.registerEvent(value.target);
            hc.push(value);
            neoges.GestureManager.eventDict[value.target.hashCode] = [];
        };
        /**删除一个手势实例*/
        GestureManager.removeHost = function (value) {
            var hc = neoges.GestureManager.hostCollection;
            var index = hc.indexOf(value);
            if (index == -1) {
                console.warn("不存在这个实例");
                return;
            }
            hc.slice(index, 1);
            neoges.GestureManager.removeEvent(value.target);
            neoges.GestureManager.eventDict[value.target.hashCode] = null;
        };
        /**注册事件侦听*/
        GestureManager.registerEvent = function (value) {
            var hc = neoges.GestureManager.hostCollection;
            value.addEventListener(egret.TouchEvent.TOUCH_BEGIN, neoges.GestureManager.touchedHandler, value);
        };
        /**删除事件侦听*/
        GestureManager.removeEvent = function (value) {
            var hc = neoges.GestureManager.hostCollection;
            value.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, neoges.GestureManager.touchedHandler, value);
        };
        /**事件处理*/
        GestureManager.touchedHandler = function (e) {
            //console.log(e.type,e.currentTarget);
            //判断事件类型
            var target;
            var stage = egret.MainContext.instance.stage;
            if (e.type == egret.TouchEvent.TOUCH_BEGIN) {
                target = e.currentTarget;
                neoges.GestureManager.currentTouchObject = target;
                stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, neoges.GestureManager.touchedHandler, stage);
                stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, neoges.GestureManager.touchedHandler, stage);
                stage.removeEventListener(egret.TouchEvent.TOUCH_END, neoges.GestureManager.touchedHandler, stage);
                stage.addEventListener(egret.TouchEvent.TOUCH_END, neoges.GestureManager.touchedHandler, stage);
                stage.removeEventListener(egret.Event.LEAVE_STAGE, neoges.GestureManager.leaveStageHandler, stage);
                stage.addEventListener(egret.Event.LEAVE_STAGE, neoges.GestureManager.leaveStageHandler, stage);
            }
            else {
                target = neoges.GestureManager.currentTouchObject;
            }
            if (neoges.GestureManager.eventDict[target.hashCode] == null) {
                neoges.GestureManager.eventDict[target.hashCode] = [];
            }
            //判断事件对象，如果是多点，则数组的长度大于1
            var ec = neoges.GestureManager.eventDict[target.hashCode];
            var currentEvent;
            var evtIndex = -1;
            if (!neoges.GestureManager.hasTouchEvent(e)) {
                currentEvent = neoges.cloneTouchEvent(e);
                ec.push(currentEvent);
            }
            else {
                currentEvent = neoges.GestureManager.getTouchEventByID(e.touchPointID, target);
                neoges.setTouchProperties(e, currentEvent);
            }
            //通知手势对象
            var hc = neoges.GestureManager.hostCollection;
            var ges;
            for (var i = 0; i < hc.length; i++) {
                ges = hc[i];
                if (ges.target == target)
                    ges.onTouch(ec);
            }
            //清理已经结束的事件
            if (currentEvent.type == egret.TouchEvent.TOUCH_END) {
                neoges.GestureManager.removeAllEvent();
            }
            //画圈
            if (neoges.GestureManager.showTouchPoint) {
                neoges.GestureManager.drawTouchPoint();
            }
        };
        /**根据TOUCH ID判断是不是已经存在了这个触碰对象*/
        GestureManager.hasTouchEvent = function (e) {
            var target = neoges.GestureManager.currentTouchObject;
            var ec = neoges.GestureManager.eventDict[target.hashCode];
            for (var index = 0; index < ec.length; index++) {
                if (ec[index].touchPointID == e.touchPointID) {
                    return true;
                }
            }
            return false;
        };
        /**根据TOUCH ID得到一个对象*/
        GestureManager.getTouchEventByID = function (touchID, target) {
            var ec = neoges.GestureManager.eventDict[target.hashCode];
            for (var index = 0; index < ec.length; index++) {
                if (ec[index].touchPointID == touchID) {
                    return ec[index];
                }
            }
            return null;
        };
        /**移出事件处理*/
        GestureManager.leaveStageHandler = function (e) {
            neoges.GestureManager.removeAllEvent();
        };
        /**remove all*/
        GestureManager.removeAllEvent = function () {
            var stage = egret.MainContext.instance.stage;
            for (var key in neoges.GestureManager.eventDict) {
                var ec = neoges.GestureManager.eventDict[key];
                ec.length = 0;
            }
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, neoges.GestureManager.touchedHandler, stage);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, neoges.GestureManager.touchedHandler, stage);
            stage.removeEventListener(egret.Event.LEAVE_STAGE, neoges.GestureManager.leaveStageHandler, stage);
            neoges.GestureManager.drawTouchPoint();
        };
        /**用圆圈显示点的位置*/
        GestureManager.drawTouchPoint = function () {
            if (neoges.GestureManager.currentTouchObject == null)
                return;
            var drawLayer = neoges.GestureManager.drawLayer;
            var stage = egret.MainContext.instance.stage;
            if (drawLayer.stage == null)
                stage.addChild(drawLayer);
            var g = drawLayer.graphics;
            g.clear();
            g.beginFill(0x000000, 0.4);
            var evt;
            for (var key in neoges.GestureManager.eventDict) {
                if (neoges.GestureManager.currentTouchObject.hashCode != key)
                    continue;
                var ec = neoges.GestureManager.eventDict[key];
                if (ec != null && ec.length > 0) {
                    for (var index = 0; index < ec.length; index++) {
                        evt = ec[index];
                        g.drawCircle(evt.stageX, evt.stageY, 10);
                    }
                }
            }
            ec = neoges.GestureManager.simulatePoints;
            for (var index = 0; index < ec.length; index++) {
                evt = ec[index];
                g.drawCircle(evt.stageX, evt.stageY, 10);
            }
            g.endFill();
        };
        /*--------------setting-----------------------*/
        /**是否用圆形显示触碰的点(用于测试)*/
        GestureManager.showTouchPoint = false;
        /**是否开启模拟的多点(用于测试)*/
        GestureManager.simulateMultitouch = false;
        /**PC上模拟的点加到这里进行显示*/
        GestureManager.simulatePoints = [];
        /**用数组存放N个手势实例*/
        GestureManager.hostCollection = [];
        /**事件字典,每一个显示对象对应一个数组存储事件*/
        GestureManager.eventDict = {};
        /**用于辅助显示*/
        GestureManager.drawLayer = new egret.Sprite();
        return GestureManager;
    })();
    neoges.GestureManager = GestureManager;
    egret.registerClass(GestureManager,"neoges.GestureManager");
})(neoges || (neoges = {}));

