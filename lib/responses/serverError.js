/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

module.exports = function serverError (data, options) {

<<<<<<< HEAD

=======
>>>>>>> 719def8367f62b8b104791a14191754931c295a3
  var config = {
    logMethod: 'error',
    logMessage: 'Sending 500 ("Server Error") response',
    statusCode: 500,
    logData: true,
    isError: true,
    isGuessView: false,
    name: 'serverError'
  };

  require('./index').buildResponse(this.req, this.res, data, options, config);

};
