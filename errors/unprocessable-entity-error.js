class UnprocessableEntityError extends Error {
  /**
   * @param {String} message
   * @param {Array} errorList
   */
  constructor(message, errorList) {
    super();
    this.message = message;
    this.code = 422;
    this.errorList = errorList;
  }
}

module.exports = UnprocessableEntityError;
