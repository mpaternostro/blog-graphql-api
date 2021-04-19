class ResourceNotFoundError extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super();
    this.message = message;
    this.code = 404;
  }
}

module.exports = ResourceNotFoundError;
