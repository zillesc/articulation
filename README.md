# articulation
Chrome extension for efficiently handling UIUC articulation forms

Installation
------------

  1. Clone or download the repository.  
  2. Configure (see below).  
  3. Open Chrome browser
  4. go to:  chrome://extensions  (or Tools > Extensions under the Chrome menu)
  5. Click Load unpacked extension... to pop up a file-selection dialog.
  6. Navigate to the directory in which this extension's files live, and select it.


Configuration
-------------

Currently configured for Computer Science courses, but could be configured for other departments/units.  Configuration is currently performed by editing the popup.js file and adding/modifying entries in the _classes array.  (Sorry...)

Currently, it supports two kinds of entries:

  1. entries for courses not articulated to a specific course (e.g., CS 1--), which look like the following
  
     `'CS 1--' : { rubric: 'CS', level: '1--',  isrealclass: false },`

  2. entries for actual courses
  
     `'CS 101' : { rubric: 'CS', number: '101', isrealclass: true, hours: 3, title: 'Intro. to Computing for Science and Engineering' },`

In both cases, the first thing (the key) is the thing that will show up in the popup list.



Usage
-----

If the articulation page is not already the active tab, clicking this
extension will open a new tab and load the articulation page.

If the articulation page is the active tab, clicking the extension
will bring up a menu.  Selecting a course from the menu will attempt
to populate the articulation page.  After the page is filled in, the
user can make any manual changes (e.g., write an explanation) and then
submit, either using the normal means in the form or by using the
'Submit' button from this extension.