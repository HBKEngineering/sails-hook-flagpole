'use strict';

module.exports = function flagpoleHook(sails) {

  var moduleUtils = require('./utils/module-utils');
  var _ = require('lodash');

  return {

    defaults: {
      __configKey__: {
        compoundDoc : true,
        included    : true,
        logDetails : true,
        jsonapi: {
          errors: true,
          data: true
        },
        debug: {
          logDetails: true,
          includeReq: false
        }
      }
    },

    loadModules: function (cb) {
      var hook = this;
      moduleUtils.loadResponses(sails, function loadedflagpoleResponseModules(err, responseDefs) {
        if (err) return cb(err);
        // Register responses as middleware
        hook.middleware.responses = responseDefs;
        return cb();
      });
    },

    initialize: function(cb){
        cb();
    },

    /**
     * Shadow route bindings
     * @type {Object}
     */
    routes: {
      before: {

        /**
         * Add custom response methods to `res`.
         *
         * @param {Request} req
         * @param {Response} res
         * @param  {Function} next [description]
         * @api private
         */
        'all /*': function addResponseMethods(req, res, next) {


          // Attach custom responses to `res` object
          // Provide access to `req` and `res` in each of their `this` contexts.
          _.each(sails.middleware.flagpole.responses, function eachMethod(responseFn, name) {
            if(typeof responseFn == 'function') {
              sails.log.silly('Binding response ' + name + ' to ' + responseFn);
              res[name] = _.bind(responseFn, {
                req: req,
                res: res,
              });
            }
          });
          // Proceed!
          next();
        }
      }
    }
  };
};
