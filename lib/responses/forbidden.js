/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden (data, options) {

  var config = {
<<<<<<< HEAD
    logMethod: 'debug',
=======
>>>>>>> 719def8367f62b8b104791a14191754931c295a3
    logMessage: 'Sending 403 ("Forbidden") response',
    statusCode: 403,
    logData: true,
    isError: true,
    isGuessView: false,
    name: 'forbidden'
  };

  require('./index').buildResponse(this.req, this.res, data, options, config);

};
