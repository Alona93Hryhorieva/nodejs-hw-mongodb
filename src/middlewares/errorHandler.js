const errorHandler = (error, req, res, next) => {
  const { status = 500, message } = error;

  // Логування повної інформації про помилку в консоль
  console.error(error);

  // Відправляємо більш детальну інформацію, якщо є
  res.status(status).json({
    message: message || 'Something went wrong',
  });
};

export default errorHandler;
