/*	jawn.js ------------------------------------------------------------------*/
/*	by austin for free -------------------------------------------------------*/
/*	license: MIT -------------------------------------------------------------*/
(function () {
	"use strict";

	if (typeof window === 'undefined') {
		var _ = require('underscore');
	}

	var jawn = {};

	jawn.parseQuery = function (queryString) {
		var queryArray = queryString.split('&'),
			output = [],
			x,
			key,
			val;
		_.each(queryArray, function (set) {
			x = set.split('=');
			key = x[0];
			val = (x[1] != null ? x[1] : null);

			if (val === '') { val = null; }
			else if (val === 'true') { val = true; }
			else if (val === 'false') { val = false; }
			else if (val === val + 0) { val = val + 0; }
			else { val = decodeURIComponent(val); }

			if (key && key.length) {
				output[key] = val;
			}
		});
		return output;
	}

	jawn.textToHtml = function (text) {
		return text.replace('\n', '<br />');
	}

	jawn.pathify = function (path) {
		path = path.substring(0,1) === '/' ? path.substring(1) : path;
		path = path.substring(-1) === '/' ? path.substring(0, -1) : path;
		return path.split('/');
	}

	jawn.filenameFromPath = function (path) {
		var pathParts = jawn.pathify(path);
		return pathParts[pathParts.length - 1];
	}

	jawn.pathWithoutFilename = function (path, force) {
		force = force || false;
		if (jawn.containsPeriod(path) || force) {
			var pathParts = jawn.pathify(path);
			pathParts.pop();
			return pathParts.join('/') + '/';
		} else {
			return path;
		}
	}

	// if string contains period rtn true
	jawn.containsPeriod = function (input) {
		return input && input.length && input.indexOf('.') !== -1;
	}

	// returns just the file extension
	jawn.getFileExtension = function (input, hard) {
		return jawn.containsPeriod(input) ? input.substring(input.lastIndexOf('.') + 1) : hard ? false : input;
	}

	// returns everything up to file extension
	jawn.removeFileExtension = function (input, hard) {
		return jawn.containsPeriod(input) ? input.substring(0, input.indexOf('.')) : hard ? false : input;
	}

	jawn.appendToFilename = function (filename, addendum) {
		var pre = jawn.removeFileExtension(filename);
		var post = jawn.getFileExtension(filename);
		return pre + addendum + '.' + post;
	}

	jawn.autopath = function () {
		pathParts = arguments;
		output = '';
		_.each(pathParts, function (part, idx) {
			if (idx === 0 && part.substring(0, 1) === '.' && part.substring(0, 2) === './') {
				output += './';
				part = part.substring(2);
			} else if (idx === 0 && part.indexOf('http://') === 0) {
				output += 'http://';
				part = part.substring(7);
			} else if (idx === 0 && part.indexOf('https://') === 0) {
				output += 'https://';
				part = substr(part, 8);
			} else if (output.substring(-1) !== '/') {
				output += '/';
			}
			if (part.substring(0, 1) === '/') {
				part = part.substring(1);
			}
			if (part.substring(-1) === '/') {
				part = part.substring(0, -1);
			}
			output += part;
		});
		return output;
	}

	jawn.fa = function (icon) {
		return 'fa fa-' + icon;
	}

	jawn.bgi = function (image) {
		return 'url("' + image + '")';
	}

	jawn.slug = function (input, separator) {
		if (!separator) separator = '-';
		return input ? input.toLowerCase().replace(/-+/g, '').replace(/\s+/g, separator).replace(/[^a-z0-9-]/g, '') : null;
	}

	jawn.hasImageExt = function (fileName) {
		return _.some(['jpg','png','svg','jpeg','gif','bmp'], function (t) {
			return fileName.lastIndexOf('.' + t) === fileName.length - (t.length + 1);
		});
	}

	jawn.wrapDoubleBreaks =  function (x) {
		return "\n\n" + x + "\n\n";
	}

	jawn.ucFirst = function (s) {
		return (s && s.length ? s[0].toUpperCase() + s.slice(1) : s);
	}

	jawn.lcFirst = function (s) {
		return (s && s.length ? s[0].toLowerCase() + s.slice(1) : s);
	}

	jawn.isNumeric = function (x) {
		return !_.isArray(x) && (x - parseFloat(x) + 1) >= 0;
	}

	jawn.isUppercase = function (str) {
	  return (_.isString(str) && str.toUpperCase() === str);
	}

	jawn.toCamelCase = function (input, overrideAllCaps) {
	  if (!_.isString(input) || !input.length) return input;
		if (!overrideAllCaps && jawn.isUppercase(input)) return input;
		var _prefix = (input.indexOf('_') === 0);
	  var output = input.split(/[\s,_+]+/);
	  output = _.map(output, jawn.ucFirst);
	  output = output.join('');
	  output = jawn.lcFirst(output);
		output = (_prefix ? '_' : '') + output;
	  return output;
	}

	jawn.castNumberTypes = function (x) {
	  return jawn.isNumeric(x) ? (x * 1) : x;
	}

	jawn.hath = function (obj, prop) {
	  if (!_.isObject(obj)) return undefined;
	  var propList = _.map(prop.split('.'), jawn.castNumberTypes);
	  while (propList.length) {
	    if (_.has(obj, propList[0])) {
	      if (propList.length === 1) return true;
	      obj = obj[propList.shift()];
	    } else return false;
	  }
	  return false;
	}

	jawn.extrude = function (obj, targetProp) {
	  if (!_.isObject(obj) || !jawn.hath(obj, targetProp)) return false;
	  var targetProps = _.map(targetProp.split('.'), jawn.castNumberTypes);
	  while (targetProps.length) {
	    obj = obj[targetProps.shift()];
	  }
	  return obj;
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	  module.exports = jawn;
	} else {
	  window.jawn = jawn;
	}
})();
