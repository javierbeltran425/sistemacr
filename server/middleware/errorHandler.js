const { httpCodes } = require("../constants/httpCodes");
const apiError = require("../common/apiError");

module.exports = ErrorHandler = (error, req, res, next) => {
  let errStatus;
  let errMsg;

  if (error instanceof apiError) {
    errStatus = error.status;
    errMsg = error.message;
  } else {
    errStatus = httpCodes.INTERNAL_SERVER_ERROR;
    errMsg = "Algo salió mal.";
  }

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  });
};
