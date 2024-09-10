const errorHandler = (error, req, res, next) => {
  const { status = 500, message } = error;

  // Відправляємо більш детальну інформацію, якщо є
  res.status(status).json({
    message: message || 'Something went wrong',
  });
};

export default errorHandler;
