const { httpCodes } = require("../constants/httpCodes");

module.exports = ErrorHandler = (err, req, res, next) => {
  const errStatus = err.status || httpCodes.INTERNAL_SERVER_ERROR;
  const errMsg = err.message || "Algo salió mal.";

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  });
};
