class apiError extends Error {
  constructor(status, message) {
    super(message, status);
  }
}

module.exports = apiError;
