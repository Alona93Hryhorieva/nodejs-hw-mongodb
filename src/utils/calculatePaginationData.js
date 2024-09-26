const calculatePaginationData = ({ count, perPage, page }) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages; // Чи є наступна сторінка
  const hasPreviousPage = page > 1; // Чи є попередня сторінка
  // const hasPreviousPage = page !== 1;

  return {
    totalPages, // Загальна кількість сторінок
    hasNextPage, // Чи є наступна сторінка
    hasPreviousPage, // Чи є попередня сторінка
    page, // Поточна сторінка
    perPage, // Кількість елементів на сторінці
    totalItems: count, // Загальна кількість елементів
  };
};

export default calculatePaginationData;
