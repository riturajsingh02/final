export function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
}

export function sendError(res, message = 'An error occurred', statusCode = 400, errors = null) {
  return res.status(statusCode).json({
    status: 'fail',
    message,
    ...(errors ? { errors } : {})
  });
}

export default {
  sendSuccess,
  sendError
};
