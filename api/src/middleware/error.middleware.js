export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Route not found.' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 ? 'Something went wrong on the server.' : error.message;

  res.status(statusCode).json({ success: false, message });
}
