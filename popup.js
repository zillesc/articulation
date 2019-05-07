// Copyright (c) 2016 Craig Zilles. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var department = 'CS';
var _classes = {
    'Nope'   : { rubric: 'CS', noteligible: true, explain: 'The University of Illinois does not grant college credit for courses whose primary focus is office applications (e.g., Microsoft Office).' },
    'CS 1--' : { rubric: 'CS', level: '1--',  isrealclass: false },
    'CS 2--' : { rubric: 'CS', level: '2--',  isrealclass: false },
    'CS 3--' : { rubric: 'CS', level: '3--',  isrealclass: false },
    'CS 4--' : { rubric: 'CS', level: '4--',  isrealclass: false },
    'CS 101' : { rubric: 'CS 101', isrealclass: true, hours: 3, title: 'Intro. to Computing for Science and Engineering' },
    'CS 105' : { rubric: 'CS 105', isrealclass: true, hours: 3, title: 'Intro Computing: Non-Tech' },
    'CS 125' : { rubric: 'CS 125', isrealclass: true, hours: 4, title: 'Introduction to Computer Science' },
    'CS 173' : { rubric: 'CS 173', isrealclass: true, hours: 3, title: 'Discrete Structures' },
    'CS 210' : { rubric: 'CS 210', isrealclass: true, hours: 2, title: 'Ethical & Professional Issues' },
    'CS 225' : { rubric: 'CS 225', isrealclass: true, hours: 4, title: 'Data Structures and Algorithms' },
    'CS 233' : { rubric: 'CS 233', isrealclass: true, hours: 4, title: 'Computer Architecture' },
    'CS 241' : { rubric: 'CS 241', isrealclass: true, hours: 4, title: 'System Programming' },
    'CS 357' : { rubric: 'CS 357', isrealclass: true, hours: 3, title: 'Numerical Methods I' },
    'CS 361' : { rubric: 'CS 361', isrealclass: true, hours: 3, title: 'Probability & Statistics for Computer Science' },

    'CS 374' : { rubric: 'CS 374', isrealclass: true, hours: 4, title: 'Algorithms and Models of Computation' },
    'CS 411' : { rubric: 'CS 411', isrealclass: true, hours: 3, title: 'Database Systems' },
    'CS 421' : { rubric: 'CS 421', isrealclass: true, hours: 3, title: 'Programming Languages' },
    'CS 423' : { rubric: 'CS 423', isrealclass: true, hours: 3, title: 'Operating System Design' },
    'CS 440' : { rubric: 'CS 440', isrealclass: true, hours: 3, title: 'Artificial Intelligence' },
    'CS 450' : { rubric: 'CS 450', isrealclass: true, hours: 3, title: 'Numerical Analysis' },
    'INFO 102' : { rubric: 'INFO 102', isrealclass: true, hours: 3, title: 'Little Bits to Big Ideas' },
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

/**
 * Send a message to the content.js script attached to the articulation page
 *
 * @param {object} message - an object containing the information needed to 
 * 	  	   	     affect the target page
 * two kinds of messages are supported: 
 *   1. { submit_only: true }
 *   2. an element from the _classes array above
 */
function sendMessageToContent(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

/**
 * Create a button in the popup for a class in _classes, with a callback
 * to send a message to the context.js to populate the form with class info
 *
 * @param {DOM element} context - the DOM element to insert the button into
 * @param {string} label - the identifier/label of for the button
 * 	  	   	   should be a key into the _classes array
 * 	  	   	     
 */
function createClassButton(context, label) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = label;
  button.onclick = function() { sendMessageToContent(_classes[label]); };
  context.appendChild(button);
}

var articulationUrl = 'https://secure.admissions.illinois.edu/CourseArticulation/Department/Default.aspx';
var articulationUrlPrefix = 'https://secure.admissions.illinois.edu/CourseArticulation'; 

/**
 * Dynamically generate content for popup
 */
function setup() {
  // attach a callback to the queue button.
  var queue_button = document.getElementById('queue');
  queue_button.onclick = function() {  alert('hi'); chrome.tabs.update({ url: articulationURL });  };

  // attach a callback to the submit button.
  var submit_button = document.getElementById('submit');
  submit_button.onclick = function() { sendMessageToContent({ submit_only: true }); };

  // create a button for each of the classes in _classes
  var button_div = document.getElementById('buttons');
  var keys = Object.keys(_classes);
  keys.sort();
  for (var i = 0 ; i < keys.length ; i ++) {
    _classes[keys[i]].dept = department;
    createClassButton(button_div, keys[i]);
  }
}


/**
 * Invoked extension clicked and popup.html finishes rendering.  Do one of two things:
 *    1. if not currently on the articulation page, load it in a new tab
 *    2. otherwise, create a menu of actions in popup.html for user 	  	   	     
 */
document.addEventListener('DOMContentLoaded', function() {

  getCurrentTabUrl(function(url) {
    if (url.indexOf(articulationUrlPrefix) === -1) {
      chrome.tabs.create({ url: articulationUrl });
    } else {
      setup();
    }
  });
});


