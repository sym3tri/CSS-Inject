/*global chrome: true*/

(function () {
  'use strict';

  // TODO: Shortcut keys
  // TODO: Optionally remove ALL existing CSS?

  // global object to track on/off state of each tab
  var state = {},
      storage = window.localStorage;

  // Displays error messages
  function error(msg) {
    window.alert('ERROR: ' + msg);
  }

  // Checks if the supplied url is valid
  // TODO: make this more robust
  function isUrlValid(url) {
    return (url && url.length > 3) ? true : false;
  }

  // send 'load/unload' request to the embedded content script
  function sendInjectionRequest(tabId, tabState, callback) {
    chrome.tabs.sendRequest(
      tabId,
      {
        // state of current tab
        state: tabState,
        // id of <link> element to inject
        id: 'cssinject-injected-cssfile',
        // css file path specified by user in options plus a
        // timestamp cache buster.
        href: storage.cssfile + '?' + (new Date()).getTime()
      },
      function(resp) {
        // something went wrong
        if (!resp.ok) {
          error('Could not load CSS file');
        }
        if (callback) {
          callback();
        }
      }
    );
  }

  // Turn on the plugin badge and inject the css
  function turnOn(tabId) {
    // error check
    if (!isUrlValid(storage.cssfile)) {
      error('No CSS url specified. Please specify url in extesion options.');
      return;
    }
    // update state
    state[tabId] = 'on';
    // send request to content script
    sendInjectionRequest(tabId, state[tabId], function() {
      // update badge
      chrome.browserAction.setBadgeText({text: 'on', tabId: tabId});
    });
  }

  // Turn off the plugin badge
  function turnOff(tabId) {
    // just delete the property if it exists
    delete state[tabId];
    // send request to content script
    sendInjectionRequest(tabId, 'off', function() {
      // update badge
      chrome.browserAction.setBadgeText({text: '', tabId: tabId});
    });
  }

  // toggles css injection on/off
  function toggleInjection(tab) {
    // toggle state on click
    if (state[tab.id] === 'on') {
      turnOff(tab.id);
    } else {
      turnOn(tab.id);
    }
  }

  // restore state on page reloads
  function restoreState(req, sender, sendResponse) {
    // first get current window
    chrome.windows.getCurrent(function(win) {
      // then get current tab
      chrome.tabs.getSelected(win.id, function(tab) {
        // check the tab's state
        if (state[tab.id] === 'on') {
          // if it should be on turn it on
          turnOn(tab.id);
          // notify content script that all is good
          sendResponse({ok: true});
        }
      });
    });
  }

  // EVENT HANDLERS

  // User clicked the activate action button,
  // kick off all the injection goodness.
  chrome.browserAction.onClicked.addListener(toggleInjection);
  // Handle requests from embedded content script.
  chrome.extension.onRequest.addListener(restoreState);
}());
