//MESSAGE
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        s = document.createElement("script");
        if(request=="getMultiMode") {
            s.innerHTML = "document.body.setAttribute('mm',window.getMultiMode())";
            document.getElementsByTagName("head")[0].appendChild(s);
            var mm = document.body.getAttribute("mm");
            sendResponse(mm);
        } else if(request=="removeMultiMode") {
            s.innerHTML = "window.setMultiMode(window.currentThis,false)";
            document.getElementsByTagName("head")[0].appendChild(s);
        } else if(request=="setMultiMode") {
            s.innerHTML = "window.setMultiMode(window.currentThis,true)";
            document.getElementsByTagName("head")[0].appendChild(s);
        }
    }
);