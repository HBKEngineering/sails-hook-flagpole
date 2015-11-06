'use strict';

var _ = require('underscore');
var JSONApiSerializer = require('jsonapi-serializer');
var modelUtils = require('../utils/model-utils');
var normUtils = require('../utils/norm-utils');
var pluralize = require('pluralize');


module.exports.buildResponse = function (req, res, data, options, config) {
  // get you a sails
  var sails = req._sails;

  config.logMethod = config.logMethod || 'verbose';

  // Log error to console
  if (config.logData && data !== undefined) {
    sails.log[config.logMethod](config.logMessage+': \n', data);
  } else {
    sails.log[config.logMethod](config.logMessage);
  }

  // set data to blank. this will be useful later.
  data = data || {};

  // Set status code
  res.status(config.statusCode);

  if(config.isError) {

    // magically parse some different kinds of potential data
    if(typeof data === 'string'){
      data = {detail: data};
    }

    // normalize that stuff, bro.

    var jsonData = {
      id: Date.now(),
      links: {
        about: data.about,
      },
      status: config.statusCode,
      code: data.code,
      title: config.name,
      detail: data.detail,
      source: {
        pointer: data.pointer,
        parameter: data.parameter,
      },
      meta: {
        debug: { // an optional "debug" object that gets stripped in production
          url: req.url, // url that made the request
          message: data.message,
          stack: data.stack
        }
      }
    };


    // if includeReq enabled, include the entire req in response. useful but not recommended, and off by default.
    if (sails.config.flagpole.debug.includeReq) {
      jsonData.meta.debug.req = req
    }


    // parse any other supplied key under meta.debug
    _.extend(jsonData.meta.debug, _.omit(data, 'id', 'links', 'status', 'code', 'title', 'detail', 'source', 'meta'));


    // remove all the undefineds from above
    jsonData.source = _.omit(jsonData.source, _.isUndefined);
    jsonData.links = _.omit(jsonData.links, _.isUndefined);
    jsonData = _.omit(jsonData, _.isUndefined);

    // log details to console. v useful. on by default.
    if (sails.config.flagpole.debug.logDetails) {
      sails.log[config.logMethod](jsonData);
    }


    // Only include debug info about errors in response if application environment
    // is not set to 'production'
    if (sails.config.environment === 'production') {
      jsonData.meta.debug = undefined;
    }

    // process json. kind of the most important part but it is not working right now.
    var json = new JSONApiSerializer('errors', jsonData);

    // Only include info about errors in response if application environment
    // is not set to 'production' and sails.config.keepResponseErrors isn't explicitly set true
    if (sails.config.environment === 'production' && sails.config.keepResponseErrors !== true) {
      json = undefined;
      data = undefined;
    }

  } else {
    json = data;
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
