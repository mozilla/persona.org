/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require('fs');
const util = require('util');

const ejs = require('ejs');

const OBJ_TOSTRING = Object.prototype.toString;

function isArray(obj) {
  return OBJ_TOSTRING.call(obj) === '[object Array]';
}

function isObject(obj) {
  return OBJ_TOSTRING.call(obj) === '[object Object]';
}

function format(fmt, obj, named) {
  if (!fmt) return "";
  if (!fmt.replace) {
    return fmt;
  }
  if (isArray(obj) || named === false) {
    return fmt.replace(/%s/g, function(match){return String(obj.shift());});
  } else if (isObject(obj) || named === true) {
    return fmt.replace(/%\(\s*([^)]+)\s*\)s/g, function(m, v){
      return String(obj[v]);
    });
  }
}

// the wintersmith-ejs plugin doesn't work with 2.x
// this creates an EJSTemplate, and EJSContentPlugin
module.exports = function(env, callback) {
  
  function loadEJS(filepath, callback) {
    fs.readFile(filepath.full, function(err, contents) {
      if (err) return callback(err);

      try {
        var template = ejs.compile(String(contents), { filename: filepath.full });
        callback(null, template);
      } catch (e) {
        callback(e);
      }
    });

  }

  function EJSTemplate(template) {
    this.template = template;
  }

  EJSTemplate.prototype.render = function render(locals, callback) {
    try {
      callback(null, new Buffer(this.template(locals)));
    } catch (e) {
      callback(e);
    }
  };

  EJSTemplate.fromFile = function fromFile(filepath, callback) {
    loadEJS(filepath, function(err, templateFn) {
      if (err) return callback(err);

      callback(null, new EJSTemplate(templateFn));
    });
  };

  env.registerTemplatePlugin("**/*.ejs", EJSTemplate);

  function EJSPage(filepath, content) {
    env.plugins.Page.call(this, filepath, {});
    this.filepath = filepath;
    this.templateFn = content;
  }

  util.inherits(EJSPage, env.plugins.Page);

  EJSPage.prototype.name = function name() {
    if (this.filename === 'index.html') {
      return 'index';
    } else {
      return this.filename.replace(/[\/\\].*/g, '');
    }
  };

  EJSPage.prototype.getView = function getView() {
    return function viewFn(env, locals, contents, templates, callback) {
      locals.gettext = function(x) { return x; };
      locals.cachify = function(x) { return x; };
      locals.format = format;
      this.content = this.templateFn(locals);
      return env.views.template.apply(this, arguments);
    };
  };

  EJSPage.prototype.getUrl = function getURL(base) {
    var url = env.plugins.Page.prototype.getUrl.apply(this, arguments);
    return url && url.replace(/\.html$/, '');
  };

  EJSPage.fromFile = function fromFile(filepath, callback) {
    loadEJS(filepath, function(err, templateFn) {
      if (err) return callback(err);

      callback(null, new EJSPage(filepath, templateFn));
    });
  };

  env.registerContentPlugin('pages', '**/*.ejs', EJSPage);

  callback();
};
