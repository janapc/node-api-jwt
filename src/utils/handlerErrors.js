/**
 * @description Format the error
 */
class HandlerErrors extends Error {
  /**
   * @description Rhe constructor receipt these params and formatted to error
   * @param {number} code statusCode
   * @param {string} message message of error
   */
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = HandlerErrors;
