(function () {
  'use strict';
  var doc = window.document,
      storage = window.localStorage;

  // Restores select box state to saved value from localStorage.
  function restoreOptions() {
    var cssfileValue = storage.cssfile,
        cssfileInput;
    if (!cssfileValue) {
        return;
    }
    cssfileInput = doc.getElementById('cssfile');
    cssfileInput.value = cssfileValue;
  }

  function showStatus(msg) {
    var status = doc.getElementById('status');
    status.innerHTML = msg;
    setTimeout(function() {
        status.innerHTML = '';
    }, 1500);
  }

  // Saves options to localStorage.
  function saveOptions() {
    var cssfileInput = doc.getElementById('cssfile');
    storage.cssfile = cssfileInput.value;
    // Update status to let user know options were saved.
    showStatus('Options Saved');
  }

  // Initialize
  function init() {
    doc.getElementById('cssfile').focus();
    restoreOptions();
    doc.getElementById('saveButton')
      .addEventListener('click', saveOptions);
  }

  window.onload=init;
}());
