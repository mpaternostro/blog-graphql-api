class ServerError extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super();
    this.message = message;
    this.code = 500;
  }
}

module.exports = ServerError;
