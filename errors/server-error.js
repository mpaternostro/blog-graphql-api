class ServerError extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);
    this.code = 500;
  }
}

module.exports = ServerError;
