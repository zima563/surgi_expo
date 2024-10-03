const apiError = require("../utils/apiError.js");

const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(new apiError(err, 500));
    });
  };
};

module.exports = catchError;
