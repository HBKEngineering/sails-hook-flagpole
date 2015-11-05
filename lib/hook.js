'use strict';

module.exports = function flagpoleHook(sails) {

  let moduleUtils = require('./utils/module-utils');
  let _ = require('lodash');

  return {

    defaults: {
      __configKey__: {
        _hookTimeout: 10000, // wait 10 seconds before timing out
        compoundDoc : true,
        included    : true,
<<<<<<< HEAD
        logDetails : true,
        jsonapi: {
          errors: true,
          data: true
        },
        debug: {
          logDetails: true,
          includeReq: false
=======
        flagpole: {
          errors: true,
          data: true
>>>>>>> 719def8367f62b8b104791a14191754931c295a3
        }
      }
    },

    loadModules: function (cb) {
      let hook = this;
      moduleUtils.loadResponses(sails, function loadedflagpoleResponseModules(err, responseDefs) {
        if (err) return cb(err);
        // Register responses as middleware
        hook.middleware.responses = responseDefs;
        return cb();
      });
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
<<<<<<< HEAD


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
=======
          // Attach custom responses to `res` object
          // Provide access to `req` and `res` in each of their `this` contexts.
          _.each(sails.middleware.flagpole.responses, function eachMethod(responseFn, name) {
            sails.log.silly('Binding response ' + name + ' to ' + responseFn);
            res[name] = _.bind(responseFn, {
              req: req,
              res: res,
            });
>>>>>>> 719def8367f62b8b104791a14191754931c295a3
          });
          // Proceed!
          next();
        }
      }
    }
  };
};
