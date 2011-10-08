// Copyright James McGill, 2011
// Author: James McGill (jmcgill@plexer.net)
//
// A simple library and UI for editing Javascript programs.

var editor;

function load() {
  editor = CodeMirror(document.getElementById("editor"));
}

function run() {
  code = editor.getValue();
  eval(code);
}

function print(n) {
  var m = document.getElementById("main");
  m.innerHTML = m.innerHTML + n + "<br>";
}
