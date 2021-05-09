class Forbidden extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);
    this.code = 403;
  }
}

module.exports = Forbidden;
