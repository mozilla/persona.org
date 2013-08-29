/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(function() {

  // Firefox and IE have rendering bugs where if the box-sizing is set to
  // border-box and a min-height is set, padding is added on top of the
  // min-height, making elements render using the normal W3C box model.  Use
  // a bit of bug detection here in case the bugs are fixed.
  function paddingAddedToMinHeight() {
    var div = document.createElement("div");
    $(div).css({
      "box-sizing": "border-box",
      "min-height": "100px",
      "padding-top": "10px",
      "position": "absolute",
      "top": "-2000px"
    });

    $("body").append(div);

    var divHeight = parseInt($(div).outerHeight(), 10);
    $(div).remove();
    return divHeight === 110;
  }

  function elementHeightWithMargins(element) {
    element = $(element);
    var height = element.outerHeight()
                 + parseInt(element.css("margin-top"), 10)
                 + parseInt(element.css("margin-bottom"), 10);
    return height;
  }
  
  $(window).bind('resize', function() {
    var height = $(window).height()
              // To find the height of the content, subtract the height of the
              // header and footer INCLUDING any top and bottom margins they
              // have.  If the margins are not included, the center content
              // will be too tall and a scroll bar appears.
              - elementHeightWithMargins("header")
              - elementHeightWithMargins("footer");

    $("#vAlign").css({ "height": height });

    // On the manage page, the content element sometimes does not take up the
    // full height of the screen, leaving the footer to float somewhere in the
    // middle.  To compensate, force the min-height of the content so that the
    // footer remains at the bottom of the screen.
    var paddingTop = 0, paddingBottom = 0;

    if (paddingAddedToMinHeight()) {
      paddingTop = parseInt($("#content").css("padding-top") || 0, 10);
      paddingBottom = parseInt($("#content").css("padding-bottom") || 0, 10);
    }

    $("#content").css({ "min-height": height - paddingTop - paddingBottom });
  }).trigger('resize');

});
