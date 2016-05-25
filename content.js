var steps = [
  { id: 'ctl00_ContentPlaceHolder1_rdo_purview_0', action: 'click' },
  { id: 'ctl00_ContentPlaceHolder1_txt_program', action: 'text', field: 'rubric' },
  { id: 'ctl00_ContentPlaceHolder1_rdo_transferrabilty_1', action: 'click'},
  { id: 'ctl00_ContentPlaceHolder1_rdo_multicourse_sequence_1', action: 'conditional', field: 'isrealclass', condition: false },
  { id: 'ctl00_ContentPlaceHolder1_rdo_multicourse_sequence_0', action: 'conditional', field: 'isrealclass', condition: true },
  { id: 'ctl00_ContentPlaceHolder1_txt_non_equiv_level',  action: 'text', field: 'level', ignoreIfNotPresent: true },
  { id: 'ctl00_ContentPlaceHolder1_txt_non_equiv_rubric', action: 'text', field: 'rubric', tryonce: true },
  { id: 'ctl00_ContentPlaceHolder1_txt_course_number',  action: 'text', field: 'number', ignoreIfNotPresent: true },
  { id: 'ctl00_ContentPlaceHolder1_txt_credit_hours',  action: 'text', field: 'hours', ignoreIfNotPresent: true },
  { id: 'ctl00_ContentPlaceHolder1_txt_course_title',  action: 'text', field: 'title', ignoreIfNotPresent: true },
  { id: 'ctl00_ContentPlaceHolder1_txt_rubric',  action: 'text', field: 'rubric', tryonce: true },
];


// not eligible text box 'ctl00_ContentPlaceHolder1_txt_suggestions'

function fillInForm(classinfo, stepNumber) {
  var step = steps[stepNumber];
  console.log(step.id);
  var timeOut = 0;
  var widget = document.getElementById(step.id);
  if (widget) {
    switch (step.action) {
      case 'click':
        widget.click();
        break;
      case 'conditional':
        if (classinfo[step.field] == step.condition) { 
          widget.click();
        }
        break;
      case 'text':
        console.log(step.field + ": " + classinfo[step.field]);
        widget.value = classinfo[step.field];
        break;
      case 'constText':
        widget.value = step.text;
        break;
    }
    // successfully completed a step, move on to the next one.
    stepNumber ++;
  } else if (step.tryonce || step.ignoreIfNotPresent && classinfo[step.field] === undefined) {
    // just skip and move on to the next one.
    stepNumber ++;
  } else {    
    // else retry the same step in a few milliseconds, the form is
    // being rendered based on our previous input
    timeOut = 100;
  }
  if (stepNumber < steps.length) {
    setTimeout(function() { fillInForm(classinfo, stepNumber); }, timeOut);
  }
}



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.submit_only) {     
      document.getElementById('ctl00_ContentPlaceHolder1_btn_submit').click();
    } else {
      fillInForm(request, 0);
    }
  }
);