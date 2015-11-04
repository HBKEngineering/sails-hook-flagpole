
'use strict';

/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 *
 * @param  {Object} data
 */


module.exports.buildResponse = function (req, res, data, options, config) {

  var JSONAPISerializer = require('jsonapi-serializer');
  var modelUtils = require('../utils/model-utils');
  var normUtils = require('../utils/norm-utils');
  var pluralize = require('pluralize');
  var Model,
      modelName,
      pluralModel,
      opts,
      relatedModelNames,
      jsonApiRes;

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  config.logMethod = config.logMethod || 'verbose';

  // Log error to console
  if (config.logData && data !== undefined) {
    sails.log[config.logMethod](config.logMessage+': \n', data);
  } else {
    sails.log[config.logMethod](config.logMessage);
  }

  // Set status code
  res.status(config.statusCode);

  // JSON just is data, which allows us to override with jsonapi error parsing
//  json = data;

  if(config.isError) {
    // Only include errors in response if application environment
    // is not set to 'production'.  In production, we shouldn't
    // send back any identifying information about errors.
    

    // @todo encapulate this in norm-utils?        
    // id: a unique identifier for this particular occurrence of the problem.
    // links: a links object containing the following members:
    // about: a link that leads to further details about this particular occurrence of the problem.
    // status: the HTTP status code applicable to this problem, expressed as a string value.
    // code: an application-specific error code, expressed as a string value.
    // title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
    // detail: a human-readable explanation specific to this occurrence of the problem.
    // source: an object containing references to the source of the error, optionally including any of the following members:
    // pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].
    // parameter: a string indicating which URI query parameter caused the error.
    // meta: a meta object containing non-standard meta-information about the error.


    var jsonData = {

      id: Date.now(),
      about: data.about,
      status: config.statusCode,
      code: data.code,
      title: config.name,
      detail: data.detail,
      source: { 
        pointer: data.pointer,
        parameter: data.parameter,
      },
      meta: {
        debug: data.debug, //an optional "debug" object that gets stripped in production
        timestamp: Date.now()
      }
    };



    if (sails.config.environment === 'production') {
      jsonData.meta.debug = null;
    }

    json = new JSONAPISerializer('errors', jsonData, opts);

    if (sails.config.environment === 'production' && sails.config.keepResponseErrors !== true) {
      data = undefined;
    }
  }


  // If appropriate, serve data as JSON(P)
  if (req.wantsJSON) {
    return res.jsonx(json);
  }

  // If second argument is a string, we take that to mean it refers to a view.
  // If it was omitted, use an empty object (`{}`)
  options = (typeof options === 'string') ? { view: options } : options || {};

  // If a view was provided in options, serve it.
  // Otherwise try to guess an appropriate view, or if that doesn't
  // work, just send JSON.
  if (options.view) {
    return res.view(options.view, { data: data });
  }

  // If no second argument provided, try to serve the implied view,
  // but fall back to sending JSON(P) if no view can be inferred.
  else {
    if(config.isGuessView) {
      return res.guessView({ data: data }, function couldNotGuessView () {
        return res.jsonx(data);
      });
    } else {
      return res.view(config.statusCode, { data: data }, function (err, html) {

        // If a view error occured, fall back to JSON(P).
        if (err) {
          //
          // Additionally:
          // • If the view was missing, ignore the error but provide a verbose log.
          if (err.code === 'E_VIEW_FAILED') {
            sails.log.verbose('res.'+config.name+'() :: Could not locate view for error page (sending JSON instead).  Details: ', err);
          }
          // Otherwise, if this was a more serious error, log to the console with the details.
          else {
            sails.log.warn('res.'+config.name+'() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
          }
          return res.jsonx(data);
        }

        return res.send(html);
      });
    }
  }
};
