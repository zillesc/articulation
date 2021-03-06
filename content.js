/**
 * Below is the sequence of DOM elements to try to edit, in the order they should be edited by the extension.
 * 
 * The form is interactive, based on your selections, it presents different options.  This is why the order
 * matters (at least in some cases).  Also, it explains why (below) we use 'setTimeout' as a wait mechanism
 * for the DOM elements to be created.
 * 
 * We handle the fact that not all DOM elements will exist in two ways:
 *   1. 'ignoreIfNotPresent' will cause us to skip the update if the DOM element isn't present and 
 *      if the desired field is not present in the classinfo object received from the extension
 *   2. 'tryonce' will cause us to skip this update if the DOM element isn't present.  This is a bit
 *      of a hack to avoid having to have separate names for 'rubric' for the two different kinds of 
 *      objects.  It is important that a 'tryonce' update is not the first update following any action
 *      that updates the DOM.  (Otherwise, we can't distinguish a DOM element that hasn't loaded yet,
 *      from one that isn't ever going to get loaded.)
 */

var steps = [
  { id: 'rbdeptpurviewyes', action: 'click' },
//  { id: 'Comments', action: 'text', field: 'dept' },

  { id: 'rbgenedyes', action: 'conditional', field: 'gened', condition: true},
  { id: 'rbgenedno',  action: 'conditional', field: 'gened', condition: false},
    
  { id: 'Program', action: 'text', field: 'dept' },
  { id: 'rbtransferyes', action: 'conditional', field: 'noteligible', condition: false},
  { id: 'rbtransferno',  action: 'conditional', field: 'noteligible', condition: true},
    
  // placed before 'multicourse sequence' ones because those won't show up.  this one terminates if present.
  { id: 'Suggestions', action: 'text', field: 'explain', ignoreIfNotPresent: true, terminate: true },

  { id: 'rbequivalentyes', action: 'conditional', field: 'isrealclass', condition: true },
  { id: 'rbequivalentno',  action: 'conditional', field: 'isrealclass', condition: false },
  // 'rubric' follows 'level' because level will ensure that it is loaded, so we can use 'tryonce'
  { id: 'NonEquivalLevel',  action: 'text', field: 'level', ignoreIfNotPresent: true },
  { id: 'NonEquivalRubric', action: 'text', field: 'rubric', tryonce: true },
  // 'rubric' follows 'number' because number will ensure that it is loaded, so we can use 'tryonce'
  //  { id: 'SubCourseNum',  action: 'text', field: 'number', ignoreIfNotPresent: true },
  { id: 'SubRubric', action: 'text', field: 'rubric', tryonce: true },
//  { id: 'credit_hours',  action: 'text', field: 'hours', ignoreIfNotPresent: true },
//  { id: 'course_title',  action: 'text', field: 'title', ignoreIfNotPresent: true },
];


/**
 * Perform a single step in filling out the form, using 'steps' above
 *
 * @param {object} classinfo - information about the class to use for populating the form
 * @param {integer} stepNumber - index (starting at 0) in the step array
 */
function fillInForm(classinfo, stepNumber) {
  var timeOut = 0;	       		   // time before attempting next step
  var step = steps[stepNumber];		   // info associated with current step
  console.log(step.id);

  // get the indicated DOM element.  If present, perform the specified operation.
  var widget = document.getElementById(step.id);
  if (widget) {
    switch (step.action) {
      case 'click':
        widget.click();
        break;
      case 'conditional':
        if (classinfo[step.field] == step.condition || 
            (!step.condition && classinfo[step.field] === undefined)) { 
          widget.click();
        }
        break;
      case 'text':
        // console.log(step.field + ": " + classinfo[step.field]);
        widget.value = classinfo[step.field];
        break;
      case 'constText':
        widget.value = step.text;
        break;
    }
    if (step.terminate && classinfo[step.field] !== undefined) {
      return;
    }
    // successfully completed a step, move on to the next one.
    stepNumber ++;
  } else if (step.tryonce || (step.ignoreIfNotPresent && classinfo[step.field] === undefined)) {
    // just skip and move on to the next one.
    stepNumber ++;
  } else {
    console.log('waiting\n');
    // else retry the same step in a few milliseconds, the form is
    // being rendered based on our previous input
    timeOut = 100;
  }
  if (stepNumber < steps.length) {
    setTimeout(function() { fillInForm(classinfo, stepNumber); }, timeOut);
  }
}


/**
 * Setup a receiver for messages from the extension.
 *
 * There are two main kinds of messages.  
 *  1. those to force a click of the submit button.
 *  2. those to fill out a form using the information from a classinfo object
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(request);
    if (request.submit_only) {     
      document.getElementById('ctl00_ContentPlaceHolder1_btn_submit').click();
    } else {
      fillInForm(request, 0);
    }
  }
);
