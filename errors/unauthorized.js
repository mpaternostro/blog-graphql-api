class Unauthorized extends Error {
  /**
   * @param {String} message
   */
  constructor(message) {
    super(message);
    this.code = 401;
  }
}

module.exports = Unauthorized;
