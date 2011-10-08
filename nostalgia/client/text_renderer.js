// Copyright James McGill, 2011
// Author: James McGill (jmcgill@plexer.net)
//
// An implementation of renderer that knows how to render text to a DIV.
// Also implements delegate functions for a console text input.

function TextRenderer(element, rows, font_size) {
  this.element_ = element;
  this.console_ = new Console(document, this);

  // Add a blinking cursor.
  this.cursor_ = $("<div>").css({
    position: 'absolute',
    height: '24px', 
    width: '14px',
    top: ((24 * 10) + 20 + 12) + 'px',
    left: '48px',
    backgroundColor: '#0acb18'});
  $(this.element_).append(this.cursor_);
  window.setInterval(bind(this, this.toggleCursor), 500);

  // Add a div which we can write text to.
  this.inner_ = $("<div>").css({
    height: '100%', 
    width: '100%'});
  $(this.element_).append(this.inner_);

  // Maximum number of rows to show. Save one for active text.
  this.rows_ = rows - 1;
  this.rows_ = 9;
 
  // Permanant text, in lines of 80 characters.
  this.contents_ = [];
  for (var i = 0; i < this.rows_; ++i) this.contents_.push('');

  // Initialize the screen.
  this.active_text_ = '';
  this.render_();
}

// Register a callback to be called when new text is available. This callback
// will be cleared once called.
TextRenderer.prototype.input = function(fn) {
  this.callback_ = fn;
}

// Write text to the display.
TextRenderer.prototype.write = function(text) {
  if (this.contents_.length == this.rows_) {
    // Drop the topmost line.
    this.contents_ = this.contents_.splice(1);
  }

  // TODO(jmcgill): Break up into rows of 80 characters.
  this.contents_.push(text);
  this.render_();

  if (this.callback_) {
    // Move to a temporary variable so we can clear it, and avoid recursion.
    var x = this.callback_;
    this.callback_ = null;
    global_text_ = text;
    x();
  }
}

//TextRenderer.prototype.updateCursor = function(position) {
//}

TextRenderer.prototype.render_ = function() {
  this.inner_.html(this.contents_.join('<br>') + '<br>' + '>' + 
      this.active_text_);
}

TextRenderer.prototype.updateActiveText = function(text) {
  this.active_text_ = text;
  this.cursor_.css('left', 24 + (14 * (text.length + 1)) + 'px');
  this.render_();
}

TextRenderer.prototype.toggleCursor = function() {
  if (this.cursor_.css('display') == 'none') {
    this.cursor_.css('display', 'block');
  } else {
    this.cursor_.css('display', 'none');
  }
};
