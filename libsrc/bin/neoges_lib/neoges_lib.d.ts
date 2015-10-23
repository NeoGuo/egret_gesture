/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**手势事件*/
    class GestureEvent extends egret.Event {
        static BEGAN: string;
        static UPDATE: string;
        static ENDED: string;
        static FAILED: string;
        host: any;
        value: number;
        offsetX: number;
        offsetY: number;
        rotation: number;
        scale: number;
        constructor(type: string);
    }
}
/**
 * Created by shaoruiguo on 15/10/23.
 */
declare module neoges {
    function cloneTouchEvent(evt: egret.TouchEvent): neoges.TouchData;
    function setTouchProperties(evt: egret.TouchEvent, data: neoges.TouchData): void;
    /**Touch事件的数据记录*/
    class TouchData {
        constructor(type: string);
        type: string;
        stageX: number;
        stageY: number;
        localX: number;
        localY: number;
        touchPointID: number;
        target: any;
        touchDown: boolean;
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**手势的接口*/
    interface IGesture extends egret.IEventDispatcher {
        /**手势监听的显示对象*/
        target: egret.DisplayObject;
        /**手势是否需要多点判断*/
        _useMultiPoints: boolean;
        /**状态*/
        _stats: number;
        /**释放*/
        dispose(): void;
        /**收到事件*/
        onTouch(ts: egret.TouchEvent[]): void;
        /**手势开始*/
        gestureBegan(): void;
        /**触点更新*/
        gestureUpdate(): void;
        /**手势结束*/
        gestureEnded(): void;
        /**手势失败*/
        gestureFailed(): void;
    }
    /**手势的抽象类*/
    class AbstractGesture extends egret.EventDispatcher implements neoges.IGesture {
        /**手势监听的显示对象*/
        private _target;
        /**手势是否需要多点判断*/
        _useMultiPoints: boolean;
        /**状态,1代表手势开始,2代表手势更新,3代表手势结束*/
        _stats: number;
        /**getter and setter*/
        target: egret.DisplayObject;
        /**位置*/
        _location: egret.Point;
        location: egret.Point;
        /**构造方法*/
        constructor(target?: egret.DisplayObject);
        /**通知Manager来管理这个显示对象*/
        private addHostToManager();
        /**通知Manager删除这个显示对象*/
        private removeHostFromManager();
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**手势开始*/
        gestureBegan(): void;
        /**触点更新*/
        gestureUpdate(): void;
        /**手势结束*/
        gestureEnded(): void;
        /**手势失败*/
        gestureFailed(): void;
        /**实现Flash中Point的subtract方法*/
        subtract(p1: egret.Point, p2: egret.Point): egret.Point;
        /**实现Flash中Point的length*/
        getPointLength(p: egret.Point): number;
        /**释放*/
        dispose(): void;
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**双击*/
    class DoubleTapGesture extends neoges.AbstractGesture {
        private touchCount;
        private isBegan;
        private callID;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**手势结束*/
        gestureEnded(): void;
        /**检测超时*/
        private checkDoubleTapHandler();
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**长按*/
    class LongPressGesture extends neoges.AbstractGesture {
        private isBegan;
        private callID;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**手势结束*/
        gestureEnded(): void;
        /**检测超时*/
        private checkTimeHandler();
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**拖动*/
    class PanGesture extends neoges.AbstractGesture {
        private _startPoint;
        private _endPoint;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**触点更新*/
        gestureUpdate(): void;
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**缩放手势*/
    class PinchGesture extends neoges.AbstractGesture {
        private startLen;
        private currentLen;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**触点更新*/
        gestureEnded(): void;
        /**触点更新*/
        gestureUpdate(): void;
        /**获取一个事件的映像副本(for test)*/
        private reverseEvent(evt1);
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**旋转手势
     * TODO:目前实现的很简陋，并非真正的两点判断，算法还需要继续优化
     **/
    class RotationGesture extends neoges.AbstractGesture {
        private _transformVector;
        private _rotationStart;
        private _rotation;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**触点更新*/
        gestureUpdate(): void;
        /**实现Flash中Point的subtract方法*/
        private getCenterPoint(p1, p2);
        /**获取一个事件的映像副本(for test)*/
        private reverseEvent(evt1);
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**横扫*/
    class SwipeGesture extends neoges.AbstractGesture {
        static SWIPE_DISTANCE: number;
        private isBegan;
        private callID;
        private _startPoint;
        private _endPoint;
        private disX;
        private disY;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**触点更新*/
        gestureEnded(): void;
        /**检测超时*/
        private checkSwipeHandler();
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**点一下*/
    class TapGesture extends neoges.AbstractGesture {
        static TAP_DISTANCE: number;
        private isBegan;
        private callID;
        private _startPoint;
        private _endPoint;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**检测超时*/
        private checkTimeHandler();
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**变换(缩放+旋转)手势
     **/
    class TransformGesture extends neoges.AbstractGesture {
        slop: number;
        private _transformVector;
        private _offsetX;
        private _offsetY;
        private _rotation;
        private _scale;
        private distance;
        private startScale;
        /**构造方法*/
        constructor(host?: egret.DisplayObject);
        /**收到事件*/
        onTouch(eventCollection: neoges.TouchData[]): void;
        /**触点更新*/
        gestureUpdate(): void;
        /**计算中心点*/
        private updateLocation(p1, p2);
        /**获取一个事件的映像副本(for test)*/
        private reverseEvent(evt1);
    }
}
/**
 * Created by shaorui on 15-1-26.
 */
declare module neoges {
    /**手势管理*/
    class GestureManager {
        /**是否用圆形显示触碰的点(用于测试)*/
        static showTouchPoint: boolean;
        /**是否开启模拟的多点(用于测试)*/
        static simulateMultitouch: boolean;
        /**PC上模拟的点加到这里进行显示*/
        static simulatePoints: neoges.TouchData[];
        /**用数组存放N个手势实例*/
        private static hostCollection;
        /**事件字典,每一个显示对象对应一个数组存储事件*/
        private static eventDict;
        /**用于辅助显示*/
        private static drawLayer;
        /**private*/
        private static currentTouchObject;
        /**添加一个手势实例*/
        static addHost(value: neoges.AbstractGesture): void;
        /**删除一个手势实例*/
        static removeHost(value: neoges.AbstractGesture): void;
        /**注册事件侦听*/
        private static registerEvent(value);
        /**删除事件侦听*/
        private static removeEvent(value);
        /**事件处理*/
        private static touchedHandler(e);
        /**根据TOUCH ID判断是不是已经存在了这个触碰对象*/
        private static hasTouchEvent(e);
        /**根据TOUCH ID得到一个对象*/
        private static getTouchEventByID(touchID, target);
        /**移出事件处理*/
        private static leaveStageHandler(e);
        /**remove all*/
        private static removeAllEvent();
        /**用圆圈显示点的位置*/
        private static drawTouchPoint();
    }
}
