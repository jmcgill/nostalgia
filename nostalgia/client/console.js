// Copyright 2011, James McGill
// Author: jmcgill@plexer.net
//
// A class which captures key press events, and interprets them as instructions
// to a single line console.

var BACKSPACE = 8;
var ENTER = 13;

function Console(element, delegate) {
  this.text_ = '';
  this.delegate_ = delegate;
  
  $(element).bind('keypress', bind(this, this.onKeyPress));
  $(element).bind('keydown', bind(this, this.onKeyDown));
}

Console.prototype.onKeyDown = function(e) {
  if (e.target.localName == "textarea") return;

  if (e.keyCode == BACKSPACE) {
    if (this.text_.length > 0) {
      this.text_ = this.text_.substring(0, this.text_.length - 1);
      this.delegate_.updateActiveText(this.text_);
    }
    return false;
  } else if (e.keyCode == ENTER) {
    this.delegate_.write(this.text_);
    this.text_ = '';
    this.delegate_.updateActiveText(this.text_);
    return false;
  }
}

Console.prototype.onKeyPress = function(e) {
  if (e.target.localName == "textarea") return;

  this.text_ += String.fromCharCode(e.keyCode);
  this.delegate_.updateActiveText(this.text_);
  return false;
}

Console.prototype.getText = function() {
  return this.text_;
}
