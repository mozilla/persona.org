/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require('path');

const wintersmith = require('wintersmith');

var env = wintersmith(path.join(__dirname, '..', 'config.json'));

env.build(function(err) {
  if (err) console.error(err);
  else console.log('Built!');
});
