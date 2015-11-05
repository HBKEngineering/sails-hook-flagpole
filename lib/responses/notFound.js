/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 * return res.notFound(err);
 * return res.notFound(err, 'some/specific/notfound/view');
 *
 * e.g.:
 * ```
 * return res.notFound();
 * ```
 *
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.
 */

module.exports = function notFound (data, options) {

  var config = {
<<<<<<< HEAD
    logMethod: 'debug',
=======
>>>>>>> 719def8367f62b8b104791a14191754931c295a3
    logMessage: 'Sending 404 ("Not Found") response',
    statusCode: 404,
    logData: true,
    isError: true,
    isGuessView: false,
    name: 'notFound'
  };

  require('./index').buildResponse(this.req, this.res, data, options, config);

};
