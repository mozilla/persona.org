/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(function() {

  function resize() {

    $('section:has(.blurb)').each(function() {
      var row = $(this);
      // Get tallest blurb
      var tallestBlurb = 0;
      row.children('.blurb').each(function() {
      
        var $this = $(this);

        var height = $this.height();
        if (height > tallestBlurb) {
          tallestBlurb = height;
        }
        console.log(tallestBlurb);
      }).height(tallestBlurb);
    });

  }

  resize();
  $(window).on('resize', resize);

  console.log('asdf');

});
