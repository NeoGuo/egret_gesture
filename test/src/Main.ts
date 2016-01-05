class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            this.createGameScene();
        }
    }
    /**
     * 创建游戏场景
     */
    private createGameScene(): void {
        if(document.location.toString().indexOf("type=2") == -1) {
            document.title = "普通手势测试";
            var test1:MainTest = new MainTest();
            this.addChild(test1);
        } else {
            document.title = "变换测试";
            var test2:TransformTest = new TransformTest();
            this.addChild(test2);
        }
        
        var vj:VirtualJoystickView = new VirtualJoystickView();
        vj.x = 10;
        vj.y = 300;
        this.addChild(vj);
    }

}


