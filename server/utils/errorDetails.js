function errorDetails(error, status, message) {
  error.status = status;
  error.message = message;
  return error;
}

module.exports = { errorDetails };
