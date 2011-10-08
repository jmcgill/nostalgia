// Copyright James McGill, 2011
// Author: James McGill (jmcgill@plexer.net)
//
// A simple library and UI for editing Javascript programs.

var editor_;
var renderer_;
 
function cancelEvent() {
  return false;
}

function run() {
  code = editor_.getValue();
  document.getElementById("editor").blur();

  // Recursively split at input.
  // TODO(jmcgill): Parse regex to extract correct variable names.
  // TODO(jmcgill): Ensure subsequent inputs are nested for correct access. 
  // Ensure var x = input(); and x = input(); both parse.
  // Don't care about x = y = input(); 

  // Example:
  // x = input();
  // y = input();
  // print(x + y);

  // input_async(f1);
  // function f1(x) {
  //   input_async(f2);
  //   function f2(y) {
  //   print (x + y); // This will capture x from above.
  // }}
      
  //index = code.indexOf("input();");
  //code = code.substr(0, index) + "input_async(f1);"
  //+ "function f1(text) {" + code.substr(index + 8, code.length) + '}';
  //window.console.log(code);

  var input_func = 
    "function input() {" + 
      "var notifier = new EventNotifier();" +
      "renderer_.input(notifier);" + 
      "notifier.wait->();" +
      "if (!isNaN(parseInt(global_text_))) return parseInt(global_text_);" +
      "return global_text_;" +
    "}";

  // Make calls to input obey blocking semantics.
  // code = code.replace('/input/g', 'boob');
  code = code.replace(/input\(\)/g, 'input->()');

  // Ensure that the input func is compiled in the same scope.
  code = 'function run() {' + input_func + code + '}\nspawn(run())';
  window.console.log(code);

  var output;  
  var compiler = new NjsCompiler();
  try {
    output = compiler.compile(code, "code");
  } catch(e) {
    alert(e.message);
  }
  window.console.log(output);
  eval(output);
}

function print(n) {
  renderer_.write(n);
}

function input_async(f) { 
  // Ask the renderer to call us back when someone inputs text.
  renderer_.input(f);
}

function save() {
  document.getElementById("status").innerHTML = "Saving.";
  $.post("/save", {
    id: id_,
    program: editor_.getValue(),
  },
  function() {
    document.getElementById("status").innerHTML = "Saved."; 
  });
}

//x = prompt("asd");
//x = input ()
//print (x);
