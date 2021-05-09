/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

exports.handleUnprocessableEntityError = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else if (err.code !== 422) {
    next(err);
  } else {
    console.error(err);
    res.status(422).json({ message: err.message, errors: err.errorList });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

exports.handleServerError = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else if (err.code !== 500) {
    next(err);
  } else {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

exports.handleResourceNotFoundError = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else if (err.code !== 404) {
    next(err);
  } else {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

exports.handleUnauthorized = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else if (err.code !== 401) {
    next(err);
  } else {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

exports.handleForbidden = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else if (err.code !== 403) {
    next(err);
  } else {
    console.error(err);
    res.status(403).json({ message: err.message });
  }
};
