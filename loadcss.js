// DOM manipulation must exist inside this "content script" in order to execute in the proper context of the page

// listen to requests from background.html
chrome.extension.onRequest.addListener(

    // depending on state value, injext/remove css
    function(req, sender, sendResponse) {
        req.state === 'on' 
            ? appendStyleNode(req.id, req.href)
            : removeStyleNode(req.id);

        sendResponse({ok: true});
    }
);

// inject the css file into the head element
function appendStyleNode(id, href) {
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.id = id;
    cssNode.href = href;
    document.getElementsByTagName('head')[0].appendChild(cssNode);
}

// remove the css
function removeStyleNode(id) {
    var node = document.getElementById(id);
    node && node.parentNode.removeChild(node);
}
