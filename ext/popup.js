/**获取当前页面*/
function getCurrentTab(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0];
        callback(tab);
    });
}
/**启动*/
$(document).ready(function(){
    //先获取到当前页面的Tab
    getCurrentTab(function (tab) {
        //然后给content_script发消息，获取游戏自身的设定
        chrome.tabs.sendMessage(tab.id,"getMultiMode",function(response) {
            if(response=="false") {
                $("#se1").attr('checked','checked');
            } else {
                $("#se2").attr('checked','checked');
            }
        });
        //点击单选按钮的时候，调用游戏自身的接口
        $("#se1").click(function() {
            chrome.tabs.sendMessage(tab.id,"removeMultiMode",function(response) {});
        });
        $("#se2").click(function() {
            chrome.tabs.sendMessage(tab.id,"setMultiMode",function(response) {});
        });
    });
});