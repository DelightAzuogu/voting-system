exports.newError = function (message, statusCode) {
  const error = new Error(message || "server error");
  error.status = statusCode || 500;
  console.log(error.message);
  return error;
};
