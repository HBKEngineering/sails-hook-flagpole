/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 * return res.badRequest(data, 'some/specific/badRequest/view');
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */

module.exports = function badRequest(data, options) {

  var config = {
<<<<<<< HEAD
    logMethod: 'debug',
=======
>>>>>>> 719def8367f62b8b104791a14191754931c295a3
    logMessage: 'Sending 400 ("Bad Request") response',
    statusCode: 400,
    logData: true,
    isError: true,
    isGuessView: true
  };

  require('./index').buildResponse(this.req, this.res, data, options, config);

};
