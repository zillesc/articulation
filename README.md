# articulation
Chrome extension for efficiently handling UIUC articulation forms

Currently configured for Computer Science courses, but could be configured for other departments/units.  Configuration is currently performed by editing the popup.js file and adding/modifying entries in the _classes array.  (Sorry...)

Currently, it supports two kinds of entries:

  1. entries for courses not articulated to a specific course (e.g., CS 1--), which look like the following
  
     `'CS 1--' : { rubric: 'CS', level: '1--',  isrealclass: false },`

  2. entries for actual courses
  
     `'CS 101' : { rubric: 'CS', number: '101', isrealclass: true, hours: 3, title: 'Intro. to Computing for Science and Engineering' },`

In both cases, the first thing (the key) is the thing that will show up in the popup list.
