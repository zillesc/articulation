// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var _classes = {
    'CS 1--' : { rubric: 'CS', level: '1--',  isrealclass: false },
    'CS 2--' : { rubric: 'CS', level: '2--',  isrealclass: false },
    'CS 3--' : { rubric: 'CS', level: '3--',  isrealclass: false },
    'CS 4--' : { rubric: 'CS', level: '4--',  isrealclass: false },
    'CS 101' : { rubric: 'CS', number: '101', isrealclass: true, hours: 3, title: 'Intro. to Computing for Science and Engineering' },
    'CS 105' : { rubric: 'CS', number: '105', isrealclass: true, hours: 3, title: 'Intro Computing: Non-Tech' },
    'CS 125' : { rubric: 'CS', number: '125', isrealclass: true, hours: 4, title: 'Introduction to Computer Science' },
    'CS 173' : { rubric: 'CS', number: '173', isrealclass: true, hours: 3, title: 'Discrete Structures' },
    'CS 225' : { rubric: 'CS', number: '225', isrealclass: true, hours: 4, title: 'Data Structures and Algorithms' },
    'CS 233' : { rubric: 'CS', number: '233', isrealclass: true, hours: 4, title: 'Computer Architecture' },
    'CS 357' : { rubric: 'CS', number: '357', isrealclass: true, hours: 3, title: 'Numerical Methods I' },
    'CS 374' : { rubric: 'CS', number: '374', isrealclass: true, hours: 4, title: 'Algorithms and Models of Computation' },
    'CS 411' : { rubric: 'CS', number: '411', isrealclass: true, hours: 3, title: 'Database Systems' },
};

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}


function fillInForm() {
  var purview = document.getElementById('ctl00_ContentPlaceHolder1_rdo_purview_0');
  console.log(purview);
  purview.value = 1;
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function sendMessageToContent(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

function classButtonClick(context) {
  var courseInfo = _classes[context];
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, courseInfo, function(response) {
      console.log(response.farewell);
    });
  });
}

function createClassButton(context, number) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = number;
  button.onclick = function() { classButtonClick(number); };
  context.appendChild(button);
}

document.addEventListener('DOMContentLoaded', function() {
  var articulationUrl = 'https://secure.admissions.illinois.edu/CourseArticulation/Department/Default.aspx';
  var articulationUrlPrefix = 'https://secure.admissions.illinois.edu/CourseArticulation'; 

  getCurrentTabUrl(function(url) {
    // chrome.browserAction.setBadgeText({text: "rawr"});

    // fillInForm();
    if (url.indexOf(articulationUrlPrefix) !== -1) {
      var submit_button = document.getElementById('submit');
      submit_button.onclick = function() { sendMessageToContent({ submit_only: true }); };

      var button_div = document.getElementById('buttons');
      var keys = Object.keys(_classes);
      keys.sort();
      for (var i = 0 ; i < keys.length ; i ++) {
        createClassButton(button_div, keys[i]);
      }
      return;
    }

    // Put the image URL in Google search.
    renderStatus('Opening ' + articulationUrl);
    var createProperties = { url: articulationUrl };

    chrome.tabs.create(createProperties, function(tab) {
      renderStatus('page loaded');
    });
  });
});

