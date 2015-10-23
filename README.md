# Egret手势识别库

版本:Alpha 0.2
> 目前处于测试阶段，欢迎使用并提出您宝贵的建议，如发现Bug，请提交Bug详情，或者修复后发送Pull Request合并到主库。

简介
-------------------

本库旨在为Egret封装常用的手势操作，因本人能力有限，有的实现并不完善，欢迎批评指正。

目前已实现的手势：

1. Tap(点一下)
2. Double Tap (双击)
3. Pinch(二指往內或往外拨动，平时经常用到的缩放)
4. Rotation(旋转)
5. Swipe(滑动，快速移动)
6. Pan (拖移，慢速移动)
7. LongPress(长按)

演示: [Demo](http://www.tech-mx.com/egret/gesture/)

使用方式
-------------------

使用很简单:

第一步，下载本库，现在已经做成标准的第三方库，下载到本地后，可以用egret build命令对库进行编译。
然后在您的项目的配置文件里，引用一下手势库：
```
{
    "name":"neoges_lib",
    "path":"../neoges_lib"
}
```

第二步，选择你想使用的手势，创建手势对象，然后侦听事件即可。事件有4种：

* BEGAN 手势开始
* UPDATE Touch点处于变化中
* ENDED 手势结束
* FAILED 手势失败

以双击举例，示例代码：

```
var tap:neoges.DoubleTapGesture = new neoges.DoubleTapGesture(this.sky);
tap.addEventListener(neoges.GestureEvent.ENDED,this.onDoubleTap,this);
private onDoubleTap(event:neoges.GestureEvent):void {
    this.showMsg("double tap on "+event.host.name);
}
```

所有手势的使用方式，可以从这里找到：[MainTest](https://github.com/NeoGuo/egret_gesture/blob/master/test/MainTest.ts)

扩展
-------------------

扩展手势库也很简单，继承neoges.AbstractGesture并重写相关的方法即可。
