// All DOM manipulation must exist inside this "content script" in order to execute in the proper context of the page

// inject the css file into the head element
function appendStyleNode(id, href) {
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.id = id;
    cssNode.href = href;
    document.getElementsByTagName('head')[0].appendChild(cssNode);
}

// removes the css
function removeStyleNode(id) {
    var node = document.getElementById(id);
    node && node.parentNode.removeChild(node);
}

// currently does nothing but alert if error
function restoreStateCallback(resp) {
    if (!resp.ok) {
        alert('Error re-injecting css on refresh. Try pushing the button again');
    }
}


// EVENT LISTENERS

// override window onload event to check the state of the current tab on each page load
var oldWindowOnload = window.onload;
window.onload = function() {

    // send request to background page to restore the state (since only it knows about state)
    chrome.extension.sendRequest({action: 'restoreState'}, restoreStateCallback);

    // execute any previously existing window onload events
    if (oldWindowOnload && typeof(oldWindowOnload) === 'function') {
        oldWindowOnload();
    }
};

// listen to injections/removal requests from background.html
chrome.extension.onRequest.addListener(

    // depending on state value, injext/remove css
    function(req, sender, sendResponse) {
        req.state === 'on' 
            ? appendStyleNode(req.id, req.href)
            : removeStyleNode(req.id);

        // notify of no problems
        sendResponse({ok: true});
    }
);
